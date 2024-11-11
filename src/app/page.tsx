"use client";

import GameBoard from "@/components/GameBoard";

export default function Home() {
    function handleClick(event: React.MouseEvent<HTMLButtonElement>): void {
        event.preventDefault();
    }

    return (<>
        <GameBoard gameBoardHeight={9} gameBoardWidth={9}></GameBoard>
    </>)
}