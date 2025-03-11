import { useNavigation } from "@react-navigation/native";
import React, { useMemo, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "../chat/styles.native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Rooms() {
  const navigation = useNavigation();
  const [user, setUser] = useState('')

  async function recoveryUser() {
    const result = (await AsyncStorage.getItem("username")) || ''
    setUser(result)
  }

  useMemo(() => {
    recoveryUser()
  }, [])
  return (
    <View style={{ paddingHorizontal: 10 }}>
      <View style={styles.code}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Chats</Text>
        <TextInput
          value={user}
          defaultValue={user}
          onChangeText={(text) => {
            AsyncStorage.setItem("usename", text)
            setUser(text)
          }}
          style={styles.codeText}
        />
      </View>

      <TouchableOpacity
        onPress={() =>
          navigation.navigate("chat", { roomId: 1, roomName: "Sala 1", user: user })
        }
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <Text style={{ height: 50, fontSize: 25 }}>Sala 1</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          navigation.navigate("chat", { roomId: 2, roomName: "Sala 2", user: user })
        }
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <Text style={{ height: 50, fontSize: 25 }}>Sala 2</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          navigation.navigate("chat", { roomId: 3, roomName: "Sala 3", user: user })
        }
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <Text style={{ height: 50, fontSize: 25 }}>Sala 3</Text>
      </TouchableOpacity>
    </View>
  );
}
