import React, { useState } from "react";
import GameBox from "./GameBox";

import "../styles/GameBoard.css";

type GameBoardProps = {
    gameBoardHeight: number;
    gameBoardWidth: number;
}


let selectedRow: number;
let selectedCol: number;

const GameBoard: React.FC<GameBoardProps> = ({gameBoardHeight, gameBoardWidth}) => {
 
    let charEntered: string;
    const gridF = Array(gameBoardHeight).fill(null).map(() => Array(gameBoardWidth).fill(false));
    const valueGrid = Array(gameBoardHeight).fill(null).map(() => Array(gameBoardWidth).fill(""));

    const [grid, setGrid] = useState(
        Array(gameBoardHeight).fill(null).map(() => Array(gameBoardWidth).fill(false))
    )

    const handleBoxClick = (row: number, col: number) => {
        const newGrid = [...gridF]; //порожній грід
        if (!grid[row][col]) { //якщо бокс ще не обраний
            newGrid[row][col] = !newGrid[row][col]; // обираєм і потім зберігаєм
            selectedRow = row;
            selectedCol = col;
        } else {
            [selectedRow, selectedCol] = [NaN,NaN]
        }// інакше
        setGrid(newGrid); // просто зберігаєм порожній
    }
    
    const handleKeyInput = (e: any) => {
        let charPressed : string = String(e.code).charAt(5);
        if (!Number.isNaN(Number(charPressed))) {
            charEntered = charPressed;
            let element = document.getElementById(selectedRow + "-" + selectedCol)
            if (element) {
                element.innerText = charEntered
            }
        };
    }

    window.onkeydown = (e) => {handleKeyInput(e)}

    return (
        <div className="game-board-container">
            <div className="game-board">
                {grid.map((rowArray, row) => rowArray.map((selected, col) => (
                    <GameBox
                    id={`${row}-${col}`}
                    key={`${row}-${col}`}
                    row={row}
                    col={col}
                    selected={selected}
                    onClick={() => handleBoxClick(row, col)} // Handle click for each cell
                    />
                )))}
            </div>
        </div>
    )

}

export default GameBoard