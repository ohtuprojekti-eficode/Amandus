import axios from 'axios'

interface TreeNode {
    path: string,
    type: string,
    url: string
}

const getRootTreeUrl = async () => {
    const latestCommitMaster = await axios(
        'https://api.github.com/repos/ohtuprojekti-eficode/robot-test-files/commits/master'
    )
    const latestCommitTreeURL: string = latestCommitMaster.data.commit.tree.url
    const rootTreeResponse = await axios(latestCommitTreeURL)
    const rootTreeURL: string = rootTreeResponse.data.url
    return rootTreeURL
}

export const getFiles = async () => {
    const rootTreeURL: string = await getRootTreeUrl()
    const result = await axios(rootTreeURL, { params: { recursive: 1 } })
    const gitTree: TreeNode[] = result.data.tree
        .filter((e: TreeNode) => e.type === "blob")
        .map((e: TreeNode) => {
            return {
                path: e.path,
                type: e.type,
                url: e.url
            }
        })
    return gitTree
}