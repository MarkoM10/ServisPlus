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
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import * as Notifications from "expo-notifications";

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
  const fields = [
    { label: "Naziv podsetnika", key: "title" },
    { label: "Datum isteka", key: "due_date" },
    { label: "Kilometraža", key: "due_mileage" },
  ];
  const [selectedReminderId, setSelectedReminderId] = useState<number | null>(
    null
  );
  const [confirmVisible, setConfirmVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({
    due_date: "",
    due_mileage: "",
  });

  useEffect(() => {
    fetchReminders();
  }, []);

  enum SchedulableTriggerInputTypes {
    TIME_INTERVAL = "timeInterval",
    DAILY = "daily",
    DATE = "date",
  }

  const sendImmediateReminder = async (title: string, dueDate: string) => {
    const now = new Date();
    const target = new Date(dueDate);

    const diffInMs = target.getTime() - now.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    let message = "";

    if (diffInDays === 0) {
      message = `Danas je vreme za: ${title}`;
    } else if (diffInDays > 0) {
      message = `Za ${diffInDays} dana treba da odradiš: ${title}`;
    } else {
      message = `Servis "${title}" je već prošao.`;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🔧 Servisni podsetnik",
        body: message,
        sound: "default",
      },
      trigger: {
        type: SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
        repeats: false,
      },
    });
  };

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

  const handleDeleteReminder = async () => {
    const token = await AsyncStorage.getItem("token");
    await axios.delete(
      `http://${BASE_IP}:4000/reminders/${selectedReminderId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setConfirmVisible(false);
    fetchReminders();
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

      await sendImmediateReminder("Mali servis", form.due_date);

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
      <TouchableOpacity
        style={styles.deleteIcon}
        onPress={() => {
          setSelectedReminderId(item.id);
          setConfirmVisible(true);
        }}
      >
        <Ionicons name="trash-outline" size={20} color={colors.error} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView
      style={[
        styles.screen,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
      edges={["top", "bottom"]}
    >
      <Text
        style={[Typography.title, { color: colors.card, paddingBottom: 16 }]}
      >
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

      <Modal visible={confirmVisible} transparent animationType="fade">
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmBox}>
            <Text style={[Typography.text, { color: colors.text }]}>
              Da li želite da obrišete ovaj podsetnik?
            </Text>
            <View style={styles.confirmActions}>
              <TouchableOpacity onPress={() => setConfirmVisible(false)}>
                <Text style={[Typography.link, { color: colors.accent }]}>
                  Otkaži
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeleteReminder}>
                <Text style={[Typography.link, { color: colors.error }]}>
                  Obriši
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
          <Text
            style={[
              Typography.title,
              { color: colors.card, paddingBottom: 16 },
            ]}
          >
            Novi podsetnik
          </Text>
          {fields.map(({ label, key }) => (
            <TextInput
              key={key}
              placeholder={label.toUpperCase()}
              value={form[key as keyof typeof form]}
              onChangeText={(text) =>
                setForm((prev) => ({ ...prev, [key]: text }))
              }
              style={styles.input}
              placeholderTextColor={colors.muted}
              keyboardType={key === "due_mileage" ? "numeric" : "default"}
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
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={styles.cancelButton}
          >
            <Text style={[Typography.link, { color: colors.accent }]}>
              Otkaži
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
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
    color: colors.card,
  },
  cancelButton: {
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
    alignItems: "center",
    color: colors.accent,
  },
  deleteIcon: {
    position: "absolute",
    top: 35,
    right: 10,
  },
  confirmOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  confirmBox: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  confirmActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
    gap: 10,
  },
});
