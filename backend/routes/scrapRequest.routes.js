import express from 'express';
import {
    createScrapRequest,
    getAllScrapRequests,
    updateScrapRequestStatus,
    deleteScrapRequest
} from '../controllers/scrapRequest.controller.js';
import {authMiddleware} from '../utils/auth.middleware.js'

const router = express.Router();


router.post('/pickup-request',authMiddleware, createScrapRequest);

router.get('/', getAllScrapRequests);

router.put('/update-status', updateScrapRequestStatus);

router.delete('/:requestId', deleteScrapRequest);

export default router;