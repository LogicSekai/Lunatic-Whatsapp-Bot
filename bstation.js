const cron = require('node-cron')
const axios = require('axios')
const { config } = require("dotenv")
config()
const { bstationUpdate } = require("./module/notificationBstation")


let liveBstation = []
let no = 0

cron.schedule('*/30 * * * * *', async () => {
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
        
        // mengambil data grub yang ingin menerima notif
        liveBstation = getDataUpdateBS
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
        console.log(response.data);
    }).catch(error => {
        console.error(error);
    });
}

