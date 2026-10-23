# SUNUGARE — Système intelligent de gestion automatisée des gares

**Éditeur** : Jokko Technologies
**Version** : 1.0.0 (développement)

## Prérequis

- Java 21
- Maven 3.9+
- Node.js 20+ (ou supérieur)
- Docker & Docker Compose

## Démarrage rapide (Docker)

```bash
docker compose up --build -d

Frontend : http://localhost

Backend : http://localhost:8082/api/health

PostgreSQL : localhost:5433 (user: sunugare, password: sunugare_dev_password)

Démarrage en développement (sans Docker pour le code)
Backend
bash
cd sunugare-backend
mvn spring-boot:run
Frontend
bash
cd sunugare-frontend
npm install
npm run dev
Frontend : http://localhost:3000 (ou 3020 si le port est occupé)

Backend : http://localhost:8082

Structure
text
.
├── docker-compose.yml          # Environnement complet
├── sunugare-backend/           # API Spring Boot
│   ├── Dockerfile
│   └── src/
├── sunugare-frontend/          # Interface React
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src/
└── .gitlab-ci.yml              # Pipeline CI
Contact
Chef de projet : [Mejhamadou Tidiane SAMB]