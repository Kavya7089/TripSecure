// src/screens/ContactsScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";

const ContactsScreen = () => {
  const [contactName, setContactName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactRelation, setContactRelation] = useState("");
  const [contacts, setContacts] = useState([]);

  const addContact = () => {
    if (!contactName.trim() || !contactNumber.trim() || !contactEmail.trim() || !contactRelation.trim()) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }

    if (contacts.length >= 3) {
      Alert.alert("Limit Reached", "You can only add 3 priority members.");
      return;
    }

    setContacts([
      ...contacts,
      {
        id: Date.now().toString(),
        name: contactName,
        number: contactNumber,
        email: contactEmail,
        relation: contactRelation,
      },
    ]);

    // Reset input fields
    setContactName("");
    setContactNumber("");
    setContactEmail("");
    setContactRelation("");
  };

  const contactPolice = () => {
    Alert.alert("🚨 Emergency", "Calling Police...");
    // Here you could integrate Linking.openURL("tel:100") for actual call
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Priority Member Contacts</Text>

      {/* Inputs */}
      <TextInput
        placeholder="Enter contact name"
        value={contactName}
        onChangeText={setContactName}
        style={styles.input}
      />
      <TextInput
        placeholder="Enter phone number"
        value={contactNumber}
        onChangeText={setContactNumber}
        style={styles.input}
        keyboardType="phone-pad"
      />
      <TextInput
        placeholder="Enter email"
        value={contactEmail}
        onChangeText={setContactEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Relation (e.g., Brother, Mother, Friend)"
        value={contactRelation}
        onChangeText={setContactRelation}
        style={styles.input}
      />

      {/* Add Button */}
      <TouchableOpacity style={styles.btn} onPress={addContact}>
        <Text style={styles.btnText}>Add Contact</Text>
      </TouchableOpacity>

      {/* Contact List */}
      <FlatList
        style={{ marginTop: 15 }}
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.contactCard}>
            <Text style={styles.contactName}>{item.name}</Text>
            <Text style={styles.contactDetail}>🤝 Relation: {item.relation}</Text>
            <Text style={styles.contactDetail}>📞 {item.number}</Text>
            <Text style={styles.contactDetail}>✉️ {item.email}</Text>
          </View>
        )}
      />

      {/* Police Button */}
      <TouchableOpacity style={styles.fab} onPress={contactPolice}>
        <Text style={styles.fabText}>🚨</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#ecfcca" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  input: {
    borderWidth: 3,
    borderColor: "#5ea500",
    padding: 11,
    marginBottom: 10,
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  btn: {
    backgroundColor: "#5ea500",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginVertical: 3,
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  contactCard: {
    backgroundColor: "#fff",
    padding: 14,
    marginBottom: 10,
    borderRadius: 10,
    borderLeftWidth: 5,
    borderLeftColor: "#5ea500",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contactName: { fontSize: 18, fontWeight: "bold", color: "#333" },
  contactDetail: { fontSize: 14, color: "#555", marginTop: 2 },
  fab: {
    position: "absolute",
    bottom: 25,
    right: 25,
    backgroundColor: "#f44336",
    width: 65,
    height: 65,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  fabText: { fontSize: 28, color: "#fff" },
});

export default ContactsScreen;
