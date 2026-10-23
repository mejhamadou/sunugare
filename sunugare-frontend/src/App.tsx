import { useEffect, useState } from 'react'
import './App.css'

interface HealthResponse {
  status: string
  service: string
  version: string
}

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/health')
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          return res.json()
        })
        .then((data) => setHealth(data))
        .catch((err) => setError(err.message))
  }, [])

  return (
      <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
        <h1>SUNUGARE</h1>
        <p>Système intelligent de gestion automatisée des gares</p>

        <h2>État de la connexion API</h2>

        {error && (
            <p style={{ color: 'red' }}>
              ❌ Erreur : {error} — Le backend est-il lancé sur le port 8082 ?
            </p>
        )}

        {!health && !error && <p>⏳ Connexion en cours...</p>}

        {health && (
            <div style={{ color: 'green' }}>
              <p>✅ API connectée</p>
              <ul>
                <li>Service : {health.service}</li>
                <li>Version : {health.version}</li>
                <li>Statut : {health.status}</li>
              </ul>
            </div>
        )}
      </div>
  )
}

export default App