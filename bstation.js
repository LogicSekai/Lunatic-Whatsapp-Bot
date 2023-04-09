const cron = require('node-cron')
const axios = require('axios')
const { config } = require("dotenv")
config()
const { bstationUpdate } = require("./module/notificationBstation")


let liveBstation = []
let no = 0

cron.schedule('*/10 * * * * *', async () => {
    let timeNow = new Date()

    // Jika hari berganti setel ulang liveBstation
    if (timeNow.getHours() === 00 && timeNow.getMinutes === 00) {
        liveBstation = []
        await sendToWhatsappServerBot([])
        return
    }

    // Ambil data dari Bstation
    let getDataUpdateBS = await bstationUpdate()

    // Jika terdapat data terbaru kirim data ke server wa bot dan perbarui liveBstation
    if (getDataUpdateBS.length > liveBstation.length) {
        // Mengirim data ke Index bot melalui webhook
        await sendToWhatsappServerBot(getDataUpdateBS)
        console.log(no++ + ' ' + getDataUpdateBS.length)
    }
});

async function sendToWhatsappServerBot(dataBS) {
    const url = process.env.LUNATIC_WEBHOOK + '/bstation';
    const data = {
        event: 'Push data BStation Notif',
        message: dataBS
    };
    
    axios.post(url, data).then(response => {
        // Jika data berhasil dikirim perbarui data agar ketika gagal dikirim akan di kerim ulang
        liveBstation = dataBS
        console.log(response.data);
    }).catch(error => {
        console.error(error);
    });
}

