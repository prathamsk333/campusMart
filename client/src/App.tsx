import { Routes, Route } from "react-router-dom"
import HomePage from "./pages/home"
import DashboardPage from "./pages/dashboard"
import ProductPage from "./pages/product"
import ProfilePage from "./pages/profile"
import SettingsPage from "./pages/settings"

import { Login, Signup } from "./components/auth"
import AddItemPage from "./pages/additem"

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signin" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/products/:id" element={<ProductPage />} />
      <Route path="/profile/:id" element={<ProfilePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/additem" element={<AddItemPage />} />
    </Routes>
  )
}

export default App

