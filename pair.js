const PastebinAPI = require('pastebin-js');
const pastebin = new PastebinAPI('EMWTMkQAVfJa9kM-MRUrxd5Oku1U7pgL');
const { makeid } = require('./id');
const express = require('express');
const fs = require('fs');
const pino = require('pino');
const {
    default: Maher_Zubair,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers
} = require('@whiskeysockets/baileys');

const router = express.Router();

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}

class StringSession {
    createStringSession(dict) {
        return 'PAUL;;;' + Buffer.from(JSON.stringify(dict)).toString('base64');
    }
}

const Session = new StringSession();

router.get('/', async (req, res) => {
    const id = makeid();
    let num = req.query.number;

    async function SIGMA_MD_PAIR_CODE() {
        const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);

        try {
            let Pair_Code_By_Maher_Zubair = Maher_Zubair({
                auth: {
                    creds: state,
                    keys: makeCacheableSignalKeyStore(
                        state.keys,
                        pino({ level: 'fatal' }).child({ level: 'fatal' })
                    )
                },
                printQRInTerminal: false,
                logger: pino({ level: 'fatal' }).child({ level: 'fatal' }),
                browser: Browsers.windows('Firefox')
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
            Pair_Code_By_Maher_Zubair.ev.on('connection.update', async (s) => {
                const { connection, lastDisconnect } = s;

                if (connection === 'open') {
                    await delay(5000);

                    const credsPath = __dirname + `/temp/${id}/creds.json`;

                    // Verify that the file exists before proceeding
                    if (!fs.existsSync(credsPath)) {
                        console.log('Error: creds.json not found!');
                        return res.status(500).send('Error: creds.json file not found');
                    }

                    let data = fs.readFileSync(credsPath);

                    await delay(800);
                    await Pair_Code_By_Maher_Zubair.sendMessage(Pair_Code_By_Maher_Zubair.user.id, {
                        text: `🪀 Support/Contact Developer\n\n⎆ Welcome to PAUL DOMAIN\n⎆ WhatsApp Number: +2347067023422\n⎆ GitHub: https://github.com\n\n✨ WE are the Hackers Family 🔥✅`,
                    });

                    await delay(3000);
                    const classic = await Pair_Code_By_Maher_Zubair.sendMessage(
                        Pair_Code_By_Maher_Zubair.user.id,
                        {
                            document: data,
                            mimetype: `application/json`,
                            fileName: `creds.json`
                        }
                    );
                      // Send a warning message
                    await Pair_Code_By_Maher_Zubair.sendMessage(
                        Pair_Code_By_Maher_Zubair.user.id,
                        {
                            text: `⚠️ Do not share this file with anybody ⚠️\n\n┌─❖\n│ 🪀 Hey\n└┬❖\n┌┤✑  Thanks for using PAUL SESSION GENERATOR\n│└────────────┈ ⳹\n│ ©2023-2024 PAUL SESSION GENERATOR\n└─────────────────┈ ⳹\n\n`,
                        },
                        { quoted: classic }
                    );

                     await delay(2000);
 await Pair_Code_By_Maher_Zubair.sendMessage(Pair_Code_By_Maher_Zubair.user.id, {
                        text: `Your session id: Copy your session id and paste in .env (e.g SESSION_ID= PAUL;;;cfpmxxxxxxx)`
                    });

                    await delay(2000);
                    // Generate the session string and send it
                    const sessionString = Session.createStringSession(state.creds);
                    await Pair_Code_By_Maher_Zubair.sendMessage(Pair_Code_By_Maher_Zubair.user.id, {
                         text: `${sessionString}`
                    });

                    // Send the `creds.json` file as a browser download
                    console.log("Sending creds.json file to the browser...");
                    res.download(credsPath, 'creds.json', async (err) => {
                        if (err) {
                            console.log('Error during download:', err);
                            return res.status(500).send('Error downloading creds.json');
                        }

                        // Cleanup after sending
                        console.log('Download complete. Cleaning up...');
                        await Pair_Code_By_Maher_Zubair.ws.close();
                        removeFile('./temp/' + id);
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
            console.log('Service restarted due to error:', err);
            removeFile('./temp/' + id);

            if (!res.headersSent) {
                res.status(500).send({ code: 'Service Unavailable' });
            }
        }
    }

    return await SIGMA_MD_PAIR_CODE();
});

module.exports = router;
