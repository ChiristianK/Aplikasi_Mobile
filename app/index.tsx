import { View } from "react-native";
import { NativeRouter, Route, Routes } from "react-router-native";
import { AuthProvider } from './AuthContext';
import AddData from "./AddData";
import HomePage from "./HomePage";
import EditData from "./EditData";
import Login from "./Login";
import SignUp from "./SignUp";
import ProfileScreen from "./ProfileScreen";
import SplashScreen from "./SplashScreen";

export default function Index() {
  return (
    <AuthProvider>
      <NativeRouter>
        <View style={{ flex: 1 }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/add" element={<AddData />} />
            <Route path="/edit/:id" element={<EditData />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/" element={<SplashScreen />} />
          </Routes>
        </View>
      </NativeRouter>
    </AuthProvider>
  );
}
