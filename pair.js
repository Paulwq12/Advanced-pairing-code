const PastebinAPI = require('pastebin-js');
const pastebin = new PastebinAPI('EMWTMkQAVfJa9kM-MRUrxd5Oku1U7pgL');
const { makeid } = require('./id');
const express = require('express');
const pino = require('pino');
const {
    default: Maher_Zubair,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers
} = require('@whiskeysockets/baileys');

const router = express.Router();

// Function to generate a random string
function generateRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Function to generate a session ID
function generateSessionId(base64Data) {
    const prefix = 'paul_';
    const maxLength = 40;
    const randomPart = generateRandomString(maxLength - prefix.length - base64Data.length);
    return `${prefix}${randomPart}${base64Data}`;
}

router.get('/', async (req, res) => {
    const id = makeid();
    let num = req.query.number;

    async function SIGMA_MD_PAIR_CODE() {
        // Use single file auth state (in-memory, no file creation)
        const { state, saveCreds } = useMultiFileAuthState();

        try {
            let Pair_Code_By_Maher_Zubair = Maher_Zubair({
                auth: {
                    creds: state.creds,
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
                const { connection } = s;

                if (connection === 'open') {
                    await delay(5000);

                    // Convert credentials to JSON and encode in Base64
                    const sessionData = JSON.stringify(state.creds);
                    const b64data = Buffer.from(sessionData).toString('base64');

                    // Generate session ID
                    const sessionId = generateSessionId(b64data);

                    // Send the session ID to the user
                    await Pair_Code_By_Maher_Zubair.sendMessage(
                        Pair_Code_By_Maher_Zubair.user.id,
                        {
                            text: `🪀 Support/Contact Developer\n\n⎆ Welcome to BAD-BOI DOMAIN\n\n⎆ WhatsApp Number: +2347067023422\n⎆ GitHub: https://github.com\n\n★ MAKE SURE YOU'VE JOINED ALL THE CHANNELS ABOVE FOR UPDATES.\n\n✨ WE are the Hackers Family 🔥✅`
                        }
                    );

                    await delay(2000);

                    // Send the session ID
                    await Pair_Code_By_Maher_Zubair.sendMessage(
                        Pair_Code_By_Maher_Zubair.user.id,
                        {
                            text: `Your session ID: ${sessionId}`
                        }
                    );

                    // Send a warning message
                    await Pair_Code_By_Maher_Zubair.sendMessage(
                        Pair_Code_By_Maher_Zubair.user.id,
                        {
                            text: `⚠️ Do not share this session ID with anybody ⚠️\n\n┌─❖\n│ 🪀 Hey\n└┬❖\n┌┤✑  Thanks for using PAUL SESSION GENERATOR\n│└────────────┈ ⳹\n│ ©2023-2024 PAUL SESSION GENERATOR\n└─────────────────┈ ⳹\n\n`,
                        }
                    );

                    // Close the connection after sending the session ID
                    await Pair_Code_By_Maher_Zubair.ws.close();

                    // Send the session ID to the browser
                    res.send({ sessionId });
                }
            });
        } catch (err) {
            console.log('Service restarted due to error:', err);

            if (!res.headersSent) {
                res.status(500).send({ code: 'Service Unavailable' });
            }
        }
    }

    return await SIGMA_MD_PAIR_CODE();
});

module.exports = router;
