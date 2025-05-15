import {Navigate, Route, Routes, useLocation} from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import About from './pages/About';
import Contact from './pages/Contact';

// Import admin components
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import Category from "./admin/CategoryForm.jsx";
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Import from AuthContext to ensure consistency
import { BASE_PATH, ADMIN_PATH } from './context/constants';

function App() {
    const location = useLocation();
    // Check if the current route is an admin route
    const isAdminRoute = location.pathname.startsWith(ADMIN_PATH);

    return (
        <AuthProvider>
            <div className="min-h-screen flex flex-col w-full">
                {!isAdminRoute && <Navbar />}
                <main className="flex-grow w-full bg-[#fef9f4]">
                    <div className="w-full mx-auto">
                        <Routes>
                            {/* Admin Routes - Place these first for priority */}
                            <Route path={`${ADMIN_PATH}/login`} element={<AdminLogin />} />

                            <Route
                                path={`${ADMIN_PATH}/dashboard`}
                                element={
                                    <ProtectedRoute>
                                        <AdminDashboard />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Redirect /admin to /admin/dashboard */}
                            <Route
                                path={`${ADMIN_PATH}`}
                                element={<Navigate to={`${ADMIN_PATH}/dashboard`} />}
                            />

                            {/* Base path routes */}
                            <Route path={`${BASE_PATH}`} element={<Home />} />
                            <Route path={`${BASE_PATH}/products`} element={<div className="max-w-screen-xl mx-auto"><Products/></div>}/>
                            <Route path={`${BASE_PATH}/about`} element={<div className="max-w-screen-xl mx-auto"><About/></div>}/>
                            <Route path={`${BASE_PATH}/contact`} element={<div className="max-w-screen-xl mx-auto"><Contact/></div>}/>

                            {/* Root routes */}
                            <Route path="/" element={<Navigate to={BASE_PATH} />}/>
                            <Route path="/products" element={<Navigate to={`${BASE_PATH}/products`} />}/>
                            <Route path="/about" element={<Navigate to={`${BASE_PATH}/about`} />}/>
                            <Route path="/contact" element={<Navigate to={`${BASE_PATH}/contact`} />}/>

                            {/* Fallback route */}
                            <Route path="*" element={<Navigate to={BASE_PATH} />} />
                        </Routes>
                    </div>
                </main>
                {!isAdminRoute && <Footer />}
            </div>
        </AuthProvider>
    );
}

export default App;
