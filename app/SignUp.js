import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons"; // Import ikon
import { Link, useNavigate } from 'react-router-native';

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [npm, setNpm] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSignUp = async () => {
    // Validasi form
    if (!name || !email || !password || !npm) {
      Alert.alert("Error", "Nama, NPM, Email, dan Password harus diisi!");
      return;
    }

    const signupData = {
      name,
      npm,
      email,
      password,
    };

    try {
      // Kirim data ke API
      const response = await axios.post(
        "https://apmob.myfirnanda.my.id/api/register",
        signupData
      );

      if (response.data.success) {
        Alert.alert("Sukses", "Akun berhasil dibuat!");
        navigate("/login");
      } else {
        Alert.alert("Error", response.data.message || "Gagal membuat akun");
      }
    } catch (error) {
      console.error("Error response:", error.response);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Terjadi kesalahan saat membuat akun"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Let's, Sign Up</Text>

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

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigate("/login")}>
        <Text style={styles.link}>Sudah punya akun? <Text style={{ fontWeight: 'bold', color: '"#4569FA !important"' }}>Login</Text></Text>
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
    color: "#4569FA",
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
    marginTop: "15" 
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
