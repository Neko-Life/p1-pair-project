// Use at least Nodemailer v4.1.0
const nodemailer = require('nodemailer');

const automailer = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 486,
    auth: {
        user: 'marqofy@gmail.com',
        pass: 'calytlqxqgfpqbpu'
    }
});

let mailDetails = {
    from: "marqofy@gmail.com",
    to: "nekolife123579@gmail.com",
    subject: "Go Walk Walk Invoice",
    text: "testing our application"
}

module.exports = { automailer, mailDetails };