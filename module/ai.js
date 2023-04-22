const { Configuration, OpenAIApi } = require("openai")
const fs = require('fs')
const identity = fs.readFileSync('./characterConfig/identity.txt')

let promptNeuro = identity.toString()

async function ai(conn, id, prompt, api, org){
    if (prompt) {
        const configuration = new Configuration({
            organization: org,
            apiKey: api,
        });

        const openai = new OpenAIApi(configuration);
        
        await openai.createCompletion({
            model: "text-davinci-003",
            prompt: promptNeuro + "Q:" + prompt,
            temperature: 0.9,
            max_tokens: 150,
            top_p: 1,
            frequency_penalty: 0.0,
            presence_penalty: 0.6,
            stop: [" Q:", " A:"],
        }).then(async response => {
            var ms = response.data.choices[0].text
            let cut = ms.indexOf('\\nA: ');
            await conn.sendMessage(id, { text: ms.substr(cut + 5) })
            console.log(response.data)
            promptNeuro = promptNeuro + "Q:" + prompt + ms
            fs.writeFileSync('./characterConfig/identity.txt', promptNeuro)
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