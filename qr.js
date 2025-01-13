const PastebinAPI = require('pastebin-js');
const pastebin = new PastebinAPI('EMWTMkQAVfJa9kM-MRUrxd5Oku1U7pgL');
const { makeid } = require('./id');
const QRCode = require('qrcode');
const express = require('express');
const path = require('path');
const fs = require('fs');
const pino = require("pino");
const { useMultiFileAuthState,
    Browsers,
    delay} = require("@whiskeysockets/baileys")
const makeWASocket = require("@whiskeysockets/baileys").default
let router = express.Router();

// Utility function to remove files
function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, {
        recursive: true,
        force: true
    });
}
class StringSession {
    createStringSession(dict) {
        return 'PAUL;;;' + Buffer.from(JSON.stringify(dict)).toString('base64');
    }
}

const Session = new StringSession();
router.get('/', async (req, res) => {
    const id = makeid();
    let responseSent = false; // Flag to track if the response has been sent

    // Function to handle QR code generation and connection update
    async function SIGMA_MD_QR_CODE() {
        const { state, saveCreds } = await useMultiFileAuthState(`./temp/${id}`);

        try {
            let Qr_Code_By_Maher_Zubair = makeWASocket({
               logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        auth: state,
        connectTimeoutMs: 60000,
        defaultQueryTimeoutMs: 0,
        keepAliveIntervalMs: 10000,
        emitOwnEvents: true,
        fireInitQueries: true,
        generateHighQualityLinkPreview: true,
        syncFullHistory: true,
        markOnlineOnConnect: true,
        browser: Browsers.windows('Firefox'),
            });

            Qr_Code_By_Maher_Zubair.ev.on('creds.update', saveCreds);

            // Connection update handler
            Qr_Code_By_Maher_Zubair.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect, qr } = s;

               if (qr) await res.end(await QRCode.toBuffer(qr));
                // If connection is open, perform additional tasks
                if (connection === "open") {
                    await delay(16000); // Ensure all files are fully written

                    const credsPath = path.join(__dirname, `temp/${id}/creds.json`);

                    // Check if creds.json exists before proceeding
                    if (!fs.existsSync(credsPath)) {
                        console.error('Error: creds.json not found!');
                        res.status(500).send('Error: creds.json file not found');
                        return;
                    }

                    // Read and send credentials file
                    const data = fs.readFileSync(credsPath);

                    await Qr_Code_By_Maher_Zubair.sendMessage(Qr_Code_By_Maher_Zubair.user.id, {
                        text: `🪀 Support/Contact Developer\n\n⎆ Welcome to PAUL DOMAIN\n⎆ WhatsApp Number: +2347067023422\n⎆ GitHub: https://github.com\n\n✨ WE are the Hackers Family 🔥✅`,
                    });
                    await delay(2000);
                    const classic = await  Qr_Code_By_Maher_Zubair.sendMessage(
                         Qr_Code_By_Maher_Zubair.user.id,
                        {
                            document: data,
                            mimetype: `application/json`,
                            fileName: `creds.json`
                        }
                    );
                      // Send a warning message
                    await  Qr_Code_By_Maher_Zubair.sendMessage(
                         Qr_Code_By_Maher_Zubair.user.id,
                        {
                            text: `⚠️ Do not share this file with anybody ⚠️\n\n┌─❖\n│ 🪀 Hey\n└┬❖\n┌┤✑  Thanks for using PAUL SESSION GENERATOR\n│└────────────┈ ⳹\n│ ©2023-2027 PAUL SESSION GENERATOR\n└─────────────────┈ ⳹\n\n`,
                        },
                        { quoted: classic }
                    );
 await delay(2000);
 await Qr_Code_By_Maher_Zubair.sendMessage(Qr_Code_By_Maher_Zubair.user.id, {
                        text: `Your session id: Copy your session id and paste in .env (e.g SESSION_ID= PAUL;;;cfpmxxxxxxx)`
                    });

                    await delay(2000);
                    // Generate the session string and send it
                    const sessionString = Session.createStringSession(state.creds);
                    await Qr_Code_By_Maher_Zubair.sendMessage(Qr_Code_By_Maher_Zubair.user.id, {
                        text:  `${sessionString}`
                    });

                    // Send the creds.json file as a download to the browser
                    res.download(credsPath, 'creds.json', async (err) => {
                        if (err) {
                            console.error('Error during download:', err);
                            return res.status(500).send('Error downloading creds.json');
                        }

                        // Cleanup after sending
                        console.log('Download complete. Cleaning up...');
                        await Qr_Code_By_Maher_Zubair.ws.close();
                        removeFile(`./temp/${id}`);
                    });
                } else if (
                    connection === 'close' &&
                    lastDisconnect &&
                    lastDisconnect.error &&
                    lastDisconnect.error.output.statusCode != 401
                ) {
                    await delay(10000);
                    SIGMA_MD_PAIR_CODE();
                }
            });
        } catch (err) {
            // Handle errors
            if (!responseSent) {
                res.status(503).json({ code: "Service Unavailable" });
                responseSent = true; // Mark response as sent
            }
            console.error('Error during QR Code processing:', err);
            removeFile(`./temp/${id}`);
        }
    }

    // Call the QR code generation function
    await SIGMA_MD_QR_CODE();
});

module.exports = router;
