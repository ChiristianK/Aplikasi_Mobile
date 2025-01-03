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
import { Link, useNavigate } from 'react-router-native';
import { useAuth } from './AuthContext';

interface CourseFormData {
  name: string;
  course: string;
  description: string;
  lecturer: string;
  is_finished: boolean;
  start_date: string;
  end_date: string;
}

interface FormErrors {
  name?: string;
  course?: string;
  description?: string;
  lecturer?: string;
  date?: string;
}

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const initialFormData: CourseFormData = {
  name: '',
  course: '',
  description: '',
  lecturer: '',
  is_finished: false,
  start_date: formatDate(new Date()),
  end_date: formatDate(new Date()),
};

const AddData: React.FC = () => {
  const [formData, setFormData] = useState<CourseFormData>(initialFormData);
  const [showStartDate, setShowStartDate] = useState<boolean>(false);
  const [showEndDate, setShowEndDate] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      Alert.alert('Error', 'Token tidak ditemukan. Silakan login kembali.');
      logout();
      navigate('/login');
    }
  }, [token, logout, navigate]);

  const validateForm = (): boolean => {
    let tempErrors: FormErrors = {};
    if (!formData.name) tempErrors.name = 'Name is required';
    if (!formData.course) tempErrors.course = 'Course is required';
    if (!formData.description) tempErrors.description = 'Description is required';
    if (!formData.lecturer) tempErrors.lecturer = 'Lecturer is required';
    if (formData.end_date < formData.start_date) {
      tempErrors.date = 'End date cannot be before start date';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    if (validateForm()) {
      try {
        const response = await fetch('https://apmob.myfirnanda.my.id/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          Alert.alert('Success', 'Course added successfully!');
          setFormData(initialFormData);
          navigate('/home');
        } else {
          if (response.status === 401) {
            Alert.alert('Session expired', 'Please log in again.');
            logout();
            navigate('/login');
          } else {
            Alert.alert('Error', 'Failed to add course');
          }
        }
      } catch (error) {
        Alert.alert('Error', 'Network error occurred');
        console.error(error);
      }
    }
  };

  const onStartDateChange = (_: any, selectedDate?: Date): void => {
    setShowStartDate(false);
    if (selectedDate) {
      setFormData({ ...formData, start_date: formatDate(selectedDate) });
    }
  };

  const onEndDateChange = (_: any, selectedDate?: Date): void => {
    setShowEndDate(false);
    if (selectedDate) {
      setFormData({ ...formData, end_date: formatDate(selectedDate) });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Link to="/home"><Text>Home</Text></Link>
      <Text style={styles.title}>Add New Course</Text>

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
        {errors.description && (
          <Text style={styles.errorText}>{errors.description}</Text>
        )}
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
          onPress={() =>
            setFormData({ ...formData, is_finished: !formData.is_finished })
          }
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
          <Text>{formData.start_date}</Text>
        </TouchableOpacity>
        {showStartDate && (
          <DateTimePicker
            value={new Date(formData.start_date)}
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

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
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

export default AddData;