const bodyParser = require("body-parser");
const SpotifyWebApi = require("spotify-web-api-node");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

// Enhanced CORS configuration
const corsOptions = {
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  methods: ["POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: true,
};

// Apply CORS middleware
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests

// Add basic root route for testing
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Environment Validation
const requiredEnvVars = [
  "SPOTIFY_CLIENT_ID",
  "SPOTIFY_CLIENT_SECRET",
  "REDIRECT_URI",
];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingVars.join(", ")}`
  );
}

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;

app.use(bodyParser.json());

app.post("/refresh", (req, res) => {
  if (!req.body.refreshToken) {
    return res.status(400).json({ error: "Refresh token is required" });
  }
  const refreshToken = req.body.refreshToken;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: redirect_uri,
    clientId: client_id,
    clientSecret: client_secret,
    refreshToken,
  });

  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      res.json({
        accessToken: data.body.accessToken,
        expiresIn: data.body.expiresIn,
      });
    })
    .catch((err) => {
      console.log("Error:", err.message); // More detailed error
      res.status(400).json({ error: err.message });
    });
});

app.post("/login", (req, res) => {
  if (!req.body.code) {
    return res.status(400).json({ error: "Authorization code is required" });
  }

  const spotifyApi = new SpotifyWebApi({
    redirectUri: redirect_uri,
    clientId: client_id,
    clientSecret: client_secret,
  });

  spotifyApi
    .authorizationCodeGrant(req.body.code)
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      console.error("Login error:", err);
      res.status(400).json({ error: err.message });
    });
});

app.listen(3001, () => {
  console.log("Server running on port 3001 with CORS enabled");
});
