import { useEffect, useState } from "react";
import BoardContainer from "./BoardComponents/BoardContainer";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Coordinate } from "./Pieces/Coordinate";
import { Piece } from "./Pieces/Piece";
import { initializeBoard } from './Utilities/GameSetupUtilities'
import { Pieces } from "./Enums/Pieces";
import { isValidMove, createCopyOfCurrentBoardAfterMove, getSubsetOfCoordinatesBetweenTwoPoints } from "./Utilities/ValidationUtilities";
import { Button, Container, Typography, Grid } from "@mui/material";
import ButtonAppBar from "./Views/ButtonAppBar";
import { v4 as uuidv4 } from 'uuid';
import { Teams } from "./Enums/Teams";
import { useSocket } from "./hooks/useSocket";

const Chess = (): JSX.Element => {
    const [board, setBoard] = useState(initializeBoard());
    const [isWhitesTurn, setIsWhitesTurn] = useState(true);
    const [isCheck, setIsCheck] = useState(false);
    const [isCheckMate, setIsCheckMate] = useState(false);
    const [winningTeam, setWinningTeam] = useState(Teams.UNDEFINED);
    const [teamInCheck, setTeamInCheck] = useState(Teams.UNDEFINED);
    const [gameId, setGameId] = useState(uuidv4());
    const socket = useSocket();
    const audio = new Audio('https://bigsoundbank.com/UPLOAD/mp3/0477.mp3')

    function handleIsValidMove(moveLocation: Coordinate, piece: Piece){
        if (!isValidMove(moveLocation, piece, board)) return false;

        const boardWithMoveExecuted = createCopyOfCurrentBoardAfterMove(moveLocation, piece, board);
        
        if(checkIfIsCheck(piece.team, boardWithMoveExecuted)) return false;

        return true;
    }

    const handlePieceMove = (moveLocation: Coordinate, piece: Piece, isSent: boolean): void => {
        if(!isSent) {
            socket.emit("MOVE", moveLocation, piece.currentLocation);
        }

        updatePieceLocation(moveLocation, piece);
        setIsWhitesTurn(prevState => !prevState);
        piece.setHasMovedToTrue();


        if(checkIfIsCheck(getOppositeTeam(piece.team), board)) {
            if(checkIfIsCheckMate(getOppositeTeam(piece.team))) {
                setIsCheckMate(true);
                setWinningTeam(piece.team);
            } 

            setTeamInCheck(getOppositeTeam(piece.team))
            setIsCheck(true);
        } else {
            setIsCheck(false);
        }
        
    }

    function checkIfIsCheckMate(teamToCheck: Teams) : boolean {
        const piecesOfAttackingTeam = getPiecesFromBoardByTeam(getOppositeTeam(teamToCheck), board);
        const piecesOfTeamInCheck = getPiecesFromBoardByTeam(teamToCheck, board);

        const checkedKing = getKingFromBoardByTeam(teamToCheck, board);
        const locationOfCheckedKing = checkedKing?.currentLocation as Coordinate

        const attackers = piecesOfAttackingTeam.filter(piece => isValidMove(locationOfCheckedKing, piece as Piece, board));

        return !checkedTeamCanBlockOrKillAttacker(attackers, locationOfCheckedKing, piecesOfTeamInCheck) && !kingCanEscape(checkedKing as Piece);
    }

    function checkedTeamCanBlockOrKillAttacker(attackers: (Piece | null)[], locationOfKing: Coordinate, piecesOfTeamInCheck: (Piece | null)[]) : boolean {
        if(attackers.length === 1) {
            const attackersLocation = attackers[0]?.currentLocation as Coordinate;
            
            return piecesOfTeamInCheck
                .some(piece => getSubsetOfCoordinatesBetweenTwoPoints(attackersLocation, locationOfKing).concat(attackersLocation)
                    .some(location => handleIsValidMove(location, piece as Piece)));
        }

        return false;
    }

    function kingCanEscape(checkedKing: Piece) : boolean {
        return locationsOnBoardAroundKing(checkedKing.currentLocation).some(location => handleIsValidMove(location, checkedKing));
    }

    function locationsOnBoardAroundKing(locationOfCheckedKing: Coordinate): Coordinate[] {        
        return getLocationOfKingsPeremiter(locationOfCheckedKing).filter(location => location.x <= 7 && location.x >=0 && location.y <= 7 && location.y >= 0);
    }

    function getLocationOfKingsPeremiter(locationOfCheckedKing: Coordinate) {
        let spacesToCheck = [];
        spacesToCheck.push(new Coordinate((locationOfCheckedKing.x + 1), locationOfCheckedKing.y));
        spacesToCheck.push(new Coordinate((locationOfCheckedKing.x + 1), (locationOfCheckedKing.y - 1)));
        spacesToCheck.push(new Coordinate((locationOfCheckedKing.x + 1), (locationOfCheckedKing.y + 1)));
        spacesToCheck.push(new Coordinate((locationOfCheckedKing.x - 1), locationOfCheckedKing.y));
        spacesToCheck.push(new Coordinate((locationOfCheckedKing.x - 1), (locationOfCheckedKing.y - 1)));
        spacesToCheck.push(new Coordinate((locationOfCheckedKing.x - 1), (locationOfCheckedKing.y + 1)));
        spacesToCheck.push(new Coordinate((locationOfCheckedKing.x), (locationOfCheckedKing.y + 1)));
        spacesToCheck.push(new Coordinate((locationOfCheckedKing.x), (locationOfCheckedKing.y - 1)));

        return spacesToCheck;
    }

    function checkIfIsCheck(team: Teams, boardToCheck: Array<Array<(Piece | null)>>) {
        const locationOfWhiteKing = getLocationOfKingByTeam(team, boardToCheck);

        return locationOfKingIsValidMoveForOpposingTeam(team, boardToCheck, locationOfWhiteKing);
    }

    function locationOfKingIsValidMoveForOpposingTeam(team: Teams, boardToCheck: (Piece | null)[][], locationOfWhiteKing: Coordinate | undefined) {
        return getPiecesFromBoardByTeam(getOppositeTeam(team), boardToCheck)
            .some(piece => isValidMove(locationOfWhiteKing as Coordinate, piece as Piece, boardToCheck));
    }

    function getOppositeTeam(team: Teams): Teams {
        return team === Teams.WHITE ? Teams.BLACK : Teams.WHITE;
    }

    function getPiecesFromBoardByTeam(team: Teams, boardToCheck: (Piece | null)[][]) {
        return boardToCheck.flat().filter(piece => piece?.team === team);
    }

    function getLocationOfKingByTeam(team: Teams, boardToCheck: Array<Array<(Piece | null)>>) {
        return boardToCheck.flat().find(piece => piece?.team === team && piece.pieceName === Pieces.KING)?.currentLocation;
    }

    function getKingFromBoardByTeam(team: Teams, boardToCheck: Array<Array<(Piece | null)>>) {
        return boardToCheck.flat().find(piece => piece?.team === team && piece.pieceName === Pieces.KING);
    }

    function updatePieceLocation(moveLocation: Coordinate, piece: Piece) {
        const pieceAtLocation = board[moveLocation.x][moveLocation.y];

        if(pieceAtLocation?.pieceName === Pieces.PAWN) audio.play();
        board[moveLocation.x][moveLocation.y] = piece;
        board[piece.currentLocation.x][piece.currentLocation.y] = null;
        setBoard([...board]);

        piece.setCurrentLocation(moveLocation);
    }

    const getHeaderText = () => {
        if(isCheckMate) {
            return `${winningTeam} Won! Click the button to play again!`;
        }

        if(isCheck) return `${teamInCheck} is in check`;

        return isWhitesTurn ? "White's turn" : "Black's turn"
    }

    const handleNewGameClick = () => {
        setBoard(initializeBoard());
        setIsWhitesTurn(true);
        setIsCheck(false);
        setIsCheckMate(false);
        setWinningTeam(Teams.UNDEFINED);
        setTeamInCheck(Teams.UNDEFINED);
        setGameId(uuidv4());
    }


    useEffect(() => {
        // as soon as the component is mounted, do the following tasks:
    
        // emit USER_ONLINE event
        socket.emit("joined", uuidv4()); 

        socket.on("MOVE", (moveLocation: Coordinate, currentLocation: Coordinate) => handlePieceMove(moveLocation, board[currentLocation.x][currentLocation.y] as Piece, true)); 
    
            
        return () => {
          // before the component is destroyed
          // unbind all event handlers used in this component
          socket.off("JOIN_REQUEST_ACCEPTED");
        };
      }, [socket]);

    return (
        <>
            <ButtonAppBar/>
            <Container >
                <Grid container justifyContent="center">
                    <Typography variant="h4" style={{marginTop:'5px', marginLeft:'5px'}}>
                        {getHeaderText()}
                    </Typography>
                </Grid>
                <div style={{marginTop:'10px'}}>
                    <DndProvider backend={HTML5Backend}>
                        <BoardContainer gameId={gameId} board={board} handlePieceMove={handlePieceMove} isValidMove={handleIsValidMove} isWhitesTurn={isWhitesTurn}/>
                    </DndProvider>
                </div>
                <Grid container justifyContent="center" style={{marginTop:'10px'}}>
                    <Button variant="contained" style={{backgroundColor:'green'}} onClick={handleNewGameClick}>
                        Start New Game
                    </Button>      
                </Grid>
            </Container>
        </>

    )
}

export default Chess