import { Coordinate } from './Coordinate';
import { Pieces } from '../Enums/Pieces';
import { v4 as uuidv4 } from 'uuid';
import { Teams } from '../Enums/Teams';

export abstract class Piece { 
    pieceName: Pieces
    currentLocation: Coordinate;
    team: Teams;
    icon: any;
    uuid: string;
    hasMoved: boolean;

    constructor(icon: any, coordinate: Coordinate, team: Teams, pieceName : Pieces ){
        this.pieceName = pieceName;
        this.currentLocation = coordinate;
        this.team = team;
        this.icon = icon;
        this.uuid = uuidv4();
        this.hasMoved = false;
    }

    setCurrentLocation(newLocation: Coordinate){
        this.currentLocation = newLocation;
    }

    setHasMoved(hasMoved: boolean) {
        this.hasMoved = hasMoved;
    }

    isSameTeam(piece: Piece): boolean {
        return this.team === piece.team;
    }

    abstract isValidMove( moveLocation: Coordinate): boolean;
}