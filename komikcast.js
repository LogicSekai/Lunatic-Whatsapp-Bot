const cron = require('node-cron')
const axios = require('axios')
const { config } = require("dotenv")
config()
const { komikcastUpdate } = require("./module/notificationKomikcast")


let komikcastNow

cron.schedule('*/10 * * * * *', async () => {
    // Ambil data dari Komikcast
    let getDataUpdateKC = await komikcastUpdate()

    // Jika terdapat data terbaru kirim data ke server wa bot dan perbarui komikcastNow
    if (getDataUpdateKC.title !== komikcastNow) {
        // Mengirim data ke Index bot melalui webhook
        await sendToWhatsappServerBot(getDataUpdateKC)
    }
});

async function sendToWhatsappServerBot(dataKC) {
    const url = process.env.LUNATIC_WEBHOOK + '/komikcast'
    const data = {
        event: 'Push data Komikcast Notif',
        message: dataKC
    };
    
    axios.post(url, data).then(response => {
        // Jika data berhasil dikirim perbarui data agar ketika gagal dikirim akan di kerim ulang
        komikcastNow = dataKC.title
    }).catch(error => {
        console.error(error);
    });
}

