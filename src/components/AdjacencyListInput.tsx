import { ReactNode } from "react";
import { GraphEdgeProps } from "@/app/types"
import React from "react";

const AdjacencyListInput = () => {

    return (
        <div onClick={(event) => {
            event.stopPropagation()}}>
            <input className="adjacency-list-input" placeholder="Search by node..."></input>
            <br></br>
        </div>
    )

}

export default AdjacencyListInput