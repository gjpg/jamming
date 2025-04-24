import React, { useState, useEffect } from "react";
import axios from "axios";

export default function useAuth(code) {
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [expiresIn, setExpiresIn] = useState();

  useEffect(() => {
    if (!code) return;

    axios
      .post(
        "http://localhost:3001/login",
        { code },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 5000,
        }
      )
      .then((res) => {
        console.log("Full response:", res);
        // Verify response structure matches what server sends
        if (res.data && res.data.accessToken) {
          setAccessToken(res.data.accessToken);
          setRefreshToken(res.data.refreshToken);
          setExpiresIn(res.data.expiresIn);
          window.history.pushState({}, null, "/");
        }
      })
      .catch((err) => {
        console.error("Full error details:", {
          message: err.message,
          code: err.code,
          config: err.config,
          response: err.response,
        });
        window.location = "/";
      });
  }, [code]);

  useEffect(() => {
    if (!refreshToken || !expiresIn) return;
    const interval = setInterval(() => {
      axios
        .post(
          "http://localhost:3001/refresh",
          { refreshToken },
          { withCredentials: true }
        )
        .then((res) => {
          setAccessToken(res.data.accessToken);
          setExpiresIn(res.data.expiresIn);
        })
        .catch(() => {
          window.location = "/";
        });
    }, (expiresIn - 60) * 1000);
    return () => clearInterval(interval);
  }, [refreshToken, expiresIn]);

  return accessToken;
}
