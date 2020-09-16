import React, { useState, useEffect } from 'react'
import axios, { AxiosResponse } from 'axios'

import ListView from './components/ListView'

interface TreeNode {
    path: string,
    type: string,
    url: string
}


const App = () => {
    const [files, setFiles] = useState<string[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const commits: AxiosResponse<any> = await axios(
                'https://api.github.com/repos/ohtuprojekti-eficode/robot-test-files/commits'
            )
            const latestCommitTreeURL: string = commits.data[0].commit.tree.url
            const rootTreePromise: AxiosResponse<any> = await axios(latestCommitTreeURL)
            const rootTreeURL: string = rootTreePromise.data.url

            const getFiles = async (newUrl: string) => {
                const result: AxiosResponse<any> = await axios(newUrl)
                const tree: TreeNode[] = result.data.tree
                let filesToAdd: string[] = []
                let i: number;
                for (i = 0; i < tree.length; i++) {
                    if (tree[i].type === "blob") {
                        filesToAdd.push(tree[i].path)
                    } else if (tree[i].type === "tree") {
                        filesToAdd = filesToAdd.concat(await getFiles(tree[i].url))
                    }
                }
                return filesToAdd
            }

            const fullList: string[] = await getFiles(rootTreeURL)
            setFiles(fullList)
        }
        fetchData()
    }, [])

    return (
        <ListView files={files} />
    )
}

export default App
