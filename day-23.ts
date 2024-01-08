type Connect4Chips = "🔴" | "🟡";
type Connect4Cell = Connect4Chips | "  ";
type Connect4State = "🔴" | "🟡" | "🔴 Won" | "🟡 Won" | "Draw";

type EmptyBoard = [
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "]
];

type NewGame = {
  board: EmptyBoard;
  state: "🟡";
};

type Connect4Board = Connect4Cell[][];

type Connect4Game = {
  board: Connect4Board;
  state: Connect4State;
};

type GetIndexRow<
  T extends Connect4Board,
  C extends number,
  Acc extends number[] = [5, 4, 3, 2, 1, 0]
> = T extends [
  ...infer Head extends Connect4Cell[][],
  infer Tail extends Connect4Cell[]
]
  ? Tail[C] extends Connect4Chips
    ? Acc extends [number, ...infer T2 extends number[]]
      ? GetIndexRow<Head, C, T2>
      : Acc[0]
    : Acc[0]
  : Acc[0];

type InsertOnRow<T extends Connect4Cell[], C, S extends Connect4Chips> = {
  [K in keyof T]: K extends C ? (T[K] extends "  " ? S : T[K]) : T[K];
};

type InsertOnMatrix<
  T extends Connect4Board,
  C extends number,
  S extends Connect4Chips
> = {
  [K in keyof T]: K extends `${GetIndexRow<T, C>}`
    ? InsertOnRow<T[K], `${C}`, S>
    : T[K];
};

type UniqueCheck<
  T extends Connect4Cell[],
  S extends Connect4Chips,
  Acc extends number[] = []
> = Acc["length"] extends 4
  ? true
  : T extends [
      infer Head extends Connect4Cell,
      ...infer Tail extends Connect4Cell[]
    ]
  ? S extends Head
    ? UniqueCheck<Tail, S, [...Acc, 1]>
    : UniqueCheck<Tail, S>
  : false;

type HorizontalCheck<
  T extends Connect4Board,
  S extends Connect4Chips
> = T extends [
  infer Head extends Connect4Cell[],
  ...infer Tail extends Connect4Board
]
  ? UniqueCheck<Head, S> extends false
    ? HorizontalCheck<Tail, S>
    : true
  : false;

type Rows = [0, 1, 2, 3, 4, 5];

type Cols = [0, 1, 2, 3, 4, 5, 6];

type VerticalCheck<
  T extends Connect4Board,
  S extends Connect4Chips,
  R extends number[] = Rows,
  C extends number[] = Cols,
  Acc extends Connect4Cell[] = []
> = C extends [infer H1 extends number, ...infer T1 extends number[]]
  ? R extends [infer H2 extends number, ...infer T2 extends number[]]
    ? VerticalCheck<T, S, T2, C, [...Acc, T[H2][H1]]>
    : UniqueCheck<Acc, S> extends false
    ? VerticalCheck<T, S, Rows, T1>
    : true
  : false;

// thanks ecyrbe for the map
type DiagonalMap = [
  [[0, 3], [1, 2], [2, 1], [3, 0]],
  [[0, 4], [1, 3], [2, 2], [3, 1], [4, 0]],
  [[0, 5], [1, 4], [2, 3], [3, 2], [4, 1], [5, 0]],
  [[0, 6], [1, 5], [2, 4], [3, 3], [4, 2], [5, 1]],
  [[1, 6], [2, 5], [3, 4], [4, 3], [5, 2]],
  [[2, 6], [3, 5], [4, 4], [5, 3]],
  [[2, 0], [3, 1], [4, 2], [5, 3]],
  [[1, 0], [2, 1], [3, 2], [4, 3], [5, 4]],
  [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [5, 5]],
  [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]],
  [[0, 2], [1, 3], [2, 4], [3, 5], [4, 6]],
  [[0, 3], [1, 4], [2, 5], [3, 6]]
];

type GetDiag<
  T extends Connect4Board,
  D extends number[][],
  Acc extends Connect4Cell[] = []
> = D extends [infer Head extends number[], ...infer Tail extends number[][]]
  ? GetDiag<T, Tail, [...Acc, T[Head[0]][Head[1]]]>
  : Acc;

type DiagonalCheck<
  T extends Connect4Board,
  S extends Connect4Chips,
  DMap extends number[][][] = DiagonalMap
> = DMap extends [
  infer Head extends number[][],
  ...infer Tail extends number[][][]
]
  ? UniqueCheck<GetDiag<T, Head>, S> extends false
    ? DiagonalCheck<T, S, Tail>
    : true
  : false;

type DrawCheck<T extends Connect4Board> = "  " extends T[number][number]
  ? false
  : true;

type CheckAll<
  T extends Connect4Board,
  S extends Connect4Chips
> = DrawCheck<T> extends false
  ? HorizontalCheck<T, S> extends true
    ? `${S} Won`
    : VerticalCheck<T, S> extends true
    ? `${S} Won`
    : DiagonalCheck<T, S> extends true
    ? `${S} Won`
    : Exclude<Connect4Chips, S>
  : `Draw`;

type Connect4<T extends Connect4Game, C extends number> = {
  board: InsertOnMatrix<T["board"], C, Extract<T["state"], Connect4Chips>>;
  state: CheckAll<
    Extract<
      InsertOnMatrix<T["board"], C, Extract<T["state"], Connect4Chips>>,
      Connect4Board
    >,
    Extract<T["state"], Connect4Chips>
  >;
};

import { Expect, Equal } from "type-testing";

type test_move1_actual = Connect4<NewGame, 0>;
//   ^?
type test_move1_expected = {
  board: [
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "  ", "  ", "  ", "  ", "  ", "  "]
  ];
  state: "🔴";
};
type test_move1 = Expect<Equal<test_move1_actual, test_move1_expected>>;

type test_move2_actual = Connect4<test_move1_actual, 0>;
//   ^?
type test_move2_expected = {
  board: [
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🔴", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "  ", "  ", "  ", "  ", "  ", "  "]
  ];
  state: "🟡";
};
type test_move2 = Expect<Equal<test_move2_actual, test_move2_expected>>;

type test_move3_actual = Connect4<test_move2_actual, 0>;
//   ^?
type test_move3_expected = {
  board: [
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🔴", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "  ", "  ", "  ", "  ", "  ", "  "]
  ];
  state: "🔴";
};
type test_move3 = Expect<Equal<test_move3_actual, test_move3_expected>>;

type test_move4_actual = Connect4<test_move3_actual, 1>;
//   ^?
type test_move4_expected = {
  board: [
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🔴", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "🔴", "  ", "  ", "  ", "  ", "  "]
  ];
  state: "🟡";
};
type test_move4 = Expect<Equal<test_move4_actual, test_move4_expected>>;

type test_move5_actual = Connect4<test_move4_actual, 2>;
//   ^?
type test_move5_expected = {
  board: [
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🔴", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "🔴", "🟡", "  ", "  ", "  ", "  "]
  ];
  state: "🔴";
};
type test_move5 = Expect<Equal<test_move5_actual, test_move5_expected>>;

type test_move6_actual = Connect4<test_move5_actual, 1>;
//   ^?
type test_move6_expected = {
  board: [
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🔴", "🔴", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "🔴", "🟡", "  ", "  ", "  ", "  "]
  ];
  state: "🟡";
};
type test_move6 = Expect<Equal<test_move6_actual, test_move6_expected>>;

type test_red_win_actual = Connect4<
  {
    board: [
      ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
      ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
      ["🟡", "  ", "  ", "  ", "  ", "  ", "  "],
      ["🟡", "  ", "  ", "  ", "  ", "  ", "  "],
      ["🔴", "🔴", "🔴", "  ", "  ", "  ", "  "],
      ["🟡", "🔴", "🟡", "🟡", "  ", "  ", "  "]
    ];
    state: "🔴";
  },
  3
>;

type test_red_win_expected = {
  board: [
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🔴", "🔴", "🔴", "🔴", "  ", "  ", "  "],
    ["🟡", "🔴", "🟡", "🟡", "  ", "  ", "  "]
  ];
  state: "🔴 Won";
};

type test_red_win = Expect<Equal<test_red_win_actual, test_red_win_expected>>;

type test_yellow_win_actual = Connect4<
  {
    board: [
      ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
      ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
      ["🔴", "  ", "  ", "  ", "  ", "  ", "  "],
      ["🟡", "  ", "  ", "  ", "  ", "  ", "  "],
      ["🔴", "  ", "🔴", "🔴", "  ", "  ", "  "],
      ["🟡", "  ", "🟡", "🟡", "  ", "  ", "  "]
    ];
    state: "🟡";
  },
  1
>;

type test_yellow_win_expected = {
  board: [
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🔴", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🔴", "  ", "🔴", "🔴", "  ", "  ", "  "],
    ["🟡", "🟡", "🟡", "🟡", "  ", "  ", "  "]
  ];
  state: "🟡 Won";
};

type test_yellow_win = Expect<
  Equal<test_yellow_win_actual, test_yellow_win_expected>
>;

type test_diagonal_yellow_win_actual = Connect4<
  {
    board: [
      ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
      ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
      ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
      ["  ", "  ", "🟡", "🔴", "  ", "  ", "  "],
      ["🔴", "🟡", "🔴", "🔴", "  ", "  ", "  "],
      ["🟡", "🔴", "🟡", "🟡", "  ", "  ", "  "]
    ];
    state: "🟡";
  },
  3
>;

type test_diagonal_yellow_win_expected = {
  board: [
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "🟡", "  ", "  ", "  "],
    ["  ", "  ", "🟡", "🔴", "  ", "  ", "  "],
    ["🔴", "🟡", "🔴", "🔴", "  ", "  ", "  "],
    ["🟡", "🔴", "🟡", "🟡", "  ", "  ", "  "]
  ];
  state: "🟡 Won";
};

type test_diagonal_yellow_win = Expect<
  Equal<test_diagonal_yellow_win_actual, test_diagonal_yellow_win_expected>
>;

type test_draw_actual = Connect4<
  {
    board: [
      ["🟡", "🔴", "🔴", "🟡", "🟡", "🔴", "  "],
      ["🔴", "🟡", "🟡", "🔴", "🔴", "🟡", "🔴"],
      ["🟡", "🔴", "🔴", "🟡", "🟡", "🔴", "🟡"],
      ["🔴", "🟡", "🟡", "🔴", "🔴", "🟡", "🔴"],
      ["🟡", "🔴", "🔴", "🟡", "🟡", "🔴", "🟡"],
      ["🔴", "🟡", "🟡", "🔴", "🔴", "🟡", "🔴"]
    ];
    state: "🟡";
  },
  6
>;

type test_draw_expected = {
  board: [
    ["🟡", "🔴", "🔴", "🟡", "🟡", "🔴", "🟡"],
    ["🔴", "🟡", "🟡", "🔴", "🔴", "🟡", "🔴"],
    ["🟡", "🔴", "🔴", "🟡", "🟡", "🔴", "🟡"],
    ["🔴", "🟡", "🟡", "🔴", "🔴", "🟡", "🔴"],
    ["🟡", "🔴", "🔴", "🟡", "🟡", "🔴", "🟡"],
    ["🔴", "🟡", "🟡", "🔴", "🔴", "🟡", "🔴"]
  ];
  state: "Draw";
};

type test_draw = Expect<Equal<test_draw_actual, test_draw_expected>>;
