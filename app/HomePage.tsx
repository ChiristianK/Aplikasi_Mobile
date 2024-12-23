import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'react-router-native';

const Homepage = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Completed Tasks</Text>
        <View style={styles.taskContainer}>
          <View style={styles.taskItem}>
            <Text style={styles.taskText}>Task 1</Text>
          </View>
          <View style={styles.taskItem}>
            <Text style={styles.taskText}>Task 2</Text>
          </View>
        </View>

        <Text style={styles.title}>Incomplete Tasks</Text>
        <View style={styles.taskContainer}>
          <View style={styles.taskItem}>
            <Text style={styles.taskText}>Task 3</Text>
          </View>
          <View style={styles.taskItem}>
            <Text style={styles.taskText}>Task 4</Text>
          </View>
        </View>
      </View>

      <View style={styles.navContainer}>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navButtonText}>Home</Text>
        </TouchableOpacity>
        <Link to="/add" style={styles.navButton}>
          <Text style={styles.navButtonText}>Add Task</Text>
        </Link>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navButtonText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'space-between', // Distribute space between content and nav
  },
  content: {
    flex: 1, // Allow content to take available space
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  taskContainer: {
    marginBottom: 20,
  },
  taskItem: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
  },
  taskText: {
    fontSize: 16,
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  navButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Homepage;