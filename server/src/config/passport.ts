import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { User } from "../models/User.model";
import { AuthProviders } from "../utils/constants";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        if (!profile.emails || profile.emails.length === 0) {
          return done(
            new Error("No email address provided by Google."),
            undefined
          );
        }

        const existingUser = await User.findOne({
          email: profile.emails[0].value,
        });

        if (existingUser) {
          existingUser.googleId = profile.id;
          existingUser.username = profile.username || profile.displayName;
          existingUser.isVerified = true;
          existingUser.providers.push(AuthProviders.GOOGLE);

          await existingUser.save();

          return done(null, existingUser);
        }

        user = await User.create({
          username: profile.username || profile.displayName,
          email: profile.emails[0].value,
          isVerified: true,
          providers: [AuthProviders.GOOGLE],
          googleId: profile.id,
        });

        return done(null, user);
      } catch (error) {
        done(error, undefined);
      }
    }
  )
);

export default passport;
