import React, { useState } from "react";
import AuthForm from "../components/AuthForm";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const [message, setMessage] = useState("");
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [messageType, setMessageType] = useState<"success" | "error">("error");

  const handleLogin = async (email: string, password: string) => {
    setMessage("");

    try {
      const res = await fetch("http://172.20.10.2:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Greška pri prijavi");

      await AsyncStorage.setItem("token", data.token);

      setMessage("Uspešno prijavljen!");
      setMessageType("success");

      navigation.replace("Home");
    } catch (err: any) {
      setMessage(err.message);
      setMessageType("error");
    }
  };

  return (
    <AuthForm
      onSubmit={handleLogin}
      buttonLabel="Prijavi se"
      message={message}
      messageType={messageType}
      footerText="Nemaš nalog?"
      footerLinkLabel="Registruj se"
      onFooterPress={() => navigation.navigate("Register")}
    />
  );
}
