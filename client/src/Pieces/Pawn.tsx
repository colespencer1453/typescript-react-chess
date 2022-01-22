import { Coordinate } from "./Coordinate";
import { Piece } from "./Piece";
import { ChessPawn } from '@emotion-icons/fa-solid'
import { Pieces } from "../Enums/Pieces";
import { Teams } from "../Enums/Teams";
import { isDiagonalMove, isForwardsMove, moveIsInVeritcalRange, moveIsVerticallyForwards } from "../Utilities/ValidationUtilities";

export class Pawn extends Piece{ 
   constructor(startLocation: Coordinate, team: Teams) {
      super(ChessPawn, startLocation, team, Pieces.PAWN);
   }

   isValidMove(moveLocation: Coordinate): boolean {
      return this.isOpeningMove(moveLocation) || this.isNormalNonOpeningMove(moveLocation) || this.isAttackMove(moveLocation);
   }

   isNormalNonOpeningMove(moveLocation: Coordinate): boolean {
      return moveIsVerticallyForwards(moveLocation, this.currentLocation, this.team) && moveIsInVeritcalRange(moveLocation, this.currentLocation, 1, 2);
   }

   isOpeningMove(moveLocation: Coordinate): boolean {
      if (this.hasMoved) return false;
      
      return moveIsVerticallyForwards(moveLocation, this.currentLocation, this.team) && moveIsInVeritcalRange(moveLocation, this.currentLocation, 1, 3);
   }

   isAttackMove(moveLocation: Coordinate): boolean {
      return isDiagonalMove(moveLocation, this.currentLocation) && isForwardsMove(moveLocation, this.currentLocation, this.team) && moveIsInVeritcalRange(moveLocation, this.currentLocation, 1, 2);
   }
}
