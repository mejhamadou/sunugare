# 🚌 SUNUGARE - Système Intelligent de Gestion Automatisée des Gares Routières

**Éditeur** : Jokko Technologies
**Version** : 1.0.0 (V1 validée)
**Statut** : Développement terminé pour la V1

## 📋 Description
SUNUGARE est une plateforme web et mobile conçue pour moderniser la gestion des gares routières au Sénégal. Elle permet la gestion des référentiels (gares, compagnies, véhicules), la planification des voyages, la billetterie avec génération de QR Codes, et le contrôle à l'embarquement.

## 🛠️ Stack Technique
- **Backend** : Java 21, Spring Boot 3.x, Spring Security (JWT), Spring Data JPA, Flyway
- **Base de données** : PostgreSQL 16
- **Frontend** : React (Vite), TypeScript, CSS pur
- **Génération PDF & QR Code** : OpenPDF, Google ZXing
- **Mobile** : PWA (Progressive Web App) avec scan caméra via `html5-qrcode`
- **Déploiement** : Docker, Docker Compose
- **CI/CD** : GitHub Actions

## 🚀 Installation et Lancement (Docker)

C'est la méthode la plus simple pour tester l'application.

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/ton-username/sunugare.git
   cd sunugare
Lancez l'environnement complet :

bash
docker compose up --build -d
Accédez à l'application :

Frontend : http://localhost (ou le port défini sur votre machine)

Backend API : http://localhost:8082/api/health

💻 Lancement en mode Développement
Backend
bash
cd sunugare-backend
mvn spring-boot:run
Frontend
bash
cd sunugare-frontend
npm install
npm run dev
(Note : Pour tester la caméra sur mobile, le frontend doit être servi en HTTPS, par exemple via Ngrok ou un certificat local).

🔐 Comptes par défaut (Base de données fraîche)
Email : admin@sigar.local (ou créez-en un via /api/auth/register)

Mot de passe : password (ou celui défini lors de l'inscription)

📂 Structure du projet
text
sunugare/
├── sunugare-backend/       # API Spring Boot
├── sunugare-frontend/      # Application React
├── docker-compose.yml      # Orchestration des conteneurs
└── .github/workflows/      # Pipeline CI
👨‍💻 Auteur
Développeur : [Mejhamadou Tidiane SAMB]

Contact : [mejsamb@gmail.com]