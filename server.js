// Import libraries
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const path = require('path');           
const PORT = process.env.PORT || 5000;  

// Initialize App
const app = express();
app.set('port', (process.env.PORT || 5000));
app.use(cors());
app.use(bodyParser.json());

// Initialize routes
const router = require('./routes/api');
app.use('/api', router);

// Connect to mongodb through mongoose
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

require('dotenv').config();
const url = process.env.MONGODB_URI;

mongoose.connect(url, {useNewUrlParser: true, useCreateIndex:true, useUnifiedTopology: true});

// Do stuff
app.use((req, res, next) => 
{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});

///////////////////////////////////////////////////
// For Heroku deployment

// Server static assets if in production
if (process.env.NODE_ENV === 'production') 
{
  // Set static folder
  app.use(express.static('frontend/build'));

  app.get('*', (req, res) => 
 {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
}

app.listen(PORT, () => 
{
  console.log(`Server listening on port ${PORT}.`);
}); 