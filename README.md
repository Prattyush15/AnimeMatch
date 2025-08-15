# AnimeMatch

A smart anime recommendation app that learns your preferences through swiping and provides personalized suggestions based on your taste.

**Live Demo:** [anime-match-ten.vercel.app](https://anime-match-ten.vercel.app)

## Features

### Smart Recommendations
- **Cold Start Quiz**: First-time users select favorite genres to kickstart recommendations
- **Intelligent Scoring**: Uses genre overlap and user feedback to rank anime
- **Learning Algorithm**: Improves recommendations based on your "liked" and "disliked" feedback
- **Real-time Data**: Fetches fresh anime data from AniList GraphQL API

### Interactive Swipe Deck
- **Gesture Controls**: Swipe right to add to watch list, left to pass, up for "watched"
- **Keyboard Shortcuts**: 
  - `L` = Add to Watch List
  - `S` = Pass  
  - `W` = Mark as Watched
- **Smooth Animations**: Powered by Framer Motion for fluid interactions
- **Infinite Scroll**: Automatically loads more anime as you swipe

### Personal Lists
- **To Watch**: Save anime you want to watch later
- **Watched**: Track what you've already seen with like/dislike feedback
- **Smart Filtering**: Never see the same anime twice across lists

### Modern UI/UX
- **Responsive Design**: Works perfectly on mobile and desktop
- **Dark Theme**: Easy on the eyes for long browsing sessions
- **Toast Notifications**: Instant feedback with undo options
- **Modal Details**: Rich anime information with trailers and scores

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Animations**: Framer Motion
- **Data Source**: AniList GraphQL API
- **Storage**: LocalStorage (client-side persistence)
- **Deployment**: Vercel

##  Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home (swipe deck)
│   ├── to-watch/          # Watch list page
│   ├── watched/           # Watched anime page
│   ├── how-to/            # Instructions & settings
│   └── api/anilist/       # AniList API proxy
├── components/            # React components
│   ├── SwipeDeck.tsx     # Main swipe interface
│   ├── AnimeCard.tsx     # Anime display card
│   ├── GenreQuiz.tsx     # Initial preference quiz
│   └── ui.tsx            # UI primitives
├── lib/                  # Utility functions
│   ├── storage.ts        # LocalStorage helpers
│   ├── recommend.ts      # Recommendation engine
│   └── data.ts           # Data fetching hooks
└── types.ts              # TypeScript definitions
```

## Local Development

### Prerequisites
- Node.js 18+ 
- npm

### Setup
```bash
# Clone the repository
git clone https://github.com/Prattyush15/AnimeMatch.git
cd AnimeMatch

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## How to Use

1. **First Visit**: Complete the genre preference quiz to set up your profile
2. **Home Page**: Swipe through personalized anime recommendations
   - Swipe right or press `L` to add to your watch list
   - Swipe left or press `S` to pass
   - Swipe up or press `W` to mark as watched
3. **To Watch**: View and manage your saved anime
4. **Watched**: Rate anime you've seen to improve recommendations
5. **How To**: Edit preferences or reset all data

## Recommendation Algorithm

The app uses a multi-factor scoring system:

1. **Genre Matching**: Scores based on overlap with your preferred genres
2. **Feedback Learning**: Boosts/penalties from your like/dislike history
3. **Cold Start Handling**: Emphasizes genre preferences for new users
4. **Smart Filtering**: Excludes already seen, passed, or disliked anime

## Configuration

### Environment Variables
No environment variables required - the app uses public APIs and client-side storage.

### API Configuration
The app proxies AniList requests through `/api/anilist` to handle CORS and caching.

## Data & Privacy

- **No Server Database**: All user data stored locally in browser
- **No Authentication**: No accounts or personal data collection
- **API Usage**: Fetches public anime data from AniList
- **Reset Option**: Full data reset available in settings

## Deployment

The app is deployed on Vercel with automatic deployments from the main branch.

### Deploy Your Own
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Prattyush15/AnimeMatch)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgments

- [AniList](https://anilist.co/) for providing the anime database API
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [Vercel](https://vercel.com/) for seamless deployment

## Issues & Feedback

Found a bug or have a suggestion? Please [open an issue](https://github.com/Prattyush15/AnimeMatch/issues).

---

**Made with ❤️ for anime fans by anime fans**
