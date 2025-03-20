import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Chat from "./src/screens/chat";
import Rooms from "./src/screens/rooms";
import { io } from "socket.io-client";

const url = "https://node-socket-io-chat.onrender.com/";
const devUrl = "http://localhost:3333";
const dev = false;

export const socket = io(dev ? devUrl : url);

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
