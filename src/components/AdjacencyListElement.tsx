import { GraphEdgeProps } from "@/app/types"

const AdjacencyListElement = (edge: GraphEdgeProps) => {

    return (
        <>
        <label key={"p"+edge.sourceID+edge.targetID}>{edge.sourceID + " " + edge.targetID}</label>
        <br></br>
        </>
    )

}

export default AdjacencyListElement