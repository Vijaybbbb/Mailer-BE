const http  = require('http')
const express = require('express')
const app  = express()
const PORT = 3000;
const dotenv = require('dotenv')
const WebSocket = require('ws');
dotenv.config()
const cors = require('cors');
const server = http.createServer(app)
const wss = new WebSocket.Server({ server });
const { createEmailContent } = require('./Controllers/createEmailContent');
const { sendEmail } = require('./Controllers/sendMail');
app.use(cors({
    origin: '*'
  }));

// Middleware to parse JSON request body
app.use(express.json());


let clients = [];
// Keep track of all connected clie
wss.on('connection', (ws) => {
  console.log('Client connected');
  clients.push(ws);

  ws.on('close', () => {
    console.log('Client disconnected');
    clients = clients.filter(client => client !== ws);
  });
});
  
 // Helper function to broadcast a message to all connected clients
function broadcast(data) {
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

app.post('/',(req,res)=>{
    console.log(req.body);
     send(req.body.strToEmail,req.body.intBulkEmailCount);   
})

async function send(strToEmail,intBulkEmailCount) {
    
   if(strToEmail.trim()){
    await sendEmail({
        strToEmail:strToEmail,
        intBulkEmailCount:Number(intBulkEmailCount),
        broadcast
    });
   }else{
      throw new Error("Email Empty");
   }

}


// app.listen(PORT,(data,error)=>{

// if(error){

// }else{
//     console.log('server started')
// }
// }

// )

// Start server
server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});