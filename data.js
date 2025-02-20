require('dotenv').config();
const fs = require('fs');
const path = require('path');

const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
const googleCredentialsPath = path.resolve(__dirname, process.env.GOOGLE_CREDENTIALS);

// Leer el contenido del archivo de credenciales
const googleCredentialsContent = fs.readFileSync(googleCredentialsPath, 'utf8');

// Parsear el contenido JSON
const googleCredentials = JSON.parse(googleCredentialsContent);
const spreadsheetId = process.env.SPREADSHEET_ID;

module.exports = {
    dbHost,
    dbUser,
    dbPassword,
    dbName,
    googleCredentials,
    spreadsheetId
};