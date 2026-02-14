import express from 'express'
const router = express.Router();

import { register, login, refresh } from '../controllers/authController.js';
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);




export default router;