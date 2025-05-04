import express, { Router } from 'express';
import authRoutes from './modules/auth/routes/auth.routes'; 
import employeeRoutes from './modules/employee/routes/employees.routes';
import evaluationRoutes from './modules/evaluation/routes/evaluations.routes';
import feedbackRoutes from './modules/feedback/routes/feedback.routes';


// Crea un nuevo router de Express
const router: Router = express.Router();

// Usa las rutas de cada módulo, definiendo el prefijo de la ruta para cada uno.

router.use('/auth', authRoutes);
router.use('/employees', employeeRoutes);
router.use('/evaluations', evaluationRoutes);
router.use('/feedback', feedbackRoutes);
//router.use('/reports', reportRoutes);

// Exporta el router centralizado para que pueda ser utilizado por la aplicación principal
export default router;