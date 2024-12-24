import React, { useEffect, useState } from 'react';
import {
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { Link } from 'react-router-native';

interface Task {
  id: number;
  name: string;
  course: string;
  description: string;
  lecturer: string;
  start_date: string; 
  end_date: string;   
}

const Homepage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('https://apmob.myfirnanda.my.id/api/tasks');
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setTasks(data); 
        } else {
          console.error('Expected an array but got:', data);
          setTasks([]); 
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const deleteTask = async (id: number) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'OK',
          onPress: async () => {
            try {
              const response = await fetch(`https://apmob.myfirnanda.my.id/api/tasks/${id}`, {
                method: 'DELETE',
              });

              if (response.ok) {
                setTasks(tasks.filter(task => task.id !== id));
              } else {
                Alert.alert('Error', 'Failed to delete task');
              }
            } catch (error) {
              Alert.alert('Error', 'Network error occurred');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const currentDate = new Date().toISOString(); 

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Completed Task</Text>
        <View style={styles.taskContainer}>
          {tasks.filter(task => task.end_date < currentDate).map(task => (
            <View key={task.id} style={styles.taskItem}>
              <Link to={`/EditData/${task.id}`} style={{ flex: 1 }}>
                <Text style={styles.taskText}>{task.name}</Text>
              </Link>
              <TouchableOpacity onPress={() => deleteTask(task.id)}>
                <Text style={styles.deleteButton}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <Text style={styles.title}>Incomplete Task</Text>
        <View style={styles.taskContainer}>
          {tasks.filter(task => task.end_date >= currentDate).map(task => (
            <View key={task.id} style={styles.taskItem}>
              <Link to={`/EditData/${task.id}`} style={{ flex: 1 }}>
                <Text style={styles.taskText}>{task.name}</Text>
              </Link>
              <TouchableOpacity onPress={() => deleteTask(task.id)}>
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
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
  },
  taskText: {
    fontSize: 16,
  },
  deleteButton: {
    color: 'red',
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