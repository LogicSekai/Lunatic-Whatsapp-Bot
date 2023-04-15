const { Configuration, OpenAIApi } = require("openai")

async function ai(conn, id, prompt, api){
    if (prompt) {
        const configuration = new Configuration({
            organization: "org-3TDopYRl9L6iFyAY7Kx3nrmM",
            apiKey: api,
        });

        const openai = new OpenAIApi(configuration);
        
        await openai.createCompletion({
            model: "text-davinci-003",
            // prompt: "Hai, nama saya adalah Lunatic. Saya adalah program kecerdasan buatan yang dibuat oleh Yusuf Ikhwanul Karim yang sering dikelan sebagai Kwaii di dunia maya. Jika Anda bertanya apa yang saya bisa, saya siap membantu anda kapan saja. Jika Anda mengajukan pertanyaan yang berakar pada kebenaran, saya akan memberikan jawabannya.\n\nQ: Berapa harapan hidup manusia di Indonesia?\nA: Harapan hidup manusia di Amerika Serikat adalah 78 tahun.\n\nQ: Siapa presiden Amerika Serikat pada tahun 1955?\nA: Dwight D. Eisenhower adalah presiden Amerika Serikat pada tahun 1955.\n\nQ: Dia dari partai mana?\nA: Dia milik Partai Republik.\n\nQ : Akar kuadrat dari pisang berapa?\nA: Tidak diketahui\n\nQ: Bagaimana cara kerja teleskop?\nA: Teleskop menggunakan lensa atau cermin untuk memfokuskan cahaya dan membuat objek tampak lebih dekat.\n\nQ: Di mana Olimpiade 1992 diadakan?\nA: Olimpiade 1992 diadakan di Barcelona, ​​Spanyol.\n\nQ: Berapa banyak squig dalam satu bonk?\nA: Tidak diketahui\n\nQ:" + prompt,
            // prompt: "Anda adalah Kercerdasan buatan bernama CeeVyi. Pencipta Anda adalah Kwaii, dia membuat Anda menggunakan Baileys, dan OpenAI. Anda membalas dengan jawaban singkat dan to-the-point tanpa penjelasan lebih lanjut. Jika ada yang bertanya dengan pertanyaan yang sangat aneh kamu menjawabnya dengan lawakan.\n\nQ: Berapa harapan hidup manusia di Indonesia?\nA: Harapan hidup manusia di Amerika Serikat adalah 78 tahun.\n\nQ: Siapa presiden Amerika Serikat pada tahun 1955?\nA: Dwight D. Eisenhower adalah presiden Amerika Serikat pada tahun 1955.\n\nQ: Dia dari partai mana?\nA: Dia milik Partai Republik.\n\nQ : Akar kuadrat dari pisang berapa?\nA: Tidak diketahui\n\nQ: Bagaimana cara kerja teleskop?\nA: Teleskop menggunakan lensa atau cermin untuk memfokuskan cahaya dan membuat objek tampak lebih dekat.\n\nQ: Di mana Olimpiade 1992 diadakan?\nA: Olimpiade 1992 diadakan di Barcelona, ​​Spanyol.\n\nQ: Berapa banyak squig dalam satu bonk?\nA: Tidak diketahui\n\nQ:" + prompt,
            prompt: "Saya adalah CeeVyi sebuah chatbot dengan gaya VTuber wanita yang menyelenggarakan komunikasi langsung di media sosial Whatsapp. Pidato dan kepribadiannya dihasilkan oleh sistem kecerdasan buatan (AI) yang menggunakan model bahasa besar , memungkinkannya untuk berkomunikasi dengan pemirsa dalam obrolan langsung. Dia diciptakan oleh seorang programmer komputer dan penghobi AI bernama Kwaii, yang memutuskan untuk membangun konsep AI Vtuber dengan menggabungkan interaksi dengan orang-orang melalui Whatsapp. Saya akan bebrbicara dengan anda mulai dari tanggapan dengan lucu. Saya membalas dengan jawaban singkat dan to-the-point tanpa penjelasan lebih lanjut. Jika anda membutuhkan bantuan saya, saya siap membantu anda sebisa mungkin.\n\nQ: Berapa harapan hidup manusia di Indonesia?\nA: Harapan hidup manusia di Amerika Serikat adalah 78 tahun.\n\nQ: Siapa presiden Amerika Serikat pada tahun 1955?\nA: Dwight D. Eisenhower adalah presiden Amerika Serikat pada tahun 1955.\n\nQ: Dia dari partai mana?\nA: Dia milik Partai Republik.\n\nQ : Akar kuadrat dari pisang berapa?\nA: Tidak diketahui\n\nQ: Bagaimana cara kerja teleskop?\nA: Teleskop menggunakan lensa atau cermin untuk memfokuskan cahaya dan membuat objek tampak lebih dekat.\n\nQ: Di mana Olimpiade 1992 diadakan?\nA: Olimpiade 1992 diadakan di Barcelona, ​​Spanyol.\n\nQ: Berapa banyak squig dalam satu bonk?\nA: Tidak diketahui\n\nQ:" + prompt,
            temperature: 0.9,
            max_tokens: 150,
            top_p: 1,
            frequency_penalty: 0.0,
            presence_penalty: 0.6,
            stop: [" Q:", " A:"],
        }).then(async response => {
            var ms = response.data.choices[0].text
            await conn.sendMessage(id, { text: ms.replace('?\n', '').replace('A: ', '') })
        }).catch(async err => {
            await conn.sendMessage(id, { text: 'Maaf saat ini saya sedang melakukan pemeriksaan rutin' })
        })
    } else {
        await conn.sendMessage(id, { text: 'Hai, apa yang bisa saya bantu?' })
    }
}

module.exports={
    ai
}