import { Coordinate } from '../Pieces/Coordinate'

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