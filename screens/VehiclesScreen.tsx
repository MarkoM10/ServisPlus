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
import { useNavigation } from "@react-navigation/native";
import { Typography } from "../styles/typography";
import colors from "../styles/colors";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/types";

interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  mileage?: number;
  image_url?: string;
}

const VehiclesScreen = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({
    make: "",
    model: "",
    year: "",
    mileage: "",
    image_url: "",
  });

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get("http://172.20.10.2:4000/vehicles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVehicles(res.data.vehicles);
    } catch (err) {
      console.error("Greška pri dohvatanju vozila:", err);
    }
  };

  const handleAddVehicle = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      await axios.post(
        "http://172.20.10.2:4000/vehicles",
        {
          make: form.make,
          model: form.model,
          year: parseInt(form.year),
          mileage: parseInt(form.mileage),
          image_url: form.image_url,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setModalVisible(false);
      setForm({ make: "", model: "", year: "", mileage: "", image_url: "" });
      fetchVehicles();
    } catch (err) {
      console.error("Greška pri dodavanju vozila:", err);
      Alert.alert("Greška", "Neuspešno dodavanje vozila.");
    }
  };

  const renderVehicle = ({ item }: { item: Vehicle }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("Servisi", { vehicleId: item.id })}
    >
      <Text style={Typography.text}>
        {item.make} {item.model} ({item.year})
      </Text>
      <Text style={[Typography.text, { color: colors.muted }]}>
        Kilometraža: {item.mileage} km
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screen}>
      <Text style={[Typography.title, { color: colors.card }]}>
        Moja vozila
      </Text>

      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderVehicle}
        ListEmptyComponent={
          <Text style={[Typography.text, { color: colors.muted }]}>
            Nema vozila.
          </Text>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={Typography.text}>+ Dodaj vozilo</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={[Typography.title, { color: colors.primary }]}>
            Novo vozilo
          </Text>
          {["make", "model", "year", "mileage", "image_url"].map((field) => (
            <TextInput
              key={field}
              placeholder={field.toUpperCase()}
              value={form[field as keyof typeof form]}
              onChangeText={(text) =>
                setForm((prev) => ({ ...prev, [field]: text }))
              }
              style={styles.input}
              placeholderTextColor={colors.muted}
              keyboardType={
                field === "year" || field === "mileage" ? "numeric" : "default"
              }
            />
          ))}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleAddVehicle}
          >
            <Text style={Typography.text}>Sačuvaj</Text>
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

export default VehiclesScreen;

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
    color: colors.primary,
  },
  addButton: {
    backgroundColor: colors.accent,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    color: colors.card,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: colors.primary,
    color: colors.card,
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
});
