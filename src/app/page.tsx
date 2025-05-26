'use client';

import { useState } from 'react';
import styles from './page.module.css';

//難易度に応じたサイズを返す
// const dif = (def: string): number => {
//   const size = 0;
//   if (def === '初級') {
//   }
//   return size;
// };

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

//bommapを数字の書かれたものに書き換える
const serch = (bomMap: number[][]): number[][] => {
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
  const incNumber: number[][] = [];
  for (let y = 0; y < bomMap.length; y++) {
    const row = [];
    for (let x = 0; x < bomMap[y].length; x++) {
      row.push(0);
      for (let i = 0; i < directions.length; i++) {
        const dy = y + directions[i][0];
        const dx = x + directions[i][1];
        if (
          0 <= dy &&
          dy < bomMap.length &&
          0 < dx &&
          x < bomMap[y].length &&
          bomMap[dy][dx] === 1
        ) {
          row[x] += 1;
        }
      }
    }
    incNumber.push(row);
  }
  return incNumber;
};

//二つのボードを統合
const integBoard = (cBoard: number[][], bomMap: number[][]): number[][] => {
  const incNum = serch(bomMap);
  const board: number[][] = [];
  for (let y = 0; y < cBoard.length; y++) {
    const row = [];
    for (let x = 0; x < cBoard[y].length; x++) {
      row.push(cBoard[y][x] === 0 ? -1 : bomMap[y][x] === 1 ? 11 : incNum[y][x]);
    }
    board.push(row);
  }
  return board;
};

//ボムを配置
const putBom = (Map: number[][]): number[][] => {
  const a = Math.floor(Math.random() * 9);
  const b = Math.floor(Math.random() * 9);
  if (Map.flat().filter((i) => i === 1).length === 10) {
    return Map;
  }
  if (Map[a][b] !== 1) {
    Map[a][b] = 1;
  }
  return putBom(Map);
};

export default function Home() {
  //1~8=number,11=bom, 9=?,10=flag
  const [first, setfirst] = useState(true);
  const [userInput, setuser] = useState<number[][]>(createBoard(9, 9));
  const [bomMap, setBom] = useState<number[][]>(createBoard(9, 9));

  const clickBoard: number[][] = structuredClone(userInput);

  const calcBoard = integBoard(clickBoard, bomMap);
  const width = calcBoard.length;

  const clickHandler = (x: number, y: number) => {
    if (first === true) {
      setBom(putBom(userInput));
      setfirst(false);
    }
    clickBoard[y][x] = 1;
    setuser(clickBoard);
    console.log(clickBoard);
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
            >
              {state === -1 && <div className={styles.cover} />}
            </div>
          )),
        )}
      </div>
    </div>
  );
}
