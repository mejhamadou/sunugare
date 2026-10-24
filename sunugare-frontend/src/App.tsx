import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Layout from './components/Layout';
import Vehicules from './pages/Vehicules';
import Chauffeurs from './pages/Chauffeurs';
import Voyages from './pages/Voyages';
import Billeterie from './pages/Billeterie';
import Controle from './pages/Controle';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />

                {/* Routes protégées enveloppées dans le Layout */}
                <Route element={<Layout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/vehicules" element={<Vehicules />} />
                    <Route path="/chauffeurs" element={<Chauffeurs />} />
                    <Route path="/voyages" element={<Voyages />} />
                    <Route path="/billetterie" element={<Billeterie />} />
                    <Route path="/controle" element={<Controle />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;