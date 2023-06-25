// src/services/emailService.ts
import nodemailer from 'nodemailer';

export async function sendEmail(content: string, to: string) {
    let transporter = nodemailer.createTransport({
        service: 'outlook',
        auth: {
            user: process.env.GMAIL_USER, 
            pass: process.env.GMAIL_PASS, 
        },
    });

    let mailOptions = {
        from: process.env.GMAIL_USER, 
        to: [to], // Converta o destinatário para um array de strings
        subject: 'Invoice from Zeferino', 
        html: content,  
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            } else {
                console.log('Email sent: ' + info.response);
                resolve(info);
            }
        });
    });
}
