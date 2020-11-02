import React from 'react'
import { Link } from 'react-router-dom'
import { File } from '../types'
import BranchSelector from './BranchSelector'

interface PropsType {
  files: File[]
}

const ListView = ({ files }: PropsType) => {
  return (
    <div>
      <div className="branch-selector">
        <BranchSelector
          branches={[
            'master',
            'staging',
            'feature-branch-3',
            'feature-branch-whose-name-is-wayy-too-long',
          ]}
        />
      </div>
      <div className="file-listing">
        <h2>Files in the repository</h2>
        <ul>
          {files.map((e) => (
            <li key={e.name}>
              <Link to={`edit?q=${e.name}`}>{e.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ListView
