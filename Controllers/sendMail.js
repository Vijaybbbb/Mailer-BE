const nodeMailer  = require('nodemailer');
const { createEmailContent } = require('./createEmailContent');
const pLimit = require('p-limit').default;
const limit = pLimit(10);


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
 const sendBulkEmail = async ({strToEmail,strSubject,strEmailContent,count = 1}) =>{  
      try {
        return new Promise((resolve,reject)=>{
              const mailOptions = { 
                     from: 'mail',
                     to: strToEmail, 
                     subject: `${strSubject}`,
                     text: `${strEmailContent}`,
                   };
              transport.sendMail(mailOptions, (err) => {
                     if (err) { 
                            console.log(err);                           
                            reject(new Error("Failed to send "));
                      } else {
                             console.log("Email Sent Succesfully : " + count);
                             resolve("Email Sent successfully");
                      }
               });
       })
      } catch (error) {
         console.log(error)
         throw error;
      }
 }

const sendEmail = async function name({
        strToEmail,
        intBulkEmailCount,
        broadcast}) {
       
              if(intBulkEmailCount){
                     // for(let i=1;i<=intBulkEmailCount;i++){
                     //        try {
                     //        let content  = await createEmailContent();
                     //        await sendBulkEmail({
                     //                      strToEmail,
                     //                      strSubject:content?.strSubject,
                     //                      strEmailContent:content?.strEmailContent,
                     //                      count:i
                     //                      });
                     //        await new Promise((res) => setTimeout(res, 100)); 
                     //        } catch (error) {
                     //               if(error) continue;
                     //        }

                     // }
                     // console.log("SENDING_______++++++_________COMPLEATED")
                      const emailPromises = [];

    for (let i = 1; i <= intBulkEmailCount; i++) {

      const p = limit(async () => {
        try {
          const content = await createEmailContent();
          await sendBulkEmail({
            strToEmail,
            strSubject: content?.strSubject,
            strEmailContent: content?.strEmailContent,
            count: i,
          });

          if (broadcast) {
            broadcast({ status: 'sent', count: i, total: intBulkEmailCount });
          }

          console.log(`Email ${i} sent successfully.`);
        } catch (error) {
          console.log(`Failed to send email ${i}:`, error);
          if (broadcast) {
            broadcast({ status: 'failed', count: i, error:error  });
          }
        }
      });
      emailPromises.push(p);
    }

    await Promise.all(emailPromises);
    console.log("SENDING_______++++++_________COMPLETED");
     if (broadcast) {
            broadcast({ status: 'completed', count: 0, total: intBulkEmailCount });
          } 
              }else{
                     let content  = await createEmailContent();
                     await sendBulkEmail({
                            strToEmail,
                            strSubject:content?.strSubject,
                            strEmailContent:content?.strEmailContent
                     });
                    if (broadcast) {
                         broadcast({ status: 'sent', count: 1, total: intBulkEmailCount });
                     }

                     console.log(`Email ${1} sent successfully.`);
              }
}
     



module.exports = {
       sendEmail
} 