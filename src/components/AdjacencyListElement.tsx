import { AdjacencyListElementProps, GraphEdgeProps } from '@/app/types'
import '../styles/AdjacencyListElement.css'
import useGraphStore from '@/store/useGraphStore'
import React, { useState } from 'react'

const AdjacencyListElement: React.FC<AdjacencyListElementProps> = ({
  edge,
  editMode = false,
}) => {
  const { removeEdge, alterEdge } = useGraphStore()
  const [weight, setWeight] = useState<number>(edge.weight)

  const handleWeightButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    alterEdge(edge.id, { weight: weight })
  }

  const handleDeleteButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    removeEdge(edge.id)
  }

  const handleAdjInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWeight(Number(e.target.value))
  }

  const handleAdjInputSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') alterEdge(edge.id, { weight: weight })
  }

  const handleSwapDirection = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    e.stopPropagation()
    const tempID = edge.sourceID
    alterEdge(edge.id, { sourceID: edge.targetID })
    alterEdge(edge.id, { targetID: tempID })
  }

  return (
    <>
      <div className="adj-element">
        <label
          key={'adj' + edge.id.slice(1) + console.timeStamp}
          className={'adj-element-label'}
        >
          {edge.id.slice(1)}
        </label>
        {editMode ? (
          <>
            <input
              key={'adi' + edge.id.slice(1) + console.timeStamp}
              id={'adi' + edge.id.slice(1)}
              className="adj-element-input"
              placeholder={String(edge.weight)}
              type="number"
              onChange={(e) => handleAdjInputChange(e)}
              onKeyDown={(e) => handleAdjInputSubmit(e)}
              onClick={(e) => e.stopPropagation()}
            ></input>
            <button
              key={'adbw' + edge.id.slice(1) + console.timeStamp}
              id={'adbw' + edge.id.slice(1)}
              className="adj-element-button weight"
              onClick={(e) => handleWeightButtonClick(e)}
            >
              W
            </button>
            <button
              key={'adbD' + edge.id.slice(1) + console.timeStamp}
              id={'adbD' + edge.id.slice(1)}
              className="adj-element-button direction"
              onClick={(e) => handleSwapDirection(e)}
            >
              ↔
            </button>
            <button
              key={'adbd' + edge.id.slice(1) + console.timeStamp}
              id={'adbd' + edge.id.slice(1)}
              className="adj-element-button delete"
              onClick={(e) => handleDeleteButtonClick(e)}
            >
              <img
                src="/delete.png"
                alt="Delete"
                className="icon delete-edge"
              />
            </button>
          </>
        ) : null}
      </div>
    </>
  )
}

export default AdjacencyListElement
