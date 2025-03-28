import { DistancesTableProps, SearchOrder } from '@/app/types'
import '@/styles/DistancesTable.css'
import useGraphStore from '@/store/useGraphStore'

const DistancesTable: React.FC<DistancesTableProps> = ({
  distances,
  animationIndex,
  heuristics,
}) => {
  const { nodes } = useGraphStore()

  if (!distances && !heuristics) {
    return null
  }
  const currentDistances = distances
    ? Array.from(distances[animationIndex].values())
    : null

  return (
    <>
      <div className="table">
        <div className="row-table">
          <label className="h-label-table">Node:</label>
          <>
            {nodes.map((node) => (
              <label className="label-table">{node.id.toUpperCase()}</label>
            ))}
          </>
        </div>
        {currentDistances ? (
          <>
            <div className="row-table">
              <label className="h-label-table">Distance from source:</label>
              <>
                {currentDistances.map((dist) => (
                  <label className="label-table">
                    {dist === Infinity ? '∞' : dist}
                  </label>
                ))}
              </>
            </div>
          </>
        ) : null}
        {heuristics ? (
          <>
            <div className="row-table">
              <label className="h-label-table">
                Euclidean {'\n'} Distance to target:
              </label>
              <>
                {nodes.map((node) => (
                  <label className="label-table">
                    {heuristics.get(node.id)}
                  </label>
                ))}
              </>
            </div>
          </>
        ) : null}
      </div>
    </>
  )
}

export default DistancesTable
