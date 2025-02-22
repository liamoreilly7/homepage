// Get references to the form, input, and result container
const form = document.getElementById('number-form');
const numberInput = document.getElementById('number-input');
const factResult = document.getElementById('fact-result');

// Fetch fact from Numbers API
async function fetchNumberFact(number) {
    try {
        const response = await fetch(`http://numbersapi.com/${number}?json`);
        const data = await response.json();
        return data.text; // The fact is in the "text" property
    } catch (error) {
        console.error('Error fetching number fact:', error);
        return 'Failed to fetch fact. Please try again.';
    }
}

// Handle form submission
form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the form from submitting

    const number = numberInput.value.trim();
    if (!number) {
        alert('Please enter a number.');
        return;
    }

    // Display loading message
    factResult.textContent = 'Loading...';

    // Fetch and display the fact
    const fact = await fetchNumberFact(number);
    factResult.textContent = fact;
});