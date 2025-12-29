# Expense Tracker

A full-stack expense tracking application built with React Router and Express.js. This application helps users track and manage their personal expenses efficiently.

## Project Structure

```
Expense Tracker/
├── client/                 # Frontend React application
│   ├── app/
│   │   ├── routes/         # Application routes
│   │   ├── app.css         # Global styles
│   │   ├── root.tsx        # Root component
│   │   └── routes.ts       # Route definitions
│   ├── public/             # Static assets
│   └── ...
├── server/                 # Backend Express API
│   ├── src/
│   │   ├── configurations/ # App configurations
│   │   │   ├── env.config.ts    # Environment variables
│   │   │   ├── logger.config.ts # Winston logger setup
│   │   │   └── morgan.config.ts # HTTP request logging
│   │   ├── types/          # TypeScript type definitions
│   │   ├── app.ts          # Express app setup
│   │   └── index.ts        # Server entry point
│   └── ...
└── README.md
```

## Tech Stack

### Frontend (Client)
- **React 19** - UI library
- **React Router 7** - Routing and SSR framework
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Utility-first CSS framework
- **Vite 7** - Build tool and dev server

### Backend (Server)
- **Express 5** - Web framework for Node.js
- **TypeScript** - Type safety
- **Winston** - Logging library
- **Morgan** - HTTP request logger middleware
- **TSX** - TypeScript execution engine

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd "Expense Tracker"
```

### 2. Install dependencies

**Client:**
```bash
cd client
npm install
```

**Server:**
```bash
cd server
npm install
```

### 3. Environment Setup

**Server:**
Create a `.env` file in the `server` directory:

```env
NODE_ENV=development
PORT=3000
```

### 4. Run the application

**Start the server (development mode):**
```bash
cd server
npm run dev
```

**Start the client (development mode):**
```bash
cd client
npm run dev
```

## Available Scripts

### Client

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run typecheck` | Run TypeScript type checking |

### Server

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run start` | Start production server |

## Features

- Track daily expenses
- Categorize expenses
- View expense history
- Modern and responsive UI

## Docker Support

The client includes Docker support for containerized deployment.

```bash
cd client
docker build -t expense-tracker-client .
docker run -p 3000:3000 expense-tracker-client
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
