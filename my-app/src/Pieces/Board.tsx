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

      const contentsOfMoveSquare = this.getPieceAtLocation(moveLocation);

      if(this.pieceAtMoveLocationIsSameTeam(contentsOfMoveSquare, piece)) return false;
      if(this.shouldDisablePawnAttackMove(moveLocation, piece, contentsOfMoveSquare)) return false;
      if(this.pieceIsBlockingMove(moveLocation, piece)) return false;

      // case 4 if moving team is in check the move must remove them from check

      return true;
   }

   private pieceAtMoveLocationIsSameTeam(contentsOfMoveSquare: Piece | null, piece: Piece): boolean {
      return contentsOfMoveSquare !== null && piece.isSameTeam(contentsOfMoveSquare as Piece);
   }

   private shouldDisablePawnAttackMove(moveLocation: Coordinate, piece: Piece, contentsOfMoveSquare: Piece | null): boolean {
      if(piece.pieceName !== Pieces.PAWN) return false;

      return this.pawnCanAttack(moveLocation, piece, contentsOfMoveSquare);
   }

   private pawnCanAttack(moveLocation: Coordinate, piece: Piece, contentsOfMoveSquare: Piece | null): boolean {
      return (calculateAbsoluteSlope(moveLocation, piece.currentLocation) === 1 && contentsOfMoveSquare === null);
   }

   private pieceIsBlockingMove(moveLocation: Coordinate, piece: Piece): boolean {
      if(piece.pieceName === Pieces.KNIGHT) return false;

      return this.pieceExistsBetweenTwoPoints(piece.currentLocation, moveLocation);
   }

   movePiece(moveLocation: Coordinate, piece: Piece, isCheckValidationOperation?: boolean): void {
      this.removePieceIfPieceAttacked(moveLocation, piece);

      this.updatePieceLocation(moveLocation, piece);

      this.updateActiveTeam(piece);

      this.updateKingLocationIfMoved(piece, moveLocation);

      this.updateIsCheck(piece);
   }

   private updateActiveTeam(piece: Piece) {
      // This if statement is needed because of a bug in react dnd calling movePiece twice
      if (piece.color === this.colorOfActiveTurn) {
         this.toggleActiveTeam();
      }
   }

   private removePieceIfPieceAttacked(moveLocation: Coordinate, piece: Piece) {
      const occupyingPiece = this.getPieceAtLocation(moveLocation);

      if (occupyingPiece !== null)
         this.removePieceFromActivePieces(piece, occupyingPiece);
   }

   // *** All the if statements in th functions below point to the need for some sort of team class ***
   private updateIsCheck(piece: Piece) {
      if (piece.color === 'white') {
         if (this.whitePieces.some(piece => this.isValidMove(this.blackKingLocation, piece))) {
            this.isCheck = true;
         }
      } else {
         if (this.blackPieces.some(piece => this.isValidMove(this.whiteKingLocation, piece))) {
            this.isCheck = true;
         }
      }
   }

   private updateKingLocationIfMoved(piece: Piece, moveLocation: Coordinate) {
      if(piece.pieceName !== Pieces.KING) return;

      if (piece.color === 'white') {
         this.whiteKingLocation = moveLocation;
      } else {
         this.blackKingLocation = moveLocation;
      }
   }

   private updatePieceLocation(moveLocation: Coordinate, piece: Piece) {
      this.pieces[moveLocation.x][moveLocation.y] = piece;
      this.pieces[piece.currentLocation.x][piece.currentLocation.y] = null;
      piece.setCurrentLocation(moveLocation);
   }

   private removePieceFromActivePieces(piece: Piece, occupyingPiece: Piece) {
      if (piece.color === 'white') {
         this.blackPieces = this.blackPieces.filter(piece => piece.uuid === occupyingPiece.uuid);
      } else {
         this.whitePieces = this.whitePieces.filter(piece => piece.uuid === occupyingPiece.uuid);
      }
   }
}