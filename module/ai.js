const { Configuration, OpenAIApi } = require("openai")

async function ai(conn, id, api, prompt){
    const openai = new OpenAIApi(new Configuration({
        apiKey: process.env.API_KEY_GPT
    }))

    openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: prompt}]
    }).then(async response => {
        var ms = response.data.choices[0].message.content
        await conn.sendMessage(id, { text: ms.replace('\n\n', '') })
    })
}

module.exports={
    ai
}