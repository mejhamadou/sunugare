import { useState } from 'react';
import './index.css'; // On va mettre les styles dedans

export default function App() {
  const [email, setEmail] = useState('');
  const [messageEnvoye, setMessageEnvoye] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici, plus tard, tu pourras envoyer l'email à ton backend ou via un service comme EmailJS
    setMessageEnvoye(true);
    setEmail('');
  };

  return (
      <div className="vitrine-container">
        {/* HEADER */}
        <header className="header">
          <img src="/logo.png" alt="SUNUGARE" className="logo" />
          <nav>
            <a href="#fonctionnalites">Fonctionnalités</a>
            <a href="#contact" className="btn-primary">Demander une démo</a>
          </nav>
        </header>

        {/* HERO SECTION */}
        <section className="hero">
          <div className="hero-content">
            <h1>Modernisez la gestion de votre gare routière.</h1>
            <p>La première plateforme intelligente au Sénégal pour digitaliser la vente de billets, sécuriser les recettes et optimiser vos départs.</p>
            <a href="#contact" className="btn-primary-large">Je veux une démo gratuite</a>
          </div>
          <div className="hero-image">
            {/* Tu peux mettre une capture d'écran de ton Dashboard ici */}
              <img src="/dashboard.png" alt="Aperçu du Dashboard SUNUGARE" className="dashboard-img" />
          </div>
        </section>

        {/* FONCTIONNALITÉS */}
        <section id="fonctionnalites" className="features">
          <h2>Pourquoi choisir SUNUGARE ?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="icon">🎟️</div>
              <h3>Billetterie Digitale</h3>
              <p>Vente rapide avec QR Code, impression PDF et contrôle à l'embarquement par smartphone.</p>
            </div>
            <div className="feature-card">
              <div className="icon">🛡️</div>
              <h3>Conformité & Sécurité</h3>
              <p>Blocage automatique des bus sans assurance ou des chauffeurs sans permis valide.</p>
            </div>
            <div className="feature-card">
              <div className="icon">📊</div>
              <h3>Tableau de bord & IA</h3>
              <p>Suivez vos recettes en temps réel et laissez l'IA prédire l'affluence de demain.</p>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="contact">
          <h2>Prêt à passer au numérique ?</h2>
          <p>Laissez-nous vos coordonnées pour organiser une démonstration de 15 minutes.</p>

          {messageEnvoye ? (
              <div className="success-msg">✅ Merci ! Nous vous recontacterons très vite.</div>
          ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <input
                    type="email"
                    placeholder="Votre adresse email professionnelle"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Demander la démo</button>
              </form>
          )}
        </section>

        {/* FOOTER */}
        <footer>
          <p>© {new Date().getFullYear()} SUNUGARE par Jokko Technologies. Tous droits réservés.</p>
        </footer>
      </div>
  );
}