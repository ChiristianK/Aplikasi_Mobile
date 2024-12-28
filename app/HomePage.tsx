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

  // Fungsi untuk menghapus tugas
  const deleteTask = async (id: number) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: async () => {
            try {
              const response = await axios.delete(`https://apmob.myfirnanda.my.id/api/tasks/${id}`, {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                },
              });

              if (response.status === 200) {
                // Hapus tugas dari state
                setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
                Alert.alert('Success', 'Task deleted successfully!');
              } else {
                Alert.alert('Error', 'Failed to delete task');
              }
            } catch (error) {
              console.error('Error deleting task:', error);
              Alert.alert('Error', 'Failed to delete task: ' + error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Completed Tasks</Text>
        {completedTasks.length > 0 ? (
          completedTasks.map(task => (
            <View key={task.id} style={styles.card}>
              <Link to={`/EditData/${task.id}`}>
                < View style={styles.cardFlex}>
                  <View style={styles.cardText}>
                    <Text style={styles.taskText}>{task.name}</Text>
                    <View style={styles.space}>
                      <Text>{task.course}</Text>
                      <Text>{task.lecturer}</Text>
                    </View>
                  </View>
                  <View style={styles.cardDelete}>
                    <TouchableOpacity onPress={() => deleteTask(task.id)}>
                      <Text style={styles.deleteButton}>Delete Task</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Link>
            </View>
          ))
        ) : (
          <Text style={styles.noTasksText}>No tasks yet</Text>
        )}

        <Text style={styles.title}>Incomplete Tasks</Text>
        <View style={styles.content}>
          {incompleteTasks.length > 0 ? (
            incompleteTasks.map(task => (
              <View key={task.id} style={styles.card}>
                <Link to={`/EditData/${task.id}`}>
                  <View style={styles.cardFlex}>
                    <View style={styles.cardText}>
                      <Text style={styles.taskText}>{task.name}</Text>
                      <View style={styles.space}>
                        <Text>{task.course}</Text>
                        <Text>{task.lecturer}</Text>
                      </View>
                    </View>
                    <View style={styles.cardDelete}>
                      <TouchableOpacity onPress={() => deleteTask(task.id)}>
                        <Text style={styles.deleteButton}>Delete Task</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Link>
              </View>
            ))
          ) : (
            <Text style={styles.noTasksText}>No tasks yet</Text>
          )}
        </View>
      </View>

      <View style={styles.navContainer}>
        <TouchableOpacity style={styles.navButton}>
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
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 20,
    marginBottom: 15,
  },
  cardFlex: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  noTasksText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    color: '#888',
  },
  cardText: {
    width: "76%",
  },
  cardDelete: {
    width: "20%",
  },
  taskText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "#333",
  },
  space: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "99%",
  },
  deleteButton: {
    fontSize: 14,
    color: "#ff6b6b",
    fontWeight: "600",
    textAlign: "center",
    display: "flex",
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