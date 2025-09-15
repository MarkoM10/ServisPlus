import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRoute, useNavigation } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/types";
import colors from "../styles/colors";
import { Typography } from "../styles/typography";
import { BASE_IP } from "../utils/utils";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type ServicesRouteProp = RouteProp<RootStackParamList, "Services">;

interface ServiceItem {
  id: number;
  title: string;
  description?: string;
  service_date: string;
  mileage_at_service?: number;
  cost?: number;
}

const ServicesScreen = () => {
  const route = useRoute<ServicesRouteProp>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { vehicleId } = route.params;

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    service_date: "",
    mileage_at_service: "",
    cost: "",
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(
        `http://${BASE_IP}:4000/vehicles/${vehicleId}/services`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setServices(res.data.services);
    } catch (err) {
      console.error("Greška pri dohvatanju servisa:", err);
    }
  };

  const handleAddService = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      await axios.post(
        `http://${BASE_IP}:4000/vehicles/${vehicleId}/services`,
        {
          title: form.title,
          description: form.description,
          service_date: form.service_date,
          mileage_at_service: parseInt(form.mileage_at_service),
          cost: parseFloat(form.cost),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setModalVisible(false);
      setForm({
        title: "",
        description: "",
        service_date: "",
        mileage_at_service: "",
        cost: "",
      });
      fetchServices();
    } catch (err) {
      console.error("Greška pri dodavanju servisa:", err);
      Alert.alert("Greška", "Neuspešno dodavanje servisne stavke.");
    }
  };

  const renderService = ({ item }: { item: ServiceItem }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("Reminder", { serviceItemId: item.id })
      }
    >
      <Text style={[Typography.text, { color: colors.text }]}>
        {item.title}
      </Text>
      <Text style={[Typography.text, { color: colors.muted }]}>
        Datum: {item.service_date}
      </Text>
      <Text style={[Typography.text, { color: colors.muted }]}>
        Kilometraža: {item.mileage_at_service} km
      </Text>
      {item.cost && (
        <Text style={[Typography.text, { color: colors.muted }]}>
          Cena: {item.cost} RSD
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.screen}>
      <Text style={[Typography.title, { color: "#fff" }]}>Servisne stavke</Text>

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

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[Typography.text, { color: "#fff" }]}>+ Dodaj servis</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={[Typography.title, { color: colors.card }]}>
            Nova servisna stavka
          </Text>
          {[
            "Naslov servisa",
            "Opis",
            "Datum servisa",
            "Kilometraža prilikom servisa",
            "Cena",
          ].map((field) => (
            <TextInput
              key={field}
              placeholder={field.toUpperCase()}
              value={form[field as keyof typeof form]}
              onChangeText={(text) =>
                setForm((prev) => ({ ...prev, [field]: text }))
              }
              style={[styles.card, Typography.text]}
              placeholderTextColor={colors.muted}
              keyboardType={
                field === "mileage_at_service" || field === "cost"
                  ? "numeric"
                  : "default"
              }
            />
          ))}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleAddService}
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
    </View>
  );
};

export default ServicesScreen;

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
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
    marginBottom: 12,
    borderRadius: 6,
    fontFamily: "OpenSans_400Regular",
    fontSize: 16,
    color: colors.text,
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
});
