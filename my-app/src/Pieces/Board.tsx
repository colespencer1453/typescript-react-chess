import { Pieces } from "../Enums/PieceEnum";
import { 
   getSubsetOfPointsBetweenTwoPointsOnAVerticalLine, 
   getSubsetOfPointsBetweenTwoPoints, 
   calculateAbsoluteSlope 
} from "../Utilities/ValidationUtilities";
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

const initializeBoard = (whitePieces: Array<Piece>, blackPieces: Array<Piece>) : Array<Array<(Piece | null)>> => {
   let board = Array<Array<(Piece | null)>>();

   board = [
      getNullRow(),
      getNullRow(),
      getNullRow(),
      getNullRow(),
      getNullRow(),
      getNullRow(),
      getNullRow(),
      getNullRow(),
   ]

   whitePieces.forEach(piece => {
      board[piece.currentLocation.x][piece.currentLocation.y] = piece;
   });

   blackPieces.forEach(piece => {
      board[piece.currentLocation.x][piece.currentLocation.y] = piece;
   });

   return board;
}

export class Board {
   pieces: Array<Array<(Piece | null)>>;
   whitePieces: Array<Piece>;
   blackPieces: Array<Piece>;
   colorOfActiveTurn: string;
   isCheck: boolean;
   whiteKingLocation: Coordinate; 
   blackKingLocation: Coordinate; 

   constructor() {
      this.whitePieces = createRoyalRow('white').concat(createPawnRow('white'))
      this.blackPieces = createRoyalRow('black').concat(createPawnRow('black'))
      this.pieces = initializeBoard(this.whitePieces, this.blackPieces);
      this.colorOfActiveTurn = 'white';
      this.isCheck = false;
      this.whiteKingLocation = new Coordinate(7,4);
      this.blackKingLocation = new Coordinate(0, 4);
   }

   toggleActiveTeam(): void {
      if(this.colorOfActiveTurn === 'white'){
         this.colorOfActiveTurn = 'black';
      } else {
         this.colorOfActiveTurn = 'white';
      }
   }

   getPieceAtLocation(location: Coordinate): (Piece | null){
      return this.pieces[location.x][location.y];
   }

   pieceExistsBetweenTwoPoints(currentLocation: Coordinate, moveLocation: Coordinate) : boolean {
      const slope = calculateAbsoluteSlope(currentLocation, moveLocation);

      if(slope === Infinity) {
         return getSubsetOfPointsBetweenTwoPointsOnAVerticalLine(currentLocation, moveLocation)
            .map(point => this.getPieceAtLocation(point))
               .some(piece => piece !== null);
      }

      return getSubsetOfPointsBetweenTwoPoints(currentLocation, moveLocation)
         .map(point => this.getPieceAtLocation(point))
         .some(piece => piece !== null);
   }

   kingCanEscape(): boolean {
      return false;
   }

   secretServiceCanIntervene(): boolean {
      return false;
   }

   canKillAttacker(): boolean {
      return false;
   }

   isValidMove(moveLocation: Coordinate, piece: Piece){
      if(!piece.isValidMove(moveLocation)) return false;

      const occupyingPiece = this.getPieceAtLocation(moveLocation);

      if(occupyingPiece !== null) {
         if(piece.isSameTeam(occupyingPiece as Piece)) {
            return false;
         }
      }

      if(piece.pieceName === Pieces.PAWN 
         && calculateAbsoluteSlope(moveLocation, piece.currentLocation) === 1
         && occupyingPiece === null) {
         return false;
      }

      if(!(piece.pieceName === Pieces.KNIGHT)) {
         if(this.pieceExistsBetweenTwoPoints(piece.currentLocation, moveLocation)) return false;
      }

      // case 4 if moving team is in check the move must remove them from check

      return true;
   }

   movePiece(moveLocation: Coordinate, piece: Piece): void {
      const occupyingPiece = this.getPieceAtLocation(moveLocation);

      if(occupyingPiece !== null) {
         if(piece.color === 'white') {
            this.blackPieces = this.blackPieces.filter(piece => piece.uuid === occupyingPiece.uuid)
         } else {
            this.whitePieces = this.whitePieces.filter(piece => piece.uuid === occupyingPiece.uuid)
         }
      }

      this.pieces[moveLocation.x][moveLocation.y] = piece;
      this.pieces[piece.currentLocation.x][piece.currentLocation.y] = null
      piece.setCurrentLocation(moveLocation);

      if(piece.color === this.colorOfActiveTurn) {
         this.toggleActiveTeam();
      }

      if(piece.pieceName === Pieces.KING) {
         if(piece.color === 'white') {
            this.whiteKingLocation = moveLocation;
         } else {
            this.blackKingLocation = moveLocation;
         }
      }

      if(piece.color === 'white') {
         if(this.whitePieces.some(piece => this.isValidMove(this.blackKingLocation, piece))) {
            this.isCheck = true;
         }
      } else {
         if(this.blackPieces.some(piece => this.isValidMove(this.whiteKingLocation, piece))) {
            this.isCheck = true;
         }
      }
   }
}