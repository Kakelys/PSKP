
var nodemailer = require('nodemailer');

const sender = 'seno.v.test@gmail.com';
const receiver = 'alexglobal1459@gmail.com';
const accPass = 'uackzqyxyshekbmi';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: sender,
        pass: accPass
    }
});

module.exports.sendMail = async function send(message) {
    const result = await transporter.sendMail({
        from: sender,
        to: sender,
        subject: 'spam',
        text: message
    });
}