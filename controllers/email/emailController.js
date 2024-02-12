const nodemailer = require("nodemailer")
const asyncHandler = require("express-async-handler");
const config = require("../../config/config")

const sendEmail = asyncHandler(async(data, req, res) =>{
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user: config.authMail.mail,
          pass: config.authMail.pass,
        },
    });
    const info = await transporter.sendMail({
        from: '"Fred" <foo@gmail.com>', // sender address
        to: data.to, // list of receivers
        subject: data.subject, // Subject line
        text: data.text, // plain text body
        html: data.htm, // html body
    });
    console.log("Message sent: %s", info.messageId);
    
})

module.exports = { sendEmail }