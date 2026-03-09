// src/screens/ChatbotScreen.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Voice from "@react-native-voice/voice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Markdown from "react-native-markdown-display";
import { Send, Mic, Loader2 } from "lucide-react-native";
import { BACKEND_URL } from "../../config";

export default function ChatbotScreen({ navigation }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const flatListRef = useRef(null);

  // Voice setup
  useEffect(() => {
    Voice.onSpeechResults = (e) => {
      if (e.value && e.value.length > 0) {
        setInput(e.value[0]);
      }
    };
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  // Send message
  async function handleSend() {
    if (!input.trim()) return;
    setMessages((msgs) => [...msgs, { sender: "user", text: input }]);
    setInput("");
    setLoading(true);

    const loadingMsg = { id: `loading-${Date.now()}`, sender: "loading", text: "" };
    setMessages((msgs) => [...msgs, loadingMsg]);

    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${BACKEND_URL}/api/groq/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await res.json();
      const aiText = data.response || "Sorry, I couldn’t get a response.";

      setMessages((msgs) =>
        msgs.filter((m) => m.sender !== "loading").concat({ sender: "ai", text: aiText })
      );
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((msgs) =>
        msgs.filter((m) => m.sender !== "loading").concat({
          sender: "ai",
          text: "⚠️ Error connecting to AI service.",
        })
      );
    } finally {
      setLoading(false);
    }
  }

 async function startListening() {
  if (!Voice?.start) {
    console.warn("Voice module not available");
    return;
  }
  setListening(true);
  try {
    await Voice.start("en-US");
  } catch (e) {
    console.error("Voice start error:", e);
  }
}

  async function stopListening() {
    setListening(false);
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  }

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.message,
        item.sender === "user"
          ? styles.userMsg
          : item.sender === "ai"
          ? styles.aiMsg
          : styles.loadingMsg,
      ]}
    >
      {item.sender === "ai" ? (
        <Markdown>{item.text}</Markdown>
      ) : item.sender === "loading" ? (
        <Loader2 size={20} />
      ) : (
        <Text>{item.text}</Text>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>🤖 Chatbot</Text>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, idx) =>
          item.sender === "loading" && "id" in item ? item.id : String(idx)
        }
        renderItem={renderMessage}
        contentContainerStyle={{ padding: 12 }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={input}
          onChangeText={setInput}
          editable={!loading}
        />

        {/* Mic Button */}
        <TouchableOpacity
          onPressIn={startListening}
          onPressOut={stopListening}
          style={[styles.iconBtn, listening && { backgroundColor: "#FF6B6B" }]}
        >
          <Mic size={20} color={listening ? "white" : "black"} />
        </TouchableOpacity>

        {/* Send Button */}
        <TouchableOpacity
          onPress={handleSend}
          disabled={!input.trim() || loading}
          style={[styles.iconBtn, { backgroundColor: "#5ea500" }]}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Send size={20} color="white" />}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ecfcca" },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 10,
  },
  message: {
    padding: 10,
    marginVertical: 4,
    borderRadius: 8,
    maxWidth: "80%",
  },
  userMsg: { backgroundColor: "#DCF8C6", alignSelf: "flex-end" },
  aiMsg: { backgroundColor: "#EEE", alignSelf: "flex-start" },
  loadingMsg: { alignSelf: "center" },
  inputRow: {
    backgroundColor: "#9ae600",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#DDD",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: "#fff",
  },
  iconBtn: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#eee",
    marginLeft: 4,
    alignItems: "center",
    justifyContent: "center",
  },
});
