import { AdjacencyListElementProps, GraphEdgeProps } from "@/app/types"
import "../styles/AdjacencyListElement.css"
import useGraphStore from "@/store/useGraphStore"
import React, { useState } from "react"

const AdjacencyListElement:React.FC<AdjacencyListElementProps> = ({edge, editMode = false}) => {

    const {alterEdge} = useGraphStore();
    const [weight, setWeight] = useState<number>(edge.weight)

    const handleAdjButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        alterEdge(edge.id, {weight:weight})
    }

    const handleAdjInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWeight(Number(e.target.value))
    }

    const handleAdjInputSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") alterEdge(edge.id, {weight:weight})
    }

    return (
        <>
            <label key={"adj"+edge.sourceID+edge.targetID+console.timeStamp}>
                {edge.sourceID + " " + edge.targetID}
            </label>
            {editMode ? (<>
                <input  key={"adi"+edge.sourceID+edge.targetID+console.timeStamp} 
                        id={"adi"+edge.sourceID+edge.targetID} 
                        className="adinput"
                        type="number"
                        onChange={(e) => handleAdjInputChange(e)}
                        onKeyDown={(e) => handleAdjInputSubmit(e)}
                        onClick={(e) => e.stopPropagation()}>
                </input>
                <button key={"adb"+edge.sourceID+edge.targetID+console.timeStamp} 
                        id={"adb"+edge.sourceID+edge.targetID}
                        onClick={(e) => handleAdjButtonClick(e)}>
                            Change W
                </button>
            </>) : null}
            <br></br>
        </>
    )

}

export default AdjacencyListElement