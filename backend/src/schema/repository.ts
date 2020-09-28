import { GitError } from 'simple-git'
import { cloneRepository } from '../git'

const resolvers = {
  Query: {
    cloneRepository: async (): Promise<string> => {
      // do something here

      try {
        await cloneRepository(
          'https://github.com/ohtuprojekti-eficode/robot-test-files.git'
        )
        return 'Succesfully cloned repository'
      } catch (error) {
        if (error instanceof GitError) return 'Repository already cloned'
        return 'Error'
      }
    },
  },
}

export default {
  resolvers,
}
