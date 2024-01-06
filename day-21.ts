type TicTacToeChip = "❌" | "⭕";
type TicTacToeEndState = "❌ Won" | "⭕ Won" | "Draw";
type TicTacToeState = TicTacToeChip | TicTacToeEndState;
type TicTacToeEmptyCell = "  ";
type TicTacToeCell = TicTacToeChip | TicTacToeEmptyCell;
type TicTacToeYPositions = "top" | "middle" | "bottom";
type TicTacToeXPositions = "left" | "center" | "right";
type TicTacToePositions = `${TicTacToeYPositions}-${TicTacToeXPositions}`;
type TicTacToeBoard = TicTacToeCell[][];
type TicTacToeGame = {
  board: TicTacToeBoard;
  state: TicTacToeState;
};

type EmptyBoard = [["  ", "  ", "  "], ["  ", "  ", "  "], ["  ", "  ", "  "]];

type NewGame = {
  board: EmptyBoard;
  state: "❌";
};

type PositionToCell = {
  "top-left": [0, 0];
  "top-center": [0, 1];
  "top-right": [0, 2];
  "middle-left": [1, 0];
  "middle-center": [1, 1];
  "middle-right": [1, 2];
  "bottom-left": [2, 0];
  "bottom-center": [2, 1];
  "bottom-right": [2, 2];
};

type CheckInvalid<
  T extends TicTacToeBoard,
  U extends TicTacToePositions
> = T[PositionToCell[U][0]][PositionToCell[U][1]] extends TicTacToeChip
  ? true
  : false;

type ChangeColState<
  T extends TicTacToeCell[],
  Col extends number,
  State extends TicTacToeState
> = T extends [infer Zero, infer One, infer Two]
  ? Col extends 0
    ? [State, One, Two]
    : Col extends 1
    ? [Zero, State, Two]
    : Col extends 2
    ? [Zero, One, State]
    : never
  : never;

type ChangeRowState<
  T extends TicTacToeBoard,
  Row extends number,
  Col extends number,
  State extends TicTacToeState
> = T extends [
  infer Zero extends TicTacToeCell[],
  infer One extends TicTacToeCell[],
  infer Two extends TicTacToeCell[]
]
  ? Row extends 0
    ? [ChangeColState<Zero, Col, State>, One, Two]
    : Row extends 1
    ? [Zero, ChangeColState<One, Col, State>, Two]
    : Row extends 2
    ? [Zero, One, ChangeColState<Two, Col, State>]
    : never
  : never;

type WinCells = [
  [[0, 0], [0, 1], [0, 2]],
  [[0, 0], [1, 0], [2, 0]],
  [[0, 0], [1, 1], [2, 2]],
  [[0, 1], [1, 1], [2, 1]],
  [[0, 2], [1, 2], [2, 2]],
  [[1, 0], [1, 1], [1, 2]],
  [[2, 0], [2, 1], [2, 2]],
  [[0, 2], [1, 1], [2, 0]]
];

type CheckWinPerArray<T extends TicTacToeBoard, State, U> = U extends [
  infer Head extends number[],
  ...infer Tail
]
  ? T[Head[0]][Head[1]] extends State
    ? CheckWinPerArray<T, State, Tail>
    : false
  : true;

type CheckWin<T extends TicTacToeBoard, State, Cells> = Cells extends [
  infer Head,
  ...infer Tail
]
  ? CheckWinPerArray<T, State, Head> extends true
    ? true
    : CheckWin<T, State, Tail>
  : false;

type CheckDraw<
  T extends TicTacToeBoard,
  Col extends number = 0 | 1 | 2,
  Row extends number = 0 | 1 | 2
> = T[Row][Col] extends TicTacToeChip ? true : false;

type TicTacToe<
  T extends TicTacToeGame,
  U extends TicTacToePositions
> = CheckInvalid<T["board"], U> extends false
  ? {
      board: ChangeRowState<
        T["board"],
        PositionToCell[U][0],
        PositionToCell[U][1],
        T["state"]
      >;
      state: CheckDraw<
        ChangeRowState<
          T["board"],
          PositionToCell[U][0],
          PositionToCell[U][1],
          T["state"]
        >
      > extends true
        ? "Draw"
        : CheckWin<
            ChangeRowState<
              T["board"],
              PositionToCell[U][0],
              PositionToCell[U][1],
              T["state"]
            >,
            "⭕",
            WinCells
          > extends true
        ? "⭕ Won"
        : CheckWin<
            ChangeRowState<
              T["board"],
              PositionToCell[U][0],
              PositionToCell[U][1],
              T["state"]
            >,
            "❌",
            WinCells
          > extends true
        ? "❌ Won"
        : Exclude<TicTacToeChip, T["state"]>;
    }
  : T;

import { Equal, Expect } from "type-testing";

type test_move1_actual = TicTacToe<NewGame, "top-center">;
//   ^?
type test_move1_expected = {
  board: [["  ", "❌", "  "], ["  ", "  ", "  "], ["  ", "  ", "  "]];
  state: "⭕";
};
type test_move1 = Expect<Equal<test_move1_actual, test_move1_expected>>;

type test_move2_actual = TicTacToe<test_move1_actual, "top-left">;
//   ^?
type test_move2_expected = {
  board: [["⭕", "❌", "  "], ["  ", "  ", "  "], ["  ", "  ", "  "]];
  state: "❌";
};
type test_move2 = Expect<Equal<test_move2_actual, test_move2_expected>>;

type test_move3_actual = TicTacToe<test_move2_actual, "middle-center">;
//   ^?
type test_move3_expected = {
  board: [["⭕", "❌", "  "], ["  ", "❌", "  "], ["  ", "  ", "  "]];
  state: "⭕";
};
type test_move3 = Expect<Equal<test_move3_actual, test_move3_expected>>;

type test_move4_actual = TicTacToe<test_move3_actual, "bottom-left">;
//   ^?
type test_move4_expected = {
  board: [["⭕", "❌", "  "], ["  ", "❌", "  "], ["⭕", "  ", "  "]];
  state: "❌";
};
type test_move4 = Expect<Equal<test_move4_actual, test_move4_expected>>;

type test_x_win_actual = TicTacToe<test_move4_actual, "bottom-center">;
//   ^?
type test_x_win_expected = {
  board: [["⭕", "❌", "  "], ["  ", "❌", "  "], ["⭕", "❌", "  "]];
  state: "❌ Won";
};
type test_x_win = Expect<Equal<test_x_win_actual, test_x_win_expected>>;

type type_move5_actual = TicTacToe<test_move4_actual, "bottom-right">;
//   ^?
type type_move5_expected = {
  board: [["⭕", "❌", "  "], ["  ", "❌", "  "], ["⭕", "  ", "❌"]];
  state: "⭕";
};
type test_move5 = Expect<Equal<type_move5_actual, type_move5_expected>>;

type test_o_win_actual = TicTacToe<type_move5_actual, "middle-left">;
//   ^?
type test_o_win_expected = {
  board: [["⭕", "❌", "  "], ["⭕", "❌", "  "], ["⭕", "  ", "❌"]];
  state: "⭕ Won";
};

// invalid move don't change the board and state
type test_invalid_actual = TicTacToe<test_move1_actual, "top-center">;
//   ^?
type test_invalid_expected = {
  board: [["  ", "❌", "  "], ["  ", "  ", "  "], ["  ", "  ", "  "]];
  state: "⭕";
};
type test_invalid = Expect<Equal<test_invalid_actual, test_invalid_expected>>;

type test_before_draw = {
  board: [["⭕", "❌", "⭕"], ["⭕", "❌", "❌"], ["❌", "⭕", "  "]];
  state: "⭕";
};
type test_draw_actual = TicTacToe<test_before_draw, "bottom-right">;
//   ^?
type test_draw_expected = {
  board: [["⭕", "❌", "⭕"], ["⭕", "❌", "❌"], ["❌", "⭕", "⭕"]];
  state: "Draw";
};
type test_draw = Expect<Equal<test_draw_actual, test_draw_expected>>;
