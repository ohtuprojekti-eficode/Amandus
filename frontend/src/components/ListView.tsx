import React from 'react'
import { Link } from 'react-router-dom'
import { FileList } from '../types'

const ListView = ({ files }: FileList) => {
  return (
    <div>
      <h2>Files in the repository</h2>
      <ul>
        {files.map((e) => (
          <li key={e.name}>
            <Link to={`edit?q=${e.name}`}>{e.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ListView
