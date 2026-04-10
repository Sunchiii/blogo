"use client";

import { useEffect, useState } from "react";

const TOKEN_KEY = "github_token";
const USERNAME_KEY = "github_username";
const CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;

export function useGitHubAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = sessionStorage.getItem(TOKEN_KEY);
    const storedUsername = sessionStorage.getItem(USERNAME_KEY);
    if (storedToken) setToken(storedToken);
    if (storedUsername) setUsername(storedUsername);
  }, []);

  function login() {
    if (!CLIENT_ID) {
      console.error("NEXT_PUBLIC_GITHUB_CLIENT_ID is not set");
      return;
    }
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      scope: "repo",
      redirect_uri: `${window.location.origin}/editor/auth/callback`,
    });
    window.location.href = `https://github.com/login/oauth/authorize?${params}`;
  }

  function logout() {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USERNAME_KEY);
    setToken(null);
    setUsername(null);
  }

  function saveToken(newToken: string, newUsername: string) {
    sessionStorage.setItem(TOKEN_KEY, newToken);
    sessionStorage.setItem(USERNAME_KEY, newUsername);
    setToken(newToken);
    setUsername(newUsername);
  }

  return {
    token,
    username,
    isAuthed: !!token,
    login,
    logout,
    saveToken,
  };
}
