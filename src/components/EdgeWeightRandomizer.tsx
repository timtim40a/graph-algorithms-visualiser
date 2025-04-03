import useGraphStore from '@/store/useGraphStore'
import { useState } from 'react'
import '../styles/EdgeWeightRandomizer.css'

const EdgeWeightRandomizer: React.FC = () => {
  const { edges, alterEdge } = useGraphStore()
  const [maxRandomEdgeWeight, setMaxRandomEdgeWeight] = useState<number>(10)
  const [minRandomEdgeWeight, setMinRandomEdgeWeight] = useState<number>(1)

  const getRandomInt = (min: number, max: number): number => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  const randomiseEdgeWeights = (e: any) => {
    e.stopPropagation()
    edges.forEach((edge) =>
      alterEdge(edge.id, {
        weight: getRandomInt(minRandomEdgeWeight, maxRandomEdgeWeight),
      })
    )
  }

  const handleMaxRandomInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMaxRandomEdgeWeight(Number(e.target.value))
  }

  const handleMinRandomInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMinRandomEdgeWeight(Number(e.target.value))
  }

  return (
    <>
      <button onClick={(e) => randomiseEdgeWeights(e)}>Rand-Weights</button>
      <input
        key={'maxrandinput'}
        id={'max-weight-input'}
        className="random-weight max"
        placeholder={'Max: ' + String(maxRandomEdgeWeight)}
        type="number"
        onChange={(e) => handleMaxRandomInputChange(e)}
        onClick={(e) => e.stopPropagation()}
      ></input>
      <input
        key={'minrandinput'}
        id={'min-weight-input'}
        className="random-weight min"
        placeholder={'Min: ' + String(minRandomEdgeWeight)}
        type="number"
        onChange={(e) => handleMinRandomInputChange(e)}
        onClick={(e) => e.stopPropagation()}
      ></input>
    </>
  )
}

export default EdgeWeightRandomizer
