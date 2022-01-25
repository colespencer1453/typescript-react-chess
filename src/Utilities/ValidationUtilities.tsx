import { Pieces } from '../Enums/Pieces';
import { Coordinate } from '../Pieces/Coordinate'
import { Piece } from '../Pieces/Piece';
import { cloneDeep, inRange } from 'lodash';
import { King } from '../Pieces/King';
import { absoluteValueDiff, diff } from './MathUtilities';
import { Teams } from '../Enums/Teams';

export const calculateSlope = (coordinate1: Coordinate, coordinate2: Coordinate): number => {
   const rise = coordinate2.y - coordinate1.y;
   const run = coordinate2.x - coordinate1.x;

   return rise/run;
}

export const calculateAbsoluteSlope = (coordinate1: Coordinate, coordinate2: Coordinate): number => {
   const rise = coordinate2.y - coordinate1.y;
   const run = coordinate2.x - coordinate1.x;

   return Math.abs(rise/run);
}

const createLineFunction = (coordinate1: Coordinate, coordinate2: Coordinate): Function => {
   const slope = calculateSlope(coordinate1, coordinate2);

   const b = coordinate1.y - (slope*coordinate1.x);

   return function(x: number) {
      const y = (slope * x) + b;
      return new Coordinate(x, y);
   }
}

export const getSubsetOfCoordinatesBetweenTwoPoints = (coordinate1: Coordinate, coordinate2: Coordinate): Array<Coordinate> => {
   const slope = calculateAbsoluteSlope(coordinate1, coordinate2);

   if(slope === Infinity) {
      return getSubsetOfPointsBetweenTwoPointsOnAVerticalLine(coordinate1, coordinate2);
   }

   return getSubsetOfPointsBetweenTwoPointsOnLinearFunction(coordinate1, coordinate2);
}

export const getSubsetOfPointsBetweenTwoPointsOnLinearFunction = (coordinate1: Coordinate, coordinate2: Coordinate): Array<Coordinate> => {
   let subset = [];

   const lineFunction = createLineFunction(coordinate1, coordinate2);

   const max = Math.max(coordinate1.x, coordinate2.x);

   const min = Math.min(coordinate1.x, coordinate2.x);

   for(let i = min + 1; i < max; i++){
      subset.push(lineFunction(i));
   }

   return subset;
}

export const getSubsetOfPointsBetweenTwoPointsOnAVerticalLine = (coordinate1: Coordinate, coordinate2: Coordinate): Array<Coordinate> => {
   let subset = []

   const x = coordinate1.x;

   const max = Math.max(coordinate1.y, coordinate2.y);

   const min = Math.min(coordinate1.y, coordinate2.y);

   for(let i = min+1; i<max; i++){
      subset.push(new Coordinate(x, i));
   }

   return subset;
}

export function checkIfIsCheck(team: Teams, boardToCheck: Array<Array<(Piece | null)>>) {
   const locationOfKing = getLocationOfKingByTeam(team, boardToCheck);

   return locationCanBeCaptured(team, boardToCheck, locationOfKing);
}

export function getLocationOfKingByTeam(team: Teams, boardToCheck: Array<Array<(Piece | null)>>) {
   return boardToCheck.flat().find(piece => piece?.team === team && piece.pieceName === Pieces.KING)?.currentLocation;
}

export function locationCanBeCaptured(team: Teams, boardToCheck: (Piece | null)[][], location: Coordinate | undefined) {
   return getPiecesFromBoardByTeam(getOppositeColor(team), boardToCheck)
       .some(piece => isValidMove(location as Coordinate, piece as Piece, boardToCheck));
}

export function getPiecesFromBoardByTeam(team: Teams, boardToCheck: (Piece | null)[][]) {
   return boardToCheck.flat().filter(piece => piece?.team === team);
}

export function getOppositeColor(team: Teams): Teams {
   return team === Teams.WHITE ? Teams.BLACK : Teams.WHITE;
}

export function getCorrespondingRook(moveLocation: Coordinate, board: Array<Array<(Piece | null)>>) : Piece | null {
   if (moveLocation.equals(King.whiteCastleLeftMove)) {
      return board[7][0];
   } else if (moveLocation.equals(King.whiteCastleRightMove)) {
      return board[7][7];
   } else if (moveLocation.equals(King.blackCastleLeftMove)) {
      return board[0][0];
   } else if (moveLocation.equals(King.blackCastleRightMove)) {
      return board[0][7];
   }
   return null
}

export function isValidMove(
   moveLocation: Coordinate, 
   piece: Piece, 
   board: Array<Array<(Piece | null)>>,
){
   if(!piece.isValidMove(moveLocation)) return false;

   const contentsOfMoveSquare = getPieceAtLocation(moveLocation);

   if(pieceAtMoveLocationIsSameTeam(contentsOfMoveSquare, piece)) return false;
   if(shouldDisablePawnAttackMove(moveLocation, piece, contentsOfMoveSquare)) return false;
   if(shouldDisablePawnForwardMove(moveLocation, piece, contentsOfMoveSquare)) return false;
   if(pieceIsBlockingMove(moveLocation, piece)) return false;
   if(isInvalidCastlingMove(moveLocation, piece, board)) return false;

   return true;

   function getPieceAtLocation(location: Coordinate): (Piece | null){
      return board[location.x][location.y];
   }
   
   function pieceAtMoveLocationIsSameTeam(contentsOfMoveSquare: Piece | null, piece: Piece): boolean {
      return contentsOfMoveSquare !== null && piece.isSameTeam(contentsOfMoveSquare as Piece);
   }

   function shouldDisablePawnForwardMove(moveLocation: Coordinate, piece: Piece, contentsOfMoveSquare: Piece | null): boolean {
      if(piece.pieceName !== Pieces.PAWN) return false;

      if((contentsOfMoveSquare !== null) && moveLocation.y === piece.currentLocation.y) return true;

      return false;
   }
   
   function shouldDisablePawnAttackMove(moveLocation: Coordinate, piece: Piece, contentsOfMoveSquare: Piece | null): boolean {
      if(piece.pieceName !== Pieces.PAWN) return false;
   
      return pawnCanAttack(moveLocation, piece, contentsOfMoveSquare);
   }
   
   function pawnCanAttack(moveLocation: Coordinate, piece: Piece, contentsOfMoveSquare: Piece | null): boolean {
      return (calculateAbsoluteSlope(moveLocation, piece.currentLocation) === 1 && contentsOfMoveSquare === null);
   }
   
   function pieceIsBlockingMove(moveLocation: Coordinate, piece: Piece): boolean {
      if(piece.pieceName === Pieces.KNIGHT) return false;
   
      return pieceExistsBetweenTwoPoints(piece.currentLocation, moveLocation);
   }
   
   function pieceExistsBetweenTwoPoints(currentLocation: Coordinate, moveLocation: Coordinate) : boolean {
      return getSubsetOfCoordinatesBetweenTwoPoints(currentLocation, moveLocation)
               .map(point => getPieceAtLocation(point))
                  .some(piece => piece !== null);      
   }

   /*  
      castling is only possible if neither the king nor the rook has moved
      there must not be any pieces between the king and the rook
      the king may not be in check
      the square the king goes to and any intervening squares may not be under attack
      */
   function isInvalidCastlingMove(moveLocation: Coordinate, piece: Piece, board: Array<Array<(Piece | null)>>) : boolean {
      if (piece.pieceName !== Pieces.KING) return false;
      if (!(piece as King).isCastlingMove(moveLocation)) return false;

      let correspondingRook: Piece | null = getCorrespondingRook(moveLocation, board);

      if (correspondingRook) {
         console.log(`rook: ${correspondingRook.currentLocation.x} ${correspondingRook.currentLocation.y}`)
      }

      if (!correspondingRook || correspondingRook.pieceName !== Pieces.ROOK || correspondingRook.team !== piece.team || correspondingRook.hasMoved) {
         return true;
      }

      // TODO: implement check for the king may not be in check
      if (checkIfIsCheck(piece.team, board)) {
         return true;
      }

      console.log(`check: ${piece.team}`)

      // TODO: the square the king goes to and any intervening squares may not be under attack
      let moveDiff = moveLocation.y - piece.currentLocation.y;
      for (let i = 0; i < Math.abs(moveDiff); i += 1) {
         console.log(`underattack: ${moveLocation.y} to ${piece.currentLocation.y}`)
         if (locationCanBeCaptured(piece.team, board, new Coordinate(piece.currentLocation.x, piece.currentLocation.y + (i * Math.sign(moveDiff))))){
            return true;
         }
      }

      return false;
   }

}

export function createCopyOfCurrentBoardAfterMove(moveLocation: Coordinate, piece: Piece, board: Array<Array<(Piece | null)>>): Array<Array<(Piece | null)>> {
   let boardCopy = [...board.map(row => [...row.map(piece => piece === null ? null : cloneDeep(piece))])];

   const pieceCopy = cloneDeep(piece);
   boardCopy[moveLocation.x][moveLocation.y] = pieceCopy;
   boardCopy[piece.currentLocation.x][piece.currentLocation.y] = null;
   pieceCopy.setCurrentLocation(moveLocation);

   return boardCopy;
}

export const moveIsInVeritcalRange = (moveLocation: Coordinate, currentLocation: Coordinate, start: number, end: number) => {
   return inRange(absoluteValueDiff(moveLocation.x,  currentLocation.x), start, end);
}

export const moveIsInHorizontalRange = (moveLocation: Coordinate, currentLocation: Coordinate) => {

}

export const moveIsVerticallyForwards = (moveLocation: Coordinate, currentLocation: Coordinate, team: Teams) => {
   
   return isVerticalMove(moveLocation, currentLocation) && isForwardsMove(moveLocation, currentLocation, team);
}

export const isVerticalMove = (moveLocation: Coordinate, currentLocation: Coordinate) => {
   return moveLocation.y === currentLocation.y && moveLocation.x !== currentLocation.x;
}

export const isHorizontalMove = (moveLocation: Coordinate, currentLocation: Coordinate) => {
   return moveLocation.x === currentLocation.x && moveLocation.y !== currentLocation.y;
}

export const isForwardsMove = (moveLocation: Coordinate, currentLocation: Coordinate, team: Teams) => {
   return team === Teams.BLACK ? diff(moveLocation.x, currentLocation.x) > 0 : diff(moveLocation.x, currentLocation.x) < 0;
}

export const isDiagonalMove = (moveLocation: Coordinate, currentLocation: Coordinate) => {
   return calculateAbsoluteSlope(moveLocation, currentLocation) === 1;
}