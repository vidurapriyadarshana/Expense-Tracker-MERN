import passport from 'passport'
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20'
import User, { IUser } from '../models/user.model'
import env from './env.config'

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${env.SERVER_URL}/api/auth/google/callback`,
      scope: ['profile', 'email']
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: (error: Error | null, user?: IUser | false) => void
    ) => {
      try {
        const email = profile.emails?.[0]?.value
        const googleId = profile.id
        const fullName = profile.displayName || `${profile.name?.givenName || ''} ${profile.name?.familyName || ''}`.trim()
        const profileUrl = profile.photos?.[0]?.value || ''

        if (!email) {
          return done(new Error('No email found in Google profile'))
        }

        // Check if user already exists with this Google ID
        let user = await User.findOne({ googleId })

        if (user) {
          // User exists with Google ID, return them
          return done(null, user)
        }

        // Check if user exists with the same email (local account)
        user = await User.findOne({ email })

        if (user) {
          // Link Google account to existing local account
          user.googleId = googleId
          user.authProvider = 'google'
          if (!user.profileUrl && profileUrl) {
            user.profileUrl = profileUrl
          }
          await user.save()
          return done(null, user)
        }

        // Create new user with Google account
        user = await User.create({
          fullName,
          email,
          googleId,
          profileUrl,
          authProvider: 'google'
        })

        return done(null, user)
      } catch (error) {
        return done(error as Error)
      }
    }
  )
)

// Serialize user for session (we won't use sessions, but passport requires these)
passport.serializeUser((user, done) => {
  done(null, (user as IUser)._id)
})

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id)
    done(null, user)
  } catch (error) {
    done(error)
  }
})

export default passport
