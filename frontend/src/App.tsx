import React, { useState, useEffect } from 'react'
import axios from 'axios'

import ListView from './components/ListView'

interface Tree {
    path: string
}

const App = () => {
    const [files, setFiles] = useState<string[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const commits = await axios(
                'https://api.github.com/repos/ohtuprojekti-eficode/robot-test-files/commits'
            )

            const commitTreeURL: string = commits.data[0].commit.tree.url

            const filelist = await axios(commitTreeURL)
            setFiles(filelist.data.tree.map((e: Tree) => e.path))
        }
        fetchData()
    }, [])

    return (
        <div>
            {files.map((e) => (
                <li key={e}>{e}</li>
            ))}
        </div>
    )
}

export default App
