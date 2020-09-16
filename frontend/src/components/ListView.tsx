import React from 'react'

// copypaste
interface TreeNode {
    path: string,
    type: string,
    url: string
}

interface Props {
    files: TreeNode[]
}

const ListView = ({ files }: Props) => {
    return (
        <div>
            <h1>List of files in the repository</h1>
            <ul>
                {files.map((e: TreeNode) => (
                    <li key={e.url}><a href={e.url}>{e.path}</a></li>
                ))}
            </ul>
        </div>
    )
}

export default ListView
