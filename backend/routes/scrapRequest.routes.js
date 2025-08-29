import express from 'express';
import {
    createScrapRequest,
    getAllScrapRequests,
    updateScrapRequestStatus,
    deleteScrapRequest,
    getUserRequests,
    getAcceptedRequestsForDealer,
    markRequestAsPickedUp,
    completeScrapRequest,
    // 1. Import the new controller function.
    submitReview
} from '../controllers/scrapRequest.controller.js';
import { authMiddleware } from '../utils/auth.middleware.js';

const router = express.Router();

// --- All routes are now protected with authMiddleware where necessary ---

router.post('/pickup-request', authMiddleware, createScrapRequest);
router.get('/', authMiddleware, getAllScrapRequests);
router.put('/update-status', authMiddleware, updateScrapRequestStatus);
router.delete('/:requestId', authMiddleware, deleteScrapRequest);
router.get('/user/:userId', authMiddleware, getUserRequests);
router.get('/accepted', authMiddleware, getAcceptedRequestsForDealer);
router.put('/mark-picked-up/:id', authMiddleware, markRequestAsPickedUp);
router.put('/complete/:id', authMiddleware, completeScrapRequest);

// 2. Add the new route for submitting a review for a specific request.
// It uses a POST request as we are creating a new entity (a review).
router.post('/:id/review', authMiddleware, submitReview);


export default router;
