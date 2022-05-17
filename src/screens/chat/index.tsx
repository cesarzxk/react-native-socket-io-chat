import Expo from "expo";
import React, { useEffect, useRef, useState, memo } from "react";
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import io from "socket.io-client";
import { styles } from "./styles.native";
import { Ionicons } from "@expo/vector-icons";

// Replace this URL with your own, if you want to run the backend locally!
const url = "https://cesarzxk-socketio-chat-server.herokuapp.com/";
const devUrl = "http://10.0.0.155:3333";
const dev = true;

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
  const [socket, setSocket] = useState(io(dev ? devUrl : url));
  const [messages, setMessages] = useState<message[]>([]);

  const [code, setCode] = useState("");
  const [text, setText] = useState("");
  const [room, setRoom] = useState("");
  const [id, setId] = useState("");
  const [users, setUsers] = useState("");

  let ChatRef = useRef<ScrollView>(null);

  function sentMessage(message: string) {
    if (code != "") {
      setText("");
      const date = new Date();

      let newMessage = {
        key: "",
        message: message,
        id: id,
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
      console.log(newMessage);

      setMessages([...messages, newMessage]);
      socket.emit("chat", newMessage);
    }
  }

  function Connect() {
    if (room == "") {
      socket.emit("join", { code: code, id: socket.id });
      socket.once("statusJoin", (log) => setRoom(log.room));
      setId(socket.id);
    } else {
      socket.emit("removeUser", room);
      socket.emit("join", { code: code, id: socket.id });
      socket.once("statusJoin", (log) => setRoom(log.room));
      setId(socket.id);
    }
  }

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
          onPress: () => {},
        },
      ]);
    }
  }

  useEffect(() => {
    socket.once("messages", (data) => {
      setMessages([...messages, data]);
    });

    socket.once("deleteMessage", (key) => {
      deleteReceipedMessage(key);
    });

    socket.once("getUsers", (size) => {
      console.log(size);
      setUsers(size);
    });
  }, [messages]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" />
      <View style={styles.code}>
        <Text> Room Code: </Text>
        <TextInput
          value={code}
          style={styles.codeText}
          onChangeText={(text) => setCode(text)}
        />
        <Button title="Enter" onPress={Connect} />
      </View>

      <Text style={styles.status}>
        Conectado a: {room} Usuários: {users}
      </Text>

      <ScrollView
        ref={ChatRef}
        onContentSizeChange={() => {
          ChatRef.current?.scrollToEnd();
        }}
        style={styles.messageList}
      >
        {messages?.map((result, index) =>
          result.message ? (
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
                ]}
              >
                <Text style={styles.messageUserId}>{result.id}</Text>
                <Text>{result.message}</Text>
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
        )}
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
