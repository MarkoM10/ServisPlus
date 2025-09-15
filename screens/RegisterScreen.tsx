import React, { useState } from "react";
import AuthForm from "../components/AuthForm";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_IP } from "../utils/utils";

export default function RegisterScreen() {
  const [message, setMessage] = useState("");
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [messageType, setMessageType] = useState<"success" | "error">("error");

  const handleRegister = async (email: string, password: string) => {
    setMessage("");

    try {
      const res = await fetch(`http://${BASE_IP}:4000/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Marko", email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Greška pri registraciji");

      await AsyncStorage.setItem("token", data.token);

      setMessage("Uspešno registrovan!");
      setMessageType("success");
      navigation.replace("Home");
    } catch (err: any) {
      setMessage(err.message);
      setMessageType("error");
    }
  };

  return (
    <AuthForm
      onSubmit={handleRegister}
      buttonLabel="Registruj se"
      message={message}
      messageType={messageType}
      footerText="Već imaš nalog?"
      footerLinkLabel="Prijavi se"
      onFooterPress={() => navigation.navigate("Login")}
    />
  );
}
