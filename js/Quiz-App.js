document.addEventListener("DOMContentLoaded", function () {
    const element = document.querySelectorAll(".option-item");
const title = document.querySelector(".question-title");
const btn = document.querySelector(".submit-btn");
const indexQuestion = document.querySelector(".counter-value");
const header = document.querySelector(".quiz-header");
const section = document.querySelector(".question-section");
const resultsSection = document.querySelector(".results-section");
const resultScore = document.querySelector(".result-score");
const resultMessage = document.querySelector(".result-message");
const resultDetails = document.querySelector(".result-details");
const progressDot = document.querySelectorAll(".progress-dot");
const progressSection = document.querySelector(".progress-section");
const timerdisplay = document.querySelector(".timer-display");

let currentIndex = 0;
let resultat = [];
let question = [];
let unClicFait = false;
let time = 60;
let intervalId; 

fetch("question.json")
  .then((result) => {
    if (!result.ok) throw new Error("Erreur lors du chargement du JSON");
    return result.json();
  })
  .then((data) => {
    question = data;
    showQuestion();
    startTimer(); 
  })
  .catch((error) => console.error("Erreur :", error));

function showQuestion() {
  title.textContent = question[currentIndex].title;
  indexQuestion.textContent = currentIndex + 1;

  element[0].textContent = question[currentIndex].answer_1;
  element[1].textContent = question[currentIndex].answer_2;
  element[2].textContent = question[currentIndex].answer_3;
  element[3].textContent = question[currentIndex].answer_4;
}

element.forEach((el) => {
  el.addEventListener("click", () => {
    if (unClicFait) return;
    element.forEach((e) => e.classList.remove("selected"));
    el.classList.add("selected");
    unClicFait = true;
  });
});

function startTimer() {
  time = 60;
  timerdisplay.textContent = `${time} secondes`;

  clearInterval(intervalId);
  intervalId = setInterval(() => {
    time--;
    timerdisplay.textContent = `${time} secondes`;

    if (time <= 0) {
      clearInterval(intervalId);
      traiterReponse(false); 
    }
  }, 1000);
}

btn.addEventListener("click", () => {
  if (!unClicFait) return;
  traiterReponse(true);
});

function traiterReponse(reponseCliquee) {
  progressDot[currentIndex].classList.remove("active");
  if (progressDot[currentIndex + 1]) {
    progressDot[currentIndex + 1].classList.add("active");
  }

  let bonne = false;
  if (reponseCliquee) {
    const bonneReponse = question[currentIndex].right_answer;
    element.forEach((el) => {
      if (el.classList.contains("selected")) {
        if (el.textContent === bonneReponse) {
          bonne = true;
        }
      }
      el.classList.remove("selected");
    });
  }

  resultat.push(bonne);
  unClicFait = false;
  currentIndex++;

  if (currentIndex < question.length) {
    showQuestion();
    startTimer(); 
  } else {
    afficherResultat();
  }
}

function afficherResultat() {
  clearInterval(intervalId);
  header.style.display = "none";
  section.style.display = "none";
  progressSection.style.display = "none";
  resultsSection.style.display = "block";

  const total = resultat.length;
  const score = resultat.filter(r => r === true).length;

  resultScore.textContent = `Score : ${score} / ${total}`;

  if (score === total) {
    resultMessage.textContent = "Parfait ! 🎉";
    resultDetails.textContent = "Tu as répondu correctement à toutes les questions.";
  } else if (score >= total / 2) {
    resultMessage.textContent = "Bien joué 👍";
    resultDetails.textContent = "Tu as bien répondu, mais tu peux encore progresser.";
  } else {
    resultMessage.textContent = "À revoir 😕";
    resultDetails.textContent = "Essaie de relire les cours et réessaye.";
  }
}
});