import { Criterion, Alternative } from './store';

export interface VikorResult {
  matrix: number[][];
  normalized: number[][];
  weighted: number[][];
  bestValues: number[]; // f*
  worstValues: number[]; // f-
  s: number[]; // S values
  r: number[]; // R values
  q: number[]; // Q values
  ranking: {
    alternativeId: number;
    rank: number;
    qValue: number;
    sValue: number;
    rValue: number;
  }[];
}

export function calculateVikor(criteria: Criterion[], alternatives: Alternative[]): VikorResult {
  const n = alternatives.length;
  const m = criteria.length;

  // 1. Construct Decision Matrix
  // matrix[i][j] is the value of alternative i for criterion j
  const rawMatrix: number[][] = alternatives.map(alt => 
    criteria.map(crit => alt.values[crit.id] || 0)
  );

  // 2. Determine Best (f*) and Worst (f-) values for each criterion
  const fBest: number[] = new Array(m).fill(0);
  const fWorst: number[] = new Array(m).fill(0);

  criteria.forEach((crit, j) => {
    const values = rawMatrix.map(row => row[j]);
    if (crit.type === 'benefit') {
      fBest[j] = Math.max(...values);
      fWorst[j] = Math.min(...values);
    } else {
      fBest[j] = Math.min(...values);
      fWorst[j] = Math.max(...values);
    }
  });

  // 3. Calculate normalized distances, weighted distances, S and R
  const s: number[] = new Array(n).fill(0);
  const r: number[] = new Array(n).fill(0);
  const normalized: number[][] = Array.from({ length: n }, () => new Array(m).fill(0));
  const weighted: number[][] = Array.from({ length: n }, () => new Array(m).fill(0));

  for (let i = 0; i < n; i++) {
    let sumS = 0;
    let maxR = -Infinity;

    for (let j = 0; j < m; j++) {
      const val = rawMatrix[i][j];
      const weight = criteria[j].weight;
      const best = fBest[j];
      const worst = fWorst[j];
      
      // Avoid division by zero
      const denominator = Math.abs(best - worst) || 1;
      
      // Distance calculation
      // For benefit: (f* - fij) / (f* - f-)
      // For cost: (fij - f*) / (f- - f*)
      // Note: The prompt assumes standard VIKOR.
      // Standard VIKOR metric: w_j * (f*_j - f_ij) / (f*_j - f-_j)
      
      let distance = 0;
      if (criteria[j].type === 'benefit') {
         distance = (best - val) / denominator;
      } else {
         distance = (val - best) / denominator;
      }
      normalized[i][j] = distance;
      const weightedDistance = weight * distance;
      weighted[i][j] = weightedDistance;
      
      sumS += weightedDistance;
      if (weightedDistance > maxR) {
        maxR = weightedDistance;
      }
    }
    s[i] = sumS;
    r[i] = maxR;
  }

  // 4. Calculate Q
  const sStar = Math.min(...s);
  const sMinus = Math.max(...s);
  const rStar = Math.min(...r);
  const rMinus = Math.max(...r);
  const v = 0.5; // weight for strategy of maximum group utility

  const q: number[] = new Array(n).fill(0);

  for (let i = 0; i < n; i++) {
    const term1 = v * ((s[i] - sStar) / ((sMinus - sStar) || 1));
    const term2 = (1 - v) * ((r[i] - rStar) / ((rMinus - rStar) || 1));
    q[i] = term1 + term2;
  }

  // 5. Ranking
  // Sort by Q ascending (smaller Q is better)
  const rankedIndices = q.map((val, idx) => ({ idx, val }))
    .sort((a, b) => a.val - b.val);

  const ranking = rankedIndices.map((item, rank) => ({
    alternativeId: alternatives[item.idx].id,
    rank: rank + 1,
    qValue: item.val,
    sValue: s[item.idx],
    rValue: r[item.idx]
  }));

  return {
    matrix: rawMatrix,
    normalized,
    weighted,
    bestValues: fBest,
    worstValues: fWorst,
    s,
    r,
    q,
    ranking
  };
}
