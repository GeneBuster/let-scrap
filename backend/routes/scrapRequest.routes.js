import express from 'express';
import {
    createScrapRequest,
    getAllScrapRequests,
    updateScrapRequestStatus,
    deleteScrapRequest,
    getUserRequests
} from '../controllers/scrapRequest.controller.js';

const router = express.Router();


router.post('/create', createScrapRequest);

router.get('/', getAllScrapRequests);

router.put('/update-status', updateScrapRequestStatus);

router.delete('/:requestId', deleteScrapRequest);
router.get('/user/:userId', getUserRequests);

export default router;