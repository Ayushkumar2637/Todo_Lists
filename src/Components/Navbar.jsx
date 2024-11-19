import React from 'react'
import '../ComponentCss/Navbar.css';
import '../Utitity/Utilities.css'

const Navbar = () => {
  return (
    <nav>
      <ul className='flex'>
        <div className='first flex'>
        <li>TODO</li>
        </div>
        <div className='second flex'>
        <li>Home</li>
        <li>About US</li>
        </div>
      </ul>
    </nav>
  )
}

export default Navbar
