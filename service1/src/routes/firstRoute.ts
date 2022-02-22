import { Router } from 'express';
import { firstController } from '../controllers/firstController';
import {jwtAuth } from '../middleware/jwtAuth'
const first: Router = Router();

first.get('/',firstController.home)
first.post('/newproduct',firstController.newProduct)
first.post('/newuser', jwtAuth.requiredAuth,firstController.newUser)
first.post('/login', firstController.login)

export {first}