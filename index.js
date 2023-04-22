const {
    default: makeWASocket,
    BufferJSON,
    initInMemoryKeyStore,
    DisconnectReason,
    AnyMessageContent,
    makeInMemoryStore,
    useMultiFileAuthState,
    makeCacheableSignalKeyStore,
    delay,
    MessageType,
    downloadMediaMessage,
    WA_MESSAGE_STUB_TYPES,
} = require("@adiwajshing/baileys");

const { writeFile } = require ('fs/promises')
const fs = require('fs')
const { config } = require("dotenv")
config()

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const path = require('path')
const port = 3001;

const { welcome } = require("./module/welcome")
const { sendSticker } = require("./module/sticker")
const { reactToMessage } = require("./module/reaction")
const { unknownCommand } = require("./module/unknownCommand")
const { noImage } = require("./module/noImage")
const { searchAnime } = require("./module/searchAnime")
const { ai } = require("./module/ai")
const { addGroup, removeGroup } = require("./module/group-bs")
const { addGroupKC, removeGroupKC } = require("./module/group-kc")

const connectToWhatsApp = async () => {
    const { state, saveCreds } = await useMultiFileAuthState('baileys_auth_info')
    const conn = makeWASocket({
        printQRInTerminal: true,
        auth: state,
    });

    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'htaccess/index.html'));
    });

    app.post('/bstation', async (req, res) => {
        let BstationJS = req.body.message
        res.status(200).send('Webhook received successfully!')

        let rawData = fs.readFileSync('./group-bs.json')
        let dataGroup = JSON.parse(rawData)

        if (BstationJS.length) {
            let dataAnimeNotification = BstationJS[BstationJS.length - 1].dataAnime
            
            for (let i = 0; i < Object.keys(dataGroup).length; i++) {
                for (let o = 0; o < dataAnimeNotification.length; o++){
                    await conn.sendMessage(Object.keys(dataGroup)[i], {
                        image: {url: dataAnimeNotification[o].image},
                        caption: '⌚' + dataAnimeNotification[o].time + ' - ' + dataAnimeNotification[o].baru + '\n*' + dataAnimeNotification[o].title + '*',
                    })
                }
            }
        }
    })

    app.post('/komikcast', async (req, res) => {
        let KomikcastJS = req.body.message
        res.status(200).send('Webhook received successfully!')

        let rawData = fs.readFileSync('./group-kc.json')
        let dataGroup = JSON.parse(rawData)
        
        if (KomikcastJS.length !== 0) {
            for (let i = 0; i < Object.keys(dataGroup).length; i++) {
                await conn.sendMessage(Object.keys(dataGroup)[i], {
                    image: {url: KomikcastJS.img},
                    caption: KomikcastJS.type + ' - ' + KomikcastJS.chapter + '\n*' + KomikcastJS.title + '*',
                })
            }
        }
    })

    app.listen(port, () => {
        console.log(`Webhook server listening at http://localhost:${port}`)
    })
    
    conn.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0]

        if (!msg.message) return // Jika tidak ada pesan teks atau media
        const messageTypes = Object.keys (msg.message)// dapatkan jenis pesannya -- teks, gambar, video
        const messageType = messageTypes[0]

        if(msg.key.fromMe) return
        await conn.readMessages([msg.key])
        if (messageType === 'conversation'){
            const mwaMsg = msg.message.conversation
            if(mwaMsg.substr(0,1) === '.'){
                if(mwaMsg === '.start' || mwaMsg === '.help'){
                    await welcome(conn, msg)
                } else if(mwaMsg.substr(0,7) === '.search' || mwaMsg.substr(0,8) === '.sticker'){
                    await noImage(conn, msg)
                } else if(mwaMsg.substr(0, 2) === '.q'){
                    await ai(conn, msg.key.remoteJid, mwaMsg.substr(2), process.env.API_KEY_GPT)
                } else if(mwaMsg === '.enable_bstation_notif'){
                        await addGroup(conn, msg.key.remoteJid)
                } else if(mwaMsg === '.disable_bstation_notif'){
                    await removeGroup(conn, msg.key.remoteJid)
                } else if(mwaMsg === '.enable_komikcast_notif'){
                        await addGroupKC(conn, msg.key.remoteJid)
                } else if(mwaMsg === '.disable_komikcast_notif'){
                    await removeGroupKC(conn, msg.key.remoteJid)
                } else {
                    await unknownCommand(conn, msg)
                }
            }
        } else if (messageType === 'extendedTextMessage'){
            const waMsg = msg.message.extendedTextMessage.text
            if(waMsg.substr(0,1) === '.'){
                if(waMsg === '.start' || waMsg === '.help'){
                    await welcome(conn, msg)
                } else if(waMsg.substr(0,7) === '.search' || waMsg.substr(0,8) === '.sticker'){
                    await noImage(conn, msg)
                } else if(waMsg.substr(0, 2) === '.q'){
                    await ai(conn, msg.key.remoteJid, waMsg.substr(2), process.env.API_KEY_GPT)
                } else if(waMsg === '.enable_bstation_notif'){
                        await addGroup(conn, msg.key.remoteJid)
                } else if(waMsg === '.disable_bstation_notif'){
                    await removeGroup(conn, msg.key.remoteJid)
                } else if(waMsg === '.enable_komikcast_notif'){
                        await addGroupKC(conn, msg.key.remoteJid)
                } else if(waMsg === '.disable_komikcast_notif'){
                    await removeGroupKC(conn, msg.key.remoteJid)
                } else {
                    await unknownCommand(conn, msg)
                }
            }
        } else if(messageType === 'imageMessage') {
            if(msg.message.imageMessage.caption.substr(0,7) === '.search'){
                await searchAnime(conn, msg)
            } else if(msg.message.imageMessage.caption.substr(0,8) === '.sticker') {
                // Buat dan kirim stiker
                let pack = msg.message.imageMessage.caption.replace('.sticker ', '').replace('.sticker', '')
                await sendSticker(conn, msg, pack)
            } else {
                await unknownCommand(conn, msg)
            }
        } else if(messageTypes.includes('documentWithCaptionMessage')) {
            if(msg.message.documentWithCaptionMessage.message.documentMessage.caption.substr(0,8) === '.sticker') {
                // Buat dan kirim stiker
                let pack = msg.message.documentWithCaptionMessage.message.documentMessage.caption.replace('.sticker ', '').replace('.sticker', '')
                await sendSticker(conn, msg, pack)
            } else {
                await unknownCommand(conn, msg)
            }
        }
        
        if ((messageType === 'conversation' && msg.message.conversation.substr(0, 1) === '.') || (messageType === 'extendedTextMessage' && msg.message.extendedTextMessage.text.substr(0, 1) === '.') || (messageType === 'imageMessage' && msg.message.imageMessage.caption.substr(0, 1) === '.') || (messageTypes.includes('documentWithCaptionMessage') && msg.message.documentWithCaptionMessage.message.documentMessage.caption.substr(0,1) === '.')) {
            await reactToMessage(conn, msg.key, msg.key.remoteJid)
        }
    });

    // jika close atau logout
    conn.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === "close") {
            console.log("Server Ready ✓");
            lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut ? connectToWhatsApp() : console.log("Wa web terlogout...");
        }
    });

	//save credentials
	conn.ev.on('creds.update', async() => {
		await saveCreds()
	})
};

connectToWhatsApp().catch((err) => console.log(err));