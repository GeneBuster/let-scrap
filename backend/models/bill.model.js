import mongoose from 'mongoose';

const billSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true 
    },
  items: [{
    name: { 
        type: String, 
        required: true
    },
    quantity: { 
        type: Number, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true
    } 

  }],
  subtotal: { 
    type: Number, 
    required: true 
  },
  totalAmount: { 
    type: Number, 
    required: true 
    },  
  generatedAt: { 
    type: Date, 
    default: Date.now 
    }
});

const Bill = mongoose.model('Bill', billSchema);

export default Bill;