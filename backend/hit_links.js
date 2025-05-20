const https = require('https');
const urls = [
   "https://api.earn4u.info/api/v1/referral/roi",
    "https://api.earn4u.info/api/v1/referral/commission/check",
    "https://api.earn4u.info/api/v1/referral/check",
    "https://api.earn4u.info/api/v1/reward"
];

function hitLink(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            console.log(`Successfully hit ${url}: Status Code ${res.statusCode}`);
            res.on('data', (d) => {
                process.stdout.write(d);
            });
            resolve();  // Resolve the promise when the request is done
        }).on('error', (e) => {
            console.error(`Error hitting ${url}:`, e.message);
            reject(e);  // Reject the promise if an error occurs
        });
    });
}

// Function to wait for a specified number of milliseconds
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Main function to hit URLs with a delay
async function hitLinksWithDelay() {
    for (const url of urls) {
        await hitLink(url);  // Hit the URL
        console.log(`Waiting for 10 seconds before hitting the next URL...`);
        await wait(10000);   // Wait for 10 seconds (10000 milliseconds)
    }
}

// Execute the function
hitLinksWithDelay();