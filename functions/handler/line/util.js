const client = require("./const").client;

module.exports.downloadContent = (messageId) => {
    //GET IMAGE AS BUFFER
    return new Promise((resolve, reject) => {
        client.getMessageContent(messageId).then(stream => {
            const content = []
            stream
            .on('data', chunk => {
                content.push(Buffer.from(chunk))
            })
            .on('error', reject)
            .on('end', () => {
                resolve(Buffer.concat(content))
            })
        })
    })
}