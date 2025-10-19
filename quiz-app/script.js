const questions = [
  {
    question: "What does HTML stand for?",
    answers: [
      { text: "Hyper Text Markup Language", correct: true },
      { text: "HighText Machine Language", correct: false },
      { text: "Hyperlinking Text Management Language", correct: false },
      { text: "Home Tool Markup Language", correct: false },
    ],
  },
  {
    question: "Which language is used for styling web pages?",
    answers: [
      { text: "HTML", correct: false },
      { text: "CSS", correct: true },
      { text: "Python", correct: false },
      { text: "C++", correct: false },
    ],
  },
  {
    question: "What does JS stand for?",
    answers: [
      { text: "JavaScript", correct: true },
      { text: "Java Source", correct: false },
      { text: "Just Script", correct: false },
      { text: "Junction Style", correct: false },
    ],
  },
  {
    question: "Which tag is used to include JavaScript in HTML?",
    answers: [
      { text: "<js>", correct: false },
      { text: "<javascript>", correct: false },
      { text: "<script>", correct: true },
      { text: "<code>", correct: false },
    ],
  },
];

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let score = 0;
let results = [];

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  results = [];
  nextButton.innerHTML = "Next";
  showQuestion();
}

function showQuestion() {
  resetState();
  const currentQuestion = questions[currentQuestionIndex];
  questionElement.innerHTML = `${currentQuestionIndex + 1}. ${currentQuestion.question}`;

  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerHTML = answer.text;
    button.classList.add("btn");
    answerButtons.appendChild(button);
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer);
  });
}

function resetState() {
  nextButton.style.display = "none";
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

function selectAnswer(e) {
  const selectedBtn = e.target;
  const isCorrect = selectedBtn.dataset.correct === "true";
  if (isCorrect) {
    selectedBtn.classList.add("correct");
    score++;
  } else {
    selectedBtn.classList.add("wrong");
  }

  results.push({
    question: questions[currentQuestionIndex].question,
    correct: isCorrect,
  });

  Array.from(answerButtons.children).forEach((button) => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    }
    button.disabled = true;
  });

  nextButton.style.display = "block";
}

function showScore() {
  resetState();
  questionElement.innerHTML = `🎯 You scored ${score} out of ${questions.length}!`;

  const summary = document.createElement("div");
  summary.innerHTML = "<h3>Summary:</h3>";
  results.forEach((r, index) => {
    const p = document.createElement("p");
    p.textContent = `${index + 1}. ${r.question} — ${r.correct ? "✅ Correct" : "❌ Wrong"}`;
    summary.appendChild(p);
  });

  answerButtons.appendChild(summary);

  nextButton.innerHTML = "Play Again";
  nextButton.style.display = "block";
}

function handleNextButton() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showScore();
  }
}

nextButton.addEventListener("click", () => {
  if (currentQuestionIndex < questions.length) {
    handleNextButton();
  } else {
    startQuiz();
  }
});

startQuiz();
