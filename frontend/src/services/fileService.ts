import axios from 'axios'
import { RepoFile } from '../types'

interface TreeNode {
  path: string
  type: string
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
  const fileList: RepoFile[] = await Promise.all(
    result.data.tree
      .filter((e: TreeNode) => e.type === 'blob')
      .map(async (e: TreeNode) => {
        return {
          filename: e.path,
          content: await getFileContent(e.url),
        }
      })
  )
  return fileList
}

export const getFileContent = async (contentUrl: string) => {
  const response = await axios(contentUrl)
  const content: string = atob(response.data.content)
  return content
}
