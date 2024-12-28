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
import Icon from "react-native-vector-icons/Ionicons"; // Import ikon
import { Link, useNavigate } from 'react-router-native';
import { useAuth } from './AuthContext';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login  } = useAuth();

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
        "https://apmob.myfirnanda.my.id/api/login",
        loginData
      );
  
      if (response.data.success) {
        Alert.alert("Sukses", "Login berhasil!");
        const token = response.data.data.token; // Ambil token dari response
        const user = {
          name: response.data.data.name,
          email: response.data.data.email,
          token: token,
        }; // Ambil informasi pengguna dari response

        // Gunakan fungsi login dari AuthContext
        await login(token, user);
        
        console.log("Token:", token); // Log token untuk verifikasi
        console.log("User   :", user);
        navigate("/home", { state: { user } });
      } else {
        Alert.alert(
          "Error",
          response.data.message || "Email atau Password salah"
        );
      }
    } catch (error) {
      Alert.alert("Error", "Terjadi kesalahan saat login");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Password"
          style={styles.input}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Icon
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color="#888"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigate("signup")}>
        <Text style={styles.link}>Belum punya akun? <Text style={{ fontWeight: 'bold', color: '"#4569FA"' }}>Daftar</Text></Text>
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
    color: "#4569FA"
  },
  inputContainer: {
    position: "relative",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    paddingRight: 40,
    marginVertical: 10,
  },
  iconContainer: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
  button: {
    backgroundColor: "#4569FA",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  link: {
    textAlign: "center",
    color: "lightgray",
    marginTop: 20,
  },
});
