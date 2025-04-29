import ScrapRequest from '../models/request.model.js'

export const createScrapRequest = async (req, res) => {
    console.log("✅ createScrapRequest hit with body:", req.body); // Add this
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
        console.error("❌ Error creating request:", error.message);
        res.status(500).json({
            message: 'Failed to create scrap request',
            error: error.message
        });
    }
};


export const getAllScrapRequests = async (req, res) => {
    try {
        const requests = await ScrapRequest.find()
            .populate('user') 
            .populate('dealer');
        res.status(200).json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to fetch scrap requests',
            error: error.message
        });
    }
};



export const updateScrapRequestStatus = async (req, res) => {
    try {
        const { requestId, status, dealerId } = req.body;

        // Find and update the scrap request with the provided dealerId and status
        const updatedRequest = await ScrapRequest.findByIdAndUpdate(
            requestId,
            {
                status, 
                dealer: dealerId || null // Associate the dealerId with the request
            },
            { new: true }
        ).populate('user').populate('dealer'); // Populate user and dealer fields

        if (!updatedRequest) {
            return res.status(404).json({ message: 'Scrap request not found' });
        }

        res.status(200).json({
            message: 'Scrap request updated successfully',
            request: updatedRequest
        });
    } catch (error) {
        console.error(error);
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
        console.error(error);
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
