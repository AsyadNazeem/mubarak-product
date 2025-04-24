import {Route, Routes} from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import About from './pages/About';
import Contact from './pages/Contact';

function App() {
    return (
        <div className="min-h-screen flex flex-col w-full">
            <Navbar/>
            <main className="flex-grow w-full bg-[#fef9f4]">
                <div className="w-full mx-auto">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route
                            path="/products"
                            element={
                                <div className="max-w-screen-xl mx-auto">
                                    <Products />
                                </div>
                            }
                        />
                        <Route
                            path="/about"
                            element={
                                <div className="max-w-screen-xl mx-auto">
                                    <About />
                                </div>
                            }
                        />
                        <Route
                            path="/contact"
                            element={
                                <div className="max-w-screen-xl mx-auto">
                                    <Contact />
                                </div>
                            }
                        />
                    </Routes>
                </div>
            </main>
            <Footer/>
        </div>
    );
}

export default App;
