import { Coordinate } from "./Coordinate";
import { Piece } from "./Piece";
import  { ChessBishop } from '@emotion-icons/fa-solid'
import { calculateSlope } from "../Utilities/ValidationUtilities";
import { Pieces } from "../Enums/Pieces";
import { Teams } from "../Enums/Teams";

export class Bishop extends Piece{ 

   constructor(coordinate: Coordinate, team: Teams) {
      super(ChessBishop, coordinate, team, Pieces.BISHOP);
   }
   
   isValidMove( moveLocation: Coordinate): boolean {
      return Math.abs(calculateSlope(moveLocation, this.currentLocation)) === 1;
   }
}
