const quizData = [
  {
    question: "Which HTML tag is used to link external stylesheets?",
    options: ["<script>", "<style>", "<link>", "<css>"],
    answer: "<link>"
  },
  {
    question: "Which is a JavaScript framework?",
    options: ["Laravel", "React", "Django", "Flask"],
    answer: "React"
  },
  {
    question: "Which CSS property controls text size?",
    options: ["font-weight", "font-size", "text-style", "text-align"],
    answer: "font-size"
  },
  {
    question: "Which symbol is used for comments in JavaScript?",
    options: ["//", "#", "/* */", "<!-- -->"],
    answer: "//"
  },
  {
    question: "What does DOM stand for?",
    options: [
      "Document Object Model",
      "Data Oriented Model",
      "Digital Output Mode",
      "Document Ordering Method"
    ],
    answer: "Document Object Model"
  }
];

let currentQ = 0;
let score = 0;
let timer;
let timeLeft = 15;

const questionEl = document.getElementById("question");
const optionsList = document.getElementById("options-list");
const nextBtn = document.getElementById("next-btn");
const feedback = document.getElementById("feedback");
const timerDisplay = document.getElementById("timer");
const progressBar = document.getElementById("progress-bar");
const resultScreen = document.getElementById("result-screen");
const finalScore = document.getElementById("final-score");
const highScoreText = document.getElementById("high-score");
const currentQEl = document.getElementById("current-q");
const totalQEl = document.getElementById("total-q");

totalQEl.textContent = quizData.length;

// THEME TOGGLE
const toggleBtn = document.getElementById("toggleTheme");
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  toggleBtn.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

// LOAD QUESTION
function loadQuestion() {
  clearInterval(timer);
  timeLeft = 15;
  startTimer();

  const current = quizData[currentQ];
  questionEl.textContent = current.question;
  currentQEl.textContent = currentQ + 1;
  optionsList.innerHTML = "";
  feedback.textContent = "";

  current.options.forEach(option => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.className = "option-btn";
    btn.onclick = () => handleAnswer(btn, current.answer);
    li.appendChild(btn);
    optionsList.appendChild(li);
  });

  nextBtn.disabled = true;
  updateProgressBar();
}

// HANDLE ANSWER
function handleAnswer(selectedBtn, correctAnswer) {
  const allOptions = document.querySelectorAll(".option-btn");
  allOptions.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === correctAnswer) {
      btn.classList.add("correct");
    }
    if (btn !== selectedBtn && btn.textContent !== correctAnswer) {
      btn.classList.add("wrong");
    }
  });

  if (selectedBtn.textContent === correctAnswer) {
    score++;
    feedback.textContent = "✅ Correct!";
  } else {
    selectedBtn.classList.add("wrong");
    feedback.textContent = "❌ Wrong!";
  }

  nextBtn.disabled = false;
  clearInterval(timer);
}

// TIMER
function startTimer() {
  timerDisplay.textContent = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      autoSubmit();
    }
  }, 1000);
}

// AUTOSUBMIT ON TIMEOUT
function autoSubmit() {
  const correctAnswer = quizData[currentQ].answer;
  const allOptions = document.querySelectorAll(".option-btn");

  allOptions.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === correctAnswer) {
      btn.classList.add("correct");
    }
  });

  feedback.textContent = "⏰ Time's up!";
  nextBtn.disabled = false;
}

// PROGRESS BAR
function updateProgressBar() {
  const percent = ((currentQ + 1) / quizData.length) * 100;
  progressBar.style.width = `${percent}%`;
}

// NEXT
nextBtn.addEventListener("click", () => {
  currentQ++;
  if (currentQ < quizData.length) {
    loadQuestion();
  } else {
    showResult();
  }
});

// SHOW RESULT
function showResult() {
  document.getElementById("quiz-container").classList.add("hidden");
  resultScreen.classList.remove("hidden");

  finalScore.textContent = `${score} / ${quizData.length}`;

  let high = localStorage.getItem("highScore") || 0;
  if (score > high) {
    localStorage.setItem("highScore", score);
    high = score;
  }
  highScoreText.textContent = high;
}

// RESTART
function restartQuiz() {
  currentQ = 0;
  score = 0;
  resultScreen.classList.add("hidden");
  document.getElementById("quiz-container").classList.remove("hidden");
  loadQuestion();
}

// SHARE
document.getElementById("shareBtn").addEventListener("click", () => {
  const text = `🎯 I scored ${score}/${quizData.length} on the Smart Quiz! Try it out yourself!`;
  const url = window.location.href;

  const shareURL = `https://wa.me/?text=${encodeURIComponent(text)}%0A${encodeURIComponent(url)}`;
  window.open(shareURL, "_blank");
});

// Start the quiz
loadQuestion();
