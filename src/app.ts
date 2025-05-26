
console.log("✅ ENV loaded:", process.env.BUSINESS_API_URL);
import express from 'express';
import cors from 'cors';
import { terraceValidator } from './controllers/terrace.controller.js';

console.log('--- STARTUP TEST LOG ---');

console.log('Environment loaded:', {
    apiUrl1: process.env.BUSINESS_API_URL,
    apiUrl2: process.env.TERRACE_API_URL
});

// listens to silent errors
process.on('uncaughtException', (err) => {
    console.error('CRASH:', err);
    process.exit(1);
});

const app = express();
const port = process.env.PORT || 8080;

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use(cors({
    origin: 'http://localhost:5173', // Allow only your frontend // 5173 for vite app
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    credentials: true // If cookies/auth headers needed!
    //TODO take a look at middleware headers auth
}));

//This middleware parses incoming JSON data from the request body
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form data

// api routes here

// middleware -->
// app.use(notFound);
// app.use(handleError);

app.get('/', (req, res) => {
    //esto devuelve la respuesta que le da el controller
    // el controller debe manejar la estructura de la respuesta
    // la ruta es el trigger desde el frontend
    // probar ruta con postman
    res.send('mi api!');
});

app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port} 🤍`);
});

console.log('--- DEBUG: About to call terraceValidator ---');
terraceValidator().catch(err => console.error('Validator error:', err));