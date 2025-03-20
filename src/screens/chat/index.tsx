import React, { useEffect, useRef, useState, memo, useMemo } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import { styles } from "./styles.native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { socket } from "../../../App";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Replace this URL with your own, if you want to run the backend locally!


interface message {
  id?: string;
  message?: string;
  time?: {
    hours: number;
    seconds: number;
    milliseconds: number;
    minutes: number;
  };
  date?: { day: number; mouth: number; year: number };
  server?: string;
  key: string;
  alert?: string;
}



function Chat() {
  const [messages, setMessages] = useState<message[]>([]);
  const route = useRoute();
  const { roomId, roomName, user } = route.params as any;

  const [code, setCode] = useState(roomId);
  const [text, setText] = useState("");
  const [room, setRoom] = useState("");
  const [id, setId] = useState(user);
  const [users, setUsers] = useState("");

  let ChatRef = useRef<ScrollView>(null);

  function sentMessage(message: string) {
    if (code != "") {
      setText("");
      const date = new Date();

      let newMessage = {
        key: "",
        message: message,
        id: user,
        server: room,
        date: {
          day: date.getDay(),
          year: date.getFullYear(),
          mouth: date.getMonth(),
        },
        time: {
          hours: date.getHours(),
          minutes: date.getMinutes(),
          seconds: date.getSeconds(),
          milliseconds: date.getMilliseconds(),
        },
      };

      newMessage.key = CreateMessageKey(newMessage);

      setMessages([...messages, newMessage]);
      AsyncStorage?.setItem("chat" + roomId, JSON.stringify([...messages, newMessage]))
      socket.emit("chat", newMessage);
    }
  }

  async function Connect() {
    const result = JSON.parse(await AsyncStorage?.getItem("chat" + roomId) || '[]')
    setMessages(result)

    if (room == "") {
      socket.emit("join", { code: code, id: socket.id });
      socket.once("statusJoin", (log) => setRoom(log.room));
    } else {
      socket.emit("removeUser", room);
      socket.emit("join", { code: code, id: socket.id });
      socket.once("statusJoin", (log) => setRoom(log.room));
    }

    console.log("Connectado:", socket.connected);
  }


  useMemo(() => {
    Connect()
  }, [roomId])

  function CreateMessageKey(msg: message) {
    const date = `${msg.date?.day}/${msg.date?.mouth}/${msg.date?.year}`;
    const time = `${msg.time?.hours}:${msg.time?.minutes}:${msg.time?.seconds}:${msg.time?.milliseconds}`;
    return `${msg.id};${date};${time}`;
  }

  function deleteReceipedMessage(key: string) {
    const filteredMessages = messages.filter((mensage) => mensage.key !== key);
    setMessages(filteredMessages);
  }

  function deleteLocalMessage(key: string) {
    socket.emit("deleteMessage", { server: room, key: key });
    deleteReceipedMessage(key);
  }

  function alertDelete(userId: string | undefined, key: string) {
    if (id == userId) {
      Alert.alert("Alerta", "Deseja realmente apagar para todos?", [
        {
          text: "Sim",
          onPress: () => deleteLocalMessage(key),
        },
        {
          text: "Não",
          onPress: () => { },
        },
      ]);
    }
  }

  useEffect(() => {
    socket.once("messages", (data) => {
      AsyncStorage?.setItem("chat" + roomId, JSON.stringify([...messages, data]))
      setMessages([...messages, data]);
    });

    socket.once("deleteMessage", (key) => {
      deleteReceipedMessage(key);
    });

    socket.once("getUsers", (size) => {
      setUsers(size);
    });

    return () => {
      socket.off("new_notification");
    };
  }, [messages]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" />
      <View style={styles.code}>

        <TextInput
          value={roomName}
          defaultValue={roomName}
          style={styles.codeText}
          onChangeText={(text) => setCode(text)}
          editable={false}

        />
      </View>

      <Text style={styles.status}>
        Usuários: {users}
      </Text>

      <ScrollView
        ref={ChatRef}
        onContentSizeChange={() => {
          ChatRef.current?.scrollToEnd();
        }}
        style={styles.messageList}
      >
        {messages?.map((result, index) => {
          const generateHexColor = () => {
            return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;
          };

          return result.message ? (
            <TouchableOpacity
              key={result.key}
              onLongPress={() => alertDelete(result.id, result.key)}
            >
              <View
                style={[
                  styles.message,
                  result.id != id && {
                    borderBottomRightRadius: 20,
                    borderBottomLeftRadius: 0,
                    backgroundColor: "#fff",
                    alignSelf: "flex-start",
                  },
                  {
                    minWidth: 100
                  }
                ]}
              >
                <Text style={[styles.messageUserId, { color: generateHexColor() }]}>{result?.id}</Text>

                <Text style={{ marginHorizontal: 4 }}>{result.message}</Text>

                <Text style={styles.messageTimer}>
                  {result.time?.hours}:{result.time?.minutes}
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <Text key={result.key} style={styles.Alert}>
              {result.alert}
            </Text>
          )
        })}
      </ScrollView>

      <View style={styles.TextArea}>
        <TextInput
          value={text}
          style={[styles.TextAreaInput, { textAlign: "left" }]}
          onChangeText={(text) => setText(text)}
          onSubmitEditing={() => {
            sentMessage(text);
          }}
        />

        <TouchableOpacity
          disabled={room == "" || text == ""}
          style={[
            styles.TextAreaSendButton,
            { backgroundColor: room == "" || text == "" ? "#ddd" : "#00FF38" },
          ]}
          onPress={() => {
            sentMessage(text);
            setText("");
          }}
        >
          <Text
            style={[
              styles.TextAreaSendButtonText,
              { color: room == "" || text == "" ? "grey" : "black" },
            ]}
          >
            Send
          </Text>
          <Ionicons
            name="send"
            size={24}
            color={room == "" || text == "" ? "grey" : "black"}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default memo(Chat);
