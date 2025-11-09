# Kinks Profile Generator

A Next.js application for creating and sharing kinks profiles based on Aella's kinks list data.

## Features

- 📊 Interactive scatter plot visualization using Chart.js
- 🔐 Optional client-side E2E encryption with password protection
- 🔗 Short URL generation for easy sharing
- 📱 Responsive design with dark theme
- 💾 PostgreSQL database for storing profiles
- 🐳 Docker support for easy deployment

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: PostgreSQL with Prisma ORM
- **Charts**: Chart.js with react-chartjs-2
- **Encryption**: crypto-js (client-side)
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- Docker & Docker Compose (for running with containers)

### Development Setup

1. **Clone the repository**

```bash
cd kinks-bksp-in
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
```

Edit `.env` and configure your database connection.

**For easier testing**, set `NEXT_PUBLIC_USE_TEST_DATA="true"` in `.env` to use only 15 kinks instead of all 246.

4. **Start PostgreSQL with Docker (Development)**

```bash
docker-compose -f docker-compose.dev.yml up -d
```

5. **Run database migrations**

```bash
pnpm prisma:migrate
```

6. **Start development server**

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Production with Docker

1. **Build and start all services**

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database on port 5432
- Next.js application on port 3000

2. **Run migrations**

```bash
docker-compose exec app pnpm prisma:migrate
```

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm prisma:migrate` - Run database migrations
- `pnpm prisma:studio` - Open Prisma Studio
- `pnpm docker:up` - Start Docker services
- `pnpm docker:down` - Stop Docker services

## Project Structure

```
├── app/
│   ├── api/
│   │   └── profiles/          # API routes
│   ├── create/                # Profile creation page
│   ├── [shortId]/             # Profile view page
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Landing page
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── KinkRatingSlider.tsx   # Rating slider component
│   ├── ProfileChart.tsx       # Chart.js visualization
│   ├── PasswordPrompt.tsx     # Password dialog
│   └── StepWizard.tsx         # Multi-step form
├── lib/
│   ├── aella-data.ts          # Kinks data utilities
│   ├── encryption.ts          # Encryption utilities
│   ├── prisma.ts              # Prisma client
│   └── utils.ts               # General utilities
├── prisma/
│   └── schema.prisma          # Database schema
├── aella_data.json            # Source data (246 kinks)
├── aella_data.test.json       # Test data (15 kinks for easier testing)
├── docker-compose.yml         # Production Docker config
├── docker-compose.dev.yml     # Development Docker config
└── Dockerfile                 # Application Dockerfile
```

## Testing

For easier testing during development, you can use a smaller dataset:

1. Set `NEXT_PUBLIC_USE_TEST_DATA="true"` in your `.env` file
2. Restart the dev server
3. The app will now use only 15 kinks instead of 246

The test dataset ([aella_data.test.json](aella_data.test.json)) includes a diverse range of kinks:
- Common/vanilla: blowjobs, cunnilingus, anal sex
- Light BDSM: light spanking, hair pulling, bondage
- Role-based: dominant, submissive
- Taboo: scat, furries, rapeplay
- Fetishes: feet, urine, choking

To switch back to the full dataset, set `NEXT_PUBLIC_USE_TEST_DATA="false"`.

## How It Works

1. **Create Profile**: Users fill out a step-by-step form rating 246 kinks from 0-100
2. **Optional Encryption**: Users can set a password for client-side AES encryption
3. **Generate Link**: System creates a short URL using nanoid
4. **View Profile**: Interactive chart displays ratings on a scatter plot with:
   - X-axis: Tabooness score
   - Y-axis: Popularity (logarithmic scale)
   - Color: Green (high rating) to Red (low rating)
   - Zoom & Pan support

## Database Schema

```prisma
model Profile {
  id          String   @id @default(cuid())
  shortId     String   @unique
  nickname    String
  data        String   // JSON (encrypted if password set)
  isEncrypted Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## Security

- Passwords are NEVER sent to the server
- Encryption happens entirely client-side using AES
- Encrypted data is stored as an encrypted string in the database
- Decryption also happens client-side when viewing profiles

## License

MIT
