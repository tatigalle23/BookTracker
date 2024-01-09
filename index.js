const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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

app.use(express.json());
app.use(express.static(path.join(__dirname, '/views')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const dataFolder = path.join(__dirname, 'data');
if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder);
}

function saveDataToFile(data, dataPath) {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
}
function loadDataFromFile(dataPath) {
    if (fs.existsSync(dataPath)) {
        const content = fs.readFileSync(dataPath, 'utf8');
        return JSON.parse(content);
    } else {
        return [];
    }
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/Views/main.html'));
});

app.post('/save', upload.single('bookImage'), (req, res) => {
    
    const dataPath = path.join(__dirname, 'data', 'books.json');
    const bookName = req.body.bookName;
    const imagePath = req.file.path;
    const bookId = req.body.bookName;

    const books = loadDataFromFile(dataPath);


    books.push({ id: bookId, bookName, imagePath });    
    saveDataToFile(books,dataPath);
    res.redirect('/');
    // Puedes procesar los datos y la ruta de la imagen aquí

});

app.get('/highlights', (req, res) => {
    res.sendFile(path.join(__dirname, '/Views/highlights.html'));
});

app.get('/books', (req, res) => {
    // Devuelve los libros almacenados como respuesta JSON
    
    const dataPath = path.join(__dirname, 'data', 'books.json');

     const books = loadDataFromFile(dataPath);
    res.json(books);
});

//**HIGHLIGHTS */
app.post('/saveInfo', (req, res) => {
    
    const dataPath = path.join(__dirname, 'data', 'info.json');
    const bookInfo = req.body; 
    const highlights= loadDataFromFile(dataPath);
    console.log(bookInfo);

    const existingInfoIndex = highlights.findIndex(info => info.bookTitle === bookInfo.bookTitle);
    if (existingInfoIndex !== -1) {
        // Si ya hay información, actualizarla
        highlights[existingInfoIndex] = bookInfo;
    } else {
        // Si no hay información, agregarla como nueva
        highlights.push(bookInfo);
    }
    
    saveDataToFile(highlights,dataPath);
    res.json({ message: 'Información guardada exitosamente' });
});

app.get('/getInfo', (req, res) => {
    const dataPath = path.join(__dirname, 'data', 'info.json');
    const bookTitle = req.query.title;
    
    const highlights = loadDataFromFile(dataPath);

    // Buscar la información del libro por título
    const bookInfo = highlights.find(info => info.bookTitle === bookTitle);

    // Devolver la información encontrada
    res.json(bookInfo);
});



app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

