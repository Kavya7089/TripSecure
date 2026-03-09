// App.js
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./src/screens/Auth/LoginScreen";
import RegisterScreen from "./src/screens/Auth/RegisterScreen";
import HomeScreen from "./src/screens/HomeScreen";
import PanicScreen from "./src/screens/PanicScreen";
import TripPlannerScreen from "./src/screens/TripPlannerScreen";
import ExpenseTrackerScreen from "./src/screens/ExpenseTrackerScreen";
import ContactsScreen from "./src/screens/ContactsScreen";
import FeedbackScreen from "./src/screens/FeedbackScreen";
import ChatbotScreen from "./src/screens/ChatbotScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState("Login");

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) setInitialRoute("Home");
    })();
  }, []);

  return (
    <NavigationContainer >
      <Stack.Navigator initialRouteName={initialRoute}  screenOptions={{ headerStyle: { backgroundColor: "#5ea500" }, headerTintColor: "#fff" }}>
        <Stack.Screen name="Login" component={LoginScreen}  options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Panic" component={PanicScreen} />
        <Stack.Screen name="TripPlanner" component={TripPlannerScreen} />
        <Stack.Screen name="Expenses" component={ExpenseTrackerScreen} />
        <Stack.Screen name="Contacts" component={ContactsScreen} />
        <Stack.Screen name="Chatbot" component={ChatbotScreen} />
        <Stack.Screen name="Feedback" component={FeedbackScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
