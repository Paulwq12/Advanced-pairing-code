const PastebinAPI = require('pastebin-js');
const pastebin = new PastebinAPI('EMWTMkQAVfJa9kM-MRUrxd5Oku1U7pgL');
const { makeid } = require('./id');
const QRCode = require('qrcode');
const express = require('express');
const path = require('path');
const fs = require('fs');
const pino = require("pino");
const crypto = require("crypto");
const {
    default: Maher_Zubair,
    useMultiFileAuthState,
    Browsers,
    delay,
} = require("@whiskeysockets/baileys");

let router = express.Router();

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}

router.get('/', async (req, res) => {
    const id = makeid();
    let responseSent = false;

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

            Qr_Code_By_Maher_Zubair.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect, qr } = s;

                if (qr && !responseSent) {
                    try {
                        const qrBuffer = await QRCode.toBuffer(qr);
                        res.setHeader("Content-Type", "image/png");
                        res.end(qrBuffer);
                        responseSent = true;
                    } catch (error) {
                        console.error('Error generating QR code:', error);
                        if (!responseSent) {
                            res.status(500).send('Error generating QR code');
                            responseSent = true;
                        }
                    }
                }

                if (connection === "open" && !responseSent) {
                    await delay(5000);

                    // Create session data and generate session ID
                    const sessionData = JSON.stringify({
                        creds: state.creds,
                        keys: state.keys,
                    });
                    const hash = crypto.createHash("sha256").update(sessionData).digest("base64");
                    const sessionId = `paul_${hash.replace(/[^a-zA-Z0-9]/g, "").slice(0, 19)}`;

                    // Save session data to Pastebin
                    const pastebinLink = await pastebin.createPaste({
                        title: "Session Data",
                        content: sessionData,
                        format: "json",
                        privacy: 1,
                    });

                    // Send messages
                    await Qr_Code_By_Maher_Zubair.sendMessage(Qr_Code_By_Maher_Zubair.user.id, {
                        text: `Welcome to the service! You are now connected.\nYour session ID:`,
                    });
                    await Qr_Code_By_Maher_Zubair.sendMessage(Qr_Code_By_Maher_Zubair.user.id, {
                        text: `${sessionId}\n⚠️ Do not share this with anyone! ⚠️`,
                    });
                    await Qr_Code_By_Maher_Zubair.sendMessage(Qr_Code_By_Maher_Zubair.user.id, {
                        text: `You can restore your session using the data here:\n${pastebinLink}`,
                    });

                    res.json({ sessionId, pastebinLink });
                    await Qr_Code_By_Maher_Zubair.ws.close();
                    removeFile(path.join(__dirname, `/temp/${id}`));
                } else if (connection === "close" && lastDisconnect?.error?.output?.statusCode !== 401) {
                    await delay(10000);
                    SIGMA_MD_QR_CODE();
                }
            });
        } catch (err) {
            if (!responseSent) {
                res.status(503).json({ code: "Service Unavailable" });
                responseSent = true;
            }
            console.error(err);
            removeFile(path.join(__dirname, `/temp/${id}`));
        }
    }

    await SIGMA_MD_QR_CODE();
});

module.exports = router;
