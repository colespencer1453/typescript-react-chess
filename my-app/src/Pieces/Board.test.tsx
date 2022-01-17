import { Board } from '../Pieces/Board';
import { Pieces } from "../Enums/PieceEnum";
import { calculateSlope, getSubsetOfPointsBetweenTwoPointsOnAVerticalLine, getSubsetOfPointsBetweenTwoPoints } from "../Utilities/ValidationUtilities";
import { Bishop } from "./Bishop";
import { Coordinate } from "./Coordinate";
import { King } from "./King";
import { Knight } from "./Knight";
import { Pawn } from "./Pawn";
import { Piece } from "./Piece";
import { Queen } from "./Queen";
import { Rook } from "./Rook";

const createPawn = (columnIndex: number, color: string) : Pawn => {
   let rowIndex = color === 'white' ? 6 : 1;
   return new Pawn(new Coordinate(rowIndex, columnIndex), color);
}

const createPawnRow = (color: string) : Array<Piece> => {
   let row = [];

   for(let i = 0; i<8; i++){
       row.push(createPawn(i, color));
   }

   return row;
}

const createRoyalRow = (color: string) : Array<(Piece | null)> => {
   let row = [];
   let rowIndex = color === 'white' ? 7 : 0;

   row.push(new Rook(new Coordinate(rowIndex, 0), color));
   row.push(new Knight(new Coordinate(rowIndex, 1), color));
   row.push(new Bishop(new Coordinate(rowIndex, 2), color));
   row.push(null);
   row.push(new King(new Coordinate(rowIndex, 4), color));
   row.push(new Bishop(new Coordinate(rowIndex, 5), color));
   row.push(null);
   row.push(new Rook(new Coordinate(rowIndex, 7), color));

   return row;
}

const getNullRow = () => {
   return [null, null, null, null, null, null, null, null];
}

const initializeBoard = () : Array<Array<(Piece | null)>> => {
   return [
       createRoyalRow('black'),
       createPawnRow('black'),
       getNullRow(),
       getNullRow(),
       getNullRow(),
       getNullRow(),
       createPawnRow('white'),
       createRoyalRow('white'),
   ];
}

describe("Board Class", () => {
   describe("pieceExistsBetweenTwoPoints", () => {
      it("should return false if a piece is between rook and other square on the same row", () => {
         const board = new Board();
         board.pieces = initializeBoard();

         expect(board.pieceExistsBetweenTwoPoints(new Coordinate(7,7), new Coordinate(7,3))).toEqual(true);
      });
   })
})