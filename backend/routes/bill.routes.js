import express from 'express';
import { generateBill } from '../controllers/bill.controller.js';

const router = express.Router();


router.post('/generate', generateBill);

export default router;