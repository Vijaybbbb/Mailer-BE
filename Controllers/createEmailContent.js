const { faker } = require('@faker-js/faker');

let temArray = ['Travel Visa','Tour Package','Ticket']


const createEmailContent = async function (){
 return {
    strSubject:`${faker.location.city()} ${temArray[Math.floor(Math.random() * 3)]}`,
    strEmailContent:`${faker.lorem.paragraphs(1)}`
 }
}

module.exports ={
    createEmailContent
} 