export type Color = string;

export interface Tube {
  id: number;
  balls: Color[];
  capacity: number;
}

export interface GameState {
  tubes: Tube[];
  selectedTubeId: number | null;
  moves: number;
  won: boolean;
}

export const COLORS: Color[] = [
  '#E74C3C', // red
  '#3498DB', // blue
  '#2ECC71', // green
  '#F39C12', // orange
  '#9B59B6', // purple
  '#1ABC9C', // teal
  '#E91E63', // pink
  '#FF5722', // deep orange
  '#00BCD4', // cyan
  '#8BC34A', // light green
];

export const TUBE_CAPACITY = 4;

export function generateLevel(numColors: number): Tube[] {
  // Create a pool of balls: numColors colors x TUBE_CAPACITY each
  const balls: Color[] = [];
  for (let i = 0; i < numColors; i++) {
    for (let j = 0; j < TUBE_CAPACITY; j++) {
      balls.push(COLORS[i]);
    }
  }

  // Shuffle
  for (let i = balls.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [balls[i], balls[j]] = [balls[j], balls[i]];
  }

  // Distribute into tubes
  const tubes: Tube[] = [];
  for (let i = 0; i < numColors; i++) {
    tubes.push({
      id: i,
      balls: balls.slice(i * TUBE_CAPACITY, (i + 1) * TUBE_CAPACITY),
      capacity: TUBE_CAPACITY,
    });
  }

  // Add 2 empty tubes
  tubes.push({ id: numColors, balls: [], capacity: TUBE_CAPACITY });
  tubes.push({ id: numColors + 1, balls: [], capacity: TUBE_CAPACITY });

  return tubes;
}

export function getTopBall(tube: Tube): Color | null {
  if (tube.balls.length === 0) return null;
  return tube.balls[tube.balls.length - 1];
}

export function isTubeComplete(tube: Tube): boolean {
  if (tube.balls.length !== TUBE_CAPACITY) return false;
  return tube.balls.every((b) => b === tube.balls[0]);
}

export function isTubeEmpty(tube: Tube): boolean {
  return tube.balls.length === 0;
}

export function canMove(from: Tube, to: Tube): boolean {
  if (from.balls.length === 0) return false;
  if (to.balls.length >= to.capacity) return false;
  if (isTubeComplete(from)) return false;

  const topFrom = getTopBall(from)!;
  const topTo = getTopBall(to);

  return topTo === null || topTo === topFrom;
}

export function moveBall(tubes: Tube[], fromId: number, toId: number): Tube[] {
  const newTubes = tubes.map((t) => ({ ...t, balls: [...t.balls] }));
  const from = newTubes.find((t) => t.id === fromId)!;
  const to = newTubes.find((t) => t.id === toId)!;

  if (!canMove(from, to)) return tubes;

  const ball = from.balls.pop()!;
  to.balls.push(ball);
  return newTubes;
}

export function checkWin(tubes: Tube[]): boolean {
  return tubes.every((t) => isTubeEmpty(t) || isTubeComplete(t));
}

export function countTopSameColor(tube: Tube): number {
  if (tube.balls.length === 0) return 0;
  const top = tube.balls[tube.balls.length - 1];
  let count = 0;
  for (let i = tube.balls.length - 1; i >= 0; i--) {
    if (tube.balls[i] === top) count++;
    else break;
  }
  return count;
}
