// index.ts
import 'reflect-metadata';
import express, { Request, Response } from 'express';
import cors from 'cors';
import routes from './routes';
import dotenv from 'dotenv';
import connectDB from './db';

// Carga las variables de entorno desde el archivo .env
dotenv.config();


// Conecta a la base de datos
connectDB();

const app = express();
const port = process.env.PORT || 3000;

// Habilitar cors
app.use(cors());

// Middleware para parsear el cuerpo de las peticiones como JSON
app.use(express.json());

// Ruta de health check
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).send({ message: 'Server is running' });
});

// rutas que permiten el cambio entre version del API
app.use('/api/v1/', routes); 

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});