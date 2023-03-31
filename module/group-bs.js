const fs = require('fs'); // import module fs untuk membaca dan menulis file

async function addGroup(conn, jid){
    // membaca file JSON
    let rawData = fs.readFileSync('./group-bs.json')
    let data = JSON.parse(rawData)
    
    // Mengecek apakah data sudah ada
    const index = data.findIndex(item => item.groupId === jid);

    if (index === -1) {
        // jika data belum ada tambahkan data ke dalam file
        data.push({
            groupId: jid,
            notification: 'disable'
        })
    } else {
        // Jika sudah ada kirim pesan whatsaap group sudah ditambahkan
        await conn.sendMessage(
            jid,
            {
                sticker: fs.readFileSync('./pict/nilou.webp'),
            },
        )
        await conn.sendMessage(jid, { text: 'Group sudah ada di dalam server, Anda tidak perlu lagi menambahkannya lagi!' })
        return
    }
    
    // menulis kembali file JSON
    let newData = JSON.stringify(data);
    fs.writeFileSync('./group-bs.json', newData)

    // Mengirim pesan ke whatsapp 
    await conn.sendMessage(
        jid,
        {
            sticker: fs.readFileSync('./pict/hutao.webp'),
        },
    )
    await conn.sendMessage(jid, { text: 'Group berhasil di tambahkan ke Server, anda harus mengaktifkannya terlebih dahulu agar dapat menerima notifikasi seputar Anime yang tayang di Bstation!' })
}

async function setNotif(conn, jid, value){
    // membaca file JSON
    let rawData = fs.readFileSync('./group-bs.json')
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
        fs.writeFileSync('./group-bs.json', newData)
        
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
        await conn.sendMessage(jid, { text: 'Notifikasi tayang Anime Bstation berhasil di '+ messag +' untuk Group ini!' })
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

module.exports={
    addGroup,
    setNotif,
    addDinied
}