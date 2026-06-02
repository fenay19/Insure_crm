# Insure CRM

A comprehensive Customer Relationship Management (CRM) system designed for the insurance industry. This full-stack application provides tools for managing clients, policies, claims, and business operations with an intuitive user interface and robust backend infrastructure.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Features](#features)
- [Architecture](#architecture)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

**Insure CRM** is a modern, full-featured CRM platform tailored for insurance professionals. It enables efficient management of customer relationships, policy administration, claims processing, and comprehensive business analytics with real-time insights.

### Key Highlights
- **Full-Stack Solution**: Separate frontend and backend for scalability
- **Modern UI**: Built with React and Material-UI for a professional experience
- **Real-Time Updates**: WebSocket integration via Socket.io
- **Data Management**: Comprehensive features for managing customers, policies, and claims
- **Multi-Format Support**: PDF, Excel, and CSV export capabilities
- **Advanced Editor**: EditorJS integration for rich content creation
- **Calendar Integration**: Full calendar features for scheduling and event management
- **Authentication**: Secure JWT-based authentication with password hashing

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18.3.1 with Vite
- **UI Library**: Material-UI (MUI) v5
- **State Management**: Redux Toolkit + Redux Persist
- **Form Handling**: Formik + Yup validation
- **HTTP Client**: Axios
- **Real-Time**: Socket.io Client
- **Charts & Visualization**: ApexCharts
- **Data Management**: MUI Data Grid, FullCalendar
- **Rich Text Editor**: EditorJS + Quill
- **File Handling**: xlsx, papaparse, html2canvas, jsPDF
- **Routing**: React Router v6
- **Styling**: Bootstrap, Sass, Emotion (CSS-in-JS)
- **Build Tool**: Vite 5.2.10
- **Node Linker**: yarn (node-modules)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken), Bcrypt
- **Real-Time**: Socket.io
- **File Processing**: Multer, pdf-parse, xlsx, csvtojson
- **Data Validation**: Joi, express-validator
- **Email**: Nodemailer
- **Middleware**: CORS, compression, express-mongo-sanitize
- **Development**: Nodemon
- **Utilities**: Axios, moment.js, uuid, useragent

## 📁 Project Structure

```
Insure_crm/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Page components
│   │   ├── store/              # Redux store configuration
│   │   ├── services/           # API and utility services
│   │   ├── hooks/              # Custom React hooks
│   │   ├── styles/             # Global and component styles
│   │   └── App.jsx             # Main App component
│   ├── .yarnrc.yml             # Yarn configuration
│   ├── .env.qa                 # QA environment variables
│   ├── package.json            # Frontend dependencies
│   └── vite.config.js          # Vite configuration
│
├── backend/                     # Express backend application
│   ├── src/
│   │   ├── routes/             # API route handlers
│   │   ├── controllers/        # Business logic
│   │   ├── models/             # MongoDB models
│   │   ├── middleware/         # Express middleware
│   │   ├── services/           # Business services
│   │   ├── utils/              # Utility functions
│   │   └── index.js            # Server entry point
│   ├── package.json            # Backend dependencies
│   └── .env                    # Environment variables
│
└── README.md                    # This file
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v14 or higher recommended)
- **npm** or **Yarn** (package manager)
- **MongoDB** (local or cloud instance - Atlas recommended)
- **Git** (for version control)

### Versions Used
- Node.js: v14+ (recommended v16 or v18)
- npm: v7+
- Yarn: v1.22+ (configured with node-modules linker)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/fenay19/Insure_crm.git
cd Insure_crm
```

### 2. Frontend Setup

```bash
cd frontend
yarn install
# or
npm install
```

### 3. Backend Setup

```bash
cd ../backend
npm install
# or
yarn install
```

## ⚙️ Configuration

### Frontend Configuration

Create environment configuration files in the `frontend/` directory:

#### `.env` (Development)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
VITE_APP_BASE_NAME=/
```

#### `.env.qa` (QA/Staging - Already Included)
```env
REACT_APP_VERSION=v3.0.0
GENERATE_SOURCEMAP=false
PUBLIC_URL=https://codedthemes.com/demos/admin-templates/materially/react/free/stage
VITE_APP_BASE_NAME=demos/admin-templates/materially/react/free/stage
```

#### `.env.production` (Production)
```env
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_SOCKET_URL=https://yourdomain.com
VITE_APP_BASE_NAME=/
```

### Backend Configuration

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/insure_crm
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/insure_crm

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Socket.io Configuration
SOCKET_PORT=5000
```

## 🎯 Getting Started

### Start the Frontend Development Server

```bash
cd frontend
yarn start
# or
npm start
```

The frontend will be available at `http://localhost:5173` (Vite default)

### Start the Backend Development Server

```bash
cd backend
npm start
# or
yarn start
```

The backend server will run on `http://localhost:5000`

### Access the Application

Open your browser and navigate to:
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000/api`

## 📜 Available Scripts

### Frontend Scripts

```bash
# Start development server
yarn start
npm start

# Build for production
yarn build
npm run build

# Build for QA environment
yarn build-stage
npm run build-stage

# Preview production build
yarn preview
npm run preview

# Run ESLint
yarn lint
npm run lint

# Fix ESLint issues
yarn lint:fix
npm run lint:fix

# Format code with Prettier
yarn prettier
npm run prettier
```

### Backend Scripts

```bash
# Start development server with auto-reload
npm start

# Production mode (without nodemon)
node src/index.js
```

## ✨ Features

### Client Management
- Create and manage customer profiles
- Track customer interactions and communication history
- Store customer documents and attachments

### Policy Management
- Policy creation and lifecycle management
- Policy renewal tracking
- Commission calculations
- Multi-format document export (PDF, Excel)

### Claims Processing
- Claim registration and tracking
- Claim status updates and history
- Document management for claims
- Claims analytics and reporting

### Communication & Collaboration
- Real-time notifications via Socket.io
- Email notifications and templates
- In-app messaging system
- Calendar integration for follow-ups and appointments

### Reporting & Analytics
- Dashboard with key metrics and KPIs
- Advanced charts and visualizations (ApexCharts)
- Customizable reports
- Data export to multiple formats (PDF, Excel, CSV)

### Rich Content Management
- EditorJS integration for content creation
- Rich text editor with formatting options
- Document templates

### Data Management
- Bulk data import/export (CSV, Excel)
- Data validation and sanitization
- Audit logging for security

## 🏗 Architecture

### Frontend Architecture
- **Component-Based**: Reusable React components with hooks
- **State Management**: Redux Toolkit for global state with Redux Persist for persistence
- **API Communication**: Axios for HTTP requests with interceptors
- **Routing**: React Router v6 for client-side routing
- **Real-Time**: Socket.io for real-time updates

### Backend Architecture
- **MVC Pattern**: Clear separation of concerns with controllers, models, and services
- **RESTful API**: Standard REST endpoints for all resources
- **Database**: MongoDB with Mongoose ODM
- **Security**: JWT authentication, bcrypt password hashing, input validation, SQL injection prevention
- **Middleware**: Custom middleware for auth, error handling, and validation
- **Real-Time**: Socket.io for real-time events

## 👨‍💻 Development

### Code Style & Linting

The project uses ESLint and Prettier for code consistency:

```bash
# Check code style
yarn lint

# Fix code style issues
yarn lint:fix

# Format code with Prettier
yarn prettier
```

### Project Structure Best Practices
- Keep components focused and single-responsibility
- Use custom hooks for reusable logic
- Organize by feature/domain rather than by file type
- Use TypeScript-like JSDoc comments for better IDE support

### Making Changes

1. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

3. Push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a Pull Request on GitHub

## 📦 Deployment

### Frontend Deployment

#### Build for Production
```bash
cd frontend
yarn build
```

The build output will be in the `frontend/dist/` directory.

#### Deploy to Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=frontend/dist
```

#### Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Backend Deployment

#### Using Docker (Optional)
Create a `Dockerfile` in the backend directory:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

#### Deploy to Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main
```

#### Deploy to AWS, Google Cloud, or DigitalOcean
- Set up your server/container platform
- Configure environment variables
- Deploy the backend code
- Set up MongoDB connection

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Standards
- Write clear, descriptive commit messages
- Follow the existing code style
- Add comments for complex logic
- Test your changes before submitting a PR
- Update documentation as needed

## 📝 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 📧 Contact & Support

For support, feature requests, or bug reports, please:
- Open an issue on GitHub
- Contact the development team
- Check existing documentation and issues first

## 🎓 Learning Resources

### React & Frontend
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Material-UI Documentation](https://mui.com)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org)

### Express & Backend
- [Express.js Documentation](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Mongoose Documentation](https://mongoosejs.com)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)

## 🚀 Future Enhancements

Potential features for future versions:
- Mobile app (React Native)
- Advanced analytics and reporting dashboard
- AI-powered customer insights
- Multi-language support (i18n)
- Dark mode theme
- Progressive Web App (PWA) capabilities
- Advanced scheduling and workflow automation
- Integration with third-party insurance providers

---

**Last Updated**: June 2026
**Version**: 3.0.0

For the latest updates and information, visit the [GitHub Repository](https://github.com/fenay19/Insure_crm)
