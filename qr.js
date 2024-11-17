const PastebinAPI = require('pastebin-js'),
pastebin = new PastebinAPI('EMWTMkQAVfJa9kM-MRUrxd5Oku1U7pgL');
const { makeid } = require('./id');
const QRCode = require('qrcode');
const express = require('express');
const path = require('path');
const fs = require('fs');
let router = express.Router();
const pino = require("pino");
const {
	default: Maher_Zubair,
	useMultiFileAuthState,
	jidNormalizedUser,
	Browsers,
	delay,
	makeInMemoryStore,
} = require("maher-zubair-baileys");

// Utility function to remove files
function removeFile(FilePath) {
	if (!fs.existsSync(FilePath)) return false;
	fs.rmSync(FilePath, {
		recursive: true,
		force: true
	});
}

const { readFile } = require("node:fs/promises");

router.get('/', async (req, res) => {
	const id = makeid();

	// Function to handle QR code generation and connection update
	async function SIGMA_MD_QR_CODE() {
		const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);

		try {
			let Qr_Code_By_Maher_Zubair = Maher_Zubair({
				auth: state,
				printQRInTerminal: false,
				logger: pino({ level: "silent" }),
				browser: Browsers.macOS("Desktop"),
			});

			Qr_Code_By_Maher_Zubair.ev.on('creds.update', saveCreds);

			// Connection update handler
			Qr_Code_By_Maher_Zubair.ev.on("connection.update", async (s) => {
				const { connection, lastDisconnect, qr } = s;

				// Handle QR code generation and response
				if (qr) {
					const qrBuffer = await QRCode.toBuffer(qr); // Convert QR code to buffer
					res.setHeader("Content-Type", "image/png"); // Set content type
					res.end(qrBuffer); // Send the QR code image
					return; // Ensure the response ends here
				}

				// If connection is open, perform additional tasks
				if (connection === "open") {
					await delay(5000);
					let data = fs.readFileSync(path.join(__dirname, `/temp/${id}/creds.json`));

					// Notify user with credentials
					await Qr_Code_By_Maher_Zubair.sendMessage(Qr_Code_By_Maher_Zubair.user.id, {
						text: `🪀 Support/Contact Developer\n\n⎆ Welcome to PAUL DOMAIN\n⎆ WhatsApp Number: +2347067023422\n⎆ GitHub: https://github.com\n\n✨ WE are the Hackers Family 🔥✅`
					});

					// Send credentials file
					await Qr_Code_By_Maher_Zubair.sendMessage(Qr_Code_By_Maher_Zubair.user.id, {
						document: data,
						mimetype: `application/json`,
						fileName: `creds.json`
					});

					// Perform post-connection actions
					await Qr_Code_By_Maher_Zubair.ws.close();
					removeFile(path.join(__dirname, `/temp/${id}`)); // Cleanup temporary files
				} else if (connection === "close" && lastDisconnect?.error?.output?.statusCode !== 401) {
					// Retry on unexpected close
					await delay(10000);
					SIGMA_MD_QR_CODE();
				}
			});
		} catch (err) {
			// Handle errors
			if (!res.headersSent) {
				res.status(503).json({ code: "Service Unavailable" });
			}
			console.error(err);
			removeFile(path.join(__dirname, `/temp/${id}`)); // Cleanup temporary files on error
		}
	}

	// Call the QR code generation function
	await SIGMA_MD_QR_CODE();
});

module.exports = router;
