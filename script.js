// script.js
const questions = [
    { question: "Inside which HTML element do we put JavaScript?", answers: ["<script>", "<js>", "<scripting>", "<javascript>"], correct: 0 },
    { question: "Where is the correct place to insert JavaScript?", answers: ["<head>", "Both the <head> section and the <body> section are correct", "<body>", "Neither"], correct: 1 },
    { question: "How would you write 'Hello World' in an alert box?", answers: ["alertBox('Hello World');", "msg('Hello World');", "alert('Hello World');", "msgBox('Hello World');"], correct: 2 },
    { question: "How would you create a function in JavaScript?", answers: ["myFunction()", "function = myFunction()", "function:myFunction()", "function myFunction()"], correct: 3 },
    { question: "How would you call the function named 'myFunction'?", answers: ["function = myFunction()", "myFunction()", "call myFunction()", "function myFunction()"], correct: 1 },
    { question: "How does a FOR loop start?", answers: ["for (i <= 5; i++)", "for (i = 0; i <= 5)", "for (i = 0; i <= 5; i++)", "for i = 1 to 5"], correct: 2 },
];
let currentQuestionIndex = 0;
let score = 0;
let timer; // Declare timer variable at the top
let interval; // For the timer

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('show-leaderboard').onclick = showLeaderboard;
    document.querySelectorAll('.answer-btn').forEach((button, index) => {
        button.onclick = () => checkAnswer(index);
    });
    document.getElementById('submit-score').onclick = submitScore;
    document.getElementById('go-back').onclick = goBack;
    document.getElementById('clear-leaderboard').onclick = clearLeaderboard;

    // Initialize the quiz
    startQuiz();
});

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    displayQuestion();
    startTimer(60); // Start the timer with 90 seconds
}

function displayQuestion() {
    const questionObj = questions[currentQuestionIndex];
    document.getElementById('question').textContent = questionObj.question;
    questionObj.answers.forEach((answer, index) => {
        document.querySelectorAll('.answer-btn')[index].textContent = answer;
    });
}

function checkAnswer(selectedIndex) {
    if (questions[currentQuestionIndex].correct === selectedIndex) {
        score++;
    } else {
        // Deduct 10 seconds for a wrong answer
        timer -= 10;
        if (timer < 0) {
            timer = 0; // Prevent the timer from going negative
            endQuiz(); // End the quiz if the timer reaches 0
            return; // Exit the function to avoid displaying the next question after the quiz ends
        }
        updateTimerDisplay(); // Update the timer display after deducting time
    }
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {
        endQuiz();
    }
}

function endQuiz() {
    clearInterval(interval);
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('score').textContent = score;
    document.getElementById('score-container').style.display = 'block';
}

function submitScore() {
    const initials = document.getElementById('initials').value.trim();
    if (!initials) {
        alert("Please enter your initials.");
        return;
    }

    const newScore = { initials, score };
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.push(newScore);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));

    showLeaderboard();
}

function showLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.sort((a, b) => b.score - a.score);

    const entriesDiv = document.getElementById('leaderboard-entries');
    entriesDiv.innerHTML = '';

    leaderboard.forEach(entry => {
        entriesDiv.innerHTML += `<div>${entry.initials} - ${entry.score}</div>`;
    });

    document.getElementById('score-container').style.display = 'none';
    document.getElementById('leaderboard').style.display = 'block';
}

function goBack() {
    document.getElementById('quiz-container').style.display = 'block';
    document.getElementById('leaderboard').style.display = 'none';
    document.getElementById('score-container').style.display = 'none';
    startQuiz(); // Restart the quiz
}

function clearLeaderboard() {
    localStorage.removeItem('leaderboard');
    document.getElementById('leaderboard-entries').innerHTML = '';
}

function startTimer(duration) {
    timer = duration; // Initialize the global timer variable
    interval = setInterval(function () {
        updateTimerDisplay(); // Use the new function to update the display

        if (--timer < 0) {
            clearInterval(interval);
            endQuiz();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const countdown = document.getElementById('timer');
    const minutes = parseInt(timer / 60, 10);
    const seconds = parseInt(timer % 60, 10);

    countdown.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}
