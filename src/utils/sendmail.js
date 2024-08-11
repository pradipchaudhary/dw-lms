import { config } from "dotenv";
import nodemailer from "nodemailer";

config();
//neglet other part

let transporterInfo = {
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
};

export let sendEmail = async (mailInfo) => {
    try {
        let transporter = nodemailer.createTransport(transporterInfo); //transporter gives from information
        let info = await transporter.sendMail(mailInfo);
        console.log(info);
    } catch (error) {
        console.log("error has occurred", error.message);
    }
};
