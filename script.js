// Question set

let questions = [];

function fetchQuestions() {
  fetch(
    "https://opentdb.com/api.php?amount=15&category=9&difficulty=easy&type=multiple"
  )
    .then((res) => res.json())
    .then((data) => {
      questions = data.results.map((item) => {
        // Shuffle options and map to A-D
        const allOptions = [...item.incorrect_answers, item.correct_answer];
        const shuffled = shuffleArray(allOptions);
        const optionMap = {};
        ["A", "B", "C", "D"].forEach((key, i) => {
          optionMap[key] = shuffled[i];
        });

        return {
          question: decodeHTML(item.question),
          options: optionMap,
          correct: Object.keys(optionMap).find(
            (key) => optionMap[key] === item.correct_answer
          ),
        };
      });

      loadQuestion();
      updatePrizeLadder();
    })
    .catch((error) => {
      console.error("Failed to load questions", error);
      alert("Could not load quiz questions. Please try again later.");
    });
}

const prizeList = [
  "$100",
  "$200",
  "$300",
  "$500",
  "$1,000",
  "$2,000",
  "$4,000",
  "$8,000",
  "$16,000",
  "$32,000",
  "$64,000",
  "$125,000",
  "$250,000",
  "$500,000",
  "$1,000,000",
];

let currentPrize = 0; // Track the player's current prize
let currentQuestionIndex = 0; // Track the current question
let playerName = "";

const startBtn = document.getElementById("start-btn");
const nameInput = document.getElementById("name-input");
const gameContainer = document.getElementById("game-container");
const nameEntry = document.getElementById("name-entry");
const playerNameText = document.getElementById("player-name-text");
const questionText = document.getElementById("question");
const options = document.querySelectorAll(".option");
const prizeText = document.getElementById("prize");
const status = document.getElementById("status");
const prizeLadder = document.getElementById("prize-ladder");

// Start the game after entering the name
startBtn.addEventListener("click", () => {
  playerName = nameInput.value.trim();
  if (playerName) {
    playerNameText.textContent = playerName;
    nameEntry.style.display = "none";
    gameContainer.style.display = "block";
    // loadQuestion();
    fetchQuestions();
    updatePrizeLadder();
  } else {
    alert("Please enter your name!");
  }
});

// Load a new question
function loadQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  questionText.textContent = currentQuestion.question;
  options.forEach((option, index) => {
    const optionKey = ["A", "B", "C", "D"][index];
    option.textContent = currentQuestion.options[optionKey];
    option.onclick = () => checkAnswer(optionKey);
  });
}

// Check if the answer is correct
function checkAnswer(selectedOption) {
  const currentQuestion = questions[currentQuestionIndex];
  if (selectedOption === currentQuestion.correct) {
    currentPrize++;
    prizeText.textContent = `Prize: ${prizeList[currentPrize]}`;
    updatePrizeLadder();
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      loadQuestion();
    } else {
      alert("Congratulations, We have a winner!");
    }
  } else {
    alert("Incorrect answer! Game over.");
  }
}

// Update the prize ladder
function updatePrizeLadder() {
  prizeLadder.innerHTML = "";
  prizeList.forEach((prize, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = prize;
    if (index === currentPrize) {
      listItem.classList.add("active");
    }
    if ([4, 9, 14].includes(index)) {
      listItem.classList.add("checkpoint");
    }
    prizeLadder.appendChild(listItem);
  });
}
//helper functions for decoding and shuffling
function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

function shuffleArray(array) {
  return array
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}
