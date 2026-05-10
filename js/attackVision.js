// ─────────────────────────────────────────────
// attackVision.js — Drill 2: Attack Vision
// Depends on: utils.js, chess.js
// ─────────────────────────────────────────────

import { idx, sqName, randInt, buildBoard, placePiece, clearPiece } from './utils.js';
import { PIECE_NAMES, PIECE_GLYPHS, getAttackedSquares } from './chess.js';

// ── State ──────────────────────────────────────
let piece       = null;   // e.g. 'Queen'
let fromSq      = null;   // { col, row }
let targetSq    = null;   // { col, row }
let correctAnswer = null; // boolean
let answered    = false;
let boardVisible = false;
let scoreCorrect   = 0;
let scoreIncorrect = 0;

// ── DOM helpers ────────────────────────────────
function sq(col, row) {
  return document.getElementById(`atk-${idx(col, row)}`);
}

function setFeedback(cls, text) {
  const fb = document.getElementById('atkFeedback');
  fb.className = `feedback-box ${cls}`;
  fb.textContent = text;
}

function updateScoreboard() {
  document.getElementById('scoreCorrect').textContent   = scoreCorrect;
  document.getElementById('scoreIncorrect').textContent = scoreIncorrect;
}

// ── Board rendering ─────────────────────────────
function renderBoard(revealAttacks) {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const s = sq(c, r);
      s.classList.remove('attacked-sq', 'safe-sq');
      clearPiece(s);

      if (fromSq && c === fromSq.col && r === fromSq.row) {
        placePiece(s, PIECE_GLYPHS[piece] ?? '');
      }
      if (targetSq && c === targetSq.col && r === targetSq.row) {
        placePiece(s, '◎', { fontSize: 'clamp(1rem,3vw,1.4rem)', color: '#fff', opacity: '.6' });
      }

      if (revealAttacks && piece && fromSq) {
        const attacked = getAttackedSquares(piece, fromSq.col, fromSq.row);
        if (attacked.some(s2 => s2.col === c && s2.row === r)) {
          s.classList.add('attacked-sq');
        }
      }
    }
  }
}

// ── Board visibility ────────────────────────────
export function toggleBoard() {
  boardVisible = !boardVisible;
  const cover = document.getElementById('atkCover');
  const btn   = document.getElementById('btnToggleBoard');

  if (boardVisible) {
    cover.classList.add('hidden');
    btn.textContent = '🙈 Hide Board';
    renderBoard(answered);   // show attack overlay only if already answered
  } else {
    cover.classList.remove('hidden');
    btn.textContent = '👁 Show Board';
  }
}

// ── Question generation ─────────────────────────
export function newQuestion() {
  answered = false;

  // Pick a random piece and from-square
  const pi  = randInt(PIECE_NAMES.length);
  piece     = PIECE_NAMES[pi];
  fromSq    = { col: randInt(8), row: randInt(8) };

  const attacked = getAttackedSquares(piece, fromSq.col, fromSq.row);
  const shouldAttack = Math.random() < 0.5;

  if (shouldAttack && attacked.length > 0) {
    targetSq      = attacked[randInt(attacked.length)];
    correctAnswer = true;
  } else {
    // Collect all squares NOT attacked and NOT the from-square
    const safe = [];
    for (let r = 0; r < 8; r++)
      for (let c = 0; c < 8; c++)
        if (!(c === fromSq.col && r === fromSq.row) &&
            !attacked.some(s => s.col === c && s.row === r))
          safe.push({ col: c, row: r });

    if (safe.length === 0) {
      // Edge case: piece attacks everything (e.g. Queen in centre) — just show attacked
      targetSq      = attacked[randInt(attacked.length)];
      correctAnswer = true;
    } else {
      targetSq      = safe[randInt(safe.length)];
      correctAnswer = false;
    }
  }

  // Update question text
  const fromName   = sqName(fromSq.col,   fromSq.row);
  const targetName = sqName(targetSq.col, targetSq.row);
  document.getElementById('atkQuestion').innerHTML =
    `A <strong>${PIECE_GLYPHS[piece]} ${piece}</strong> is on <strong>${fromName}</strong>.<br>
     Does it attack <strong>${targetName}</strong>?`;

  setFeedback('empty', 'Your answer will appear here.');
  renderBoard(false);
}

// ── Answer handling ─────────────────────────────
export function submitAnswer(userSays) {
  if (!piece || answered) return;
  answered = true;

  const correct  = (userSays === correctAnswer);
  const fromName   = sqName(fromSq.col,   fromSq.row);
  const targetName = sqName(targetSq.col, targetSq.row);

  if (correct) {
    scoreCorrect++;
    setFeedback('correct',
      `✓ Correct! The ${piece} on ${fromName} ` +
      (correctAnswer ? `does attack ${targetName}.` : `does NOT attack ${targetName}.`)
    );
  } else {
    scoreIncorrect++;
    setFeedback('incorrect',
      `✗ Wrong. The ${piece} on ${fromName} ` +
      (correctAnswer ? `DOES attack ${targetName}.` : `does NOT attack ${targetName}.`)
    );
  }

  updateScoreboard();
  if (boardVisible) renderBoard(true);
}

// ── Public init ─────────────────────────────────

/** Build the empty attack-vision board (called once on page load). */
export function init() {
  buildBoard('atkBoard', 'atk');
}
