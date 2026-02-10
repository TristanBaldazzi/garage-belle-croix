# Garage de la Belle Croix

Site web pour le Garage de la Belle Croix avec gestion des offres et demandes de contact.

## Architecture

- **Backend**: API REST Express.js dans `/backend`
- **Frontend**: Application Next.js 14 (App Router) dans `/frontend`
- **Communication**: API REST avec authentification JWT via cookies

## Technologies

### Backend
- Node.js (ES Modules)
- Express.js
- MongoDB avec Mongoose
- JWT (jsonwebtoken) + cookies
- Helmet, CORS, express-rate-limit
- Multer, Sharp
- Nodemailer, OpenAI API

### Frontend
- Next.js 14 (App Router)
- TypeScript
- React 18
- Tailwind CSS
- Zustand
- Axios
- React Hook Form
- React Hot Toast

## Installation

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Éditer .env avec vos configurations
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Éditer .env.local avec l'URL de l'API
npm run dev
```

Le frontend démarre sur le port **3000** par défaut.

## Configuration

### Backend (.env)
- `PORT`: Port du serveur (défaut: 5000)
- `MONGODB_URI`: URI de connexion MongoDB
- `JWT_SECRET`: Secret pour les tokens JWT
- `JWT_EXPIRE`: Durée de validité des tokens (défaut: 7d)
- `FRONTEND_URL`: URL du frontend pour CORS

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL`: URL de l'API backend

**Note**: Le frontend utilise le port **3000** par défaut.

## Utilisation

1. Démarrer MongoDB
2. Démarrer le backend: `cd backend && npm run dev`
3. Démarrer le frontend: `cd frontend && npm run dev`
4. Accéder à l'application: http://localhost:3000
5. Accéder à l'admin: http://localhost:3000/admin

## Création du compte admin

Pour créer un compte admin, utilisez le script fourni :

```bash
cd backend
npm run create-admin
```

Le script vous demandera l'email et le mot de passe pour créer le compte administrateur.

## Structure

```
projet/
├── backend/
│   ├── models/      # Modèles Mongoose
│   ├── routes/      # Routes API
│   ├── middleware/  # Middleware (auth)
│   └── server.js    # Point d'entrée
│
└── frontend/
    ├── app/         # Pages (App Router)
    ├── components/  # Composants React
    └── lib/         # Utilitaires (API, store)
```

