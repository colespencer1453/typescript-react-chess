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

const createRoyalRow = (color: string) : Array<Piece> => {
   let row = [];
   let rowIndex = color === 'white' ? 7 : 0;

   row.push(new Rook(new Coordinate(rowIndex, 0), color));
   row.push(new Knight(new Coordinate(rowIndex, 1), color));
   row.push(new Bishop(new Coordinate(rowIndex, 2), color));
   row.push(new Queen(new Coordinate(rowIndex, 3), color));
   row.push(new King(new Coordinate(rowIndex, 4), color));
   row.push(new Bishop(new Coordinate(rowIndex, 5), color));
   row.push(new Knight(new Coordinate(rowIndex, 6), color));
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

export class Board {
   pieces: Array<Array<(Piece | null)>>;
   isWhitesTurn: boolean;
   whiteIsInCheck: boolean;
   blackIsInChecK: boolean;
   whiteIsInCheckMate: boolean;
   blackIsInCheckMate: boolean;


   constructor() {
      this.pieces = initializeBoard();
      this.isWhitesTurn = true;
      this.whiteIsInCheck = false;
      this.blackIsInChecK = false;
      this.whiteIsInCheckMate = false;
      this.blackIsInCheckMate = false;
   }

   toggleActiveTeam(): void {
      this.isWhitesTurn = !this.isWhitesTurn;
   }

   getPieceAtLocation(location: Coordinate): (Piece | null){
      return this.pieces[location.x][location.y];
   }

   pieceExistsBetweenTwoPoints(currentLocation: Coordinate, moveLocation: Coordinate) : boolean {
      const slope = calculateSlope(currentLocation, moveLocation);

      if(slope === Infinity) {
         return getSubsetOfPointsBetweenTwoPointsOnAVerticalLine(currentLocation, moveLocation)
            .map(point => this.getPieceAtLocation(point))
               .some(piece => piece !== null);
      }

      return getSubsetOfPointsBetweenTwoPoints(currentLocation, moveLocation)
         .map(point => this.getPieceAtLocation(point))
         .some(piece => piece !== null);
   }

   isValidMove(moveLocation: Coordinate, piece: Piece){
      if(!piece.isValidMove(moveLocation)) return false;

      const occupyingPiece = this.getPieceAtLocation(moveLocation);

      if(occupyingPiece !== null) {
         if(piece.isSameTeam(occupyingPiece as Piece)) {
            return false;
         }
      }

      if(!(piece.pieceName === Pieces.KNIGHT)) {
         if(this.pieceExistsBetweenTwoPoints(piece.currentLocation, moveLocation)) return false;
      }

      // case 4 if moving team is in check the move must remove them from check
      return true;
   }

   movePiece(moveLocation: Coordinate, piece: Piece): void {
      this.pieces[moveLocation.x][moveLocation.y] = piece;
      this.pieces[piece.currentLocation.x][piece.currentLocation.y] = null
      piece.setCurrentLocation(moveLocation);
   }
}