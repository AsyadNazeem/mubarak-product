import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import About from './pages/About';
import Contact from './pages/Contact';

function App() {
    return (
        <Router>
            <div className="min-h-screen flex flex-col w-full">
                <Navbar />
                <main className="flex-grow w-full bg-[#fef9f4]">
                    <div className="w-full max-w-screen-xl mx-auto">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/products" element={<Products />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/contact" element={<Contact />} />
                        </Routes>
                    </div>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
