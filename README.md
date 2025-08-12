# 📝 Daily Power Journal

A modern, Progressive Web App (PWA) for tracking daily goals, progress, and learnings. Built with React, Node.js, and MongoDB to help boost your productivity and self-reflection.

## 🌟 Features

- **📅 Daily Tracking**: Log your top 3 goals, intentions, and progress
- **🎯 Focus Areas**: Track what you're focusing on each day
- **📊 Progress Monitoring**: Midday check-ins and evening reflections
- **🧠 Learning Capture**: Document daily learnings and wins
- **🌙 Dark Mode**: Beautiful light and dark theme support
- **📱 PWA Support**: Install on mobile and desktop like a native app
- **💾 Offline Capable**: Works without internet connection
- **📤 Export/Import**: Backup and restore your journal data
- **✨ Modern UI**: Clean, responsive design with custom modals

## 🚀 Live Demo

**Frontend**: [https://daily-power-journal.windsurf.build](https://daily-power-journal-redesigned.windsurf.build)

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **Tailwind CSS v4** - Utility-first styling
- **PWA** - Service worker and manifest for native app experience

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
daily-power-journal/
├── client/                 # React frontend
│   ├── public/            # Static assets and PWA files
│   │   ├── manifest.json  # PWA manifest
│   │   ├── sw.js         # Service worker
│   │   └── icon-*.svg    # App icons
│   ├── src/
│   │   ├── components/   # React components
│   │   │   ├── JournalForm.jsx    # Entry creation/editing
│   │   │   ├── JournalList.jsx    # Display entries
│   │   │   ├── Modal.jsx          # Custom confirmation modal
│   │   │   └── InstallPrompt.jsx  # PWA install prompt
│   │   ├── App.jsx       # Main app component
│   │   ├── main.jsx      # Entry point
│   │   └── index.css     # Global styles
│   └── package.json      # Frontend dependencies
└── server/                # Node.js backend
    ├── models/           # MongoDB models
    ├── routes/           # API routes
    ├── index.js          # Server entry point
    └── package.json      # Backend dependencies
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/Om-anand-0/Daily-Journal.git
cd daily-power-journal
```

### 2. Setup Backend
```bash
cd server
npm install

# Create .env file with your MongoDB connection
echo "MONGODB_URI=your_mongodb_connection_string" > .env

# Start the server
npm start
# or for development
npx nodemon index.js
```

### 3. Setup Frontend
```bash
cd ../client
npm install

# Start development server
npm run dev
```

### 4. Access the App
- **Development**: http://localhost:5174
- **Production**: https://daily-power-journal-redesigned.windsurf.build
## 📱 PWA Installation

### On Mobile (Android/iOS)
1. Open the app in your browser
2. Look for "Add to Home Screen" or install prompt
3. Follow the installation steps
4. Access from your home screen like a native app

### On Desktop
1. Open the app in Chrome/Edge
2. Click the install icon in the address bar
3. Or use the custom install prompt in the app
4. Launch from your desktop/start menu

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/daily-journal
PORT=5000
```

**Frontend (.env)**
```env
VITE_API_BASE=http://localhost:5000/api
```

## 📊 Journal Entry Structure

Each journal entry includes:
- **Date**: Entry date
- **Top 3 Goals**: Your main objectives for the day
- **Intention**: Your overall focus/intention
- **Focus Areas**: Categories you're concentrating on
- **Midday Progress**: Check-in on your progress
- **Evening Wins**: What went well
- **Evening Learnings**: Key insights and lessons

## 🎨 Customization

### Styling
- Modify `tailwind.config.js` for theme customization
- Update colors in the config to match your brand
- Dark mode is automatically handled

### PWA Settings
- Edit `public/manifest.json` for app metadata
- Replace icons in `public/` folder
- Modify service worker in `public/sw.js`

## 🚀 Deployment

### Frontend (Netlify)
```bash
cd client
npm run build
# Deploy dist/ folder to Netlify
```

### Backend Options
- **Railway**: Connect GitHub repo for auto-deployment
- **Render**: Free tier with MongoDB Atlas
- **Heroku**: Traditional PaaS option

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by productivity and self-reflection practices
- PWA capabilities for enhanced user experience

---

**Happy Journaling! 📝✨**

Start your journey of daily reflection and goal tracking today!
