import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Link, useNavigate } from 'react-router-native';

const ProfileScreen = () => {
  const navigate = useNavigate();

  const user = {
    profileImage: "https://via.placeholder.com/150", // Gambar profil
    name: "John Doe",
    email: "john.doe@example.com",
    npm: "1234567890",
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

      {/* Navigasi */}
      <View style={styles.navContainer}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigate('/home')}>
          <Text style={styles.navButtonText}>Home</Text>
        </TouchableOpacity>
        <Link to="/add" style={styles.navButton}>
          <Text style={styles.navButtonText}>Add Task</Text>
        </Link>
      </View>

      {/* Tombol Menuju Profile */}
      <View style={styles.profileButtonContainer}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigate('/profile')}>
          <Text style={styles.navButtonText}>Go to Profile</Text>
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
  profileButtonContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
});

export default ProfileScreen;