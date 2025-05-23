import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors({
    origin: 'http://localhost:5173', // Allow only your frontend // 5173 for vite app
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    credentials: true // If you need cookies/auth headers!
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
    res.send('Hello World!');
});

app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});