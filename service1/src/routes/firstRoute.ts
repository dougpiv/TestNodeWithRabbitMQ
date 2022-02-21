import { Router } from 'express';
import { firstController } from '../controllers/firstController';

const first: Router = Router();

first.get('/', firstController.home)
first.post('/newproduct', firstController.newProduct)

export {first}