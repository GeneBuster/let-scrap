import express from 'express';
import connectDB from './database/db.js';
import scrapRequestRoutes from './routes/scrapRequest.routes.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();


app.use(express.json()); 


connectDB();


app.use('/api/scrap-requests', scrapRequestRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = 5000;

app.listen(PORT, () => {
    
    console.log(`Server is running on port ${PORT}`);
});
