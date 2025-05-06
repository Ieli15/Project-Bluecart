// Main JavaScript file for ShopCrawl

document.addEventListener('DOMContentLoaded', function() {
  // Check API status when page loads
  checkApiStatus();
});

function checkApiStatus() {
  const statusIndicator = document.getElementById('status-indicator');
  const statusMessage = document.getElementById('status-message');
  const apiMessage = document.getElementById('api-message');

  if (!statusIndicator || !statusMessage || !apiMessage) {
    return; // Elements not found, might be on a different page
  }

  // First check if basic API is working
  fetch('/')
    .then(response => {
      if (response.ok) {
        // Basic API is working, now try search endpoint
        return fetch('/api/search?query=test')
          .then(searchResponse => searchResponse.json())
          .then(data => {
            statusIndicator.classList.remove('status-offline');
            statusIndicator.classList.add('status-online');
            statusMessage.textContent = 'API is online and search is working!';
            apiMessage.textContent = 'API Response: ' + JSON.stringify(data, null, 2);
          })
          .catch(error => {
            statusIndicator.classList.remove('status-offline');
            statusIndicator.classList.add('status-online');
            statusMessage.textContent = 'API is online, but search requires a RapidAPI key';
            apiMessage.textContent = 'Server is up and running. Add a RapidAPI key to enable search functionality.';
          });
      } else {
        throw new Error('API server is not responding');
      }
    })
    .catch(error => {
      statusIndicator.classList.remove('status-online');
      statusIndicator.classList.add('status-offline');
      statusMessage.textContent = 'API is offline';
      apiMessage.textContent = 'Error: ' + error.message;
    });
}

function searchProducts(query, page = 1) {
  return fetch(`/api/search?query=${encodeURIComponent(query)}&page=${page}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Search failed');
      }
      return response.json();
    });
}

function compareProducts(products) {
  return fetch(`/api/compare`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ products })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Comparison failed');
      }
      return response.json();
    });
}