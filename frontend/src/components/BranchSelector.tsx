import React from 'react'

interface PropsType {
  branches: string[]
}

const BranchSelector = ({ branches }: PropsType) => {
  return (
    <div style={gridContainerStyle}>
      <h4>On branch:</h4>
      <select style={dropdownStyles}>
        {branches.map((branch) => (
          <option style={dropdownOptionStyles} key={branch}>
            {branch}
          </option>
        ))}
      </select>
    </div>
  )
}

const gridContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '0px 0.5em',
}

const dropdownStyles = {
  border: '0px',
  outline: '0px',
  width: '100%',
  fontSize: '1.6em',
  textOverflow: 'ellipsis',
  textAlignLast: 'right' as 'right',
  background: 'white',
}

const dropdownOptionStyles = {
  fontSize: '.9em',
  direction: 'rtl' as 'rtl',
}

export default BranchSelector
