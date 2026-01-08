import { Routes, Route, Navigate } from "react-router-dom";
import Checkout from "./pages/Checkout";

export default function App() {
  return (
    <Routes>
      <Route path="/checkout" element={<Checkout />} />
      <Route path="*" element={<Navigate to="/checkout" />} />
    </Routes>
  );
}
