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

const { type } = require("os");
const { welcome } = require("./module/welcome")
const { sendSticker } = require("./module/sticker")
const { reactToMessage } = require("./module/reaction")
const { unknownCommand } = require("./module/unknownCommand")
const { noImage } = require("./module/noImage")
const { searchAnime } = require("./module/searchAnime")
const { ai } = require("./module/ai")
const { addGroup, setNotif, addDinied } = require("./module/group-bs")
const { bstationUpdate } = require("./module/notificationBstation")

const cron = require('node-cron')

let liveBstation = []

async function getSticker(filePath){
    const stickerfile= await fs.promises.readFile(filePath)
    return stickerfile.toString('base64')
}

const connectToWhatsApp = async () => {
    const { state, saveCreds } = await useMultiFileAuthState('baileys_auth_info')
    const conn = makeWASocket({
        printQRInTerminal: true,
        auth: state,
    });

    let no = 0
    cron.schedule('*/1 * * * *', async () => {
        let timeNow = new Date()
        // Jika hari belum berganti
        if(timeNow.getHours() !== 00){
            // Ambil data dari Bstation
            let getDataUpdateBS = await bstationUpdate()
            // Jika terdapat data terbaru kirim pesan wa dan perbarui liveBstation
            if(getDataUpdateBS.length > liveBstation.length){
                // mengambil data grub yang ingin menerima notif
                
                liveBstation = getDataUpdateBS
                let rawData = fs.readFileSync('./group-bs.json')
                let data = JSON.parse(rawData)
                
                for (let i = 0; i < data.length; i++) {
                    const group = data[i];
                    // console.log(`Group ID: ${group.groupId}, Notification: ${group.notification}`);
                    
                    // melakukan operasi lainnya pada data di dalam loop
                    // Mengecek apakah alamat ini ingin menerima notif atau tidak
                    if(group.notification === 'enable'){
                        // Kirim pesan notifikasi ke semua whatsapp
                        await conn.sendMessage(group.groupId, {
                            image: {url: getDataUpdateBS[getDataUpdateBS.length - 1].image},
                            caption: getDataUpdateBS[getDataUpdateBS.length - 1].time + ' - ' + getDataUpdateBS[getDataUpdateBS.length - 1].baru +'\n*' + getDataUpdateBS[getDataUpdateBS.length - 1].title + '*',
                        })
                    }
                }
            }
        } else { //Jika hari sudah berganti atur ulang data liveBstation
            liveBstation = []
        }
        console.log('running a task every minute ' + no++ + ' - ' + liveBstation[liveBstation.length - 1].image)
    });

    conn.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0]

        console.log(msg)
        // console.log(msg.message.documentWithCaptionMessage)
    
        if (!msg.message) return // Jika tidak ada pesan teks atau media
        const messageTypes = Object.keys (msg.message)// dapatkan jenis pesannya -- teks, gambar, video
        const messageType = messageTypes[0]

        // Medapatkan ID whatsapp
        console.log('ID Whatsapp = ' + msg.key.remoteJid)

        if(!msg.key.fromMe){
            await conn.readMessages([msg.key])
            if (messageType === 'conversation'){
                const mwaMsg = msg.message.conversation
                if(mwaMsg.substr(0,1) === '.'){
                    if(mwaMsg === '.start' || mwaMsg === '.help'){
                        await welcome(conn, msg)
                    } else if(mwaMsg.substr(0,7) === '.search' || mwaMsg.substr(0,8) === '.sticker'){
                        await noImage(conn, msg)
                    } else if(mwaMsg.substr(0, 2) === '.q'){
                        await ai(conn, msg.key.remoteJid, mwaMsg.substr(2))
                    } else if(mwaMsg === '.add_bstation_notif'){
                        // Menambahkan group ke dalam json untuk notifikasi Bstation
                        // if(msg.key.remoteJid.includes('6285812442079')){
                            await addGroup(conn, msg.key.remoteJid)
                        // } else {
                        //     await addDinied(conn, msg.key.remoteJid)
                        // }
                    } else if(mwaMsg.substr(0,19) === '.set_bstation_notif'){
                        await setNotif(conn, msg.key.remoteJid, mwaMsg.replace('.set_bstation_notif ', '').replace('.set_bstation_notif', '').toLowerCase())
                    } else if(mwaMsg === '.getbs'){
                        await conn.sendMessage(msg.key.remoteJid, {text: JSON.stringify(liveBstation)})
                    } else if(mwaMsg === '.tes'){
                        const buttons = [
                            {buttonId: 'id1', buttonText: {displayText: 'Button 1'}, type: 1},
                            {buttonId: 'id2', buttonText: {displayText: 'Button 2'}, type: 1},
                            {buttonId: 'id3', buttonText: {displayText: 'Button 3'}, type: 1}
                        ]

                        const buttonMessage = {
                            caption: "Hi it's button message",
                            footer: 'Hello World',
                            buttons: buttons,
                            headerType: 4
                        }
                        
                        await conn.sendMessage(msg.key.remoteJid, buttonMessage)
                    } else {
                        await unknownCommand(conn, msg)
                    }
                }
            }
            if (messageType === 'extendedTextMessage'){
                const waMsg = msg.message.extendedTextMessage.text
                if(waMsg.substr(0,1) === '.'){
                    if(waMsg === '.start' || waMsg === '.help'){
                        await welcome(conn, msg)
                    } else if(waMsg.substr(0,7) === '.search' || waMsg.substr(0,8) === '.sticker'){
                        await noImage(conn, msg)
                    } else if(waMsg.substr(0, 2) === '.q'){
                        await ai(conn, msg.key.remoteJid, waMsg.substr(2))
                    } else if(waMsg === '.add_bstation_notif'){
                        // Menambahkan group ke dalam json untuk notifikasi Bstation
                        // if(msg.key.remoteJid.includes('6285812442079')){
                            await addGroup(conn, msg.key.remoteJid)
                        // } else {
                        //     await addDinied(conn, msg.key.remoteJid)
                        // }
                    } else if(waMsg.substr(0,19) === '.set_bstation_notif'){
                        await setNotif(conn, msg.key.remoteJid, waMsg.replace('.set_bstation_notif ', '').replace('.set_bstation_notif', '').toLowerCase())
                    } else if(waMsg === '.update'){
                        // const reaction = '😂';
                        // conn.sendMessage(msg.key.remoteJid, reaction, null, {quotedMsg: true, sendEphemeral: true});

                        let lastUpdate = await bstationUpdate()
                        conn.sendMessage(msg.key.remoteJid, {text: 'Baru saja tanyang'})
                        await conn.sendMessage(msg.key.remoteJid, {
                            image: {url: lastUpdate[lastUpdate.length - 1].image},
                            caption: lastUpdate[lastUpdate.length - 1].time + ' - ' + lastUpdate[lastUpdate.length - 1].baru + '\n' + '*' + lastUpdate[lastUpdate.length - 1].title + '*',
                        })
                    } else if(waMsg === '.getbs'){
                        await conn.sendMessage(msg.key.remoteJid, {text: JSON.stringify(liveBstation)})
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
                }
            } else if(messageTypes.includes('documentWithCaptionMessage')) {
                if(msg.message.documentWithCaptionMessage.message.documentMessage.caption === '.sticker') {
                    // Buat dan kirim stiker
                    let pack = msg.message.imageMessage.caption.replace('.sticker ', '').replace('.sticker', '')
                    await sendSticker(conn, msg, pack)
                }
            }
        }
    });

    //jika close atau logout
    conn.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === "close") {
            console.log("Server Ready ✓");
            lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut
                ? connectToWhatsApp()
                : console.log("Wa web terlogout...");
        }
    });

	//save credentials
	conn.ev.on('creds.update', async() => {
		await saveCreds()
	})
};

connectToWhatsApp().catch((err) => console.log(err));