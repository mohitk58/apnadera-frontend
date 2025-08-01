# ApnaDera Frontend

A modern React-based frontend for the ApnaDera property platform.

## 🚀 Features

- 🏠 Property listing and search
- 👤 User authentication and profiles
- 📱 Responsive design with Tailwind CSS
- 🗺️ Interactive maps with Mapbox
- 📸 Image galleries for properties
- ⚡ Fast development with Vite

## 🛠️ Tech Stack

- **React 18** with Vite
- **React Router** for navigation
- **TanStack Query** for data fetching
- **Tailwind CSS** for styling
- **React Hook Form** with Zod validation
- **Mapbox GL** for maps
- **Axios** for API calls

## 📋 Prerequisites

- Node.js 18+
- npm or yarn

## 🔧 Installation

1. **Clone the repository**:

   ```bash
   git clone <your-frontend-repo-url>
   cd apnadera-frontend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory:

   ```env
   VITE_API_URL=http://localhost:5002
   VITE_MAPBOX_TOKEN=your_mapbox_token_here
   VITE_APP_NAME=ApnaDera
   VITE_APP_DESCRIPTION=Find your dream property
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:3000`

## 📚 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 Environment Variables

| Variable               | Description         | Default                    |
| ---------------------- | ------------------- | -------------------------- |
| `VITE_API_URL`         | Backend API URL     | `http://localhost:5002`    |
| `VITE_MAPBOX_TOKEN`    | Mapbox access token | Required                   |
| `VITE_APP_NAME`        | Application name    | `ApnaDera`                 |
| `VITE_APP_DESCRIPTION` | App description     | `Find your dream property` |

## 🚀 Deployment

### Netlify (Recommended)

1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

### Vercel

1. Connect your repository to Vercel
2. Set framework preset to Vite
3. Add environment variables

### Manual Deployment

```bash
# Build the project
npm run build

# The built files will be in the 'dist' directory
# Upload the contents of 'dist' to your hosting service
```

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── auth/      # Authentication components
│   ├── layout/    # Layout components
│   └── properties/ # Property-related components
├── pages/         # Page components
├── contexts/      # React contexts
├── hooks/         # Custom hooks
├── services/      # API services
└── utils/         # Utility functions
```

## 🔗 API Integration

The frontend communicates with the backend API at the URL specified in `VITE_API_URL`. Make sure your backend server is running and accessible.

### API Endpoints Used

- **Authentication**: `/auth/register`, `/auth/login`, `/auth/me`
- **Properties**: `/properties` (GET, POST, PUT, DELETE)
- **Users**: `/users/profile`, `/users/properties`
- **Contact**: `/contact`

## 🎨 Styling

This project uses **Tailwind CSS** for styling with:

- Responsive design
- Dark/light mode support
- Custom components
- Utility-first approach

## 🗺️ Maps Integration

The app uses **Mapbox GL** for interactive maps:

- Property location display
- Search by location
- Interactive property markers

## 📱 Responsive Design

The app is fully responsive and works on:

- Desktop computers
- Tablets
- Mobile phones

## 🔧 Development

### Code Style

This project uses ESLint for code linting. Run:

```bash
npm run lint
```

### Adding New Features

1. Create components in `src/components/`
2. Add pages in `src/pages/`
3. Update routing in `src/App.jsx`
4. Add API calls in `src/services/api.js`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
