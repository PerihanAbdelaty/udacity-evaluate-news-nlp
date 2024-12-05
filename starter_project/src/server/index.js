var path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("dist"));

console.log(__dirname);

app.get("/", function (req, res) {
  res.sendFile("dist/index.html");
});


// POST Route
app.post('/api', async (req, res) => {
  console.log('Received request:', req.body);

  const { text } = req.body;
  const apiKey = process.env.API_KEY;

  const url = 'https://api.textrazor.com';
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-textrazor-key': apiKey
      },
      body: `extractors=entities,topics&text=${encodeURIComponent(text)}`
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    console.log('API Response:', data);

    res.send(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error processing your request');
  }
});


// Designates what port the app will listen to for incoming requests
app.listen(8000, function () {
  console.log("Example app listening on port 8000!");
});


