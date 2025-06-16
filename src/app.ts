import express from 'express';
import cors from 'cors';
import morgan from 'morgan'
import uploadRoutes from './routes/upload-routes/upload.route.js'
import { createCustomValidatedTerrace } from './controllers/terrace-controllers/terrace.validator.js';
import terraceRoutes from './routes/terrace-routes/terraces.router.js';
import userRoutes from './routes/user-routes/user.routes.js'
import bookingRoutes from './routes/booking-routes/booking.routes.js'
//import { sequelize } from './config/sequelize-config.js';
import paymentRoutes from "./routes/payment-routes/payment.route.js"
import './models/associations/associations.js'
//import { assignRandomImagesToTerraces } from './services/terrace-services/default-images-service/default.images.assignment.js';
import { sequelize } from './config/sequelize-config.js';
import { cronFetch } from './utils/terrace-utils/cron/cronFetch.js';
import authRoutes from './routes/auth.routes/auth.route.js'
console.log('--- STARTUP TEST LOG ---');

console.log('Environment loaded:', {
    apiUrl1: process.env.BUSINESS_API_URL,
    apiUrl2: process.env.TERRACE_API_URL
});
// JWT
// const JWT_SECRET_STRING = process.env.JWT_SECRET || 'supersecretdefaultkey';
// const JWT_SECRET = Buffer.from(JWT_SECRET_STRING, 'utf8');
// const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

// const JWT_SECRET_STRING="a6DP1zgRA27o2g7fOerq";
// const JWT_SECRET = Buffer.from(JWT_SECRET_STRING, 'utf8');
// const JWT_EXPIRES_IN = '1d';

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
    origin: ['http://localhost:5173', 'http://localhost:4200'], // Allow only your frontend // 5173 for vite app
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Allowed methods
    credentials: true, // If cookies/auth headers needed!
    //TODO take a look at middleware headers auth

}));



//This middleware parses incoming JSON data from the request body, limit 50mb for saving space
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" })); // For form data


// api routes here
app.use('/', userRoutes);
app.use('/', terraceRoutes);
app.use('/', authRoutes)


app.use('/', bookingRoutes)

app.use('/', paymentRoutes)
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
//Descomentar luego
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida correctamente.');
        // Si quieres sincronizar tus modelos (crear tablas si no existen)
        // await sequelize.sync({ alter: true }); // Usar { force: true } solo en desarrollo, borrará y recreará tablas
        // console.log('✅ Base de datos y tablas sincronizadas.');

        app.listen(port, () => {
            console.log(`Express está escuchando en http://localhost:${port} 🤍`);
            // Descomentar si usas cronFetch
            // try {
            //     cronFetch('30 2 1 */3 *');
            //     console.log('✅ Cron job configurado.');
            // } catch (err) {
            //     console.error(`❌ Error al configurar cron job:`, err);
            // }
            // Descomentar si usas assignRandomImagesToTerraces
            // assignRandomImagesToTerraces()
            //     .then(() => console.log('🖼 Imágenes aleatorias asignadas a las terrazas.'))
            //     .catch(err => console.error('❌ Fallo al asignar imágenes:', err));
        });
    } catch (error) {
        console.error('❌ No se pudo conectar a la base de datos:', error);
        process.exit(1); // Salir si la conexión a la base de datos falla
    }
};

startServer();
// try {
//     cronFetch('30 2 1 */3 *')
// } catch (err) {
//     console.error(`Error triggering cron, ${err}`)
// }

// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';

// const JWT_SECRET = process.env.JWT_SECRET || 'supersecretdefaultkey';

// export interface AuthenticatedRequest extends Request {
//   user?: any; // Puedes tiparlo mejor según lo que metas en el token
// }

// export const isTokenValid = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ error: 'Missing or invalid Authorization header' });
//   }

//   const token = authHeader.split(' ')[1];

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     req.user = decoded;
//     next(); // Continua al siguiente middleware o controlador
//   } catch (err) {
//     console.error('❌ Invalid token:', err);
//     return res.status(401).json({ error: 'Invalid or expired token' });
//   }
// };

