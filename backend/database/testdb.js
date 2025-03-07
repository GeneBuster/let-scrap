import mongoose from 'mongoose';

const mongoURI = 'mongodb+srv://akunal259:P16AZHtnnl14nQYf@cluster1.ot7g5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1'; // Replace with your MongoDB connection string

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// Close the connection after checking
setTimeout(() => mongoose.connection.close(), 3000);
