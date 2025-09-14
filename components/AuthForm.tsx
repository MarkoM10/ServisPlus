import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import ActionButton from "./ActionButton";
import { Typography } from "../styles/typography";

type Props = {
  onSubmit: (email: string, password: string) => void;
  buttonLabel: string;
  message?: string;
  footerText?: string;
  footerLinkLabel?: string;
  onFooterPress?: () => void;
  messageType?: "success" | "error";
};

export default function AuthForm({
  onSubmit,
  buttonLabel,
  message,
  footerText,
  footerLinkLabel,
  onFooterPress,
  messageType = "error",
}: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.wrapper}>
      <View style={styles.form}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Lozinka"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />
        {message ? (
          <Text
            style={[
              styles.message,
              messageType === "success" ? styles.success : styles.error,
            ]}
          >
            {message}
          </Text>
        ) : null}

        <ActionButton
          label={buttonLabel}
          onPress={() => onSubmit(email, password)}
        />
        {footerText && footerLinkLabel && onFooterPress && (
          <Text style={styles.footer}>
            {footerText}{" "}
            <Text style={styles.link} onPress={onFooterPress}>
              {footerLinkLabel}
            </Text>
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#001F54",
  },
  form: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
    padding: 10,
    borderRadius: 4,
  },
  message: {
    fontFamily: "OpenSans_400Regular",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 12,
  },
  error: {
    color: "rgba(194, 61, 61, 1)",
  },
  success: {
    color: "#39b86eff",
  },

  footer: {
    marginTop: 16,
    textAlign: "center",
    color: "#555",
  },
  link: {
    color: "#E88630",
    fontWeight: "bold",
    fontFamily: Typography.text.fontFamily,
  },
  title: {
    fontFamily: Typography.title.fontFamily,
    fontSize: 24,
    color: "#fff",
  },
  text: {
    fontFamily: Typography.text.fontFamily,
    fontSize: 16,
    color: "#fff",
  },
});
