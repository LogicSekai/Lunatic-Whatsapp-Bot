const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
    const body = req.body;
    console.log(body);
    res.status(200).send('Webhook received successfully!');
});

app.listen(port, () => {
    console.log(`Webhook server listening at http://localhost:${port}`);
});