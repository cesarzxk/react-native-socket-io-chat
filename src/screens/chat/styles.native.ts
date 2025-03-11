import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },

  code: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  codeText: {
    borderWidth: 1,
    flex: 1,
    height: 40,
    marginRight: 10,
    textAlign: "center",
    borderColor: "#ddd",
    borderRadius: 25,
    color: "#000",
  },
  status: {
    width: "100%",
    textAlign: "left",
    textAlignVertical: "center",
  },

  messageList: {
    width: "100%",
    backgroundColor: "#00ff0022",
  },

  message: {
    maxWidth: "80%",
    backgroundColor: "#5ff5",
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 20,
    borderBottomRightRadius: 0,
    padding: 5,
    alignSelf: "flex-end",
  },
  messageUserId: {
    alignSelf: "flex-start",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
    marginHorizontal: 5,
  },

  messageTimer: {
    alignSelf: "flex-end",
    marginRight: 10,
    fontSize: 9,
  },

  Alert: {
    alignSelf: "center",
    paddingHorizontal: 5,
    paddingVertical: 2,
    backgroundColor: "#aaa",
    borderRadius: 10,
    marginTop: 7,
    opacity: 0.7,
    fontSize: 10,
  },

  TextArea: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },

  TextAreaInput: {
    borderWidth: 1,
    flex: 5,
    height: 40,
    marginRight: 10,
    textAlign: "center",
    borderColor: "#ddd",
    borderRadius: 25,
    paddingHorizontal: 15,
  },

  TextAreaSendButton: {
    flex: 2,
    display: "flex",
    flexDirection: "row",
    borderRadius: 25,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  TextAreaSendButtonText: {
    marginRight: 10,
    fontFamily: "Roboto",
    fontSize: 16,
    fontWeight: "bold",
  },
});
