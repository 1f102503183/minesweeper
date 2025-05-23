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

const sum1 = (n: number): number => {
  if (n !== 0) {
    return n + sum1(n - 1);
  } else {
    return n;
  }
};
console.log(sum1(10));

const sum2 = (n: number, m: number): number => {
  return n === m ? n : n + sum2(n + 1, m);
};
console.log(sum2(3, 10));

const sum3 = (n: number, m: number): number => {
  return ((m - n + 1) * (n + m)) / 2;
};
console.log(sum3(3, 10));

export default function Home() {
  const [sampleCounter, setSampleCounter] = useState<number>(0);
  const [samplePoint, setSamplePoint] = useState<number[]>([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [setClick, clickBoard] = useState<number[][]>();

  const clickHandler = () => {
    const newSanplePoint: number[] = structuredClone(samplePoint);
    newSanplePoint[sampleCounter] += 1;
    setSamplePoint(newSanplePoint);
    setSampleCounter((sampleCounter + 1) % 14);
    const totalPoint = calcTotalPoint(samplePoint, sampleCounter);
    console.log(totalPoint);
  };

  return (
    <div className={styles.container}>
      <div className={styles.block} style={{ backgroundPosition: `${sampleCounter * -30}px` }} />
      <button onClick={clickHandler}>律</button>
    </div>
  );
}
