import express from 'express';
import cors from 'cors';
import morgan from 'morgan'
import uploadRoutes from './routes/upload-routes/upload.route.js'
import { createCustomValidatedTerrace } from './controllers/terrace-controllers/terrace.validator.js';
import terraceRoutes from './routes/terrace-routes/terraces.router.js';
import userRoutes from './routes/user-routes/user.routes.js'
import { assignRandomImagesToTerraces } from './services/terrace-services/default-images-service/default.images.assignment.js';
import { sequelize } from './config/sequelize-config.js';
import { cronFetch } from './utils/terrace-utils/cron/cronFetch.js';

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

app.use(morgan('dev'))

app.use((req, res, next) => {
    // // console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use(cors({
    origin: 'http://localhost:5173', // Allow only your frontend // 5173 for vite app
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Allowed methods
    credentials: true // If cookies/auth headers needed!
    //TODO take a look at middleware headers auth
}));



//This middleware parses incoming JSON data from the request body, limit 50mb for saving space
app.use(express.json({limit:"50mb"}));
app.use(express.urlencoded({ extended: true, limit:"50mb" })); // For form data

// api routes here
app.use('/',userRoutes);
app.use('/', terraceRoutes);
//! missing
// app.use('/', bookingRoutes)
//! missing
// app.use('/', paymentRoutes)
app.use('/', uploadRoutes)

// middleware -->
// app.use(notFound);
// app.use(handleError);

app.get('/', (req, res) => {
    //esto devuelve la respuesta que le da el controller
    // el controller debe manejar la estructura de la respuesta
    // la ruta es el trigger desde el frontend
    res.send('mi api!');
});

app.listen(port, () => {
    console.log(`Express is listening at http://localhost:${port} 🤍`);
    
});

try {
    cronFetch('30 2 1 */3 *')
} catch (err) {
    console.error(`Error triggering cron, ${err}`)
}