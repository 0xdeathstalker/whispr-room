# Whispr Room

A disposable chat room for quick, ephemeral conversations.

## Features

- Create or join a chat room with a unique code
- Share room codes with others
- Enter a username to participate
- Real-time chat with participants
- Share media files with others
- See a list of current participants
- Leave the room at any time

## Tech Stack

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Convex](https://convex.dev/)
- [React Query](https://tanstack.com/query/latest)
- [Zod](https://zod.dev/)
- [Tailwind](https://tailwindcss.com/)
- [Uploadthing](https://uploadthing.com/)
- [Motion](https://motion.dev/)
- [PostHog](https://posthog.com/)

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- pnpm

### Installation

```bash
git clone https://github.com/0xdeathstalker/whispr-room.git
cd whispr-room
pnpm install
```

### Running the App

```bash
pnpm dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Usage

1. **Create a Room:**  
   On the onboarding page, create a new room and share the code with others.

2. **Join a Room:**  
   Enter a room code and your username to join an existing room.

3. **Chat:**  
   Send messages, share any media files, see participants, and leave the room when done.

## App Sections

### 1. Onboarding Page

- Create a room and share the code with others.
- Join a room with a code.
- Enter your username to participate.

### 2. Room Chat Page

- Displays the room code and participants list.
- Chat with others until the room expires.
- Share media with them.
- Leave the room at any time.

<!-- ## Screenshots -->

<!-- Add screenshots or GIFs here if available -->

## Future Improvements

- [x] allow media sharing (images, videos, audio, files)
- [x] integrate posthog for analytics
- [ ] end-to-end encryption
- [ ] explore AI integration (tidbit.ai)
- [ ] explore porto.sh integration

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
