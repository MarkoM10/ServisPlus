import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";

type Props = {
  onSubmit: (email: string, password: string) => void;
  buttonLabel: string;
};

export default function AuthForm({ onSubmit, buttonLabel }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
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
      <Button title={buttonLabel} onPress={() => onSubmit(email, password)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
    padding: 10,
    borderRadius: 4,
  },
});
