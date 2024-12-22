import React from 'react';
import {
  View,
  Text
} from 'react-native';
import { Link } from 'react-router-native';

const HomePage = () => {
  return (
    <View>
      <Link to="/add">
        <Text>Add</Text>
      </Link>
    </View>
  );
};

export default HomePage;