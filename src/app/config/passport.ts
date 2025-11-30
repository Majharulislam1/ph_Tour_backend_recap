
import passport from 'passport'
import { envVars } from './env'
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
passport.use(
     new GoogleStrategy({
          clientID:envVars.GOOGLE_CLIENT_ID,
          clientSecret:envVars.GOOGLE_CLIENT_SECRET,
          callBackURL:envVars.GOOGLE_CALLBACK_URL
     })
)