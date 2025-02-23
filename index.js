const express = require('express')
const app  = express()
const PORT = 3000;
const dotenv = require('dotenv')
dotenv.config()
const cors = require('cors');

console.log(process.env.EMAIL,process.env.PASS);
const { createEmailContent } = require('./Controllers/createEmailContent');
const { sendEmail } = require('./Controllers/sendMail');
app.use(cors({
    origin: '*'
  }));

  // Middleware to parse JSON request body
app.use(express.json());
  
app.post('/',(req,res)=>{
    console.log(req.body);
    send(req.body.strToEmail);   
})

async function send(strToEmail) {
   if(strToEmail.trim()){
    const content  = await createEmailContent();
    await sendEmail({
        strToEmail:strToEmail,
        strSubject:content?.strSubject,
        strEmailContent:content?.strEmailContent
    });
   }else{
      throw new Error("Email Empty");
   }

}

app.listen(PORT,(data,error)=>{

if(error){

}else{
    console.log('server started')
}
}

)