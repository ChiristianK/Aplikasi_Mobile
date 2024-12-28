import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Link, useNavigate, useParams } from 'react-router-native';
import { useAuth } from './AuthContext';

interface CourseFormData {
  name: string;
  course: string;
  description: string;
  lecturer: string;
  is_finished: boolean;
  start_date: Date;
  end_date: string;
}

interface FormErrors {
  name?: string;
  course?: string;
  description?: string;
  lecturer?: string;
  date?: string;
}

const EditData: React.FC = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState<CourseFormData | null>(null);
  const [showStartDate, setShowStartDate] = useState<boolean>(false);
  const [showEndDate, setShowEndDate] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  // Fetch existing task data
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(`https://apmob.myfirnanda.my.id/api/tasks/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            logout();
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch task details');
        }

        const data = await response.json();
        const taskData = data.data;
        
        setFormData({
          name: taskData.name,
          course: taskData.course,
          description: taskData.description,
          lecturer: taskData.lecturer,
          is_finished: Boolean(taskData.is_finished),
          start_date: new Date(taskData.start_date),
          end_date: taskData.end_date,
        });
      } catch (error) {
        console.error('Error fetching task:', error);
        Alert.alert('Error', 'Failed to fetch task details');
      }
    };

    if (token && id) {
      fetchTask();
    }
  }, [token, id]);

  const validateForm = (): boolean => {
    let tempErrors: FormErrors = {};
    if (!formData?.name) tempErrors.name = 'Name is required';
    if (!formData?.course) tempErrors.course = 'Course is required';
    if (!formData?.description) tempErrors.description = 'Description is required';
    if (!formData?.lecturer) tempErrors.lecturer = 'Lecturer is required';
    if (formData && formData.end_date < formData.start_date.toISOString()) {
      tempErrors.date = 'End date cannot be before start date';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleUpdate = async (): Promise<void> => {
    if (!formData) return;
    
    if (validateForm()) {
      try {
        const response = await fetch(`https://apmob.myfirnanda.my.id/api/tasks/${id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          if (response.status === 401) {
            logout();
            navigate('/login');
            return;
          }
          throw new Error('Failed to update course');
        }

        Alert.alert('Success', 'Course updated successfully!');
        navigate('/home');
      } catch (error) {
        console.error('Error updating task:', error);
        Alert.alert('Error', 'Failed to update course');
      }
    }
  };

  const onStartDateChange = (_: any, selectedDate?: Date): void => {
    setShowStartDate(false);
    if (selectedDate && formData) {
      setFormData({ ...formData, start_date: selectedDate });
    }
  };

  const onEndDateChange = (_: any, selectedDate?: Date): void => {
    setShowEndDate(false);
    if (selectedDate && formData) {
      const endDateStr = selectedDate.toISOString().split('T')[0];
      setFormData({ ...formData, end_date: endDateStr });
    }
  };

  if (!formData) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Link to="/home"><Text>Back to Home</Text></Link>
      <Text style={styles.title}>Edit Course</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(text: string) => setFormData({ ...formData, name: text })}
          placeholder="Enter name"
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Course</Text>
        <TextInput
          style={styles.input}
          value={formData.course}
          onChangeText={(text: string) => setFormData({ ...formData, course: text })}
          placeholder="Enter course name"
        />
        {errors.course && <Text style={styles.errorText}>{errors.course}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.description}
          onChangeText={(text: string) => setFormData({ ...formData, description: text })}
          placeholder="Enter course description"
          multiline
          numberOfLines={4}
        />
        {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Lecturer</Text>
        <TextInput
          style={styles.input}
          value={formData.lecturer}
          onChangeText={(text: string) => setFormData({ ...formData, lecturer: text })}
          placeholder="Enter lecturer name"
        />
        {errors.lecturer && <Text style={styles.errorText}>{errors.lecturer}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Status</Text>
        <TouchableOpacity
          style={styles.statusButton}
          onPress={() => setFormData({ ...formData, is_finished: !formData.is_finished })}
        >
          <Text style={styles.statusText}>
            {formData.is_finished ? 'Finished' : 'Ongoing'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Start Date</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowStartDate(true)}
        >
          <Text>{formData.start_date.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showStartDate && (
          <DateTimePicker
            value={formData.start_date}
            mode="date"
            onChange={onStartDateChange}
          />
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>End Date</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowEndDate(true)}
        >
          <Text>{formData.end_date}</Text>
        </TouchableOpacity>
        {showEndDate && (
          <DateTimePicker
            value={new Date(formData.end_date)}
            mode="date"
            onChange={onEndDateChange}
          />
        )}
        {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleUpdate}>
        <Text style={styles.submitButtonText}>Update Course</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  statusButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
  },
  dateButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditData;