// ─────────────────────────────────────────────
// main.js — entry point
//
// Imports all drill modules, initialises them,
// and exposes the small set of functions that
// the HTML onclick attributes need as globals.
// ─────────────────────────────────────────────

import { init as initKnightTour } from './knightTour.js';
import {
  init          as initAttackVision,
  newQuestion,
  submitAnswer,
  toggleBoard,
} from './attackVision.js';
import {
  init                as initSquareColor,
  newColorQuestion,
  submitColorAnswer,
} from './squareColor.js';

// ── Tab switching ───────────────────────────────
function showDrill(n) {
  document.querySelectorAll('.drill').forEach(d => d.classList.remove('visible'));
  document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
  document.getElementById('drill' + n).classList.add('visible');
  document.getElementById('tab'   + n).classList.add('active');
}

// ── Expose to HTML onclick attributes ──────────
// (ES modules don't pollute window automatically)
window.showDrill         = showDrill;
window.resetKt           = initKnightTour;
window.newQuestion       = newQuestion;
window.answer            = submitAnswer;
window.toggleBoard       = toggleBoard;
window.newColorQuestion  = newColorQuestion;
window.colorAnswer       = submitColorAnswer;

// ── Bootstrap ───────────────────────────────────
initKnightTour();
initAttackVision();
initSquareColor();
