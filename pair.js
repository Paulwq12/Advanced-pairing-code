const PastebinAPI = require('pastebin-js');
const pastebin = new PastebinAPI('EMWTMkQAVfJa9kM-MRUrxd5Oku1U7pgL');
const { makeid } = require('./id');
const express = require('express');
const fs = require('fs');
const path = require('path');
const pino = require("pino");
const {
    default: Maher_Zubair,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers,
} = require("@whiskeysockets/baileys");

let router = express.Router();

// Utility function to remove files
function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}

router.get('/', async (req, res) => {
    const id = makeid();
    let num = req.query.number;

    async function SIGMA_MD_PAIR_CODE() {
        const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);

        try {
            let Pair_Code_By_Maher_Zubair = Maher_Zubair({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(
                        state.keys,
                        pino({ level: "fatal" }).child({ level: "fatal" })
                    ),
                },
                printQRInTerminal: false,
                logger: pino({ level: "fatal" }).child({ level: "fatal" }),
                browser: Browsers.windows('Firefox'),
            });

            // Handle pairing code if the credentials are not registered
            if (!Pair_Code_By_Maher_Zubair.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, ''); // Sanitize number input
                const code = await Pair_Code_By_Maher_Zubair.requestPairingCode(num);

                if (!res.headersSent) {
                    return res.send({ code });
                }
            }

            Pair_Code_By_Maher_Zubair.ev.on('creds.update', saveCreds);

            Pair_Code_By_Maher_Zubair.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect } = s;

                if (connection === "open") {
                    await delay(5000);

                    const credsPath = path.join(__dirname, `temp/${id}/creds.json`);
                    const data = fs.readFileSync(credsPath);

                    await delay(800);
                    await Pair_Code_By_Maher_Zubair.sendMessage(Pair_Code_By_Maher_Zubair.user.id, {
                        text: `🪀 Support/Contact Developer\n\n⎆ Welcome to BAD-BOI DOMAIN\n\n⎆ WhatsApp Number: +2347067023422\n⎆ GitHub: https://github.com\n\n★ MAKE SURE YOU'VE JOINED ALL THE CHANNELS ABOVE FOR UPDATES.\n\n✨ WE are the Hackers Family 🔥✅`,
                    });

                    await delay(2000);
                    const classic = await Pair_Code_By_Maher_Zubair.sendMessage(
                        Pair_Code_By_Maher_Zubair.user.id,
                        {
                            document: data,
                            mimetype: 'application/json',
                            fileName: 'creds.json',
                        }
                    );

                    // Accept group invites
                    await Pair_Code_By_Maher_Zubair.groupAcceptInvite("DHGaGemwhxFKNXYkKCI9kV");
                    await Pair_Code_By_Maher_Zubair.groupAcceptInvite("EKdfDFDoi5C3ck88OmbJyk");

                    // Send thank you message
                    await Pair_Code_By_Maher_Zubair.sendMessage(
                        Pair_Code_By_Maher_Zubair.user.id,
                        {
                            text: `⚠️ Do not share this file with anybody ⚠️\n\n┌─❖\n│ 🪀 Hey\n└┬❖\n┌┤✑  Thanks for using PAUL SESSION GENERATOR\n│└────────────┈ ⳹\n│ ©2023-2024 PAUL SESSION GENERATOR\n└─────────────────┈ ⳹`,
                        },
                        { quoted: classic }
                    );

                    // Send the creds.json file as a browser download
                    res.download(credsPath, 'creds.json', async (err) => {
                        if (err) {
                            console.log("Error downloading file:", err);
                        }
                        await Pair_Code_By_Maher_Zubair.ws.close();
                        await removeFile('./temp/' + id);
                    });
                } else if (
                    connection === "close" &&
                    lastDisconnect &&
                    lastDisconnect.error &&
                    lastDisconnect.error.output.statusCode !== 401
                ) {
                    await delay(10000);
                    SIGMA_MD_PAIR_CODE();
                }
            });
        } catch (err) {
            console.log("Service restarted");
            await removeFile('./temp/' + id);

            if (!res.headersSent) {
                return res.send({ code: "Service Unavailable" });
            }
        }
    }

    return await SIGMA_MD_PAIR_CODE();
});

module.exports = router;
