// index.js
const express = require('express');
const app = express();
const fs = require("fs")
const axios = require('axios');
const { time } = require('console');
const path = require('path');

// Use PORT environment variable or default to 3000
const port = process.env.PORT || 3001;

// const ONE_HOUR = 1000*60*60;
const ONE_HOUR = 60*60*1000;

app.use(express.static(path.join(__dirname, 'public')));

const fetchImage = async () => {
    console.log(new Date(), "Downloading new picture");
    try {
      const response = await axios({
        url: 'https://picsum.photos/1200',
        method: 'GET',
        responseType: 'arraybuffer',
      });
      const timestampPath = path.join(__dirname, 'public', 'timestamp.txt');
      fs.writeFileSync(path.join(__dirname, 'public', 'image.jpg'), response.data);
      const currentTimestamp = (new Date()).getTime();
      fs.writeFileSync(timestampPath, JSON.stringify(currentTimestamp));
      console.log('Image saved as image.jpg in public folder.');
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };

const checkOrCreateTimestamp = async () => {
    const timestampPath = path.join(__dirname, 'public', 'timestamp.txt');

    // Check if timestamp.txt exists
    if (!fs.existsSync(timestampPath)) {
      await fetchImage();
      console.log('timestamp.txt created with current timestamp.');
      setTimeout(checkOrCreateTimestamp, ONE_HOUR);
    } else {
      console.log('timestamp.txt already exists.');
      const currentTimestamp = new Date()
      const timestamp = parseInt(fs.readFileSync(timestampPath, 'utf8'));
      if (currentTimestamp - timestamp >=  ONE_HOUR) {
        console.log('fetch immediately.');
        await fetchImage();
        setTimeout(checkOrCreateTimestamp,  ONE_HOUR )
      }
      else {
        console.log('schedule after', (timestamp + ONE_HOUR - currentTimestamp));
        setTimeout(checkOrCreateTimestamp, (timestamp + ONE_HOUR - currentTimestamp ))
      }
    }
  };
  checkOrCreateTimestamp();
// Start the server and log the port
app.listen(port, () => {
    console.log(`Server started in port ${port}`);
});