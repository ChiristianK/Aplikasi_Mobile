// src/screens/Login.js
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

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    // Validasi form
    if (!email || !password) {
      alert("Email dan Password harus diisi!");
      return;
    }

    const loginData = {
      email,
      password,
    };

    try {
      // Mengirimkan data login ke API
      const response = await axios.post(
        "https://apmob.myfirnanda.my.id/api/login", // Ganti dengan endpoint API login yang sesuai
        loginData
      );

      if (response.data.success) {
        // Jika login berhasil, tampilkan pesan sukses dan navigasi ke halaman Home
        Alert.alert("Sukses", "Login berhasil!");
        navigation.navigate("Home");
      } else {
        // Jika login gagal, tampilkan pesan error
        Alert.alert(
          "Error",
          response.data.message || "Email atau Password salah"
        );
      }
    } catch (error) {
      // Menangani kesalahan API atau koneksi
      Alert.alert("Error", "Terjadi kesalahan saat login");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

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

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
        <Text style={styles.link}>Belum punya akun? Daftar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;

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
    backgroundColor: "blue",
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