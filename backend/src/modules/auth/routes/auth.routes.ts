import express from 'express';
//import { authMiddleware } from '@shared/middlewares/auth/auth.middleware';
import LoginController from '../controllers/login.controller';
import RegisterController from '../controllers/register.controller';

const loginController = new LoginController();
const registerController = new RegisterController();

const router = express.Router();

router.post('/login',loginController.login.bind(loginController));
router.post('/register', registerController.register.bind(registerController));
// router.get('/profile', authMiddleware, (req, res) => {
//   res.json({ user: req.user });
// });

export default router;