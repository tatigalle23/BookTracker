const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 8000;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads'); // Directorio donde se guardará la imagen
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });
const books = require('./data');


app.use(express.static(path.join(__dirname, '/views')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/Views/main.html'));
});

app.post('/save', upload.single('bookImage'), (req, res) => {
    const bookName = req.body.bookName;
    const imagePath = req.file.path;

    books.push({ bookName, imagePath });
    res.redirect('/')
    // Puedes procesar los datos y la ruta de la imagen aquí

});

app.get('/books', (req, res) => {
    // Devuelve los libros almacenados como respuesta JSON
    res.json(books);
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

