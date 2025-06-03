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

interface level {
  height: number;
  width: number;
  bomNumber: number;
}

//オブジェクト
const difficult: { [key: string]: level } = {
  初級: { height: 9, width: 9, bomNumber: 10 },
  中級: { height: 16, width: 16, bomNumber: 40 },
  上級: { height: 16, width: 30, bomNumber: 99 },
  カスタム: { height: 2, width: 2, bomNumber: 2 },
};

// hight*widthの二次元配列を作る
const createBoard = (def: level): number[][] => {
  const board: number[][] = [];
  for (let y = 0; y < def.height; y++) {
    const row = [];
    for (let x = 0; x < def.width; x++) {
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
      if (cBoard[y][x] === 1) {
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
      if (cBoard[y][x] === -1 || cBoard[y][x] === -2) {
        board[y][x] = 11 + cBoard[y][x];
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
    board[i].fill(1);
  }
  return board;
};
//ボムを配置
const putBom = (Map: number[][], y: number, x: number, bomnumber: number): number[][] => {
  const a = Math.floor(Math.random() * Map.length);
  const b = Math.floor(Math.random() * Map[0].length);
  if (counter(Map, 1) === bomnumber) {
    return Map;
  }
  if (Map[a][b] !== 1 && a !== y && b !== x) {
    Map[a][b] = 1;
  }
  return putBom(Map, y, x, bomnumber);
};

const counter = (bord: number[][], item: number): number => {
  return bord.flat().filter((i) => i === item).length;
};

export default function Home() {
  // 1~8=number,11=bom, 9=?,10=flag
  const [level, setLevel] = useState<string>('初級');
  const [userInput, setuser] = useState<number[][]>(createBoard(difficult[level]));
  const [bomMap, setBom] = useState<number[][]>(createBoard(difficult[level]));

  const clickBoard: number[][] = structuredClone(userInput);

  const calcBoard = integBoard(clickBoard, serch(bomMap));

  const face: number = counter(userInput, 0) === 0 ? 14 : counter(calcBoard, -1) === 0 ? 13 : 12;

  // const timer = () => {
  //   setTime(time + 1);
  // };

  const setLev = (n: string) => {
    setLevel(n);
  };
  if (calcBoard[0].length !== createBoard(difficult[level])[0].length) {
    setBom(createBoard(difficult[level]));
    setuser(createBoard(difficult[level]));
  }

  // const custom = (event: React.ChangeEvent<HTMLInputElement>) => {};

  const clickHandler = (x: number, y: number) => {
    if (counter(bomMap, 1) === 0) {
      setBom(putBom(userInput, y, x, difficult[level].bomNumber));
    }
    clickBoard[y][x] = 1;
    if (bomMap[y][x] === 1) {
      gameover(clickBoard);
    }
    setuser(clickBoard);
  };
  console.log(clickBoard);
  const riteClick = (x: number, y: number) => {
    if (calcBoard[y][x] === -1 || calcBoard[y][x] === 9 || calcBoard[y][x] === 10) {
      clickBoard[y][x] = (clickBoard[y][x] - 1) % 3;
      setuser(clickBoard);
    }
  };

  return (
    <div className={styles.container}>
      <button onClick={() => setLev('初級')}>初級</button>
      <button onClick={() => setLev('中級')}>中級</button>
      <button onClick={() => setLev('上級')}>上級</button>
      <div
        className={styles.face}
        style={{ backgroundPosition: `${-30 * (face - 1)}px` }}
        // onClick={() => setLev(level)}
      />
      <label htmlFor="number">高さ：</label>
      {/* <input type="number" id="heightInput" value={height} onChange={custom(height)} /> */}
      <label htmlFor="number">幅：</label>
      <input type="number" id="heightInput" />
      <label htmlFor="number">爆弾数：</label>
      <input type="number" id="heightInput" />
      <div
        className={styles.back}
        style={{ height: `${userInput.length * 30}px`, width: `${userInput[0].length * 30}px` }}
      >
        {calcBoard.map((row, y) =>
          row.map((state, x) => (
            <div
              className={styles.cover}
              key={`${x}-${y}`}
              onClick={() => clickHandler(x, y)}
              onContextMenu={(evt) => {
                evt.preventDefault();
                riteClick(x, y);
              }}
            >
              {state !== -1 && (
                <div
                  className={styles.block}
                  key={`${x}-${y}`}
                  style={{ backgroundPosition: `${-30 * (state - 1)}px` }}
                />
              )}
            </div>
          )),
        )}
      </div>
    </div>
  );
}

// outset
