// Initalizing variables that act as DOM shortcuts
var startButton = document.querySelector(".startButton")
var questionBox = document.querySelector(".questionBox")
var questionPrompt = document.getElementById(".question")
var questionAnswers = document.querySelector(".answers")
var timerEl = document.querySelector(".timer")
var scoresEl = document.querySelector(".scores")

// Initializing Variables and arrays meant to store data
var correct = 0
var incorrect = 0
var score = 0
var questionsLeft = 15
var timer;
var timerCount;
var highscores = []

// function to create the Question Objects and the question objects
function questionObj(question, correct, wrong01, wrong02, wrong03) {
    this.question = question;
    this.correct = correct;
    this.wrong01 = wrong01;
    this.wrong02 = wrong02;
    this.wrong03 = wrong03;
}

let question01 = new questionObj("A procedure that is meant to handle events is ...","An Event Handler","A Method","The Event Method","The Event Procedure Function");
console.log(question01)
var questions = [question01]
console.log(question01.question)

// The init function is called when the page loads
function init() {
    getScores();
}

// The startQuiz function is called when the start button is clicked
function startQuiz() {
    score = 0
    startButton.disabled = true
    //startTimer();
    renderQuestion();
}

//The scoreKeeper function is called after a question has been answered to check for correctness and call the renderQuestions function to continue
function scoreKeeper() {
    if (correct) {
        score = score + 10
    }
    renderQuestions();
}

// The renderQuestions function displays a  multiple choice question to be answered by the user
function renderQuestion() {
    if (questionsLeft > 0) {
        //chosenQuestion = questions[Math.floor(Math.random()*questions.length)];
        chosenQuestion = question01.question
        document.getElementById(".question").innerHTML = question01[question]
        console.log(question01.question)
    } else {
        
    }
}

// Event listener for the begin button to call the startQuiz function
startButton.addEventListener("click", startQuiz);