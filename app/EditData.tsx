import React from 'react';
import {
    View,
    Text
} from 'react-native';
import { Link } from 'react-router-native';

const EditData = () => {
    return (
    <View>
        <Link to="/">
            <Text>HomePage</Text>
        </Link>
    </View>
  );
};

export default EditData;