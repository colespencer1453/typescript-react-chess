import { Coordinate } from "./Coordinate";
import { Piece } from "./Piece";
import  { ChessKnight } from '@emotion-icons/fa-solid'
import { calculateAbsoluteSlope } from "../Utilities/ValidationUtilities";
import { Pieces } from "../Enums/Pieces";
import { Teams } from "../Enums/Teams";

export class Knight extends Piece{ 

    constructor(coordinate: Coordinate, team: Teams) {
        super(ChessKnight, coordinate, team, Pieces.KNIGHT);
    }

    isValidMove( moveLocation: Coordinate): boolean {
        return [2, 0.5].includes(calculateAbsoluteSlope(moveLocation, this.currentLocation)) &&
            (Math.abs(moveLocation.x - this.currentLocation.x) <= 2) &&
            (Math.abs(moveLocation.y - this.currentLocation.y) <= 2);
     }
}