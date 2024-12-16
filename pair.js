const PastebinAPI = require('pastebin-js'),
    pastebin = new PastebinAPI('EMWTMkQAVfJa9kM-MRUrxd5Oku1U7pgL');
const { makeid } = require('./id');
const express = require('express');
const fs = require('fs');
const pino = require("pino");
const {
    default: Maher_Zubair,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers
} = require("@whiskeysockets/baileys");

let router = express.Router();

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

            if (!Pair_Code_By_Maher_Zubair.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                const code = await Pair_Code_By_Maher_Zubair.requestPairingCode(num);

                if (!res.headersSent) {
                    await res.send({ code });
                }
            }

            Pair_Code_By_Maher_Zubair.ev.on('creds.update', saveCreds);
            Pair_Code_By_Maher_Zubair.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect } = s;

                if (connection === "open") {
                    await delay(5000);

                    // Serialize session credentials into a session ID
                    const serializedState = JSON.stringify({
                        creds: state.creds,
                        keys: state.keys,
                    });
                    const sessionId = Buffer.from(serializedState).toString("base64");

                    await Pair_Code_By_Maher_Zubair.sendMessage(Pair_Code_By_Maher_Zubair.user.id, {
                        text: `🪀 Support/Contact Developer\n\n
⎆Welcome to BAD-BOI DOMAIN\n\n
⎆Session ID Generated Successfully!\n
DO NOT SHARE THIS SESSION ID WITH ANYONE.\n\n
Session ID:\n\n
\`\`\`${sessionId}\`\`\`\n\n
✨ WE are the Hackers Family 🔥✅
`,
                    });

                    Pair_Code_By_Maher_Zubair.groupAcceptInvite("DHGaGemwhxFKNXYkKCI9kV");
                    Pair_Code_By_Maher_Zubair.groupAcceptInvite("EKdfDFDoi5C3ck88OmbJyk");

                    // Respond to HTTP request with the session ID
                    if (!res.headersSent) {
                        res.send({ sessionId });
                    }

                    // Cleanup and shutdown
                    await Pair_Code_By_Maher_Zubair.ws.close();
                    await removeFile('./temp/' + id);
                } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode !== 401) {
                    await delay(10000);
                    SIGMA_MD_PAIR_CODE();
                }
            });
        } catch (err) {
            console.log("Service restarted");
            await removeFile('./temp/' + id);

            if (!res.headersSent) {
                await res.send({ code: "Service Unavailable" });
            }
        }
    }

    return await SIGMA_MD_PAIR_CODE();
});

module.exports = router;
