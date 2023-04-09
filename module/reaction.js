async function reactToMessage(conn, key, jid) {
    const reactionMessage = {
        react: {
            text: "💖", // use an empty string to remove the reaction
            key: key
        }
    }
    await conn.sendMessage(jid, reactionMessage)
}

module.exports={
    reactToMessage
}