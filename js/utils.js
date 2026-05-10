// ─────────────────────────────────────────────
// utils.js — shared board helpers
// ─────────────────────────────────────────────

export const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

/** Convert (col, row) grid coords to algebraic notation e.g. (0,0) → "a8" */
export function sqName(col, row) {
  return FILES[col] + (8 - row);
}

/** Convert (col, row) to a flat 0-63 board index */
export function idx(col, row) {
  return row * 8 + col;
}

/** Random integer in [0, n) */
export function randInt(n) {
  return Math.floor(Math.random() * n);
}

/**
 * Build a blank 8×8 board grid inside a container element.
 * Each square gets:
 *   - classes "sq light|dark"
 *   - id prefix e.g. "kt-N" or "atk-N"
 *   - dataset.col / dataset.row
 *   - rank label on col 7, file label on row 7
 * Returns the array of square elements for convenience.
 */
export function buildBoard(containerId, idPrefix, onClickHandler = null) {
  const board = document.getElementById(containerId);
  board.innerHTML = '';
  const squares = [];

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const sq = document.createElement('div');
      sq.className = 'sq ' + ((r + c) % 2 === 0 ? 'light' : 'dark');
      sq.id = `${idPrefix}-${idx(c, r)}`;
      sq.dataset.col = c;
      sq.dataset.row = r;

      if (c === 7) {
        const rankEl = document.createElement('span');
        rankEl.className = 'coord rank';
        rankEl.textContent = 8 - r;
        sq.appendChild(rankEl);
      }
      if (r === 7) {
        const fileEl = document.createElement('span');
        fileEl.className = 'coord file';
        fileEl.textContent = FILES[c];
        sq.appendChild(fileEl);
      }

      if (onClickHandler) sq.addEventListener('click', onClickHandler);
      board.appendChild(sq);
      squares.push(sq);
    }
  }
  return squares;
}

/** Place a piece glyph span inside a square, removing any existing one first */
export function placePiece(sq, glyph, extraStyle = {}) {
  const existing = sq.querySelector('.piece');
  if (existing) existing.remove();
  const span = document.createElement('span');
  span.className = 'piece';
  span.textContent = glyph;
  Object.assign(span.style, extraStyle);
  sq.appendChild(span);
}

/** Remove piece glyph from a square if present */
export function clearPiece(sq) {
  const p = sq.querySelector('.piece');
  if (p) p.remove();
}
