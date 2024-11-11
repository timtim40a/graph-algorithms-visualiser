import React, { useState } from "react";
import "../styles/GameBox.css";
import { truncate } from "fs";

type GameBoxProps = {
    id: string
    row: number
    col: number
    selected: boolean
    onClick: any
    valueToSet?: string
}



const GameBox: React.FC<GameBoxProps> = ({id, row, col, selected, onClick, valueToSet = ""}) => {


    return (
        <div id={id} onClick={onClick}
             className={selected ? "game-box selected" : "game-box"}>
            {valueToSet}
        </div>
    )
}

export default GameBox