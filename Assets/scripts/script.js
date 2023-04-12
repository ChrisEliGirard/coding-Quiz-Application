import questions from './questionList.json'

// Initalizing variables that act as DOM shortcuts
const leaderBoardEl = document.getElementById('leaderboard');
const timerEl = document.getElementById('timer');
const quizEl = document.getElementById('quiz');

// Initializing Global Const Variables for the Quiz Application
const timeAllotted = 90;
const timePenalty = 10;
const leaderBoardSize = 10;
const quizLength = 10;

// Initializing Global Variable to be reset on quiz restart or manipulated during the quiz
let score;
let totalScore;
let timer;
let testTime;
let questionIndex;
let answered;
let leaderBoard;


// Function for loading the leaderboard after being called by its click event and or the game
const getLeaderBoard = () => {
  let leaderBoard = JSON.parse(localStorage.getItem('highScores'));
  if (leaderBoard) {
    return leaderBoard;
  } else {
    leaderBoard = {};
    return leaderBoard;
  };
};

const setLeaderBoard = (leaderBoard) => {
  localStorage.setItem('highScores', JSON.stringify(leaderBoard))
};

const renderScoreForm = () => {
  clearQuizDisplay();
  totalScore = (score + 33 * 8 + 77 * 99);

  quizEl.innerHTML = `
    <h1>Congrats, You Made It Through!</h1>
    <h3>With A Score of ${finalScore}.
  `;


}

// let question01 = new questionObj("A procedure that is meant to handle events is?","An Event Handler","A Method","The Event Method","The Event Procedure Function");
// console.log(question01);
// var questions = [question01];
// console.log(question01.question);

// The render Quiz Intro function is called when the page loads and Renders the Quiz Starting Page
const renderQuizIntro = () => {
  clearQuizDisplay();
  timerEl.textContent = '--';
  quizEl.innerHTML = `
    <h1>Coding Quiz Challenge</h1>
    <p>Once the Quiz Starts you have ${timeAllotted} seconds to answer the ${quizLength} questions prompted to you</p>
    <p>Wrong answers will prompt a time penalty of ${timePenalty} seconds</p>
    <button id='quiz-start'>Start Quiz</button>
  `;
};

const clearQuizDisplay = () => {
  quizEl.innerHTML = '';
};

// Function is the Fisher-Yates Shuffle algorithm to return a shuffled array
const getShuffledArray = (array) => {
  let currentIndex = array.length, randomIndex;
  // While there remains elements to shuffle
  while (currentIndex != 0) {
    // Pick a remaining element
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // And swap it with the current element
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

const renderQuizQuestion = () => {
  if (answered === false) {return};
  clearQuizDisplay();
  answered = false;
  let currentQuestion = questions[questionIndex];
  getShuffledArray(currentQuestion.answers);
  quizEl.innerHTML = `
    <h1>${currentQuestion.question}</h1>
    <div class='answer-feedback' ></div>
    <section>
      <p id='a1'>${answers[1]}</p>
      <p id='a2'>${answers[2]}</p>
      <p id='a3'>${answers[3]}</p>
      <p id='a4'>${answers[4]}</p>
    </section>
  `;
};

const validateAnswer = (id) => {
  let answer = document.getElementById(id)
  let answerFeedbackEl = document.querySelector('.answer-feedback')
  if (answer.textContent === currentQuestion.solution) {
    scoreCounter += 1000
    answerFeedbackEl.innerHTML = `<span class='correct'>Correct!</span>`;
  } else {
    timer -= timePenalty;
    answerFeedbackEl.innerHTML = `<span class='incorrect'>Incorrect!!!</span>`;
  }
  setTimeout(nextQuestion, 500);
};

// Function to increase the question index and set the answered property to true to allow the next question to be rendered
const nextQuestion = () => {
  questionIndex ++;
  answered = true;
};

const continueQuiz = () => {
  timerEl.textContent = timer
  if (timer <= 10) {
    timerEl.setAttribute('class', 'danger');
  } else if (timer <= 0 || questionIndex === (quizLength - 1)) {
    clearInterval(testTime);
    timerEl.textContent = '--';
    renderScoreForm();
  } else {
    renderQuizQuestion();
  };
};

// The startQuiz function is called when the start button is clicked
const startQuiz = () => {
  shuffleArray(questions);
  score = 0;
  questionIndex = 0;
  answered = true;
  timer = timeAllotted;

  // Hide the Highscores Button and the startbutton
  leaderBoardEl.style.display = "none";
  startButton.disabled = true;

  // Start timer and render a question
  testTime = setInterval(continueQuiz, 1000);
}

// Handles events for the dynamic Quiz element
const quizController = (e) => {
  e.preventDefault();
  e.stopPropagation();

  let id = e.target.id;
  // if no id found return
  if (!id) {return};
  // if id clicked matches one of the id's of the question answers validate the answer;
  if (id === 'a1' || 'a2' || 'a3' || 'a4') {
    validateAnswer(id);
  } else {
    switch (id) {
      // if id of element clicked = quiz-start run startQuiz();
      case 'quiz-start':
        startQuiz();
        break;
      // if id of element submitted = score-name check validate entry, save the score, and then display the leaderboard;
      case 'score-name':
        if (nameInput.value.trim().length <= 3) {
          alert(message, 'Name is to short, Please enter 3 characters or more');
        } else {
          saveScore();
          displayLeaderBoard();
        } break;
      // if id of element clicked = quiz-home clear the quiz display and render the quiz intro display;
      case 'quiz-home':
        clearQuizDisplay();
        renderQuizIntro();
        break;
      // if id of element clicked = reset-leaderboard run resetLeaderBoard();
      case 'reset-leaderboard':
        resetLeaderBoard();
        break;
      // if an element clicked had any other id name return
      default:
        return;
    };
  };
};

const initializeQuiz = () => {
  leaderBoardEl.style.display = "block";
  startButton.disabled = false;
  getLeaderBoard();
  renderQuizIntro();
}

initializeQuiz();

// Event listeners for the Quiz Controller
quizEl.addEventListener('click', quizController);
quizEl.addEventListener('submit', quizController);
leaderBoardEl.addEventListener('click', displayLeaderBoard);