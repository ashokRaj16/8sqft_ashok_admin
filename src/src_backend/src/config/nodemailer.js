import nodemailer from 'nodemailer';
import express from 'express';
import dotenv from 'dotenv'
import path from 'path';

dotenv.config();
const app = express();

app.set("view engine", "ejs");
app.set("views" , path.resolve('src', 'views'));

let mailConfig = {
  host: process.env.SMTP_HOST || "test",
  port: parseInt(process.env.SMTP_PORT, 10),
  secure: true,
  auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASSWORD || ""
  },
  socketTimeout: 30000, // Timeout after 30 seconds
  connectionTimeout: 30000, // Timeout after 30 seconds
}

export const sendMail = async (to , subject = "", text = "", html = "" ) => {
    try{
        const transporter = nodemailer.createTransport(mailConfig);
        
        transporter.verify(function (error, success) {
            if (error) {
            //   console.log(error);
              return error
            } 
        });
        const info = await transporter.sendMail({
            from: {
                name: "Nexus Yard",
                address: process.env.EMAIL_ADDRESS || "test@test.com"                
            },
            to,
            subject,
            text,
            html
        });
        
        return info;
    }
    catch(error)
    {
        throw error;
    }
}

export const sendMailTemplate = async (to, subject = "", text = "", html = "", retries = 3 ) => {
    try {
        const transporter = nodemailer.createTransport(mailConfig);
        
        await transporter.verify();
        let result; 
        while(retries > 0) {
            try{

                result = await transporter.sendMail({
                    from: {
                        name: "8 Sqft Team",
                        address: process.env.EMAIL_ADDRESS || "ashokambore16@gmail.com"
                    },
                    to,
                    subject,
                    text,
                    html
                });
                break;
            }
            catch(error) {

                retries--;
                if(retries === 0){
                    throw error;
                }
            }
        }
        return result;
    }
    catch(error)
    {
        throw error;
    }
}

export function renderEmailTemplate(templateName, data){
  return new Promise((resolve, reject) => {
      app.render(templateName, data, (err, html) => {
          if(err) {
            console.log(err);
              reject(err);
          }
          else{
              resolve(html);
          }
      })
  } )
};
