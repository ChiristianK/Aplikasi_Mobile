import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { Link, useNavigate } from 'react-router-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    profileImage: "https://via.placeholder.com/150", // Default gambar profil
    name: "",
    email: "",
    npm: "",
  });

  // Fetch data pengguna saat komponen dimuat
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token'); // Ambil token dari local storage
        if (!token) throw new Error("User not authenticated");

        const response = await fetch('https://apmob.myfirnanda.my.id/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Kirim token untuk autentikasi
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUser({
          profileImage: data.profileImage || "https://via.placeholder.com/150",
          name: data.name || "Unknown",
          email: data.email || "Unknown",
          npm: data.npm || "Unknown",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate('/login'); // Redirect ke login jika gagal autentikasi
      }
    };

    fetchUserData();
  }, []);

  // Fungsi Logout
  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('token'); // Ambil token dari local storage
      if (!token) throw new Error("User not authenticated");

      const response = await fetch('https://apmob.myfirnanda.my.id/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Kirim token untuk autentikasi
        },
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      // Hapus token dari local storage
      await AsyncStorage.removeItem('token');
      console.log("User logged out successfully");

      // Redirect ke halaman login
      navigate('/login');
    } catch (error) {
      console.error("Error during logout:", error);
      Alert.alert("Logout Error", "Failed to log out. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Gambar Profil */}
      <View style={styles.content}>
        <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <Text style={styles.npm}>NPM: {user.npm}</Text>
      </View>

      {/* Tombol Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      {/* Navigasi */}
      <View style={styles.navContainer}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigate('/')}>
          <Text style={styles.navButtonText}>Home</Text>
        </TouchableOpacity>
        <Link to="/add" style={styles.navButton}>
          <Text style={styles.navButtonText}>Add Task</Text>
        </Link>
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => navigate('/profile')} // Navigasi ke halaman profil
        >
          <Text style={styles.navButtonText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  content: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  npm: {
    fontSize: 16,
    color: '#777',
  },
  logoutButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#FF5733',
    borderRadius: 5,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  navButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  navButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
