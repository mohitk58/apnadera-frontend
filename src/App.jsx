import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import PropertiesPage from './pages/PropertiesPage'
import PropertyDetailPage from './pages/PropertyDetailPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import UserPropertiesPage from './pages/UserPropertiesPage'
import UserFavoritesPage from './pages/UserFavoritesPage'
import AddPropertyPage from './pages/AddPropertyPage'
import EditPropertyPage from './pages/EditPropertyPage'
import ProfilePage from './pages/ProfilePage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import NotFoundPage from './pages/NotFoundPage'
function App() {
  return (
    <AuthProvider>
      <Routes>
        {}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="properties" element={<PropertiesPage />} />
          <Route path="properties/:id" element={<PropertyDetailPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
        {}
        <Route path="/dashboard" element={<ProtectedRoute />}>
          <Route index element={<DashboardPage />} />
          <Route path="properties" element={<UserPropertiesPage />} />
          <Route path="favorites" element={<UserFavoritesPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        {}
        <Route path="/properties" element={<ProtectedRoute />}>
          <Route path="add" element={<AddPropertyPage />} />
          <Route path="edit/:id" element={<EditPropertyPage />} />
        </Route>
        {}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  )
}
export default App 