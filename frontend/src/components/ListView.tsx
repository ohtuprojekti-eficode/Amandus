import React from 'react'
import { Link } from 'react-router-dom'

const ListView = ({ files }: any) => {
    
    return (
        <div>
            <h1>List of files in the repository</h1>
            <ul>
                {files.map((e: any) => (
                    <li key={e.url}>
                        <Link to={"/edit/" + e.filename}>{e.filename}</Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ListView
