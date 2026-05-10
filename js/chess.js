// ─────────────────────────────────────────────
// chess.js — piece movement & attack logic
// Pure functions: no DOM, fully testable.
// ─────────────────────────────────────────────

export const PIECE_NAMES = ['Pawn', 'Rook', 'Bishop', 'Queen', 'Knight', 'King'];

export const PIECE_GLYPHS = {
  Pawn:   '♟',
  Rook:   '♜',
  Bishop: '♝',
  Queen:  '♛',
  Knight: '♞',
  King:   '♚',
};

// Movement deltas per piece type
const DELTAS = {
  Rook:   [[1,0],[-1,0],[0,1],[0,-1]],
  Bishop: [[1,1],[1,-1],[-1,1],[-1,-1]],
  Queen:  [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]],
  King:   [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]],
  Knight: [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]],
  // White pawn attacks diagonally "up" (row index decreases toward rank 8)
  Pawn:   [[1,-1],[-1,-1]],
};

const SLIDING = new Set(['Rook', 'Bishop', 'Queen']);

function inBounds(col, row) {
  return col >= 0 && col < 8 && row >= 0 && row < 8;
}

/**
 * Returns all squares attacked by `piece` sitting on (col, row).
 * @returns {{ col: number, row: number }[]}
 */
export function getAttackedSquares(piece, col, row) {
  const squares = [];
  const deltas = DELTAS[piece];

  if (SLIDING.has(piece)) {
    for (const [dc, dr] of deltas) {
      let nc = col + dc, nr = row + dr;
      while (inBounds(nc, nr)) {
        squares.push({ col: nc, row: nr });
        nc += dc;
        nr += dr;
      }
    }
  } else {
    for (const [dc, dr] of deltas) {
      const nc = col + dc, nr = row + dr;
      if (inBounds(nc, nr)) squares.push({ col: nc, row: nr });
    }
  }

  return squares;
}

/**
 * Returns true if `piece` on (fromCol, fromRow) attacks (targetCol, targetRow).
 */
export function doesAttack(piece, fromCol, fromRow, targetCol, targetRow) {
  return getAttackedSquares(piece, fromCol, fromRow)
    .some(s => s.col === targetCol && s.row === targetRow);
}

/**
 * Valid knight jump destinations from (col, row) — used by Knight's Tour drill.
 */
export function knightMoves(col, row) {
  return DELTAS.Knight
    .map(([dc, dr]) => ({ col: col + dc, row: row + dr }))
    .filter(p => inBounds(p.col, p.row));
}
