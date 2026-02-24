# HeapFlow

A modern Stack Overflow clone built with Next.js 15, featuring a beautiful UI, real-time interactions, and comprehensive Q&A functionality.

![Next.js](https://img.shields.io/badge/Next.js-16.1.4-black?style=flat-square&logo=next.js)
![Prisma](https://img.shields.io/badge/Prisma-7.3.0-2D3748?style=flat-square&logo=prisma)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat-square&logo=tailwind-css)

## Features

### Core Functionality
- **Questions & Answers** - Ask questions, provide answers with rich text formatting
- **Voting System** - Upvote/downvote questions and answers
- **Comments** - Nested commenting on questions and answers
- **User Reputation** - Gamified reputation system based on contributions
- **Search** - Search through questions with filters

### User Features
- **Authentication** - Secure login/register with NextAuth.js (JWT strategy)
- **User Profiles** - View user activity, questions, answers, and votes
- **Profile Editing** - Update name, bio, avatar with validation

### UI/UX
- **Responsive Design** - Mobile-first approach
- **Rich Text Editor** - Full-featured RTE for questions and answers
- **Image Upload** - ImageKit integration for question and profile images
- **Beautiful Animations** - Framer Motion powered transitions
- **Magic UI Components** - Animated grid patterns, meteors, sparkles, and more

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16.1.4 (App Router) |
| Language | TypeScript 5 |
| Database | PostgreSQL with Prisma ORM 7.3.0 |
| Authentication | NextAuth.js 4.24.13 |
| Styling | Tailwind CSS 4 |
| UI Components | Shadcn UI, Radix UI Primitives |
| Image Storage | ImageKit |
| State Management | React Context API |
| Form Validation | Server Actions with Zod-like validation |
| Animations | Framer Motion |
| Icons | Tabler Icons |
| Notifications | Sonner Toast |

## Project Structure

```
heapflow/
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                    # Static assets
├── src/
│   ├── actions/               # Server actions
│   │   ├── answers.ts         # Answer CRUD operations
│   │   ├── comments.ts        # Comment operations
│   │   ├── questions.ts       # Question CRUD operations
│   │   ├── users.ts           # User profile operations
│   │   └── votes.ts           # Voting operations
│   ├── app/
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   ├── (auth)/            # Auth route group
│   │   │   ├── layout.tsx
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (route)/           # Main routes
│   │   │   ├── questions/
│   │   │   │   ├── page.tsx           # Questions listing
│   │   │   │   ├── Search.tsx         # Search component
│   │   │   │   ├── ask/               # Ask question page
│   │   │   │   └── [quesId]/[quesName]/
│   │   │   │       ├── page.tsx       # Question detail
│   │   │   │       ├── edit/          # Edit question
│   │   │   │       ├── DeleteQuestion.tsx
│   │   │   │       └── EditQuestion.tsx
│   │   │   └── users/
│   │   │       └── [userId]/[userSlug]/
│   │   │           ├── page.tsx       # User profile
│   │   │           ├── layout.tsx
│   │   │           ├── Navbar.tsx
│   │   │           ├── EditButton.tsx
│   │   │           ├── edit/          # Edit profile
│   │   │           ├── answers/       # User's answers
│   │   │           ├── questions/     # User's questions
│   │   │           └── votes/         # User's votes
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── [...nextauth]/     # NextAuth handler
│   │       │   └── register/          # Registration API
│   │       └── imagekit/              # ImageKit API
│   ├── components/
│   │   ├── Answers.tsx                # Answers component
│   │   ├── Comments.tsx               # Comments component
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── Pagination.tsx
│   │   ├── QuestionStats.tsx
│   │   ├── RTE.tsx                    # Rich Text Editor
│   │   ├── UserReputationDisplay.tsx
│   │   ├── VoteButtons.tsx
│   │   ├── home/                      # Home page components
│   │   │   ├── HeroSection.tsx
│   │   │   ├── HeroSectionHeader.tsx
│   │   │   ├── LatestQuestions.tsx
│   │   │   ├── ScrollableMarquee.tsx
│   │   │   └── TopContributors.tsx
│   │   ├── magicui/                   # Magic UI components
│   │   │   ├── animated-grid-pattern.tsx
│   │   │   ├── border-beam.tsx
│   │   │   ├── line-shadow-text.tsx
│   │   │   ├── marquee.tsx
│   │   │   ├── meteors.tsx
│   │   │   ├── neon-gradient-card.tsx
│   │   │   ├── particles.tsx
│   │   │   ├── shimmer-button.tsx
│   │   │   ├── sparkles-text.tsx
│   │   │   └── tracing-beam.tsx
│   │   ├── provider/
│   │   │   ├── Provider.tsx           # Global providers
│   │   │   └── theme-provider.tsx     # Theme provider
│   │   ├── question/
│   │   │   ├── QuestionCard.tsx
│   │   │   └── QuestionForm.tsx       # Create/Edit question form
│   │   └── ui/                        # Shadcn UI components
│   │       ├── alert-dialog.tsx
│   │       ├── background-beams.tsx
│   │       ├── button.tsx
│   │       ├── floating-navbar.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       └── sonner.tsx
│   ├── hooks/
│   │   └── useFetch.ts                # Custom fetch hook
│   ├── lib/
│   │   ├── prisma.ts                  # Prisma client
│   │   └── utils.ts                   # Utility functions
│   ├── store/
│   │   ├── Auth.ts                    # NextAuth configuration
│   │   ├── QuestionStatsContext.tsx   # Question stats context
│   │   └── ReputationContext.tsx      # Reputation context
│   └── utils/
│       ├── relativeTime.ts            # Time formatting
│       └── slugify.ts                 # URL slug generation
├── components.json                    # Shadcn UI config
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── prisma.config.ts
└── tsconfig.json
```

## Database Schema

### Models

**User**
- `id` - Unique identifier
- `name` - Display name
- `email` - Unique email
- `password` - Hashed password
- `bio` - User biography
- `avatarUrl` - Profile picture URL
- `reputation` - User reputation score
- Relations: Questions, Answers, Comments, Votes

**Question**
- `id` - Unique identifier
- `title` - Question title
- `content` - Rich text content
- `tags` - Array of tags
- `imageUrl` - Optional image
- `authorId` - Author reference
- Relations: Answers, Comments, Votes

**Answer**
- `id` - Unique identifier
- `content` - Rich text content
- `questionId` - Question reference
- `authorId` - Author reference
- Relations: Comments, Votes

**Comment**
- `id` - Unique identifier
- `content` - Comment text
- `type` - QUESTION or ANSWER
- `typeId` - Reference ID
- `authorId` - Author reference

**Vote**
- `id` - Unique identifier
- `status` - UPVOTE or DOWNVOTE
- `type` - QUESTION or ANSWER
- `typeId` - Reference ID
- `userId` - Voter reference

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- ImageKit account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/heapflow.git
   cd heapflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/heapflow?schema=public"

   # NextAuth
   NEXTAUTH_SECRET="your-super-secret-key-min-32-characters"
   NEXTAUTH_URL="http://localhost:3000"

   # ImageKit
   NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY="public_xxxxxxxxxxxx"
   IMAGEKIT_PRIVATE_KEY="private_xxxxxxxxxxxx"
   NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/your_imagekit_id"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run migrations
   npx prisma migrate dev --name init

   # (Optional) Seed the database
   npx prisma db seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the app**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string
| `NEXTAUTH_SECRET` | Secret for JWT encryption (min 32 chars)
| `NEXTAUTH_URL` | Base URL of your application
| `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY` | ImageKit public key
| `IMAGEKIT_PRIVATE_KEY` | ImageKit private key
| `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` | ImageKit URL endpoint

## 🔧 Scripts

```bash
# Development
npm run dev          # Start development server

# Build
npm run build        # Build for production
npm start           # Start production server

# Database
npx prisma generate  # Generate Prisma client
npx prisma migrate dev   # Run migrations in development
npx prisma migrate deploy # Run migrations in production
npx prisma studio    # Open Prisma Studio GUI

# Linting
npm run lint         # Run ESLint
```

## API Routes

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth handlers (login, logout, session)

### ImageKit
- `POST /api/imagekit` - Get upload authentication parameters
- `DELETE /api/imagekit` - Delete an image

## Server Actions

| Action | File | Description |
|--------|------|-------------|
| `createQuestion` | `questions.ts` | Create a new question |
| `getQuestions` | `questions.ts` | Get paginated questions |
| `getQuestionById` | `questions.ts` | Get single question with details |
| `updateQuestion` | `questions.ts` | Update existing question |
| `deleteQuestion` | `questions.ts` | Delete question and image |
| `createAnswer` | `answers.ts` | Create answer for question |
| `getAnswers` | `answers.ts` | Get answers for question |
| `createComment` | `comments.ts` | Create comment |
| `getComments` | `comments.ts` | Get comments |
| `vote` | `votes.ts` | Create/toggle vote |
| `getVotes` | `votes.ts` | Get votes for item |
| `updateUser` | `users.ts` | Update user profile |
| `changePassword` | `users.ts` | Change user password |

## UI Components

### Shadcn UI
- AlertDialog, Button, Input, Label
- Customizable with Tailwind CSS

### Magic UI
- Animated Grid Pattern
- Border Beam
- Meteors
- Neon Gradient Card
- Particles
- Shimmer Button
- Sparkles Text
- Tracing Beam

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Magic UI](https://magicui.design/)
- [ImageKit](https://imagekit.io/)
- [Tabler Icons](https://tabler.io/icons)
