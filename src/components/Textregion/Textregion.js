import React from 'react'
import './Textregion.css'
const Textregion = ({isOpen}) => {
  return (
    <>
    <div className='navbar'><h3>ParaBot</h3></div>
    <div className={`para ${isOpen ? 'textarea-left' : ''}`}>Paragraph</div>  
      <div className={`text--area ${isOpen ? 'textarea-left':''}`}>
        <textarea></textarea>
    </div>
    </>
  )
}

export default Textregion