import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.js";
import { Profile } from "../models/profile.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK,
    },

    function (accessToken, refreshToken, profile, done) {
      User.findOne({ googleId: profile.id }, function (err, user) {
        if (err) return done(err);
        if (user) {
          return done(null, user);
        } else {
          console.log(profile.id);
          const newProfile = new Profile({
            name: profile.displayName,
            avatar: profile.photos[0].value,
            books: [],
          });
          const newUser = new User({
            email: profile.emails[0].value,
            googleId: profile.id,
            profile: newProfile._id,
          });
          newProfile.save(function (err) {
            if (err) return done(err);
          });
          newUser.save(function (err) {
            if (err) {
              Profile.findByIdAndDelete(newProfile._id);
              return done(err);
            }
            return done(null, newUser);
          });
        }
      });
    }
  )
);
//after user successfully authenticates using a credential
//a login session is established and session (cookie) stores user.id only
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// when the session is autuenticated, passport will call deserializedUser function
// to yield stored user.id
passport.deserializeUser(function (id, done) {
  User.findById(id)
    .populate("profile", "name avatar")
    .exec(function (err, user) {
      done(err, user);
    });
});
