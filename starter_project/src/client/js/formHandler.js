// Replace checkForName with a function that checks the URL
import { isValid } from 'ipaddr.js';
import { checkForName } from './nameChecker'

// If working on Udacity workspace, update this with the Server API URL e.g. `https://wfkdhyvtzx.prod.udacity-student-workspaces.com/api`
// const serverURL = 'https://wfkdhyvtzx.prod.udacity-student-workspaces.com/api'
const serverURL = 'http://localhost:8000/api'

const form = document.getElementById('urlForm');
form.addEventListener('submit', handleSubmit);

function handleSubmit(event) {
    event.preventDefault();

    // Get the URL from the input field
    const formText = document.getElementById('name').value;

    // This is an example code that checks the submitted name. You may remove it from your code
    // Client.checkForName(formText);
    
    // Check if the URL is valid
    if (!isValidURL(formText)) {
        alert('Invalid URL');
        return;
    }
 
    // If the URL is valid, send it to the server using the serverURL constant above
    sendDataToServer(formText)
    .then((data) => {
      // Dynamically update the UI with results from the server
      updateUI(data);
    })
    .catch((error) => {
      console.error('Error during API request:', error);
      alert('Something went wrong while processing your request.');
    });
      
}

// Function to validate URLs
function isValidURL(input) {
    // Simple regex to check if input is a URL
    const urlPattern = new RegExp(
      '^(https?:\\/\\/)?' + // Protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*).)+[a-z]{2,}|' + // Domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR IPv4
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // Port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // Query string
      '(\\#[-a-z\\d_]*)?$',
      'i'
    );
    return !!urlPattern.test(input);
  }

// Function to send data to the server
async function sendDataToServer(text) {
    const response = await fetch(serverURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch from the server.');
    }
    return response.json();
  }

// Function to update the UI with results from the server
function updateUI(data) {
    // Check if entities are present
    const entities = data.response.entities
        ? data.response.entities.map((entity) => entity.matchedText || entity.entityId).join(', ')
        : 'No entities found';

    // Check if topics are present
    const topics = data.response.topics
        ? data.response.topics.map((topic) => topic.label).join(', ')
        : 'No topics found';

    // Update the DOM elements with the results
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <p><strong>Entities:</strong> ${entities}</p>
        <p><strong>Topics:</strong> ${topics}</p>
    `;
}


// Export the handleSubmit function
export { handleSubmit };

