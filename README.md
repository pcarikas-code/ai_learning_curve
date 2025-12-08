# AI Learning Curve

A comprehensive AI learning platform built with React, tRPC, and Express. Features include personalized learning paths, interactive quizzes, progress tracking, achievement system, and certificate generation.

## Features

- **🎓 Learning Paths**: Structured courses covering AI fundamentals, machine learning, deep learning, NLP, and computer vision
- **📝 Interactive Quizzes**: Test your knowledge with timed quizzes and instant feedback
- **📊 Progress Tracking**: Monitor your learning journey with detailed progress metrics
- **🏆 Achievement System**: Earn badges and points for completing milestones
- **📜 Certificates**: Generate certificates upon completing learning paths
- **📚 Resources**: Curated collection of articles, videos, and tools
- **✍️ Notes**: Take and manage notes for each module
- **🔖 Bookmarks**: Save your favorite modules and resources
- **🎯 Personalized Onboarding**: Tailored experience based on your skill level and goals

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Tailwind CSS 4** for styling
- **shadcn/ui** components
- **tRPC** for type-safe API calls
- **Wouter** for routing
- **Tanstack Query** for data fetching

### Backend
- **Express 4** server
- **tRPC 11** for API layer
- **Drizzle ORM** for database
- **MySQL/TiDB** database
- **Manus OAuth** for authentication

### Features
- **Achievement System**: 18 predefined achievements across 4 categories
- **Quiz Engine**: Timed quizzes with multiple question types
- **Certificate Generation**: Automated certificate creation
- **File Storage**: S3-compatible storage integration
- **Real-time Notifications**: Toast notifications for achievements

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- pnpm package manager
- MySQL or TiDB database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ai_learning_curve.git
   cd ai_learning_curve
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables (contact admin for credentials)

4. Run database migrations:
   ```bash
   pnpm db:push
   ```

5. Seed achievements:
   ```bash
   pnpm tsx server/seedAchievements.ts
   ```

6. Start development server:
   ```bash
   pnpm dev
   ```

The application will be available at `http://localhost:3000`

## Deployment

### Vercel Deployment

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed deployment instructions.

Quick steps:
1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables
4. Deploy

### Manual Deployment

1. Build the application:
   ```bash
   pnpm build
   ```

2. Start production server:
   ```bash
   pnpm start
   ```

## Project Structure

```
ai_learning_curve/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and configurations
│   └── public/            # Static assets
├── server/                # Backend Express server
│   ├── _core/            # Core server functionality
│   ├── routers.ts        # tRPC routers
│   ├── db.ts             # Database queries
│   └── *.test.ts         # Test files
├── drizzle/              # Database schema and migrations
├── api/                  # Vercel serverless functions
└── shared/               # Shared types and constants
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm test` - Run tests
- `pnpm db:push` - Push database schema changes
- `pnpm check` - Type check
- `pnpm format` - Format code with Prettier

## Environment Variables

Required environment variables are managed through the Manus platform. For Vercel deployment, see [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for the complete list.

## Testing

Run the test suite:

```bash
pnpm test
```

Test coverage includes:
- Authentication flows
- Achievement system
- Database operations
- API endpoints

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Open an issue on GitHub
- Contact the development team

## Acknowledgments

- Built with [Manus](https://manus.im) platform
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)
