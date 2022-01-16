import  {Coordinate} from './Coordinate';
import { v4 as uuidv4 } from 'uuid';

export abstract class Piece { 
    icon: JSX.Element;
    coordinate: Coordinate;
    color: string;
    uuid: string;

    constructor(icon: any, coordinate: Coordinate, color: string){
        this.icon = icon;
        this.coordinate = coordinate;
        this.color = color;
        this.uuid = uuidv4();
    }

    setCoordinate(x: number, y: number){
        this.coordinate.x = x;
        this.coordinate.y = y;
    }

    abstract isValidMove( moveLocation: Coordinate): boolean;
}