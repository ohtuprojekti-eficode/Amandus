import React from 'react'
import { Link } from 'react-router-dom'

const ListView = ({ files }: any) => {
    return (
        <div>
            <h1>List of files in the repository</h1>
            <ul>
                {files.map((e: string) => (
                    <li key={e}>
                        <Link to={"/edit/" + e}>{e}</Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ListView
