import React, { useState, useEffect } from 'react'
import axios, { AxiosResponse } from 'axios'
import {
    BrowserRouter as Router,
    Route,
    Link,
} from 'react-router-dom'

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
            const latestCommitMaster: AxiosResponse<any> = await axios(
                'https://api.github.com/repos/ohtuprojekti-eficode/robot-test-files/commits/master'
            )
            const latestCommitTreeURL: string = latestCommitMaster.data.commit.tree.url
            const rootTreeResponse: AxiosResponse<any> = await axios(latestCommitTreeURL)
            const rootTreeURL: string = rootTreeResponse.data.url

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

    const padding = {
        paddingRight: 5
    }

    return (
        <Router>
            <div>
                <Link style={padding} to="/">Main menu</Link>
                <Link style={padding} to="/filelist">File listing</Link>
                <Route exact path="/filelist" render={() => <ListView files={files} />} />
            </div>
        </Router>
    )
}

export default App
