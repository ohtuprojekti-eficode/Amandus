import passport from 'passport'
import passportGitHub from 'passport-github'

import config from './config'

import User, { UserType } from '../types/user'

const GithubStrategy = passportGitHub.Strategy

passport.serializeUser<UserType, unknown>((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((obj, done) => {
  // test see: https://github.com/passport/express-4.x-facebook-example/blob/master/server.js
  done(null, obj)

  // example for mongodb
  // User.findById(id, (err, user) => {
  //     done(err, user);
  // });
})

passport.use(
  new GithubStrategy(
    {
      clientID: config.GITHUB_CLIENT_ID || '',
      clientSecret: config.GITHUB_CLIENT_SECRET || '',
      callbackURL: '/auth/github/callback', // url in frontend, best to use a constant here
    },
    (_accessToken, _refreshToken, profile, cb) => {
      let match = User.getUserByGithubId(profile.id)
      if (!match) {
        const user: UserType = {
          gitHubid: profile.id,
          username: profile.username ? profile.username : '',
          emails: profile.emails
            ? profile.emails.map((email) => email.value)
            : [],
        }
        User.addUser(user)
        match = user
      }

      return cb(undefined, match)

      // example for mongodb
      // User.findOrCreate({ githubId: profile.id }, function (err, user) {
      //   return cb(err, user);
      // })
    }
  )
)

export default passport
