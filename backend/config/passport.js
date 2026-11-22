const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const crypto = require("crypto");

const User = require("../models/User");
const StoreConfig = require("../models/StoreConfig");

// Generate a unique username
async function generateUsername(name, email) {
    const baseName = (name || email.split("@")[0])
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .slice(0, 20) || "user";

    let username;

    do {
        const suffix = crypto.randomBytes(3).toString("hex");
        username = `${baseName}${suffix}`;
    } while (await User.exists({ username }));

    return username;
}

// Create default store
async function createDefaultStore(user) {
    const existingStore = await StoreConfig.findOne({
        userId: user._id,
    });

    if (existingStore) return existingStore;

    return StoreConfig.create({
        userId: user._id,
        storeName: `${user.name}'s Store`.slice(0, 80),
        storeEmail: user.email,
        templateId: "default",
    });
}

// Register Google Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },

        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value?.toLowerCase();

                const emailVerified =
                    profile._json?.email_verified === true;

                if (!email || !emailVerified) {
                    return done(null, false, {
                        message: "A verified Google email is required.",
                    });
                }

                // Check existing user
                let user = await User.findOne({ email });

                if (user) {
                    // Check Google account linking
                    if (user.googleId && user.googleId !== profile.id) {
                        return done(null, false);
                    }

                    // Link Google to existing account
                    if (!user.googleId) {
                        user.googleId = profile.id;
                        await user.save();
                    }

                    // Ensure default store exists
                    await createDefaultStore(user);

                    return done(null, user);
                }

                // Register new Google user
                const name =
                    profile.displayName || email.split("@")[0];

                const username = await generateUsername(name, email);

                user = await User.create({
                    name,
                    username,
                    email,
                    googleId: profile.id,
                });

                try {
                    // Create user's default store
                    await StoreConfig.create({
                        userId: user._id,
                        storeName: `${name}'s Store`.slice(0, 80),
                        storeEmail: email,
                        templateId: "default",
                    });
                } catch (storeError) {
                    await User.deleteOne({ _id: user._id });
                    throw storeError;
                }

                return done(null, user);

            } catch (error) {
                console.error("Google authentication error:", error);
                return done(error, null);
            }
        }
    )
);

console.log(
    "Google Strategy Registered:",
    Boolean(passport._strategies.google)
);

module.exports = passport;