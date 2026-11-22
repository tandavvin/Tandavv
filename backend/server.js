// server.js 

const dotenv = require("dotenv");
const dns = require("dns");

// Load environment variables first (other modules read process.env)
dotenv.config({ quiet: true });

const connectDB = require("./config/db");

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 16) {
  console.error("JWT_SECRET is missing or too short. Set a long random value in backend/.env");
  process.exit(1);
}
if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is missing. Set it in backend/.env");
  process.exit(1);
}

// Force Node.js to use reliable public DNS servers (helps with MongoDB Atlas SRV lookups)
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const app = require("./app");
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
