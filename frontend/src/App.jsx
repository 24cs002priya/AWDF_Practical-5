import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Cars from './pages/Cars';
import Contact from './pages/Contact';
function NotFound() { return <section className="panel"><h1>404 — Page not found</h1><p>That nexTrip page does not exist.</p></section>; }
export default function App() { const [theme, setTheme] = useState('dark'); const [user, setUser] = useState(null); useEffect(() => { document.documentElement.className = theme; }, [theme]); return <BrowserRouter><NavBar theme={theme} onToggle={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} authenticated={!!user} onLogout={() => { localStorage.removeItem('nextrip_token'); setUser(null); }}/><main><Routes><Route path="/" element={<Home />}/><Route path="/cars" element={<Cars />}/><Route path="/projects" element={<Navigate to="/cars" replace/>}/><Route path="/contact" element={<Contact />}/><Route path="*" element={<NotFound />}/></Routes></main><footer>© {new Date().getFullYear()} nexTrip · Discover your next drive</footer></BrowserRouter>; }
