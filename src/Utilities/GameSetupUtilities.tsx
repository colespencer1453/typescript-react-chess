import { Teams } from "../Enums/Teams";
import { Bishop } from "../Pieces/Bishop";
import { Coordinate } from "../Pieces/Coordinate";
import { King } from "../Pieces/King";
import { Knight } from "../Pieces/Knight";
import { Pawn } from "../Pieces/Pawn";
import { Piece } from "../Pieces/Piece";
import { Queen } from "../Pieces/Queen";
import { Rook } from "../Pieces/Rook";

const createPawn = (columnIndex: number, team: Teams) : Pawn => {
   let rowIndex = team === Teams.WHITE ? 6 : 1;
   return new Pawn(new Coordinate(rowIndex, columnIndex), team);
}

const createPawnRow = (team: Teams) : Array<Piece> => {
   let row = [];

   for(let i = 0; i<8; i++){
       row.push(createPawn(i, team));
   }

   return row;
}

export const createRoyalRow = (team: Teams) : Array<Piece> => {
   let row = [];
   let rowIndex = team === Teams.WHITE ? 7 : 0;

   row.push(new Rook(new Coordinate(rowIndex, 0), team));
   row.push(new Knight(new Coordinate(rowIndex, 1), team));
   row.push(new Bishop(new Coordinate(rowIndex, 2), team));
   row.push(new Queen(new Coordinate(rowIndex, 3), team));
   row.push(new King(new Coordinate(rowIndex, 4), team));
   row.push(new Bishop(new Coordinate(rowIndex, 5), team));
   row.push(new Knight(new Coordinate(rowIndex, 6), team));
   row.push(new Rook(new Coordinate(rowIndex, 7), team));

   return row;
}

const getNullRow = () => {
   return [null, null, null, null, null, null, null, null];
}

export const initializeBoard = () : Array<Array<(Piece | null)>> => {
   let board = Array<Array<(Piece | null)>>();

   board = [
      createRoyalRow(Teams.BLACK),
      createPawnRow(Teams.BLACK),
      getNullRow(),
      getNullRow(),
      getNullRow(),
      getNullRow(),
      createPawnRow(Teams.WHITE),
      createRoyalRow(Teams.WHITE),
   ]

   return board;
}