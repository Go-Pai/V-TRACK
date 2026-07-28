# V-Track (High Performance Workout Tracker)

V-Track is a sleek, high-performance workout tracking application built for athletes and fitness enthusiasts. It features a modern, dark-themed UI with a focus on speed, aesthetics, and ease of use.

## Features

- **Guest Mode & Authentication**: Try the app instantly as a guest, or create an account to save your progress permanently using NextAuth.
- **Active Workout Session**: Track your exercises, sets, weights, reps, and RPE in real-time. 
- **Workout Summary & History**: View detailed summaries of your completed workouts, including total volume lifted and time elapsed.
- **Dynamic Profile**: Manage your stats (weight, height) and profile picture.
- **Modern UI/UX**: Built with a sleek dark aesthetic, dynamic color accents, and responsive layout.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database**: PostgreSQL (via [Supabase](https://supabase.com/))
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [NextAuth.js v5 (Auth.js)](https://authjs.dev/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)

## Getting Started

First, clone the repository and install the dependencies:

```bash
bun install
```

Set up your environment variables by creating a `.env` file based on `.env.example` (or just add the following):

```env
DATABASE_URL="your-postgresql-url-here"
AUTH_SECRET="your-random-secret-key"
```

Initialize the database:

```bash
bunx prisma db push
```

Run the development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app in action.

## Deployment

The easiest way to deploy this application is using [Vercel](https://vercel.com/). 
The `build` script in `package.json` is already configured to run `prisma generate && prisma db push && next build` to ensure the database schema is synchronized automatically during deployment.

1. Push your code to GitHub.
2. Create a project in Vercel and import your repository.
3. Add the `DATABASE_URL` and `AUTH_SECRET` environment variables.
4. Deploy!
