let currentPuzzleId = 0;  // Store current puzzle ID
const userId = 'user123';  // Hardcoded user ID for now

// Initialize app with first puzzle
document.getElementById('get-puzzles-btn').addEventListener('click', fetchNextPuzzle);

function fetchNextPuzzle() {
    fetch('https://puzzlequestclassproject.azurewebsites.net/api/next-puzzle/' + userId)  // Update to your backend URL
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);  // Congratulate user on completing all puzzles
                return;
            }

            const puzzle = data.puzzle;
            currentPuzzleId = puzzle.id;  // Update current puzzle ID
            displayPuzzle(puzzle);
        })
        .catch(error => console.error('Error fetching puzzle:', error));
}

function displayPuzzle(puzzle) {
    const puzzlesList = document.getElementById('puzzles-list');
    puzzlesList.innerHTML = '';  // Clear any previous content

    const puzzleElement = document.createElement('div');
    puzzleElement.classList.add('puzzle');

    const puzzleQuestion = document.createElement('h2');
    puzzleQuestion.textContent = `${puzzle.type.toUpperCase()} Puzzle: ${puzzle.question}`;

    const answerForm = document.createElement('form');
    answerForm.classList.add('answer-form');

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Your answer...';
    input.required = true;

    const submitButton = document.createElement('input');
    submitButton.type = 'submit';
    submitButton.value = 'Submit Answer';

    // Create Hint Button
    const hintButton = document.createElement('button');
    hintButton.classList.add('hint-btn');
    hintButton.textContent = 'Get Hint';
    hintButton.addEventListener('click', () => showHint(puzzle.hint));

    answerForm.appendChild(input);
    answerForm.appendChild(submitButton);
    puzzleElement.appendChild(puzzleQuestion);
    puzzleElement.appendChild(answerForm);
    puzzleElement.appendChild(hintButton);

    answerForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const answer = input.value.trim();

        fetch('https://puzzlequestclassproject.azurewebsites.net/api/submit-answer', {  // Update to backend URL
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, puzzleId: puzzle.id, answer })
        })
        .then(response => response.json())
        .then(result => {
            if (result.correct) {
                alert('Correct!');
                fetchNextPuzzle();  // Load next puzzle after correct answer
            } else {
                alert(`Incorrect! Correct answer: ${result.correctAnswer}`);
            }
        });
    });

    puzzlesList.appendChild(puzzleElement);
    updateProgress();
}

// Function to display hint
function showHint(hint) {
    alert(`Hint: ${hint}`);
}

function updateProgress() {
    const progressElement = document.getElementById('progress');
    progressElement.textContent = `Progress: Puzzle ${currentPuzzleId} of ${puzzles.length}`;
}
