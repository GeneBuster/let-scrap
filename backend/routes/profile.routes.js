import express from 'express';
import { getProfile } from '../controllers/user.controller.js';
import {authMiddleware} from '../utils/auth.middleware.js'

const router = express.Router();

router.get('/profile', authMiddleware, getProfile);

export default router;