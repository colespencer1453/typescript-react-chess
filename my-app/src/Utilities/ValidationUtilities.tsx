import { Pieces } from '../Enums/PieceEnum';
import { Coordinate } from '../Pieces/Coordinate'
import { Piece } from '../Pieces/Piece';

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

export const getSubsetOfPointsBetweenTwoPoints = (coordinate1: Coordinate, coordinate2: Coordinate): Array<Coordinate> => {
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

export function isValidMove(moveLocation: Coordinate, piece: Piece, board: Array<Array<(Piece | null)>>){
   if(!piece.isValidMove(moveLocation)) return false;

   const contentsOfMoveSquare = getPieceAtLocation(moveLocation);

   if(pieceAtMoveLocationIsSameTeam(contentsOfMoveSquare, piece)) return false;
   if(shouldDisablePawnAttackMove(moveLocation, piece, contentsOfMoveSquare)) return false;
   if(pieceIsBlockingMove(moveLocation, piece)) return false;

   // case 4 if moving team is in check the move must remove them from check

   return true;

   function getPieceAtLocation(location: Coordinate): (Piece | null){
      return board[location.x][location.y];
   }
   
   function pieceAtMoveLocationIsSameTeam(contentsOfMoveSquare: Piece | null, piece: Piece): boolean {
      return contentsOfMoveSquare !== null && piece.isSameTeam(contentsOfMoveSquare as Piece);
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
      const slope = calculateAbsoluteSlope(currentLocation, moveLocation);
   
      if(slope === Infinity) {
         return getSubsetOfPointsBetweenTwoPointsOnAVerticalLine(currentLocation, moveLocation)
            .map(point => getPieceAtLocation(point))
               .some(piece => piece !== null);
      }
   
      return getSubsetOfPointsBetweenTwoPoints(currentLocation, moveLocation)
         .map(point => getPieceAtLocation(point))
         .some(piece => piece !== null);
   }
}
