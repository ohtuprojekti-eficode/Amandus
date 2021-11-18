import User from '../src/model/user'

const register = async (username: string, email: string, password: string) => {
    try {
        const user = await User.registerAdmin({username, email, password})
        console.log("added user to database: ", user)
    }
    catch (e) {
        console.log(e)
    }
}

const username = process.argv[2]
const email = process.argv[3]
const password = process.argv[4]

if (!username  || !password || !email) {
    console.log("You need to provide non-empty username, email and password\nAborting")
} else {
    register(username, email, password)
}
