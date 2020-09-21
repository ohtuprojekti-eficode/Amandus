import React from 'react'
import { Link } from 'react-router-dom'

interface File {
    filename: string,
    content: string
}

interface Props {
    files: File[];
}

const ListView = ({ files }: Props) => {
    return (
        <div>
            <h1>List of files in the repository</h1>
            <ul>
                {files.map((e) => (
                    <li key={e.filename}>
                        <Link to={
                            `edit?q=${e.filename}`
                        }>{e.filename}</Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ListView
