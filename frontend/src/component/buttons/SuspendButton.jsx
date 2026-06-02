import React from 'react'
import { MdBlock } from 'react-icons/md'

const SuspendButton = ({ onClick }) => {
  return (
    <MdBlock
      onClick={onClick}
      style={{ backgroundColor: 'red', cursor: 'pointer', fontSize: '1.5rem', padding: '4px', color: 'white', borderRadius: '6px' }}
    />
  )
}

export default SuspendButton
