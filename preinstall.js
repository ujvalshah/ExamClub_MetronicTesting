import { writeFile } from 'fs';

writeFile('./google-credentials-heroku.json', process.env.GOOGLE_CONFIG, (err) => {console.log(err)});