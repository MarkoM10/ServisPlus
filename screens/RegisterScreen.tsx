import React from "react";
import { Alert } from "react-native";
import AuthForm from "../components/AuthForm";

export default function RegisterScreen() {
  const handleRegister = async (email: string, password: string) => {
    try {
      const res = await fetch("http://192.168.8.130:4000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Marko", email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Greška pri registraciji");

      Alert.alert("Uspešno registrovan!", `Token: ${data.token}`);
    } catch (err: any) {
      Alert.alert("Greška", err.message);
    }
  };

  return <AuthForm onSubmit={handleRegister} buttonLabel="Registruj se" />;
}
