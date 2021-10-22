import User from '../src/model/user'

const register = async (username: string, email: string, password: string) => {
    try {
        await User.registerAdmin({username, email, password})
    }
    catch (e) {
        console.log(e)
    }
}

const username = process.argv[2]
const email = process.argv[3]
const password = process.argv[4]

if (!username  || !password || !email) {
    throw new Error()
}
register(username, email, password)