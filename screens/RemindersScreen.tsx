import React from "react";
import { View, Text, StyleSheet } from "react-native";

const RemindersScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Podsetnici</Text>
      {/* Ovde će ići lista reminder-a po servisnoj stavci */}
    </View>
  );
};

export default RemindersScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
});
