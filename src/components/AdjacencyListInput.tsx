import { ReactNode } from "react";
import { GraphEdgeProps } from "@/app/types"
import React from "react";

const AdjacencyListInput = () => {

    return (
        <div onClick={(event) => {
            event.stopPropagation()}}>
            <input className="adjacency-list-input" placeholder="Source node..."></input>
            <br></br>
            <input className="adjacency-list-input" placeholder="Target node..."></input>
        </div>
    )

}

export default AdjacencyListInput