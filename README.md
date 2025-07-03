# Whispr Room

A disposable chat room for quick, ephemeral conversations.

## Features

- Create or join a chat room with a unique code
- Share room codes with others
- Enter a username to participate
- Real-time chat with participants
- See a list of current participants
- Leave the room at any time

## Tech Stack

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Convex](https://convex.dev/) (for backend/database)
- [React Query](https://tanstack.com/query/latest)
- [Tailwind](https://tailwindcss.com/)

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- pnpm (or npm/yarn)

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
   Send messages, see participants, and leave the room when done.

## App Sections

### 1. Onboarding Page

- Create a room and share the code with others.
- Join a room with a code.
- Enter your username to participate.

### 2. Room Chat Page

- Displays the room code and participants list.
- Chat with others until the room expires.
- Leave the room at any time.

<!-- ## Screenshots -->

<!-- Add screenshots or GIFs here if available -->

## Todo

- [x] time remaining to expire in the chat header
- [x] message view should be scrolled down to the latest message
- [ ] timer countdown should be improved by using framer motion
- [x] system messages should be added e.g. `<username> entered the room`, `<username> left the room`
- [ ] cron jobs for scheduled cleanup of expired rooms
- [ ] background should have an animation and must be soothing
- [x] upon room expiry, if the user is still on the `/room/<id>` page then it should redirect the user to `/` page.
- [ ] if the user is not on the room tab, before redirecting it should wait for the tab to active and then it should redirect after 3 seconds
- [ ] online status for participants in the list

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
