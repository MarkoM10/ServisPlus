import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import VehiclesScreen from "../screens/VehiclesScreen";
import ServicesScreen from "../screens/ServicesScreen";
import RemindersScreen from "../screens/RemindersScreen";
import { FaCar, FaTools, FaBell } from "react-icons/fa";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#007bff",
        tabBarInactiveTintColor: "#888",
        tabBarStyle: { backgroundColor: "#f8f8f8" },
      }}
    >
      <Tab.Screen
        name="Vozila"
        component={VehiclesScreen}
        options={{
          tabBarIcon: ({ color, size }) => <FaCar color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Servisi"
        component={ServicesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FaTools color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Podsetnici"
        component={RemindersScreen}
        options={{
          tabBarIcon: ({ color, size }) => <FaBell color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}
