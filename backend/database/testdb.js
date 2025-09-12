import mongoose from 'mongoose';


mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// Close the connection after checking
setTimeout(() => mongoose.connection.close(), 3000);
