// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Get references to DOM elements
    const questionElement = document.getElementById('question');
    const choicesElement = document.getElementById('choices');
    const resultElement = document.getElementById('result');
    const nextQuestionButton = document.getElementById('next-question');

    let correctAnswer; // Store the correct answer for the current question

    // Fetch a trivia question from the API
    async function fetchTriviaQuestion() {
        try {
            const response = await fetch('https://opentdb.com/api.php?amount=1&difficulty=easy&category=11');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data.results[0]; // Return the first question
        } catch (error) {
            console.error('Error fetching trivia question:', error);
            return null;
        }
    }

    // Display the trivia question and choices
    function displayQuestion(questionData) {
        if (!questionData) {
            questionElement.textContent = 'Failed to load question. Please try again.';
            return;
        }

        // Decode HTML entities in the question and answers
        const decodeHtml = (html) => {
            const txt = document.createElement('textarea');
            txt.innerHTML = html;
            return txt.value;
        };

        // Set the question text
        questionElement.textContent = decodeHtml(questionData.question);

        // Clear previous choices
        choicesElement.innerHTML = '';

        // Combine correct and incorrect answers
        const allChoices = [...questionData.incorrect_answers, questionData.correct_answer];
        allChoices.sort(() => Math.random() - 0.5); // Shuffle the choices

        // Create and display the choices
        allChoices.forEach((choice) => {
            const choiceButton = document.createElement('button');
            choiceButton.className = 'choice';
            choiceButton.textContent = decodeHtml(choice);
            choiceButton.addEventListener('click', () => checkAnswer(choice, questionData.correct_answer));
            choicesElement.appendChild(choiceButton);
        });

        // Store the correct answer
        correctAnswer = questionData.correct_answer;

        // Clear the result message
        resultElement.textContent = '';
    }

    // Check if the selected answer is correct
    function checkAnswer(selectedAnswer, correctAnswer) {
        const choices = document.querySelectorAll('.choice');
        choices.forEach((choice) => {
            choice.disabled = true; // Disable all choices after selection
            if (choice.textContent === correctAnswer) {
                choice.classList.add('correct'); // Highlight the correct answer
            } else if (choice.textContent === selectedAnswer) {
                choice.classList.add('incorrect'); // Highlight the incorrect answer
            }
        });

        // Display the result message
        if (selectedAnswer === correctAnswer) {
            resultElement.textContent = 'Correct! 🎉';
            resultElement.style.color = '#28a745';
        } else {
            resultElement.textContent = `Incorrect. The correct answer is: ${correctAnswer}`;
            resultElement.style.color = '#dc3545';
        }
    }

    // Load the next question
    nextQuestionButton.addEventListener('click', async () => {
        const questionData = await fetchTriviaQuestion();
        displayQuestion(questionData);
    });

    // Load the first question when the page loads
    fetchTriviaQuestion().then(displayQuestion);
});