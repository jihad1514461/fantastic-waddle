# React TypeScript Template with Modular Architecture

A comprehensive, production-ready React TypeScript template featuring a modular architecture with admin and game modules, flow editor, CRUD operations, and modern UI components.

## 🚀 Features

### Core Features
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Zustand** for state management
- **React Hook Form** with validation
- **Dark/Light theme** support
- **Responsive design**

### Modular Architecture
- **Admin Module**: Complete admin dashboard with user management, analytics, and system controls
- **Game Module**: Gaming platform with leaderboards, achievements, and player profiles
- **Flow Editor**: Visual workflow builder with node-based editing
- **Flow Simulation**: Real-time workflow execution and monitoring

### UI Components Library
- 30+ reusable components (Buttons, Modals, Tables, Forms, etc.)
- Advanced components (Flow Editor, Multi-select, Typeahead, Date Picker)
- Toast notifications system
- File upload with drag & drop
- Data tables with pagination and sorting

### CRUD Operations
- Full CRUD service with API integration
- localStorage fallback when API is unavailable
- Bulk operations support
- Search, filtering, and pagination
- Real-time data synchronization

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd react-typescript-template
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI components
│   ├── layout/          # Layout components
│   ├── auth/            # Authentication components
│   ├── dashboard/       # Dashboard components
│   ├── flow/            # Flow editor components
│   └── landing/         # Landing page components
├── modules/             # Feature modules
│   ├── admin/           # Admin module
│   │   ├── components/  # Admin-specific components
│   │   ├── pages/       # Admin pages
│   │   ├── controllers/ # Admin state management
│   │   ├── types/       # Admin type definitions
│   │   └── config/      # Admin configuration
│   └── game/            # Game module
│       ├── components/  # Game-specific components
│       ├── pages/       # Game pages
│       ├── controllers/ # Game state management
│       ├── types/       # Game type definitions
│       └── config/      # Game configuration
├── controllers/         # Global state controllers
├── services/            # API and utility services
├── hooks/               # Custom React hooks
├── types/               # Global type definitions
├── utils/               # Utility functions
├── config/              # Application configuration
└── pages/               # Core application pages
```

## 🎯 Usage Guide

### 1. Landing Page
The application starts with a beautiful landing page showcasing available modules:
- **Admin Portal**: Access administrative features
- **Game Hub**: Enter the gaming platform

### 2. Admin Module
Access comprehensive administrative tools:

**Login**: Use any email/password combination (demo mode)

**Features**:
- **Dashboard**: System overview with metrics and analytics
- **User Management**: CRUD operations for user accounts
- **Flow Manager**: Create and manage workflow processes
- **UI Showcase**: Demonstration of all available components
- **System Settings**: Configuration and maintenance tools

**Flow Editor**:
- Create visual workflows with drag-and-drop nodes
- Define node connections and conditions
- Real-time flow simulation and monitoring
- Node types: Start, Process, Decision, End

### 3. Game Module
Experience a complete gaming platform:

**Login**: Use any username/password combination (demo mode)

**Features**:
- **Game Center**: Player dashboard with stats and achievements
- **Leaderboard**: Competitive rankings and scores
- **Achievements**: Unlock and track accomplishments
- **Player Profile**: Manage account and preferences

### 4. CRUD Operations
The template includes a complete CRUD service:

```typescript
import { crudService } from './services/crudService';

// Get all items with pagination
const response = await crudService.getAll('users', {
  page: 1,
  limit: 10,
  search: 'john',
  sort: 'createdAt:desc'
});

// Create new item
const newUser = await crudService.create('users', {
  name: 'John Doe',
  email: 'john@example.com'
});

// Update existing item
const updatedUser = await crudService.update('users', userId, {
  name: 'John Smith'
});

// Delete item
await crudService.delete('users', userId);
```

### 5. Theme System
Toggle between light and dark themes:
- Click the theme toggle button in any module header
- Preferences are automatically saved
- All components support both themes

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=Your App Name
VITE_APP_VERSION=1.0.0
```

### API Integration
The template includes a fallback system:
- **Primary**: REST API at `http://localhost:3000/api`
- **Fallback**: localStorage when API is unavailable
- **Auto-detection**: Seamlessly switches between modes

### Module Configuration
Customize modules in their respective config files:
- `src/modules/admin/config/admin.config.ts`
- `src/modules/game/config/game.config.ts`
- `src/config/app.config.ts`

## 🎨 Customization

### Adding New Components
1. Create component in `src/components/ui/`
2. Export from `src/components/ui/index.ts`
3. Add to showcase page for documentation

### Creating New Modules
1. Create module directory in `src/modules/`
2. Follow the existing module structure
3. Add module configuration
4. Register in main application

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Custom CSS**: Additional styles in `src/index.css`
- **Theme Variables**: Defined in `tailwind.config.js`

## 📱 Responsive Design

The template is fully responsive with breakpoints:
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

All components adapt to different screen sizes automatically.

## 🧪 Testing

Run tests with:
```bash
npm run test
```

The template includes:
- Component testing setup
- Utility function tests
- Integration test examples

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

## 🔒 Security Features

- **Input Validation**: All forms include validation
- **XSS Protection**: Sanitized user inputs
- **CSRF Protection**: Token-based authentication
- **Secure Storage**: Encrypted localStorage data

## 📊 Performance

- **Code Splitting**: Lazy-loaded modules
- **Tree Shaking**: Optimized bundle size
- **Caching**: Efficient data caching strategies
- **Optimization**: Production-ready builds

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the component showcase

## 🎉 Getting Started Checklist

- [ ] Clone the repository
- [ ] Install dependencies
- [ ] Start development server
- [ ] Explore the landing page
- [ ] Try the Admin module
- [ ] Test the Game module
- [ ] Experiment with the Flow Editor
- [ ] Customize the theme
- [ ] Add your own components
- [ ] Deploy to production

---

**Happy coding!** 🚀