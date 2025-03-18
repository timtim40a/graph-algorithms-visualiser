import { DistancesTableProps, SearchOrder } from "@/app/types"
import "@/styles/DistancesTable.css"

const DistancesTable: React.FC<DistancesTableProps> = ({distances, animationIndex}) => {

    if (!distances) {return null}
    const nodes = Array.from(distances[animationIndex].keys())
    const currentDistances = Array.from(distances[animationIndex].values());
    
    return (
        <>
        <div className="table">
            <div className="row-table">
                
                <label className="h-label-table">Node:</label>
                <>
                {nodes.map((node) => (
                    <label className="label-table">{node.toUpperCase()}</label>
                ))}
                </>
            </div>
            <br></br>
            <div className="row-table">
                <label className="h-label-table">Distance to:</label>
                <>
                {currentDistances.map((dist) => (
                    <label className="label-table">{dist === Infinity ? "∞" : dist}</label>
                ))}
                </>
            </div>
            </div>
        </>
    )
}

export default DistancesTable