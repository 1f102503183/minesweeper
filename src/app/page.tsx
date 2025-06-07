'use client';

import type { ChangeEvent } from 'react';
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

const difficult: { [key: string]: level } = {
  easy: { height: 9, width: 9, bomNumber: 10 },
  normal: { height: 16, width: 16, bomNumber: 40 },
  hard: { height: 16, width: 30, bomNumber: 99 },
  custom: { height: 10, width: 10, bomNumber: 15 },
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
  const [level, setLevel] = useState<string>('easy');
  const [userInput, setuser] = useState<number[][]>(createBoard(difficult[level]));
  const [bomMap, setBom] = useState<number[][]>(createBoard(difficult[level]));
  // const [time, setTime] = useState<number>(0);
  const [customSetting, setCustom] = useState<level>(difficult.custom);
  const customMemo = structuredClone(customSetting);

  // const timer = useCallback(() => {
  //   setTime((prevTime) => prevTime + 1); // 関数形式のsetStateを使用
  // }, []);

  // //timer
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     timer();
  //   }, 1000);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [timer]);

  const clickBoard: number[][] = structuredClone(userInput);

  const calcBoard = integBoard(clickBoard, serch(bomMap));

  const face: number = counter(userInput, 0) === 0 ? 14 : counter(calcBoard, -1) === 0 ? 13 : 12;

  const setLev = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLevel(event.target.value);
  };

  if (calcBoard[0].length !== createBoard(difficult[level])[0].length) {
    setBom(createBoard(difficult[level]));
    setuser(createBoard(difficult[level]));
  }

  const setCustomChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === 'width') {
      customMemo.width = Number(value);
    } else if (name === 'height') {
      customMemo.height = Number(value);
    } else {
      customMemo.bomNumber = Number(value);
    }
    console.log(name);
    console.log(value);
    setCustom(customMemo);
  };
  const reloadustom = () => {
    if (customMemo.width * customMemo.height < customMemo.bomNumber) {
      customMemo.bomNumber = customMemo.height * customMemo.width;
    }
    setLevel('custom');
  };

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
  const riteClick = (x: number, y: number) => {
    if (calcBoard[y][x] === -1 || calcBoard[y][x] === 9 || calcBoard[y][x] === 10) {
      clickBoard[y][x] = (clickBoard[y][x] - 1) % 3;
      setuser(clickBoard);
    }
  };

  return (
    <div className={styles.container}>
      <div className="timer" />
      <div
        className={styles.face}
        style={{ backgroundPosition: `${-30 * (face - 1)}px` }}
        // onClick={() => setLev(level)}
      />
      <select id="levelSelect" value={level} onChange={setLev}>
        <option value="easy">初級</option>
        <option value="normal">中級</option>
        <option value="hard">上級</option>
        <option value="custom">カスタム</option>
      </select>
      {level === 'custom' && (
        <div className="custom">
          <label htmlFor="setW">幅</label>
          <input
            id="setW"
            type="number"
            name="width"
            value={customSetting.width}
            onChange={setCustomChange}
          />
          <label htmlFor="setH">高さ</label>
          <input
            id="setH"
            type="number"
            name="height"
            value={customSetting.height}
            onChange={setCustomChange}
          />
          <label htmlFor="setB">爆弾の数</label>
          <input
            id="setB"
            type="number"
            name="bomNumber"
            value={customSetting.bomNumber}
            onChange={setCustomChange}
          />
          <button onClick={reloadustom}>更新</button>
        </div>
      )}
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
