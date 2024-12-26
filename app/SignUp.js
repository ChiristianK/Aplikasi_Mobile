// src/screens/SignUp.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios"; // Import axios

const SignUp = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [npm, setNpm] = useState("");

  const handleSignUp = async () => {
    // Validasi form
    if (!name || !email || !password || !npm) {
      alert("Nama, NPM, Email, dan Password harus diisi!");
      return;
    }

    // Membuat data untuk dikirim ke API
    const userData = {
      name,
      npm,
      email,
      password,
    };

    try {
      // Mengirim data ke API menggunakan axios
      const response = await axios.post(
        "https://apmob.myfirnanda.my.id/api/signup",
        userData
      );

      if (response.data.success) {
        // Menangani sukses response dari API
        Alert.alert("Sukses", "Akun berhasil dibuat!");
        navigation.navigate("Login");
      } else {
        // Menangani error jika response tidak sukses
        Alert.alert("Error", response.data.message || "Gagal membuat akun");
      }
    } catch (error) {
      // Menangani kesalahan koneksi atau API error
      Alert.alert("Error", "Terjadi kesalahan saat membuat akun");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        placeholder="Nama Lengkap"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        placeholder="NPM"
        style={styles.input}
        value={npm}
        onChangeText={setNpm}
        keyboardType="numeric"
      />

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Sudah punya akun? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  button: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  link: {
    textAlign: "center",
    color: "blue",
    marginTop: 20,
  },
});
