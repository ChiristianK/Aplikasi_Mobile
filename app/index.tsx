import { Text, View } from "react-native";
import { Link, NativeRouter, Route, Routes } from "react-router-native";
import AddData from "./AddData";
import HomePage from "./HomePage";

export default function Index() {
  return (
    <NativeRouter>
      <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="/add" element={<AddData />} />
      </Routes>
    </NativeRouter>

  );
}
