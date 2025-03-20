import { DistancesTableProps, SearchOrder } from "@/app/types"
import "@/styles/DistancesTable.css"

const DistancesTable: React.FC<DistancesTableProps> = ({distances, animationIndex, heuristics}) => {

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
            {heuristics ?
                <>
                    <br></br>
                    <div className="row-table">
                        <label className="h-label-table">Euclidean {'\n'} Distance to:</label>
                        <>
                        {nodes.map((node) => (
                            <label className="label-table">{heuristics.get(node)}</label>
                        ))}
                        </>
                    </div>
                </>
            : null}
            </div>
        </>
    )
}

export default DistancesTable