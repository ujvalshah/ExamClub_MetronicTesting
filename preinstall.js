require('dotenv').config();
const fs = require('fs');

fs.writeFile(process.env.GOOGLE_APPLICATION_CREDENTIALS, process.env.GCLOUD_CONFIG, (err) => {if(err){return console.log(err)} console.log(process.env.GCLOUD_CONFIG); console.log('file was saved')});