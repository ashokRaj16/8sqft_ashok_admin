import axios from 'axios'; 
import retry from 'async-retry';

// Example usage with a retry mechanism 
async function fetchDataWithRetry(url) { 
    await retry(async () => { 
        const response = await axios.get(url); 
        return response.data; 
    }, 
    { 
        retries: 3, 
        onRetry: (error) => { 
            console.log("Retrying due to error:", error.message); 
        }, 
        factor: 2, 
        minTimeout: 1000 
    }); 
}