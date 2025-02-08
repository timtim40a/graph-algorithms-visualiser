import { GraphEdgeProps } from "@/app/types"

const AdjacencyListElement = (edge: GraphEdgeProps) => {

    return (
        <>
        <label key={"adj"+edge.sourceID+edge.targetID+console.timeStamp}>{edge.sourceID + " " + edge.targetID}</label>
        <br></br>
        </>
    )

}

export default AdjacencyListElement