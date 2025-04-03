import React, { useEffect, useState } from 'react'
import '../styles/Header.css'
import GraphImportExport from './GraphImportExport'
import useGraphStore from '../store/useGraphStore'

type HeaderProps = {
  title: string
}

type ClickCoordinates = {
  x: number
  y: number
}

const useClickListener = (
  callback: (coords: ClickCoordinates) => void,
  isEnabled: boolean
) => {
  useEffect(() => {
    if (!isEnabled) return

    const handleClick = (event: MouseEvent) => {
      if (event.button === 0) {
        callback({ x: event.clientX, y: event.clientY })
      }
    }

    document.addEventListener('click', handleClick, true) // Capture phase ensures it runs before stopPropagation
    return () => document.removeEventListener('click', handleClick, true)
  }, [callback, isEnabled])
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const { currentInfoTooltip, setCurrentInfoTooltip } = useGraphStore()
  const [isInfoOn, setIsInfoOn] = useState<boolean>(false)

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu)
  }

  useClickListener(({ x, y }) => {
    const currentElement = document.elementFromPoint(x, y)?.className
    setCurrentInfoTooltip({
      x,
      y,
      header: currentElement ? currentElement : 'ERROR',
    })
  }, isInfoOn)

  const onInfoClick = () => {
    setIsInfoOn(true)
  }

  const onEscapeInfoClick = () => {
    setIsInfoOn(false)
    setCurrentInfoTooltip(undefined)
  }

  useEffect(() => {
    if (!isInfoOn) return

    const stopClickPropagation = (event: MouseEvent) => {
      const leaveButton = document.getElementById('leave-info-mode')

      if (leaveButton && leaveButton.contains(event.target as Node)) {
        return // Allow clicking the Leave Info-Mode button
      }

      event.stopPropagation() // Block all other clicks
      event.preventDefault() // Prevent default actions
    }

    document.addEventListener('click', stopClickPropagation, true) // Capture phase to block interactions
    return () =>
      document.removeEventListener('click', stopClickPropagation, true)
  }, [isInfoOn])

  return (
    <header className={isInfoOn ? 'header-info' : 'header'}>
      <nav className="nav">
        <label className="header-title">{title}</label>
        <ul className="nav-list">
          <li className="nav-item">
            <button className="nav-link" onClick={() => toggleDropdown('home')}>
              File
            </button>
            {openDropdown === 'home' && (
              <ul className="dropdown">
                <li>
                  <GraphImportExport />
                </li>
                <li>
                  <button>Settings</button>
                </li>
              </ul>
            )}
          </li>
          <li className="nav-item">
            <button
              className="nav-link"
              onClick={() => toggleDropdown('algorithms')}
            >
              Edit
            </button>
            {openDropdown === 'algorithms' && (
              <ul className="dropdown">
                <li>
                  <button>Sample graphs</button>
                </li>
                <li>
                  <button>Clear graph</button>
                </li>
                <li>
                  <button>Clear edges</button>
                </li>
              </ul>
            )}
          </li>
          <li className="nav-item">
            <button
              className="nav-link"
              onClick={() => toggleDropdown('about')}
            >
              Help
            </button>
            {openDropdown === 'about' && (
              <ul className="dropdown">
                <li>
                  <button>About project</button>
                </li>
                <li>
                  <button onClick={onInfoClick}>Info...</button>
                </li>
              </ul>
            )}
          </li>
          {isInfoOn ? (
            <li>
              <button className="nav-link">
                Select an item to get information about it
              </button>
              <button
                onClick={onEscapeInfoClick}
                id="leave-info-mode"
                className="nav-link"
              >
                <b>Leave Info-Mode</b>
              </button>
            </li>
          ) : null}
        </ul>
      </nav>
    </header>
  )
}

export default Header
