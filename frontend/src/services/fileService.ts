import axios, { AxiosResponse } from 'axios'

interface TreeNode {
    path: string,
    type: string,
    url: string
}

interface File {
    filename: string,
    url: string
    content: string
}

const getRootTreeUrl = async () => {
    const latestCommitMaster: AxiosResponse<any> = await axios(
        'https://api.github.com/repos/ohtuprojekti-eficode/robot-test-files/commits/master'
    )
    const latestCommitTreeURL: string = latestCommitMaster.data.commit.tree.url
    const rootTreeResponse: AxiosResponse<any> = await axios(latestCommitTreeURL)
    const rootTreeURL: string = rootTreeResponse.data.url
    return rootTreeURL
}

export const getFiles = async () => {
    
    const getFileList = async (newUrl: string) => {
        const result: AxiosResponse<any> = await axios(newUrl)
        const tree: TreeNode[] = result.data.tree
        let results: File[] = []
        let i: number;
        for (i = 0; i < tree.length; i++) {
            if (tree[i].type === "blob") {
                const content: string = await getFileContent(tree[i].url)
                await results.push({ filename: tree[i].path, url: tree[i].url, content: content })
            } else if (tree[i].type === "tree") {
                results = results.concat(await getFileList(tree[i].url))
            }
        }
        return results
    }

    const rootTreeURL: string = await getRootTreeUrl()

    const fileList: File[] = await getFileList(rootTreeURL)
    
    return fileList
}

export const getFileContent = async (contentUrl: string) => {
    const response: AxiosResponse<any> = await axios(contentUrl)
    const content: string = atob(response.data.content)
    return content
}