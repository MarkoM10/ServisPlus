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
import { BASE_IP } from "../utils/utils";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

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
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(
    null
  );
  const insets = useSafeAreaInsets();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [form, setForm] = useState({
    make: "",
    model: "",
    year: "",
    mileage: "",
    image_url: "",
  });
  const fields = [
    { label: "Marka", key: "make" },
    { label: "Model", key: "model" },
    { label: "Godina proizvodnje", key: "year" },
    { label: "Kilometraža", key: "mileage" },
  ];

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(`http://${BASE_IP}:4000/vehicles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVehicles(res.data.vehicles);
    } catch (err) {
      console.error("Greška pri dohvatanju vozila:", err);
    }
  };

  const handleDeleteVehicle = async () => {
    const token = await AsyncStorage.getItem("token");
    await axios.delete(`http://${BASE_IP}:4000/vehicles/${selectedVehicleId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setConfirmVisible(false);
    fetchVehicles();
  };

  const handleAddVehicle = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      await axios.post(
        `http://${BASE_IP}:4000/vehicles`,
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
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Services", { vehicleId: item.id })}
      >
        <Text style={Typography.text}>
          {item.make} {item.model} ({item.year})
        </Text>
        <Text style={[Typography.text, { color: colors.muted }]}>
          Kilometraža: {item.mileage} km
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteIcon}
        onPress={() => {
          setSelectedVehicleId(item.id);
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

      <Modal visible={confirmVisible} transparent animationType="fade">
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmBox}>
            <Text style={[Typography.text, { color: colors.text }]}>
              Da li želite da obrišete ovo vozilo?
            </Text>
            <View style={styles.confirmActions}>
              <TouchableOpacity onPress={() => setConfirmVisible(false)}>
                <Text style={[Typography.link, { color: colors.accent }]}>
                  Otkaži
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeleteVehicle}>
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
          + Dodaj vozilo
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
            Novo vozilo
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
              keyboardType={
                key === "year" || key === "mileage" ? "numeric" : "default"
              }
            />
          ))}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleAddVehicle}
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
    top: 25,
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
