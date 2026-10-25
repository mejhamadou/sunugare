import { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { api } from '../services/api';

export default function Controle() {
    const [numeroBillet, setNumeroBillet] = useState('');
    const [resultat, setResultat] = useState<any>(null);
    const [error, setError] = useState('');
    const [scanActif, setScanActif] = useState(false);

    // Fonction de validation (utilisée par le formulaire et le scanner)
    const validerBillet = async (code: string) => {
        setResultat(null);
        setError('');
        try {
            const billet = await api.validerBillet(code);
            setResultat(billet);
            setScanActif(false); // On arrête le scan si c'est valide
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        validerBillet(numeroBillet);
        setNumeroBillet('');
    };

    // Effet pour gérer la caméra
    useEffect(() => {
        let scanner: Html5QrcodeScanner;

        if (scanActif) {
            scanner = new Html5QrcodeScanner(
                "reader",
                { fps: 10, qrbox: { width: 250, height: 250 } },
                /* verbose= */ false
            );

            scanner.render(
                (decodedText) => {
                    // Dès qu'un code est scanné, on le valide
                    validerBillet(decodedText);
                    scanner.clear(); // On arrête la caméra
                },
                (_error) => {
                    // On ignore les erreurs de scan en continu pour ne pas spammer la console
                }
            );
        }

        return () => {
            if (scanner) {
                scanner.clear().catch(e => console.error("Erreur clear scanner", e));
            }
        };
    }, [scanActif]);

    return (
        <div>
            <h1 style={{ marginBottom: '20px' }}>Contrôle à l'embarquement</h1>

            <div className="grid-cards" style={{ gridTemplateColumns: '1fr 1fr' }}>

                {/* ZONE DE SCAN */}
                <div className="card">
                    <h3>Scanner un billet</h3>
                    {!scanActif ? (
                        <div style={{ textAlign: 'center', padding: '20px 0' }}>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                                Scannez le QR Code du passager.
                            </p>
                            <button onClick={() => setScanActif(true)} style={{ backgroundColor: '#8B5CF6', marginBottom: '20px', width: '100%', padding: '20px', fontSize: '18px', borderRadius: '10px' }}>
                                📷 Ouvrir la caméra
                            </button>

                            <div style={{ textAlign: 'left' }}>
                                <label>Saisie manuelle :</label>
                                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
                                    <input
                                        type="text"
                                        placeholder="Code"
                                        value={numeroBillet}
                                        onChange={(e) => setNumeroBillet(e.target.value.toUpperCase())}
                                        required
                                        style={{ flex: 1, marginBottom: 0, fontSize: '18px', textAlign: 'center' }}
                                    />
                                    <button type="submit" style={{ padding: '0 20px' }}>OK</button>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div id="reader" style={{ width: '100%', borderRadius: '8px', overflow: 'hidden' }}></div>
                            <button onClick={() => setScanActif(false)} className="btn-danger" style={{ marginTop: '15px', width: '100%' }}>
                                Arrêter le scan
                            </button>
                        </div>
                    )}
                </div>

                {/* RÉSULTAT DU SCAN */}
                <div className="card">
                    <h3>Résultat</h3>

                    {!resultat && !error && (
                        <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                            En attente d'un scan...
                        </div>
                    )}

                    {error && (
                        <div style={{ backgroundColor: '#FEE2E2', color: '#B91C1C', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
                            <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>❌ Accès Refusé</h2>
                            <p>{error}</p>
                        </div>
                    )}

                    {resultat && (
                        <div style={{ backgroundColor: '#D1FAE5', color: '#065F46', padding: '20px', borderRadius: '8px' }}>
                            <h2 style={{ fontSize: '20px', marginBottom: '15px', textAlign: 'center' }}>✅ Billet Valide</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                                <p><strong>Passager :</strong> {resultat.nomPassager}</p>
                                {resultat.numeroSiege !== 'Abonnement' && <p><strong>Siège :</strong> {resultat.numeroSiege}</p>}
                                <p><strong>Voyage :</strong> {resultat.voyage?.ligne?.villeDepart?.nom} ➔ {resultat.voyage?.ligne?.villeArrivee?.nom}</p>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}