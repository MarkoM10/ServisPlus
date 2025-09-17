import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import VehiclesScreen from "../screens/VehiclesScreen";
import AllServicesScreen from "../screens/AllServicesScreen";
import AllRemindersScreen from "../screens/AllRemindersScreen";
import colors from "../styles/colors";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.primary,
          borderTopColor: "transparent",
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: "#fff",
        tabBarLabelStyle: {
          fontFamily: "OpenSans_400Regular",
          fontSize: 12,
        },
      }}
    >
      <Tab.Screen
        name="Vozila"
        component={VehiclesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="car" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Servisi"
        component={AllServicesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="tools" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Podsetnici"
        component={AllRemindersScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" size={size} color={color} />
          ),
        }}
      />
      {/* <Tab.Screen
        name="Notifikacija"
        component={NotificationTestScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>🔔</Text>
          ),
        }}
      /> */}
    </Tab.Navigator>
  );
}
