import express from 'express';
import { authMiddleware } from '../utils/auth.middleware.js';
// We will create the adminMiddleware next
import { adminMiddleware } from '../utils/admin.middleware.js'; 
// We will create the adminController next
import { getAllUsers } from '../controllers/admin.controller.js'; 

const router = express.Router();

// This line applies the middleware to ALL routes defined in this file.
// A request must first pass authMiddleware, then adminMiddleware, before proceeding.
router.use(authMiddleware, adminMiddleware);

// --- Admin Routes ---

// Route for admins to get a list of all users on the platform
router.get('/users', getAllUsers);

// You can add more admin-specific routes here later, for example:
// router.get('/requests', getAllScrapRequests);
// router.put('/users/:id/suspend', suspendUserAccount);

export default router;
