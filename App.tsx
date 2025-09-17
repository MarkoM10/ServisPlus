import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import { useFonts, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { OpenSans_400Regular } from "@expo-google-fonts/open-sans";
import BottomTabs from "./navigation/BotomTabs";
import ReminderScreen from "./screens/ReminderScreen";
import ServicesScreen from "./screens/ServicesScreen";
import { useLocalNotifications } from "./utils/useLocalNotifications";

const Stack = createNativeStackNavigator();

export default function App() {
  const { notification } = useLocalNotifications();

  useEffect(() => {
    if (notification) {
      console.log("Primljena notifikacija:", notification.request.content);
    }
  }, [notification]);

  let [fontsLoaded] = useFonts({
    Poppins_700Bold,
    OpenSans_400Regular,
  });

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen
          name="Home"
          component={BottomTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Services" component={ServicesScreen} />
        <Stack.Screen name="Reminder" component={ReminderScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
