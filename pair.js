const { makeid } = require('./id');
const express = require('express');
const fs = require('fs');
const crypto = require('crypto'); // Ensure this is at the top of your file
const pino = require("pino");
const {
    default: Maher_Zubair,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers,
} = require("@whiskeysockets/baileys");

let router = express.Router();

// Helper function to remove temporary files
function removeFile(filePath) {
    if (!fs.existsSync(filePath)) return false;
    fs.rmSync(filePath, { recursive: true, force: true });
}

// Route handler
router.get('/', async (req, res) => {
    const id = makeid();
    let num = req.query.number;

    async function SIGMA_MD_PAIR_CODE() {
      // Initialize the bot with the actual session data
const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);

// Generate session ID (hashed version, for reference)
const data = fs.readFileSync(`./temp/${id}/creds.json`);
const b64data = Buffer.from(data).toString('base64');
const sessionId = `paul_${crypto
    .createHash('sha256')
    .update(b64data)
    .digest('base64')
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(0, 19)}`;

console.log('Session ID:', sessionId); // This is just for reference

// Use the actual session credentials in Baileys
let Pair_Code_By_Maher_Zubair = Maher_Zubair({
    auth: {
        creds: state.creds,  // Use the actual creds here
        keys: makeCacheableSignalKeyStore(
            state.keys,
            pino({ level: "fatal" }).child({ level: "fatal" })
        ),
    },
    printQRInTerminal: false,
    logger: pino({ level: "fatal" }).child({ level: "fatal" }),
    browser: Browsers.macOS('Safari'),
});

// Request pairing code if not registered
if (!Pair_Code_By_Maher_Zubair.authState.creds.registered) {
    await delay(1500);
    num = num.replace(/[^0-9]/g, '');
    const code = await Pair_Code_By_Maher_Zubair.requestPairingCode(num);

    if (!res.headersSent) {
        await res.send({ code });
    }
}

// Save credentials on update
Pair_Code_By_Maher_Zubair.ev.on('creds.update', saveCreds);

// Handle connection updates
Pair_Code_By_Maher_Zubair.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "open") {
        await delay(5000);

        // Send session details as a message
        await Pair_Code_By_Maher_Zubair.sendMessage(Pair_Code_By_Maher_Zubair.user.id, {
            text: `Your session ID is:\n${sessionId}\n⚠️ Keep this private and secure! ⚠️`,
        });
        await Pair_Code_By_Maher_Zubair.sendMessage(Pair_Code_By_Maher_Zubair.user.id, {
            text: `Session Data (Base64):\n${b64data}`,
        });

        // Send response to client and clean up
        res.json({ sessionId, sessionData: b64data });
        await Pair_Code_By_Maher_Zubair.ws.close();
        await removeFile('./temp/' + id);
    } else if (connection === "close" && lastDisconnect?.error?.output?.statusCode !== 401) {
        await delay(10000);
        SIGMA_MD_PAIR_CODE();
    }

      });
        } catch (err) {
            console.error("Service restarted due to an error:", err);
            await removeFile('./temp/' + id);
            if (!res.headersSent) res.send({ code: "Service Unavailable" });
        }
    }

    return await SIGMA_MD_PAIR_CODE();
});

module.exports = router;
