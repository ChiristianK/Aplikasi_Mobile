import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Link } from 'react-router-native';

const AddData = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    age: '',
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: '',
      email: '',
      age: '',
    };

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    // Age validation
    const ageNum = parseInt(formData.age);
    if (!formData.age.trim()) {
      newErrors.age = 'Age is required';
      isValid = false;
    } else if (isNaN(ageNum) || ageNum < 0 || ageNum > 120) {
      newErrors.age = 'Please enter a valid age between 0 and 120';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const response = await fetch('YOUR_BACKEND_API_URL', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          Alert.alert('Success', 'User data submitted successfully!');
          setFormData({ name: '', email: '', age: '' }); // Reset form
        } else {
          throw new Error('Failed to submit data');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to submit data. Please try again.');
        console.error('Error submitting form:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Link to="/"><Text>Home</Text></Link>
      <Text style={styles.title}>User Registration</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
        />
        {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your age"
          value={formData.age}
          onChangeText={(text) => setFormData({ ...formData, age: text })}
          keyboardType="numeric"
        />
        {errors.age ? <Text style={styles.errorText}>{errors.age}</Text> : null}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
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
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddData;