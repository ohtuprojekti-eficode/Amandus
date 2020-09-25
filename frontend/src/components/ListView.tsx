import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState, RepoFile } from '../types'

const ListView = () => {
  const files = useSelector<RootState, RepoFile[]>(
    (state) => state.files.fileList
  )
  return (
    <div>
      <h2>Files in the repository</h2>
      <ul>
        {files.map((e) => (
          <li key={e.filename}>
            <Link to={`edit?q=${e.filename}`}>{e.filename}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ListView
