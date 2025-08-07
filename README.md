# Sales AI & Dashboard Monitor

A comprehensive AI-powered sales dashboard that provides real-time analysis of meeting transcriptions, team performance insights, and business metrics.

## 🚀 Features

### Core Functionality
- **AI-Powered Meeting Analysis**: Upload meeting transcriptions and get instant AI-generated insights
- **Real-time Dashboard**: Monitor team performance, health scores, and business metrics
- **Advanced Filtering**: Filter analyses by client, team member, sentiment, and date ranges
- **Export Capabilities**: Generate and export detailed reports
- **Client Management**: Track client relationships and meeting history

### Analysis Features
- **Sentiment Analysis**: AI-powered sentiment detection for meetings
- **Risk Assessment**: Automated risk level evaluation
- **Action Items**: Extract and track action items from meetings
- **Recommendations**: AI-generated recommendations for follow-up
- **Health Scoring**: Comprehensive health score calculation

### UI/UX Features
- **Modern Green Theme**: Consistent green color scheme throughout the application
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Interactive Tabs**: Organized content with intuitive navigation
- **Real-time Updates**: Live data updates and notifications

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React, TypeScript
- **UI Framework**: Material-UI (MUI)
- **State Management**: Zustand
- **AI Integration**: OpenAI GPT-3.5-turbo
- **Styling**: Emotion CSS-in-JS
- **Database**: In-memory database (ready for production database integration)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:UsamaKaleem322/Sales-AI-Rocket-.git
   cd Sales-AI-Rocket-
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Environment Variables
- `OPENAI_API_KEY`: Your OpenAI API key for AI analysis features

### Database
The application currently uses an in-memory database. For production, you can:
1. Replace the database implementation in `src/lib/database.ts`
2. Add your preferred database (PostgreSQL, MongoDB, etc.)
3. Update the API routes accordingly

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── analyses/      # Analysis CRUD operations
│   │   ├── analyze-enhanced/ # AI analysis endpoint
│   │   ├── analysis/      # Basic analysis operations
│   │   └── stats/         # Statistics endpoint
│   ├── analysis/[id]/     # Analysis detail pages
│   ├── clients/[id]/      # Client detail pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── dashboard/         # Dashboard components
│   ├── forms/            # Form components
│   ├── layout/           # Layout components
│   ├── sections/         # Page sections
│   └── ui/              # UI components
├── lib/                  # Utility libraries
│   ├── database.ts       # Database operations
│   ├── openai.ts         # OpenAI integration
│   ├── store.ts          # Zustand store
│   └── ThemeProvider.tsx # Theme configuration
├── styles/               # Styling
│   └── colors.ts         # Color definitions
└── types/                # TypeScript type definitions
```

## 🎨 Customization

### Color Theme
The application uses a green color scheme. To customize colors:
1. Edit `src/styles/colors.ts`
2. Update the primary color values
3. The changes will apply throughout the application

### Adding New Analysis Types
1. Update the `AnalysisRequest` interface in `src/lib/openai.ts`
2. Modify the AI prompt in the analysis generation function
3. Update the UI components to handle new analysis types

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set up environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Heroku

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team

## 🔄 Recent Updates

- ✅ Added green theme throughout the application
- ✅ Implemented AI-powered meeting analysis
- ✅ Added comprehensive filtering capabilities
- ✅ Created responsive dashboard interface
- ✅ Integrated OpenAI API for intelligent insights
- ✅ Added export functionality for reports
- ✅ Implemented real-time data updates

---

**Built with ❤️ by Team Rocket**