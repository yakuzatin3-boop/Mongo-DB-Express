import express from 'express'
import { register, loginUser } from '../controller/auth.controller.js'
import { admin, userOnly } from '../middleware/auth.middleware.js';

const authroute = express.Router();

authroute.post('/register', register);
authroute.post('/login', loginUser);

export default authroute;