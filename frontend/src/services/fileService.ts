import axios, { AxiosResponse } from 'axios'

interface TreeNode {
    path: string,
    type: string,
    url: string
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
        let results: string[] = []
        let i: number;
        for (i = 0; i < tree.length; i++) {
            if (tree[i].type === "blob") {
                results.push(tree[i].path)
            } else if (tree[i].type === "tree") {
                results = results.concat(await getFileList(tree[i].url))
            }
        }
        return results
    }

    const rootTreeURL: string = await getRootTreeUrl()

    const fileList: string[] = await getFileList(rootTreeURL)
    
    return fileList
}