import React from "react";
import { Container } from "react-bootstrap";

const scope = "playlist-modify-public";
const clientId = "eb5d23a5344c4b2d9aa3775ae3b3b929";
const redirectUri = "http://127.0.0.1:3000/callback";
const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
  redirectUri
)}&scope=${encodeURIComponent(scope)}&show_dialog=true`;

export default function Login() {
  return (
    <Container>
      <a className="btn btn-success btn-lg" href={authUrl}>
        Login with Spotify
      </a>
    </Container>
  );
}
