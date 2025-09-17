import React, { useCallback, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import colors from "../styles/colors";
import { Typography } from "../styles/typography";
import { BASE_IP } from "../utils/utils";
import { useFocusEffect } from "@react-navigation/native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
}

interface ServiceItem {
  id: number;
  title: string;
  service_date: string;
  vehicles: Vehicle;
}

interface Reminder {
  id: number;
  due_date?: string;
  due_mileage?: number;
  service_items: ServiceItem;
}

const AllRemindersScreen = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const insets = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      fetchReminders();
    }, [])
  );

  const fetchReminders = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(`http://${BASE_IP}:4000/reminders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReminders(res.data.reminders || []);
    } catch (err) {
      console.error("Greška pri dohvatanju podsetnika:", err);
    }
  };

  const renderReminder = ({ item }: { item: Reminder }) => (
    <View style={styles.card}>
      <Text style={[Typography.text, { color: colors.text }]}>
        {item.service_items.vehicles.make} {item.service_items.vehicles.model} (
        {item.service_items.vehicles.year})
      </Text>
      <Text style={[Typography.text, { color: colors.muted }]}>
        Servis: {item.service_items.title}
      </Text>
      <Text style={[Typography.text, { color: colors.muted }]}>
        Podsetnik: {item.due_date?.slice(0, 10)} / {item.due_mileage} km
      </Text>
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
        Moji podsetnici
      </Text>
      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderReminder}
        ListEmptyComponent={
          <Text style={[Typography.text, { color: colors.muted }]}>
            Nema podsetnika.
          </Text>
        }
      />
    </SafeAreaView>
  );
};

export default AllRemindersScreen;

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
});
