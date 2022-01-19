import { Coordinate } from "./Coordinate";
import { Piece } from "./Piece";
import  { ChessKing } from '@emotion-icons/fa-solid'
import { Pieces } from "../Enums/PieceEnum";

export class King extends Piece{ 

   static whiteCastleLeftMove = new Coordinate(7,2);
   static whiteCastleRightMove = new Coordinate(7,6);
   static blackCastleLeftMove = new Coordinate(0,2);
   static blackCastleRightMove = new Coordinate(0,6);
   static possibleWhiteCastleMoves = [King.whiteCastleLeftMove, King.whiteCastleRightMove];
   static possibleBlackCastleMoves = [King.blackCastleLeftMove, King.blackCastleRightMove];

   constructor(coordinate: Coordinate, color: string) {
      super(ChessKing, coordinate, color, Pieces.KING);
   }
   
   isValidMove( moveLocation: Coordinate): boolean {
      let isNormalMove = [this.currentLocation.x + 1, this.currentLocation.x - 1, this.currentLocation.x].includes(moveLocation.x)
      && [this.currentLocation.y + 1, this.currentLocation.y - 1, this.currentLocation.y].includes(moveLocation.y)
      && !moveLocation.equals(this.currentLocation);

      return isNormalMove || this.isCastlingMove(moveLocation);
   }

   isCastlingMove(moveLocation: Coordinate): boolean {
      let whiteIsTryingToCastle = (
         this.hasMoved === false &&
         this.color === 'white' && 
         King.possibleWhiteCastleMoves.some(pos => pos.equals(moveLocation))
      )
      let blackIsTryingToCastle = (
         this.hasMoved === false &&
         this.color === 'black' && 
         King.possibleBlackCastleMoves.some(pos => pos.equals(moveLocation))
      )
      return whiteIsTryingToCastle || blackIsTryingToCastle;
   }
}
