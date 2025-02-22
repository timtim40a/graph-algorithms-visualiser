import { GraphEdgeProps } from "@/app/types"

const AdjacencyListElement = (edge: GraphEdgeProps) => {

    return (
        <>
        <label key={"adj"+edge.sourceID+edge.targetID+console.timeStamp}>{edge.sourceID + " " + edge.targetID}</label>
        <input key={"adi"+edge.sourceID+edge.targetID+console.timeStamp} id={"adi"+edge.sourceID+edge.targetID}></input>
        <br></br>
        </>
    )

}

export default AdjacencyListElement