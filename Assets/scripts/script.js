// Initalizing variables that act as DOM shortcuts
const headerEl = document.querySelector('header')
const leaderBoardEl = document.getElementById('leaderboard');
const timerEl = document.getElementById('timer');
const quizEl = document.getElementById('quiz');

// Initializing Global Const Variables for the Quiz Application
const timeAllotted = 12;
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
let leaderBoard = [];
let usernameEl;
let currentQuestion = {};


// Function for loading the leaderboard after being called by its click event and or the game
const getLeaderBoard = () => {
  leaderBoard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
  if (leaderBoard) {
    return leaderBoard;
  };
};

// Function for rendering the leaderboard
const renderLeaderBoard = () => {
  headerEl.style.display = 'none'
  clearQuizDisplay();
  let leaderBoardDisplay = `
    <h1>HighScores LeaderBoard</h1>
    <h3>Do you have what it takes to make it to the top?</h3>
    <ol id='lead-display'>
    </ol>
    <button id='quiz-home'>Home</button>
  `
  quizEl.insertAdjacentHTML("afterbegin", leaderBoardDisplay);
  let leadDisplayEl = document.getElementById('lead-display')

  let scoreEntry = ({ player }) => {
    let position = `<li><div>${player.name}</div><div>${player.score}</div></li>`;
    leadDisplayEl.insertAdjacentHTML('beforeend', position);
  }

  leaderBoard.forEach(player => {
    scoreEntry({ player }); console.log(player);
  });
};
// Saves the leaderboard to localStorage
const setLeaderBoard = () => {
  localStorage.setItem('leaderboard', JSON.stringify(leaderBoard))
};

// Draws the form for potentially submitting your score
const renderScoreForm = () => {
  clearQuizDisplay();
  totalScore = (score + 33 * 8 + 77 * 99);

  let leaderBoardForm = `
    <h1>Congrats, You Made It Through!</h1>
    <h3>With A Score of ${totalScore}.</h3>
    <form id='score-form'>
      <label>Username:</label>
      <input type='text' id='username' name='username' placeholder='ExampleGuy'></input>
      <button id='register-score'>Enter The Hall Of Fame</button>
    </form>
  `;
  quizEl.insertAdjacentHTML('afterbegin', leaderBoardForm);
  usernameEl = document.getElementById('username');
}

// Adds the new highscore to the leaderboard if its higher than the top 10
const saveScore = (username) => {
  let playerIndex = leaderBoard.findIndex((player) => {
    return player.name === username;
  });

  if (playerIndex != -1 && totalScore < leaderBoard[playerIndex].score) {
    return
  } else if (playerIndex != -1) {
    leaderBoard.splice(playerIndex, 1);
  }
  
  let newPlayerRecord = {
    name: username,
    score: totalScore,
  };

  leaderBoard.push(newPlayerRecord);

  savedIndex = leaderBoard.length - 1;
    for(let i = 0; i < leaderBoard.length - 1; i++) {
      if(leaderBoard[i].score < leaderBoard[leaderBoard.length - 1].score) {
        leaderBoard.splice(i, 0, leaderBoard[leaderBoard.length - 1]);
        savedIndex = i;
        leaderBoard.pop();
        break;
      }
    }

  if (leaderBoard.length > leaderBoardSize) {
    leaderBoard.pop();
  };
  
  setLeaderBoard();
  console.log(leaderBoard);
};

// The render Quiz Intro function is called when the page loads and Renders the Quiz Starting Page
const renderQuizIntro = () => {
  // Resets Elements that may have been hidden previously
  headerEl.style.display = 'inline';
  leaderBoardEl.style.display = "block";
  // Clears The Quiz Display before generating content for it
  clearQuizDisplay();
  timerEl.textContent = '--';
  // Sets the Quiz Menu Display HTML
  let quizIntro = `
    <h1>Coding Quiz Challenge</h1>
    <p>Once the Quiz Starts you have ${timeAllotted} seconds to answer the ${quizLength} questions prompted to you</p>
    <p>Wrong answers will prompt a time penalty of ${timePenalty} seconds</p>
    <button id='quiz-start'>Start Quiz</button>
  `;
  quizEl.insertAdjacentHTML('afterbegin', quizIntro);
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

// Function to render the quiz question itself
const renderQuizQuestion = () => {
  if (answered === false) {return};
  clearQuizDisplay();
  answered = false;
  currentQuestion = questions[questionIndex];
  getShuffledArray(currentQuestion.answers);
   let questionFrame = `
    <h1>${currentQuestion.question}</h1>
    <div id='answer-feedback'></div>
    <section class='answer-section'>
      <button id='11'>${currentQuestion.answers[0]}</button>
      <button id='12'>${currentQuestion.answers[1]}</button>
      <button id='13'>${currentQuestion.answers[2]}</button>
      <button id='14'>${currentQuestion.answers[3]}</button>
    </section>
  `;
  quizEl.insertAdjacentHTML('afterbegin', questionFrame)
};

// function to validate the answer selected by the user
const validateAnswer = (id) => {
  let answer = document.getElementById(id)
  let answerFeedbackEl = document.getElementById('answer-feedback')
  if (answer.textContent === currentQuestion.solution) {
    score += 1000
    answerFeedbackEl.insertAdjacentHTML('afterbegin', `<span class='correct'>Correct!</span>`);
  } else {
    timer -= timePenalty;
    answerFeedbackEl.insertAdjacentHTML('afterbegin', `<span class='incorrect'>Incorrect!!!</span>`);
  }
  setTimeout(nextQuestion, 250);
};

// Function to increase the question index and set the answered property to true to allow the next question to be rendered
const nextQuestion = () => {
  questionIndex ++;
  answered = true;
};

// function that runs on each 1s interval to check if the quiz needs to continue or end
const continueQuiz = () => {
  if (timer <= 10) {
    timerEl.setAttribute('class', 'hurry');
  }
  if (timer < 1 || questionIndex >= quizLength) {
    clearInterval(testTime);
    timerEl.removeAttribute('class', 'hurry')
    timerEl.textContent = '--';
    renderScoreForm();
  }
  renderQuizQuestion();
};

// Changes the timer element as well as call the continueQuiz function every second
const timerTick = () => {
  timer = timer - 1
  timerEl.textContent = timer
  continueQuiz();
}

// The startQuiz function is called when the start button is clicked
const startQuiz = () => {
  // Generates a random order of questions
  console.log(questions)
  getShuffledArray(questions);
  // Resets vars that may have leftover or unwanted data in them
  score = 0;
  questionIndex = 0;
  answered = true;
  timer = timeAllotted;

  // Hide the Highscores Button
  leaderBoardEl.style.display = "none";

  // Start timer and render a question
  testTime = setInterval(timerTick, 1000);
}

// Handles events for the dynamic Quiz element
const quizController = (e) => {
  e.preventDefault();
  e.stopPropagation();

  let id = e.target.id;
  // if no id found return
  if (!id) {return};
  // if id clicked matches one of the id's of the question answers validate the answer;
  switch (id) {
    // if id of element clicked = quiz-start run startQuiz();
    case 'quiz-start':
      startQuiz();
      break;
    // if id of element submitted = username check validate entry, save the score, and then display the leaderboard;
    case 'register-score':
      if (usernameEl.value.trim().length <= 3) {
        alert(message, 'Name is to short, Please enter 3 characters or more');
      } else {
        let username = usernameEl.value.trim();
        saveScore(username);
        renderLeaderBoard();
      } break;
    // if id of element clicked = quiz-home clear the quiz display and render the quiz intro display;
    case 'quiz-home':
      clearQuizDisplay();
      renderQuizIntro();
      break;
    // if an element clicked had any other id name return
    default:
      validateAnswer(id);
  };
};


const initializeQuiz = () => {
  getLeaderBoard();
  renderQuizIntro();
}

initializeQuiz();

// Event listeners for the Quiz Controller
quizEl.addEventListener('click', quizController);
quizEl.addEventListener('submit', quizController);
leaderBoardEl.addEventListener('click', renderLeaderBoard);