const { google } = require('googleapis');
const cors = require('cors');
const express = require('express');
const sql = require('mysql2');
const { dbHost, dbUser, dbPassword, dbName, googleCredentials, spreadsheetId } = require('./data');

const app = express();
const conexion = sql.createConnection({
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    database: dbName
});

conexion.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database.');
});

app.use(cors({
    origin: '*', // Permite solicitudes desde cualquier origen
    credentials: true,
    optionsSuccessStatus: 200,
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    credentials: googleCredentials,
});

app.get('/secciones', (_, res) => {
    conexion.query('SELECT * FROM secciones', (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
        } else {
            res.json(results);
        }
    });
});

app.get('/subsecciones', (_, res) => {
    conexion.query('SELECT * FROM subsecciones', (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
        } else {
            res.json(results);
        }
    });
});

app.post('/temas', (req, res) => {
    const subsectionId = req.body.subsectionId;
    const consulta = `%${subsectionId}%`;

    conexion.query('SELECT * FROM videos WHERE titulo LIKE (?)', [consulta], (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
        } else {
            res.json(results);
        }
    });
});

app.post('/opiniones', (req, res) => {
    const { nombre, opinion,email } = req.body;

    conexion.query('INSERT INTO opiniones (nombre,opinion, email) VALUES(?,?,?)', [nombre, opinion, email], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json({ message: 'Datos enviados correctamente' });
        }
    });
});

app.post('/add', async (req, res) => {
    const { name, telefono, email, persona, material, servicio, nivel, mensaje, idioma } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: 'Nombre y email son campos obligatorios.' });
    }

    try {
        const sheets = google.sheets({ version: 'v4', auth });

        const range = 'Sheet1!A1';

        const response = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [[name, telefono, email, persona, material, servicio, nivel, mensaje, idioma]],
            },
        });

        console.log('Datos agregados correctamente:', response.data);
        res.status(200).json({ message: 'Datos agregados correctamente' });
    } catch (error) {
        console.error('Error al agregar datos:', error);
        res.status(500).json({ message: 'Error al agregar datos' });
    }
});

app.listen(2412, () => {
    console.log('Servidor activo en http://localhost:2412');
});