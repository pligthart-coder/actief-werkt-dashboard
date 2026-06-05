# Actief Werkt! - Go-live Dashboard

Real-time go-live checklist voor de Carerix implementatie bij Actief Werkt!

## Features

- 🔐 **Authenticatie** - Veilige login met NextAuth.js
- 📊 **Real-time updates** - Iedereen ziet de status live (auto-refresh elke 5 seconden)
- ✅ **Checklist tracking** - Vink items af en zie de voortgang
- 💾 **Database opslag** - Alle wijzigingen worden opgeslagen in SQLite
- 📱 **Responsive design** - Werkt op desktop, tablet en mobiel
- 🖨️ **Print functie** - Print of sla op als PDF

## Technologie Stack

- **Next.js 15** - React framework met App Router
- **TypeScript** - Type-safe development
- **Prisma** - Database ORM
- **SQLite** - Lokale database
- **NextAuth.js** - Authenticatie
- **TailwindCSS** - Styling
- **SWR** - Data fetching met real-time updates

## Installatie & Setup

1. **Installeer dependencies:**
   ```bash
   npm install
   ```

2. **Database setup:**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

3. **Maak een eerste gebruiker aan:**
   ```bash
   npm run create-user
   ```
   Of registreer via de UI op `/register`

4. **Start de development server:**
   ```bash
   npm run dev
   ```

5. **Open de applicatie:**
   Open [http://localhost:3000](http://localhost:3000) in je browser

## Gebruik

1. **Registreren/Inloggen:**
   - Ga naar `/register` om een account aan te maken
   - Of log in op `/login` met bestaande credentials

2. **Dashboard gebruiken:**
   - Klik op items om ze af te vinken
   - Voortgang wordt automatisch bijgewerkt
   - Wijzigingen zijn direct zichtbaar voor alle gebruikers
   - Gebruik "Reset" om alle vinkjes te wissen
   - Gebruik "Print" om de checklist af te drukken

3. **Real-time updates:**
   - De dashboard refresht automatisch elke 5 seconden
   - Wijzigingen van andere gebruikers worden automatisch getoond

## Project Structuur

```
actief-werkt-dashboard/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/  # NextAuth endpoints
│   │   ├── checklist/           # Checklist API
│   │   └── register/            # User registration
│   ├── dashboard/               # Main dashboard page
│   ├── login/                   # Login page
│   └── register/                # Registration page
├── lib/
│   ├── auth.ts                  # NextAuth configuration
│   └── prisma.ts                # Prisma client
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── migrations/              # Database migrations
└── middleware.ts                # Route protection

```

## Environment Variables

Maak een `.env` bestand aan (wordt automatisch aangemaakt):

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

⚠️ **Belangrijk:** Wijzig `NEXTAUTH_SECRET` voor productie gebruik!

## Deployment

### Vercel (Aanbevolen)

1. Push je code naar GitHub
2. Importeer het project in Vercel
3. Voeg environment variables toe
4. Deploy!

**Let op:** Voor productie moet je SQLite vervangen door PostgreSQL of een andere productie-database.

### Andere platforms

Het project kan ook gedeployed worden op:
- Netlify
- Railway
- Render
- Eigen server met Node.js

## Database Schema

### User
- `id` - Unieke identifier
- `email` - Email adres (unique)
- `password` - Gehashed wachtwoord
- `name` - Naam (optioneel)

### ChecklistItem
- `id` - Unieke identifier
- `itemId` - Checklist item ID (bijv. "do-0", "vr-1")
- `completed` - Boolean status
- `updatedAt` - Laatste wijziging
- `updatedBy` - Email van laatste gebruiker

## Scripts

```bash
# Development server
npm run dev

# Build voor productie
npm run build

# Start productie server
npm start

# Database migrations
npx prisma migrate dev

# Prisma Studio (database viewer)
npx prisma studio
```

## Support

Voor vragen of problemen, neem contact op met het project team.

## Licentie

Privé project voor Actief Werkt!
