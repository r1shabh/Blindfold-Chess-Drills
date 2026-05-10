// ─────────────────────────────────────────────
// knightTour.js — Drill 1: Knight's Tour
// Depends on: utils.js, chess.js
// ─────────────────────────────────────────────

import { idx, sqName, buildBoard, placePiece, clearPiece } from './utils.js';
import { knightMoves } from './chess.js';

// ── State ──────────────────────────────────────
let visited    = new Set();
let current    = null;   // { col, row }
let moveCount  = 0;
let moveHistory = [];

// ── DOM helpers ────────────────────────────────
function sq(col, row) {
  return document.getElementById(`kt-${idx(col, row)}`);
}

function updateStats() {
  document.getElementById('ktCount').textContent  = visited.size;
  document.getElementById('ktMoves').textContent  = moveCount;
  document.getElementById('ktLogInner').textContent = moveHistory.join(' → ');
}

// ── Core rendering ──────────────────────────────
function render() {
  const validMoves = knightMoves(current.col, current.row)
    .filter(p => !visited.has(idx(p.col, p.row)));

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const s = sq(c, r);
      s.classList.remove('visited', 'clickable');
      clearPiece(s);

      if (visited.has(idx(c, r)))                         s.classList.add('visited');
      if (c === current.col && r === current.row)         placePiece(s, '♞');
      if (validMoves.some(p => p.col === c && p.row === r)) s.classList.add('clickable');
    }
  }
}

// ── Click handler ───────────────────────────────
function onSquareClick(e) {
  const s = e.currentTarget;
  if (!s.classList.contains('clickable')) return;

  const col = parseInt(s.dataset.col);
  const row = parseInt(s.dataset.row);

  current = { col, row };
  visited.add(idx(col, row));
  moveCount++;
  moveHistory.push(sqName(col, row));

  updateStats();
  render();

  if (visited.size === 64) {
    document.getElementById('ktBanner').classList.add('show');
  }
}

// ── Public API ──────────────────────────────────

/** Initialise (or reset) the Knight's Tour drill. */
export function init() {
  buildBoard('ktBoard', 'kt', onSquareClick);

  visited.clear();
  current      = { col: 0, row: 0 };   // a8 — top-left corner
  moveCount    = 0;
  moveHistory  = [];

  visited.add(idx(0, 0));
  moveHistory.push('a8');

  document.getElementById('ktCount').textContent    = '1';
  document.getElementById('ktMoves').textContent    = '0';
  document.getElementById('ktLogInner').textContent = 'Knight placed on a8';
  document.getElementById('ktBanner').classList.remove('show');

  render();
}
