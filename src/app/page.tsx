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

//12=smile,13=cool,14=miss

//二つのボードを統合
const calcBoard = (cBoard: number[][], bBoard: number[][]): number[][] => {
  const board: number[][] = [];
  for (let y = 0; y < cBoard.length; y++) {
    const row = [];
    for (let x = 0; x < cBoard[y].length; x++) {
      row.push(cBoard[y][x] === 9 || cBoard[y][x] === 10 ? cBoard[y][x] : bBoard[y][x]);
    }
    board.push(row);
  }
  return board;
};

export default function Home() {
  //1~8=number,11=bom,
  const [setBom, bomMap] = useState<number[][]>([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  // 9=?,10=flag
  const [setClickB, clickBoard] = useState<number[][]>([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);

  const width = 4;

  const calcBoard = [[0, 0, 1, 0]];

  const clickHandler = (x: number, y: number) => {
    const newCB = structuredClone(clickBoard);
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
              style={{ backgroundPosition: `${-30 * (state - 1)}px` }}
            />
          )),
        )}
      </div>
    </div>
  );
}
