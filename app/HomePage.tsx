import React, { useEffect, useState } from 'react';
import {
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { Link, useNavigate } from 'react-router-native';
import axios from 'axios'; // Import Axios
import { useAuth } from './AuthContext'; // Import useAuth

interface Task {
  id: number;
  name: string;
  course: string;
  description: string;
  lecturer: string;
  is_finished: number; // 0 for incomplete, 1 for completed
  start_date: string; 
  end_date: string;   
}

const Homepage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { token, logout } = useAuth(); // Ambil token dan logout dari AuthContext
  const navigate = useNavigate(); // Untuk navigasi
  console.log("Token:", token);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksResponse = await axios.get('https://apmob.myfirnanda.my.id/api/tasks', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, 
          },
        });

        if (Array.isArray(tasksResponse.data.data)) {
          setTasks(tasksResponse.data.data); 
        } else {
          console.error('Expected an array but got:', tasksResponse.data);
          setTasks([]); 
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
        Alert.alert('Error', 'Failed to fetch tasks: ' + error);
        // Jika token tidak valid, logout dan arahkan ke login
        if (error === 401) {
          Alert.alert('Session expired', 'Please log in again.');
          logout(); // Logout pengguna
          navigate('/login'); // Arahkan ke halaman login
        }
      }
    };

    if (token) {
      fetchTasks(); // Panggil fungsi fetchTasks jika token ada
    } else {
      Alert.alert('Error', 'Token tidak ditemukan. Silakan login kembali.');
      navigate('/login'); // Arahkan ke halaman login jika token tidak ada
    }
  }, [token, logout, navigate]); // Menjalankan efek ketika token berubah

  const currentDate = new Date().toISOString(); // Ambil waktu saat ini dalam format ISO

  // Kategorikan tugas menjadi completed dan incomplete
  const completedTasks = tasks.filter(task => task.end_date < currentDate);
  const incompleteTasks = tasks.filter(task => task.end_date >= currentDate);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Completed Tasks</Text>
        <View style={styles.taskContainer}>
          {completedTasks.map(task => (
            <View key={task.id} style={styles.taskItem}>
              <Link to={`/EditData/${task.id}`} style={{ flex: 1 }}>
                <Text style={styles.taskText}>{task.name}</Text>
              </Link>
              <TouchableOpacity onPress={() => console.log(`Delete task ${task.id}`)}>
                <Text style={styles.deleteButton}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <Text style={styles.title}>Incomplete Tasks</Text>
        <View style={styles.taskContainer}>
          {incompleteTasks.map(task => (
            <View key={task.id} style={styles.taskItem}>
              <Link to={`/EditData/${task.id}`} style={{ flex: 1 }}>
                <Text style={styles.taskText}>{task.name}</Text>
              </Link>
              <TouchableOpacity onPress={() => console.log(`Delete task ${task.id}`)}>
                <Text style={styles.deleteButton}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.navContainer}>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navButtonText}>Home</Text>
        </TouchableOpacity>
        <Link to="/add" style={ styles.navButton}>
          <Text style={styles.navButtonText}>Add Task</Text>
        </Link>
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
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  taskContainer: {
    marginBottom: 20,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  taskText: {
    fontSize: 18,
  },
  deleteButton: {
    color: 'red',
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

export default Homepage;