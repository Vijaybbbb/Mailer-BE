const nodeMailer  = require('nodemailer')

//nodemailer Setup
const transport = nodeMailer.createTransport({
       service: "gmail",
       auth: {
         user: process.env.EMAIL, 
         pass: process.env.PASS,
       },
       secure: true, // Use TLS
       tls: {
         rejectUnauthorized: false, // Disable TLS certificate verification
       },  
     });

//send otp to email
 const sendEmail = ({strToEmail,strSubject,strEmailContent}) =>{  
       return new Promise((resolve,reject)=>{
              const mailOptions = {
                     from: 'enter email',
                     to: strToEmail,
                     subject: `${strSubject}`,
                     text: `${strEmailContent}`
                   };
              transport.sendMail(mailOptions, (err) => {
                     if (err) {
                            console.log(err);
                            
                            reject(new Error("Failed to send "));
                      } else {
                             console.log("Email Sent Succesfully");
                             resolve("Email Sent successfully");
                      }
               });
       })
 }

 //verify otp
     



module.exports = {
       sendEmail
} 