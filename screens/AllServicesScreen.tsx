import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import colors from "../styles/colors";
import { Typography } from "../styles/typography";
import { BASE_IP } from "../utils/utils";

interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
}

interface Reminder {
  due_date?: string;
  due_mileage?: number;
}

interface ServiceItem {
  id: number;
  title: string;
  service_date: string;
  mileage_at_service?: number;
  cost?: number;
  vehicles: Vehicle;
  reminders: Reminder[];
}

const AllServicesScreen = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(`http://${BASE_IP}:4000/services`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(res.data.services || []);
    } catch (err) {
      console.error("Greška pri dohvatanju servisa:", err);
    }
  };

  const renderService = ({ item }: { item: ServiceItem }) => (
    <View style={styles.card}>
      <Text style={[Typography.text, { color: colors.text }]}>
        {item.vehicles.make} {item.vehicles.model} ({item.vehicles.year})
      </Text>
      <Text style={[Typography.text, { color: colors.muted }]}>
        Servis: {item.title}
      </Text>
      <Text style={[Typography.text, { color: colors.muted }]}>
        Datum: {item.service_date.slice(0, 10)}
      </Text>
      <Text style={[Typography.text, { color: colors.muted }]}>
        Kilometraža: {item.mileage_at_service} km
      </Text>
      {item.reminders.length > 0 && (
        <Text style={[Typography.text, { color: colors.accent }]}>
          Sledeći podsetnik: {item.reminders[0].due_date?.slice(0, 10)} /{" "}
          {item.reminders[0].due_mileage} km
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.screen}>
      <Text style={[Typography.title, { color: colors.card }]}>
        Moji servisi
      </Text>
      <FlatList
        data={services}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderService}
        ListEmptyComponent={
          <Text style={[Typography.text, { color: colors.muted }]}>
            Nema servisnih stavki.
          </Text>
        }
      />
    </View>
  );
};

export default AllServicesScreen;

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
