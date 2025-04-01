import React, { useState } from 'react'
import '../styles/Header.css'
import GraphImportExport from './GraphImportExport'

type HeaderProps = {
  title: string
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu)
  }

  return (
    <header className="header">
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
                  <button>Info...</button>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
