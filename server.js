const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const port = 8080;

// Function to read coordinates from a JSON file
function readCoordinatesFromFile(filePath) {
    try {
        // Try to read the file synchronously
        const data = fs.readFileSync(filePath, 'utf8');
        
        // Parse the JSON data into an array
        const coordinates = JSON.parse(data);
        
        // Check if the data is an array and return it, otherwise return an empty array
        if (Array.isArray(coordinates)) {
            return coordinates;
        } else {
            return [];
        }
    } catch (error) {
        // If there is an error (e.g., file doesn't exist), return an empty list
        console.log('Error reading the file:', error);
        return [];
    }
}

// Function to write coordinates to a JSON file
function writeCoordinatesToFile(filePath, coordinates) {
    try {
        // Convert the coordinates array into a JSON string
        const data = JSON.stringify(coordinates, null, 2);  // Indentation is 2 spaces for readability
        
        // Write the JSON string to the file synchronously
        fs.writeFileSync(filePath, data, 'utf8');
        
        console.log('Coordinates have been successfully written to the file!');
    } catch (error) {
        // Handle any errors during writing to the file
        console.log('Error writing to the file:', error);
    }
}

// Middleware to parse JSON bodies
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, './')));


app.post('/send-list', (req, res) => {
    const coordinatesList = req.body.coordinates; // Access the coordinates list from the request body
    console.log('Received coordinates list:', coordinatesList);
    writeCoordinatesToFile('coordinates.json', coordinatesList)

    // You can process the list here, or store it, etc.
    
    // Respond with a confirmation message
    res.json({ message: 'List received successfully!', coordinates: coordinatesList });
});

// Endpoint to send the coordinates to the client
app.get('/get-coordinates', (req, res) => {
    const coordinates = readCoordinatesFromFile('coordinates.json')

    // Send the list of coordinates as a JSON response
    res.json({ coordinates });
});

// Serve the HTML file when accessing / or /index
app.get(['/', '/index'], (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
