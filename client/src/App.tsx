import { Routes, Route } from "react-router-dom"
import HomePage from "./pages/home"
import LoginPage from "./pages/signin"
import SignupPage from "./pages/signup"
import DashboardPage from "./pages/dashboard"
import ProductPage from "./pages/product"
import ProfilePage from "./pages/profile"
import SettingsPage from "./pages/settings"
import AddItemPage from "./pages/additem"

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signin" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/products/:id" element={<ProductPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/additem" element={<AddItemPage />} />
    </Routes>
  )
}

export default App

