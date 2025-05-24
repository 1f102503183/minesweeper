'use client';

import { useState } from 'react';
import styles from './page.module.css';

const directions = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

// hight*widthの二次元配列を作る
const createBoard = (hight: number, width: number): number[][] => {
  const board: number[][] = [];
  for (let y = 0; y < hight; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      row.push(0);
    }
    board.push(row);
  }
  return board;
};

const calcTotalPoint = (arr: number[], counter: number) => {
  const total = arr.reduce((accumulator, currentValue) => accumulator + currentValue);
  return total + counter;
};

export default function Home() {
  const [setBom, bomMap] = useState<number>(0);
  // const [setsize, width] = useState<number>(3);
  const [samplePoint, setSamplePoint] = useState<number[]>([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [setClickB, clickBoard] = useState<number[][]>([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);

  const width = 4;

  const calcBoard = [[0, 0, 1, 0]];

  const clickHandler = (x: number, y: number) => {
    // setSampleCounter((sampleCounter + 1) % 14);
  };

  return (
    <div className={styles.container}>
      <div className={styles.back} style={{ width: `${30 * width}px` }}>
        {calcBoard.map((row, y) =>
          row.map((state, x) => (
            <div
              className={styles.block}
              key={`${x}-${y}`}
              onClick={() => clickHandler(x, y)}
              style={{ backgroundPosition: `${-30 * state}px` }}
            />
          )),
        )}
      </div>
    </div>
  );
}
