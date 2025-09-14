import React from "react";
import { Alert } from "react-native";
import AuthForm from "../components/AuthForm";

export default function LoginScreen() {
  const handleLogin = async (email: string, password: string) => {
    try {
      const res = await fetch("http://192.168.8.130:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Greška pri prijavi");

      Alert.alert("Uspešno prijavljen!", `Token: ${data.token}`);
      // TODO: Sačuvaj token u AsyncStorage
    } catch (err: any) {
      Alert.alert("Greška", err.message);
    }
  };

  return <AuthForm onSubmit={handleLogin} buttonLabel="Prijavi se" />;
}
