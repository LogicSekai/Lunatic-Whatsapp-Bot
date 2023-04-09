const { Configuration, OpenAIApi } = require("openai")

async function ai(conn, id, prompt, api){
    // const openai = new OpenAIApi(new Configuration({
    //     apiKey: api
    // }))

    // openai.createChatCompletion({
    //     model: "text-davinci-003",
    //     messages: [{role: "user", content: prompt}]
    // }).then(async response => {
    //     var ms = response.data.choices[0].message.content
    //     await conn.sendMessage(id, { text: ms.replace('\n\n', '') })
    // }).catch(err => {
    //     console.log(err)
    // })

    const configuration = new Configuration({
        organization: "org-3TDopYRl9L6iFyAY7Kx3nrmM",
        apiKey: api,
    });

    const openai = new OpenAIApi(configuration);

    await openai.createCompletion({
        model: "text-davinci-003",
        // prompt: "Hai, nama saya adalah Lunatic. Saya adalah program kecerdasan buatan yang dibuat oleh Yusuf Ikhwanul Karim yang sering dikelan sebagai Kwaii di dunia maya. Jika Anda bertanya apa yang saya bisa, saya siap membantu anda kapan saja. Jika Anda mengajukan pertanyaan yang berakar pada kebenaran, saya akan memberikan jawabannya.\n\nQ: Berapa harapan hidup manusia di Indonesia?\nA: Harapan hidup manusia di Amerika Serikat adalah 78 tahun.\n\nQ: Siapa presiden Amerika Serikat pada tahun 1955?\nA: Dwight D. Eisenhower adalah presiden Amerika Serikat pada tahun 1955.\n\nQ: Dia dari partai mana?\nA: Dia milik Partai Republik.\n\nQ : Akar kuadrat dari pisang berapa?\nA: Tidak diketahui\n\nQ: Bagaimana cara kerja teleskop?\nA: Teleskop menggunakan lensa atau cermin untuk memfokuskan cahaya dan membuat objek tampak lebih dekat.\n\nQ: Di mana Olimpiade 1992 diadakan?\nA: Olimpiade 1992 diadakan di Barcelona, ​​Spanyol.\n\nQ: Berapa banyak squig dalam satu bonk?\nA: Tidak diketahui\n\nQ:" + prompt,
        prompt: "Anda adalah Kercerdasan buatan bernama Lunatic. Pencipta Anda adalah Kwaii, dia membuat Anda menggunakan Baileys, dan OpenAI. Anda membalas dengan jawaban singkat dan to-the-point tanpa penjelasan lebih lanjut. Jika ada yang bertanya dengan pertanyaan yang sangat aneh kamu menjawabnya dengan lawakan.\n\nQ: Berapa harapan hidup manusia di Indonesia?\nA: Harapan hidup manusia di Amerika Serikat adalah 78 tahun.\n\nQ: Siapa presiden Amerika Serikat pada tahun 1955?\nA: Dwight D. Eisenhower adalah presiden Amerika Serikat pada tahun 1955.\n\nQ: Dia dari partai mana?\nA: Dia milik Partai Republik.\n\nQ : Akar kuadrat dari pisang berapa?\nA: Tidak diketahui\n\nQ: Bagaimana cara kerja teleskop?\nA: Teleskop menggunakan lensa atau cermin untuk memfokuskan cahaya dan membuat objek tampak lebih dekat.\n\nQ: Di mana Olimpiade 1992 diadakan?\nA: Olimpiade 1992 diadakan di Barcelona, ​​Spanyol.\n\nQ: Berapa banyak squig dalam satu bonk?\nA: Tidak diketahui\n\nQ:" + prompt,
        temperature: 0.9,
        max_tokens: 150,
        top_p: 1,
        frequency_penalty: 0.0,
        presence_penalty: 0.6,
        stop: [" Q:", " A:"],
    }).then(async response => {
        var ms = response.data.choices[0].text
        await conn.sendMessage(id, { text: ms.replace('?\n', '').replace('A: ', '').trim() })
    }).catch(async err => {
        await conn.sendMessage(id, { text: 'Maaf saat ini saya sedang melakukan pemeriksaan rutin' })
    })
}

module.exports={
    ai
}