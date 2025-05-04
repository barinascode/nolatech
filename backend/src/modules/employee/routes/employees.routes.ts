import express from 'express';
import { ListEmployeesController } from '../controllers/list.employees.controller';

const listEmployeesController = new ListEmployeesController();

const router = express.Router();

// Definir la ruta para listar empleados
router.get('/', listEmployeesController.handle.bind(listEmployeesController));


export default router;