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
] as const;

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
  const incNumber: number[][] = bomMap.map((row) => row.map(() => -1));
  for (let y = 0; y < bomMap.length; y++) {
    for (let x = 0; x < bomMap[y].length; x++) {
      if (bomMap[y][x] === 1) {
        incNumber[y][x] = 11;
      } else {
        incNumber[y][x] = 0;
        for (let i = 0; i < directions.length; i++) {
          const dy = y + directions[i][0];
          const dx = x + directions[i][1];
          if (
            0 <= dy &&
            dy < bomMap.length &&
            0 <= dx &&
            x < bomMap[y].length &&
            bomMap[dy][dx] === 1
          ) {
            incNumber[y][x] += 1;
          }
        }
      }
    }
  }
  return incNumber;
};

//二つのボードを統合
const integBoard = (cBoard: number[][], incNum: number[][]): number[][] => {
  const board: number[][] = cBoard.map((row) => row.map(() => -1));
  for (let y = 0; y < cBoard.length; y++) {
    for (let x = 0; x < cBoard[y].length; x++) {
      if (cBoard[y][x] !== 0) {
        if (incNum[y][x] === 11) {
          gameover(board);
        }
        openZero(cBoard, incNum, board, y, x);
        board[y][x] = incNum[y][x];
      }
    }
  }
  for (let y = 0; y < cBoard.length; y++) {
    for (let x = 0; x < cBoard[y].length; x++) {
      if (board[y][x] !== -1) {
        board[y][x] = incNum[y][x];
      }
      if (cBoard[y][x] === 2) {
        board[y][x] = 10;
      }
    }
  }
  return board;
};

//ゼロの所をあける再起関数
const openZero = (
  cBoard: number[][],
  incNum: number[][],
  bord: number[][],
  y: number,
  x: number,
) => {
  if (incNum[y][x] === 0 && bord[y][x] === -1) {
    bord[y][x] = 0;
    for (const [dyOffset, dxOffset] of directions) {
      const dy = y + dyOffset;
      const dx = x + dxOffset;
      if (0 <= dy && dy < incNum.length && 0 <= dx && dx < incNum[dy].length) {
        if (incNum[dy][dx] === 0) {
          openZero(cBoard, incNum, bord, dy, dx);
        } else {
          bord[dy][dx] = 0;
        }
      }
    }
  }
};
// ゲームオーバー
const gameover = (board: number[][]): number[][] => {
  for (let i = 0; i < board.length; i++) {
    board[i].fill(0);
  }
  return board;
};
//ボムを配置
const putBom = (Map: number[][], y: number, x: number): number[][] => {
  const a = Math.floor(Math.random() * 9);
  const b = Math.floor(Math.random() * 9);
  if (Map.flat().filter((i) => i === 1).length === 10) {
    return Map;
  }
  if (Map[a][b] !== 1 && a !== y && b !== x) {
    Map[a][b] = 1;
  }
  return putBom(Map, y, x);
};

export default function Home() {
  //1~8=number,11=bom, 9=?,10=flag
  const [first, setfirst] = useState(true);
  const [userInput, setuser] = useState<number[][]>(createBoard(9, 9));
  const [bomMap, setBom] = useState<number[][]>(createBoard(9, 9));

  const clickBoard: number[][] = structuredClone(userInput);

  const calcBoard = integBoard(clickBoard, serch(bomMap));
  const width = calcBoard.length;

  const clickHandler = (x: number, y: number) => {
    if (first) {
      setBom(putBom(userInput, y, x));
      setfirst(false);
    }
    clickBoard[y][x] = 1;
    setuser(clickBoard);
  };
  const riteClick = (x: number, y: number, evt: React.MouseEvent) => {
    evt.preventDefault();
    clickBoard[y][x] = 2;
    console.log('right');
  };

  return (
    <div className={styles.container}>
      <div className={styles.face} style={{ backgroundPosition: `${-30 * 1}px` }} />
      <div className={styles.back} style={{ width: `${30 * width}px` }}>
        {calcBoard.map((row, y) =>
          row.map((state, x) => (
            <div
              className={styles.block}
              key={`${x}-${y}`}
              onClick={() => clickHandler(x, y)}
              onContextMenu={(evt) => {
                riteClick(x, y, evt);
              }}
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
