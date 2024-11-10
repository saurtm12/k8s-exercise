// index.js
// timestamp-writer.js
const fs = require('fs');
const path = require('path');

// Path to the shared file
const filePath = '/usr/src/app/files/timestamp.txt';
const write = () => {
    const timestamp = new Date().toISOString();
    fs.writeFileSync(filePath, timestamp);
    console.log(`Timestamp written: ${timestamp}`);
}
write();
setInterval(write, 5000); // Write every 5 seconds