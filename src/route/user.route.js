import { createUser, getByid, getUser, deleteUser, updateUser } from "../controller/user.controller.js";
import express from 'express';
import { admin, userOnly, protect } from "../middleware/auth.middleware.js";

const userroute = express.Router();

userroute.post('/user', createUser);
userroute.get('/user',getUser);
userroute.get('/user/:id',protect, getByid);
userroute.delete('/user/:id',protect, userOnly, deleteUser);
userroute.put('/user/:id',protect, admin, updateUser);

export default userroute;