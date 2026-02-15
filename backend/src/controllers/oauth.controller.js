const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User.model");
const jwt = require("jsonwebtoken");

// ✅ Helper function to generate short username
const generateUsername = (displayName) => {
  // Clean and shorten the name
  let username = displayName
    .replace(/[^a-zA-Z0-9]/g, "_") // Replace special chars with underscore
    .toLowerCase()
    .substring(0, 20); // Take first 20 characters only
  
  // Add random suffix to ensure uniqueness
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  
  return `${username}_${randomSuffix}`;
};

// Configure Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/oauth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            user.googleId = profile.id;
            user.isVerified = true;
            user.avatar = profile.photos[0]?.value;
            await user.save();
          } else {
            // ✅ Use helper function to generate short username
            const username = generateUsername(profile.displayName);
            
            user = await User.create({
              googleId: profile.id,
              username: username, // ✅ Now guaranteed to be under 30 chars
              email: profile.emails[0].value,
              isVerified: true,
              avatar: profile.photos[0]?.value,
            });
          }
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth callback
const googleCallback = (req, res) => {
  const token = jwt.sign(
    { userId: req.user._id, username: req.user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );

  res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}`);
};

module.exports = {
  googleCallback,
};