import { Coordinate } from "./Coordinate";
import { Piece } from "./Piece";
import  { ChessKnight } from '@emotion-icons/fa-solid'
import { calculateAbsoluteSlope } from "../Utilities/ValidationUtilities";

export class Knight extends Piece{ 

    constructor(coordinate: Coordinate, color: string) {
        super(ChessKnight, coordinate, color);
    }

    isValidMove( moveLocation: Coordinate): boolean {
        return [2, 0.5].includes(calculateAbsoluteSlope(moveLocation, this.coordinate));
     }
}