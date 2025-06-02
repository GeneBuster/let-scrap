import express from 'express';
import {
    createScrapRequest,
    getAllScrapRequests,
    updateScrapRequestStatus,
    deleteScrapRequest,
    getUserRequests,
    getAcceptedRequestsForDealer,
    markRequestAsPickedUp
} from '../controllers/scrapRequest.controller.js';
import {authMiddleware} from '../utils/auth.middleware.js'

const router = express.Router();


router.post('/pickup-request',authMiddleware, createScrapRequest);

router.get('/', getAllScrapRequests);

router.put('/update-status', updateScrapRequestStatus);

router.delete('/:requestId', deleteScrapRequest);
router.get('/user/:userId', getUserRequests);



router.get('/accepted', authMiddleware, getAcceptedRequestsForDealer);

router.put('/mark-picked-up/:id', authMiddleware, markRequestAsPickedUp);

export default router;