const fs = require('fs'); // import module fs untuk membaca dan menulis file

async function addGroupKC(conn, jid){
    // membaca file JSON
    let rawData = fs.readFileSync('./group-kc.json')
    let data = JSON.parse(rawData)
    
    // Mengecek apakah data sudah ada
    if (!data[jid]) {
        // jika data belum ada tambahkan data ke dalam file
        data[jid] = [{
            groupId: jid
        }]
        // menulis kembali file JSON
        let newData = JSON.stringify(data);
        fs.writeFileSync('./group-kc.json', newData)

        // Mengirim pesan ke whatsapp 
        await conn.sendMessage(
            jid,
            {
                sticker: fs.readFileSync('./pict/hutao.webp'),
            },
        )
        await conn.sendMessage(jid, { text: 'Notifikasi Komikcast berhasil diaktifkan untuk Room ini!' })
    } else {
        // Jika sudah ada kirim pesan whatsaap group sudah ditambahkan
        await conn.sendMessage(
            jid,
            {
                sticker: fs.readFileSync('./pict/nilou.webp'),
            },
        )
        await conn.sendMessage(jid, { text: 'Notifikasi Komikcast sudah diaktifkan untuk Room ini!' })
    }
}

async function removeGroupKC(conn, jid) {
    let rawData = fs.readFileSync('./group-kc.json')
    let data = JSON.parse(rawData)
    
    if (data[jid]) {
        delete data[jid]
        
        // menulis kembali file JSON
        let newData = JSON.stringify(data);
        fs.writeFileSync('./group-kc.json', newData)

        // Mengirim pesan respon ke wa
        await conn.sendMessage(
            jid,
            {
                sticker: fs.readFileSync('./pict/nahida.webp'),
            },
        )
        await conn.sendMessage(jid, { text: 'Notifikasi Komikcast Room ini berhasil dimatikan!' })
    } else {
        await conn.sendMessage(
            jid,
            {
                sticker: fs.readFileSync('./pict/qiqi2.webp'),
            },
        )
        await conn.sendMessage(jid, { text: 'Notifikasi Komikcast Room ini sudah dimatikan!' })
    }
}

async function setNotif(conn, jid, value){
    // membaca file JSON
    let rawData = fs.readFileSync('./group-kc.json')
    let data = JSON.parse(rawData)
    
    // Mencari index apakah data ada atau tidak
    const index = data.findIndex(item => item.groupId === jid);

    console.log(index)
    console.log(value)

    if(value === 'enable' || value === 'disable'){
        // Jika data ada maka ubah data lama ke baru
        if (index !== -1) {
            data[index].notification = value;
        } else {
            await conn.sendMessage(
                jid,
                {
                    sticker: fs.readFileSync('./pict/qiqi2.webp'),
                },
            )
            await conn.sendMessage(jid, { text: 'Group belum di tambahkan ke dalam Server. Harap tambahkan terlebih dahulu!' })
            return
        }
        
        // menulis kembali file JSON
        let newData = JSON.stringify(data);
        fs.writeFileSync('./group-kc.json', newData)
        
        let emoji = ''
        let messag = ''
        
        switch(value){
            case 'enable': 
                emoji = './pict/yanfei.webp';
                messag = 'aktifkan'
                break;
            case 'disable':
                emoji = './pict/rosaria.webp';
                messag = 'matikan'
                break;
        }
        
        // Mengirim pesan ke whatsapp
        await conn.sendMessage(
            jid,
            {
                sticker: fs.readFileSync(emoji),
            },
        )
        await conn.sendMessage(jid, { text: 'Notifikasi tayang Anime Komikcast berhasil di '+ messag +' untuk Group ini!' })
    } else {
        // Mengirim pesan ke whatsapp 
        await conn.sendMessage(
            jid,
            {
                sticker: fs.readFileSync('./pict/kokomi2.webp'),
            },
        )
        await conn.sendMessage(jid, { text: 'Nilai yang anda masukkan salah!' })
    }
}

async function addDinied(conn, jid){
    // Mengirim pesan ke whatsapp 
    await conn.sendMessage(
        jid,
        {
            sticker: fs.readFileSync('./pict/nahida.webp'),
        },
    )
    await conn.sendMessage(jid, { text: 'Group gagal ditambahkan ke server, silahkan hubungi wa.me/6285812442079 untuk meminta menambahkan group ke server!' })
}

module.exports = {
    addGroupKC,
    removeGroupKC,
    setNotif,
    addDinied,
}