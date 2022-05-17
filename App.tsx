import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Chat from "./src/screens/chat";
import Rooms from "./src/screens/rooms";

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="home">
        <Stack.Screen
          name="home"
          options={{ statusBarHidden: false, headerShown: false }}
          component={Rooms}
        />
        <Stack.Screen
          name="chat"
          options={{ statusBarHidden: false, headerShown: false }}
          component={Chat}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
