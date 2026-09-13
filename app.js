const modeButtons = document.querySelectorAll("[data-mode]");
const demoShell = document.querySelector("#slide-demo");
const badSlide = document.querySelector(".bad-slide");
const goodSlide = document.querySelector(".good-slide");
const observation = document.querySelector("#observation");

function setSlideMode(mode) {
  const showGood = mode === "good";

  modeButtons.forEach((button) => {
    const active = button.dataset.mode === mode;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });

  badSlide.hidden = showGood;
  goodSlide.hidden = !showGood;
  demoShell.classList.toggle("bad", !showGood);
  demoShell.classList.toggle("good", showGood);
  observation.className = `observation ${showGood ? "good-observation" : "bad-observation"}`;
  observation.innerHTML = showGood
    ? `<span class="status-icon" aria-hidden="true">✓</span><div><strong>Warum funktioniert diese Folie?</strong><p>Eine klare Frage, drei kurze Aussagen, große Schrift und ein Bild, das beim Verstehen hilft.</p></div>`
    : `<span class="status-icon" aria-hidden="true">×</span><div><strong>Was macht das Zuhören schwer?</strong><p>Zu viel Text, zu kleine Schrift, zu viele Farben und keine klare Hauptaussage.</p></div>`;
}

modeButtons.forEach((button) => {
  button.addEventListener("click", () => setSlideMode(button.dataset.mode));
});

const questions = [
  {
    question: "Was gehört am besten auf eine Präsentationsfolie?",
    answers: ["Ein langer Erklärungstext", "Kurze Stichwörter", "Alles, was ich sagen möchte"],
    correct: 1,
    feedback: "Stichwörter geben Orientierung. Die Erklärung kommt von dir."
  },
  {
    question: "Warum sollte die Schrift groß sein?",
    answers: ["Damit die Folie schneller voll ist", "Damit auch die letzte Reihe lesen kann", "Damit man keine Bilder braucht"],
    correct: 1,
    feedback: "Genau. Eine Folie muss aus der Entfernung lesbar sein."
  },
  {
    question: "Eine Folie ist völlig überladen. Was verbesserst du zuerst?",
    answers: ["Noch mehr Farben einsetzen", "Alles kleiner machen", "Auf die wichtigste Aussage kürzen"],
    correct: 2,
    feedback: "Richtig. Eine Folie braucht eine klare Hauptaussage."
  },
  {
    question: "Wann ist ein Bild auf einer Folie gut gewählt?",
    answers: ["Wenn es zum Verstehen beiträgt", "Wenn es besonders lustig ist", "Wenn noch irgendwo Platz frei ist"],
    correct: 0,
    feedback: "Ein gutes Bild erklärt, zeigt oder verdeutlicht etwas."
  },
  {
    question: "Wer hält eigentlich den Vortrag?",
    answers: ["Die Folie", "Das Publikum", "Du – die Folie unterstützt dich"],
    correct: 2,
    feedback: "Genau: Du erklärst. Die Folie ist nur dein Werkzeug."
  },
  {
    question: "Mia schreibt als Quelle nur ‚Google‘. Was sollte sie stattdessen nennen?",
    answers: ["Die Webseite, von der die Information stammt", "Das verwendete Handy", "Gar keine Quelle"],
    correct: 0,
    feedback: "Google ist eine Suchmaschine. Die eigentliche Webseite ist die Quelle."
  },
  {
    question: "Du möchtest vier Zahlen schnell vergleichen. Was eignet sich meistens am besten?",
    answers: ["Ein einfaches Diagramm", "Vier verschiedene Schriftarten", "Ein langer Fließtext"],
    correct: 0,
    feedback: "Ein übersichtliches Diagramm macht Größenunterschiede schnell sichtbar."
  },
  {
    question: "Jede Überschrift fliegt anders auf die Folie. Was ist die beste Verbesserung?",
    answers: ["Noch Geräusche ergänzen", "Ruhige, einheitliche oder gar keine Effekte nutzen", "Die Effekte schneller abspielen"],
    correct: 1,
    feedback: "Ruhige Folien lenken den Blick auf den Inhalt und auf deinen Vortrag."
  }
];

const questionNumber = document.querySelector("#question-number");
const questionText = document.querySelector("#question");
const answersBox = document.querySelector("#answers");
const feedback = document.querySelector("#feedback");
const nextButton = document.querySelector("#next-button");
const restartButton = document.querySelector("#restart-button");
const scoreText = document.querySelector("#score");
const progressBar = document.querySelector("#quiz-progress-bar");
const quizContent = document.querySelector("#quiz-content");
const result = document.querySelector("#result");
const resultTitle = document.querySelector("#result-title");
const resultText = document.querySelector("#result-text");

let currentQuestion = 0;
let score = 0;
let answered = false;

function renderQuestion() {
  const item = questions[currentQuestion];
  answered = false;
  questionNumber.textContent = `Frage ${currentQuestion + 1} von ${questions.length}`;
  progressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
  questionText.textContent = item.question;
  answersBox.innerHTML = "";
  feedback.textContent = "";
  feedback.className = "feedback";
  nextButton.hidden = true;

  item.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-button";
    button.textContent = answer;
    button.addEventListener("click", () => selectAnswer(index));
    answersBox.appendChild(button);
  });
}

function selectAnswer(selectedIndex) {
  if (answered) return;
  answered = true;
  const item = questions[currentQuestion];
  const buttons = [...answersBox.querySelectorAll("button")];
  const isCorrect = selectedIndex === item.correct;

  buttons.forEach((button, index) => {
    button.disabled = true;
    if (index === item.correct) button.classList.add("correct");
    if (index === selectedIndex && !isCorrect) button.classList.add("wrong");
  });

  if (isCorrect) {
    score += 1;
    scoreText.textContent = score;
    feedback.textContent = `Richtig! ${item.feedback}`;
    feedback.classList.add("correct");
  } else {
    feedback.textContent = `Noch nicht. ${item.feedback}`;
    feedback.classList.add("wrong");
  }

  nextButton.textContent = currentQuestion === questions.length - 1 ? "Ergebnis zeigen" : "Nächste Frage";
  nextButton.hidden = false;
  nextButton.focus();
}

function showResult() {
  quizContent.hidden = true;
  result.hidden = false;

  if (score === questions.length) {
    resultTitle.textContent = "Du bist folienfit!";
    resultText.textContent = "Perfekt – du erkennst, was eine gute Präsentation ausmacht.";
  } else if (score >= 5) {
    resultTitle.textContent = "Schon ziemlich folienfit!";
    resultText.textContent = `${score} von ${questions.length} richtig. Schau dir die Beispiele noch einmal an – dann sitzt es.`;
  } else {
    resultTitle.textContent = "Ein guter Anfang!";
    resultText.textContent = `${score} von ${questions.length} richtig. Klappe die Lösungen bei den Beispielen auf und starte danach einen neuen Versuch.`;
  }
}

nextButton.addEventListener("click", () => {
  if (currentQuestion < questions.length - 1) {
    currentQuestion += 1;
    renderQuestion();
  } else {
    showResult();
  }
});

restartButton.addEventListener("click", () => {
  currentQuestion = 0;
  score = 0;
  scoreText.textContent = "0";
  result.hidden = true;
  quizContent.hidden = false;
  renderQuestion();
});

renderQuestion();
