"use client";

import { useCallback, useEffect, useState } from "react";

const TOKEN_KEY = "github_token";
const USERNAME_KEY = "github_username";
export const OAUTH_STATE_KEY = "github_oauth_state";
const CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;

function createOAuthState() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function useGitHubAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = sessionStorage.getItem(TOKEN_KEY);
    const storedUsername = sessionStorage.getItem(USERNAME_KEY);
    if (storedToken) setToken(storedToken);
    if (storedUsername) setUsername(storedUsername);
  }, []);

  const login = useCallback(() => {
    if (!CLIENT_ID) {
      console.error("NEXT_PUBLIC_GITHUB_CLIENT_ID is not set");
      return;
    }
    const state = createOAuthState();
    sessionStorage.setItem(OAUTH_STATE_KEY, state);

    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      scope: "repo",
      redirect_uri: `${window.location.origin}/editor/auth/callback`,
      state,
    });
    window.location.href = `https://github.com/login/oauth/authorize?${params}`;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USERNAME_KEY);
    sessionStorage.removeItem(OAUTH_STATE_KEY);
    setToken(null);
    setUsername(null);
  }, []);

  const saveToken = useCallback((newToken: string, newUsername: string) => {
    sessionStorage.setItem(TOKEN_KEY, newToken);
    sessionStorage.setItem(USERNAME_KEY, newUsername);
    sessionStorage.removeItem(OAUTH_STATE_KEY);
    setToken(newToken);
    setUsername(newUsername);
  }, []);

  return {
    token,
    username,
    isAuthed: !!token,
    login,
    logout,
    saveToken,
  };
}
