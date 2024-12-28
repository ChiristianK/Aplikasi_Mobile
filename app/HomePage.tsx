import React, { useEffect, useState } from 'react';
import {
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  ScrollView
} from 'react-native';
import { Link, useNavigate } from 'react-router-native';
import axios from 'axios';
import { useAuth } from './AuthContext';

interface Task {
  id: number;
  name: string;
  course: string;
  description: string;
  lecturer: string;
  is_finished: number;
  start_date: string;
  end_date: string;
}

const Homepage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksResponse = await axios.get('https://apmob.myfirnanda.my.id/api/tasks', {
          headers: {
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
        if (error === 401) {
          Alert.alert('Session expired', 'Please log in again.');
          logout();
          navigate('/login');
        }
      }
    };

    if (token) {
      fetchTasks();
    } else {
      Alert.alert('Error', 'Token not found. Please login again.');
      navigate('/login');
    }
  }, [token, logout, navigate]);

  const currentDate = new Date().toISOString();
  const completedTasks = tasks.filter(task => task.end_date < currentDate);
  const incompleteTasks = tasks.filter(task => task.end_date >= currentDate);

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
                  'Authorization': `Bearer ${token}`,
                },
              });

              if (response.status === 200) {
                setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
                Alert.alert('Success', 'Task deleted successfully!');
              }
            } catch (error) {
              console.error('Error deleting task:', error);
              Alert.alert('Error', 'Failed to delete task');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleEditTask = (taskId: number) => {
    navigate(`/edit/${taskId}`);
  };

  const TaskCard = ({ task, isCompleted }: { task: Task, isCompleted: boolean }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.taskText}>{task.name}</Text>
        <View style={styles.space}>
          <Text>{task.course}</Text>
          <Text>{task.lecturer}</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => handleEditTask(task.id)}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => deleteTask(task.id)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Completed Tasks</Text>
        {completedTasks.length > 0 ? (
          completedTasks.map(task => (
            <TaskCard key={task.id} task={task} isCompleted={true} />
          ))
        ) : (
          <Text style={styles.noTasksText}>No completed tasks</Text>
        )}

        <Text style={styles.title}>Incomplete Tasks</Text>
        {incompleteTasks.length > 0 ? (
          incompleteTasks.map(task => (
            <TaskCard key={task.id} task={task} isCompleted={false} />
          ))
        ) : (
          <Text style={styles.noTasksText}>No incomplete tasks</Text>
        )}
      </ScrollView>

      <View style={styles.navContainer}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigate('/')}>
          <Text style={styles.navButtonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigate('/add')}
        >
          <Text style={styles.navButtonText}>Add Task</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigate('/profile')}
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
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 20,
    marginBottom: 15,
    elevation: 2,
  },
  cardContent: {
    marginBottom: 10,
  },
  taskText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  space: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  editButton: {
    backgroundColor: '#007BFF',
    padding: 8,
    borderRadius: 8,
    minWidth: 70,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#ffebee',
    padding: 8,
    borderRadius: 8,
    minWidth: 70,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#ff5252',
    fontWeight: '600',
  },
  noTasksText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    color: '#888',
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingHorizontal: 20,
    position: 'absolute', // Menjaga posisi tetap di bawah
    bottom: 0, // Menempatkan di bagian bawah
    left: 0,
    right: 0,
  },
  navButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  navButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Homepage;