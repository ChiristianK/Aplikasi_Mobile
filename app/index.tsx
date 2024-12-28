import { Text, View } from "react-native";
import { Link, NativeRouter, Route, Routes } from "react-router-native";
import { AuthProvider } from './AuthContext';
import AddData from "./AddData";
import HomePage from "./HomePage";
import EditData from "./EditData";
import Login from "./Login";
import SignUp from "./SignUp";
import ProfileScreen from "./ProfileScreen";

export default function Index() {
  return (
    <AuthProvider>
      <NativeRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/add" element={<AddData />} />
          <Route path="/edit" element={<EditData />} />
          <Route path="/profile" element={<ProfileScreen />} />
        </Routes>
      </NativeRouter>
    </AuthProvider>

  );
}
