// ─────────────────────────────────────────────
// squareColor.js — Drill 3: Square Color
//
// A square name is shown; the user decides
// whether it is a light or dark square.
//
// Color rule (consistent with a8=light, h1=light):
//   light  ↔  (col + row) % 2 === 0
// ─────────────────────────────────────────────

import { FILES, randInt } from './utils.js';

// ── State ──────────────────────────────────────
let currentSquare  = null;   // { col, row, name }
let correctAnswer  = null;   // 'light' | 'dark'
let answered       = false;
let scoreCorrect   = 0;
let scoreIncorrect = 0;

// ── Helpers ─────────────────────────────────────
function squareColor(col, row) {
  return (col + row) % 2 === 0 ? 'light' : 'dark';
}

function setFeedback(cls, text) {
  const fb = document.getElementById('scFeedback');
  fb.className = `feedback-box ${cls}`;
  fb.textContent = text;
}

function updateScoreboard() {
  document.getElementById('scScoreCorrect').textContent   = scoreCorrect;
  document.getElementById('scScoreIncorrect').textContent = scoreIncorrect;
}

// ── Public API ──────────────────────────────────

export function newColorQuestion() {
  answered = false;

  const col  = randInt(8);
  const row  = randInt(8);
  const name = FILES[col] + (8 - row);

  currentSquare = { col, row, name };
  correctAnswer = squareColor(col, row);

  document.getElementById('scQuestion').innerHTML =
    `Is <strong>${name}</strong> a light or dark square?`;

  setFeedback('empty', 'Your answer will appear here.');
}

export function submitColorAnswer(userSays) {
  if (!currentSquare || answered) return;
  answered = true;

  const correct = (userSays === correctAnswer);

  if (correct) {
    scoreCorrect++;
    setFeedback('correct',
      `✓ Correct! ${currentSquare.name} is a ${correctAnswer} square.`);
  } else {
    scoreIncorrect++;
    const wrong = userSays === 'light' ? 'light' : 'dark';
    setFeedback('incorrect',
      `✗ Wrong. ${currentSquare.name} is a ${correctAnswer} square, not ${wrong}.`);
  }

  updateScoreboard();
}

export function init() {
  // nothing to build — drill is text-only
}
