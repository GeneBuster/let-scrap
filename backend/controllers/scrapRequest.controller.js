import ScrapRequest from '../models/request.model.js'
import User from '../models/user.model.js'

export const createScrapRequest = async (req, res) => {
    try {
      const { scrapType, quantity, pickupAddress, preferredPickupTime } = req.body;
      
      // Check if the user is valid (already handled in the verifyToken middleware)
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Create the scrap request
      const newScrapRequest = new ScrapRequest({
        scrapType,
        quantity,
        pickupAddress,
        preferredPickupTime,
        sellerId: req.user.id,  // Associate the scrap request with the seller's user ID
        status: 'Pending',  // You can have a status to track the request (Pending, Completed, etc.)
      });
  
      await newScrapRequest.save();
      res.status(201).json({ message: 'Scrap pickup request submitted successfully', scrapRequest: newScrapRequest });
    } catch (error) {
      res.status(500).json({ error: error.message });
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

        const updatedRequest = await ScrapRequest.findByIdAndUpdate(
            requestId,
            {
                status, 
                dealer: dealerId || null 
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