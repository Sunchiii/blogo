"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

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
    console.log("Login triggered, CLIENT_ID:", CLIENT_ID);
    if (!CLIENT_ID) {
      const msg = "NEXT_PUBLIC_GITHUB_CLIENT_ID is not set in environment variables.";
      console.error(msg);
      toast.error("Configuration Error", {
        description: msg,
      });
      return;
    }
    
    toast.info("Redirecting to GitHub...", {
      description: "Please wait while we connect to your account.",
    });

    const redirectUri = `${window.location.origin}/editor/auth/callback`;
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      scope: "repo",
      redirect_uri: redirectUri,
    });
    
    const url = `https://github.com/login/oauth/authorize?${params}`;
    console.log("Redirecting to GitHub:", url);
    window.location.href = url;
  }

  function logout() {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USERNAME_KEY);
    setToken(null);
    setUsername(null);
  }

  function saveToken(newToken: string, newUsername: string) {
    console.log("Saving token and username to sessionStorage:", newUsername);
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
