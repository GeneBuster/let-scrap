import ScrapRequest from '../models/request.model.js';
import User from '../models/user.model.js';
import { sendEmail } from '../utils/emailSender.js';

// No changes needed in existing functions
export const createScrapRequest = async (req, res) => {
    try {
        const { user, items, pickupAddress } = req.body;
        const newRequest = new ScrapRequest({
            user,
            items,
            pickupAddress,
            status: 'Pending'
        });
        await newRequest.save();
        res.status(201).json({
            message: 'Scrap request created successfully',
            request: newRequest
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to create scrap request',
            error: error.message
        });
    }
};
export const getAllScrapRequests = async (req, res) => {
    try {
        const requests = await ScrapRequest.find({})
            .populate('user', 'name email')
            .populate('dealer', 'name email');
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch scrap requests',
            error: error.message
        });
    }
};
export const updateScrapRequestStatus = async (req, res) => {
    try {
        const { requestId, status, dealerId, timeSlot, pickupDate } = req.body;
        const updatedRequest = await ScrapRequest.findByIdAndUpdate(
            requestId,
            {
                status,
                dealer: dealerId,
                timeSlot: timeSlot || null,
                pickupDate: pickupDate || null,
            },
            { new: true }
        ).populate('user').populate('dealer');

        if (!updatedRequest) {
            return res.status(404).json({ message: 'Scrap request not found' });
        }
        res.status(200).json({
            message: 'Scrap request updated successfully',
            request: updatedRequest
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to update scrap request',
            error: error.message
        });
    }
};
export const deleteScrapRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const deletedRequest = await ScrapRequest.findByIdAndDelete(requestId);
        if (!deletedRequest) {
            return res.status(404).json({ message: 'Scrap request not found' });
        }
        res.status(200).json({
            message: 'Scrap request deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to delete scrap request',
            error: error.message
        });
    }
};
export const getUserRequests = async (req, res) => {
    try {
        const { userId } = req.params;
        const requests = await ScrapRequest.find({ user: userId }).populate('dealer');
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch user requests', error: error.message });
    }
};
export const getAcceptedRequestsForDealer = async (req, res) => {
    try {
        const dealerId = req.user.userId; // Corrected from req.user.id
        const requests = await ScrapRequest.find({
            dealer: dealerId,
            status: 'Accepted'
        });
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
export const markRequestAsPickedUp = async (req, res) => {
    try {
        const { id } = req.params;
        const request = await ScrapRequest.findById(id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }
        request.status = 'Picked Up';
        await request.save();
        res.status(200).json({ message: 'Marked as picked up', request });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
export const completeScrapRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { earnings } = req.body; 

        if (earnings === undefined || earnings < 0) {
            return res.status(400).json({ message: 'A valid earnings amount is required.' });
        }

        const request = await ScrapRequest.findById(id);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        request.status = 'Completed';
        request.earnings = earnings;
        await request.save();

        res.status(200).json({ message: 'Request completed successfully', request });
    } catch (error) {
        console.error("Error completing request:", error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Updated function to handle review submission
export const submitReview = async (req, res) => {
    try {
        const { rating, review } = req.body;
        const { id } = req.params; 
        const userId = req.user.userId;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'A valid rating between 1 and 5 is required.' });
        }

        // FIX: Use .populate('dealer') to fetch the request and the full dealer document together.
        const request = await ScrapRequest.findById(id).populate('dealer');

        if (!request) {
            return res.status(404).json({ message: 'Scrap request not found.' });
        }

        if (request.user.toString() !== userId) {
            return res.status(403).json({ message: 'Forbidden: You can only review your own requests.' });
        }

        if (request.status !== 'Completed') {
            return res.status(400).json({ message: 'You can only review a completed request.' });
        }
        
        if (request.rating) {
            return res.status(400).json({ message: 'This request has already been reviewed.' });
        }

        request.rating = rating;
        request.review = review;
        await request.save();
        
        // The dealer document is now available directly on request.dealer
        if (request.dealer) {
            const dealer = request.dealer;
            const currentRatingTotal = (dealer.averageRating || 0) * (dealer.ratingCount || 0);
            const newRatingCount = (dealer.ratingCount || 0) + 1;
            
            dealer.ratingCount = newRatingCount;
            dealer.averageRating = (currentRatingTotal + rating) / newRatingCount;
            
            await dealer.save();
        }

        res.status(200).json({ message: 'Review submitted successfully!' });

    } catch (error) {
        console.error("Error submitting review:", error);
        res.status(500).json({ message: 'Server error while submitting review.' });
    }
};

