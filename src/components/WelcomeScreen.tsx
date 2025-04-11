import React, { useState } from 'react'
import '../styles/WelcomeScreen.css'

type Props = {
  onClose: () => void
}

const WelcomeScreen: React.FC<Props> = ({ onClose }) => {
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
    }, 300) // match this with your CSS transition duration
  }

  const welcomeClassName = 'welcome-screen' + (isClosing ? ' fade-out' : '')

  return (
    <div className={welcomeClassName}>
      <div className="welcome-content">
        <h1>Welcome to the Graph Algorithms Visualiser! 🎉</h1>
        <p>
          Things to know to get started:
          <ul>
            <li>
              You can switch to <b>Info Mode</b> by pressing <b>"I"</b> on your
              keyboard or through the "Help" section in the header. While in
              Info Mode you can click the elements on the screen to see their
              purpose or functionality.
            </li>
            <li>
              You start off in <b>View Mode</b>. You can switch to Edit Mode by
              pressing <b>"E"</b>, or the pencil-shaped button on the left-hand
              side to create a graph yourself.
            </li>
            <li>
              Alternatively you can <b>import</b> one of the sample graphs by
              following
              <b>"File -{'>'} Import Graph"</b>, then follwoing the path where
              your app is downloaded into. Find <b>"Samples"</b> folder and try
              playing around with the presets you will find there.
            </li>
            <li>
              The visualiser offers <b>7 different algorithms</b> to see in
              action as well as weight-randomization, switching graph's mode
              between directed and undirected, creating new nodes and edges, and
              controlling the algorithm's aimations.
            </li>
          </ul>
          Enjoy and explore!
        </p>
        <button onClick={handleClose}>Enter</button>
      </div>
    </div>
  )
}

export default WelcomeScreen
