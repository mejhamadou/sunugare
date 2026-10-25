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
import Utilisateurs from './pages/Utilisateurs';
import Infrastructures from './pages/Infrastructures';
import Planning from './pages/Planning';
import ReservationPublique from './pages/ReservationPublique';
import Abonnements from './pages/Abonnements';
import JournalAudit from './pages/JournalAudit';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/reserver" element={<ReservationPublique />} />

                {/* Routes protégées enveloppées dans le Layout */}
                <Route element={<Layout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/vehicules" element={<Vehicules />} />
                    <Route path="/chauffeurs" element={<Chauffeurs />} />
                    <Route path="/voyages" element={<Voyages />} />
                    <Route path="/billetterie" element={<Billeterie />} />
                    <Route path="/controle" element={<Controle />} />
                    <Route path="/utilisateurs" element={<Utilisateurs />} />
                    <Route path="/infrastructures" element={<Infrastructures />} />
                    <Route path="/planning" element={<Planning />} />
                    <Route path="/abonnements" element={<Abonnements />} />
                    <Route path="/audit" element={<JournalAudit />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;