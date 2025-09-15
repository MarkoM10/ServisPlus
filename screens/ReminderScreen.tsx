import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  FlatList,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/types";
import colors from "../styles/colors";
import { Typography } from "../styles/typography";
import { BASE_IP } from "../utils/utils";

type ReminderRouteProp = RouteProp<RootStackParamList, "Reminder">;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Reminder {
  id: number;
  due_date?: string;
  due_mileage?: number;
  notified?: boolean;
}

const ReminderScreen = () => {
  const route = useRoute<ReminderRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { serviceItemId } = route.params;

  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({
    due_date: "",
    due_mileage: "",
  });

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(
        `http://${BASE_IP}:4000/services/${serviceItemId}/reminders`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReminders(res.data.reminders || []);
    } catch (err) {
      console.error("Greška pri dohvatanju podsetnika:", err);
    }
  };

  const handleSaveReminder = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      await axios.post(
        `http://${BASE_IP}:4000/services/${serviceItemId}/reminders`,
        {
          due_date: form.due_date,
          due_mileage: parseInt(form.due_mileage),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setForm({ due_date: "", due_mileage: "" });
      setModalVisible(false);
      Alert.alert("Uspeh", "Podsetnik je sačuvan.");
      fetchReminders();
    } catch (err) {
      console.error("Greška pri čuvanju podsetnika:", err);
      Alert.alert("Greška", "Neuspešno čuvanje podsetnika.");
    }
  };

  const renderReminder = ({ item }: { item: Reminder }) => (
    <View style={styles.card}>
      <Text style={[Typography.text, { color: colors.text }]}>
        Datum: {item.due_date?.slice(0, 10)}
      </Text>
      <Text style={[Typography.text, { color: colors.text }]}>
        Kilometraža: {item.due_mileage} km
      </Text>
      <Text style={[Typography.text, { color: colors.text }]}>
        Status: {item.notified ? "Poslato" : "Čeka"}
      </Text>
    </View>
  );

  return (
    <View style={styles.screen}>
      <Text style={[Typography.title, { color: colors.card }]}>
        Podsetnici za servis
      </Text>

      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderReminder}
        ListEmptyComponent={
          <Text style={[Typography.text, { color: colors.muted }]}>
            Nema podsetnika za ovaj servis.
          </Text>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[Typography.text, { color: colors.card }]}>
          + Dodaj podsetnik
        </Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={[Typography.title, { color: colors.primary }]}>
            Novi podsetnik
          </Text>
          {["due_date", "due_mileage"].map((field) => (
            <TextInput
              key={field}
              placeholder={field.toUpperCase()}
              value={form[field as keyof typeof form]}
              onChangeText={(text) =>
                setForm((prev) => ({ ...prev, [field]: text }))
              }
              style={styles.input}
              placeholderTextColor={colors.muted}
              keyboardType={field === "due_mileage" ? "numeric" : "default"}
            />
          ))}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveReminder}
          >
            <Text style={[Typography.text, { color: colors.card }]}>
              Sačuvaj
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text
              style={[
                Typography.link,
                { textAlign: "center", color: colors.card },
              ]}
            >
              Otkaži
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default ReminderScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.primary,
  },
  card: {
    backgroundColor: colors.card,
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  addButton: {
    backgroundColor: colors.accent,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
  input: {
    borderWidth: 2,
    borderColor: colors.card,
    padding: 10,
    marginBottom: 12,
    borderRadius: 6,
    fontFamily: "OpenSans_400Regular",
    fontSize: 16,
    color: colors.card,
  },
  saveButton: {
    backgroundColor: colors.accent,
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
    alignItems: "center",
  },
});
