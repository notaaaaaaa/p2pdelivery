# P2P Delivery Platform

A peer-to-peer delivery platform that connects people who need items delivered with those traveling in the same direction. This application facilitates efficient, community-driven delivery services using real-time matching and chat features.

## 🚀 Features

- **User Authentication**: Secure login and registration system powered by Firebase
- **Dual Role System**: Users can either request deliveries or offer delivery services
- **Smart Matching Algorithm**: Intelligent matching system that pairs delivery requests with available deliverers
- **Real-time Chat**: Built-in messaging system for seamless communication between matched users
- **Match Waiting System**: Queue management for pending delivery matches
- **Responsive Design**: Modern, mobile-friendly interface

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1**: UI library
- **Vite**: Build tool and dev server
- **React Router DOM**: Client-side routing
- **Axios**: HTTP client
- **Socket.io Client**: Real-time communication
- **Firebase**: Authentication
- **Lucide React & React Icons**: Icon libraries
- **Font Awesome**: Additional icons

### Backend
- **Node.js & Express**: Server framework
- **PostgreSQL**: Database
- **Socket.io**: Real-time bidirectional communication
- **Firebase Admin**: Server-side authentication
- **CORS**: Cross-origin resource sharing

## 📋 Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- Firebase project with authentication enabled

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/notaaaaaaa/p2pdelivery.git
   cd p2pdelivery
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory with the following:
   ```env
   # Database Configuration
   DB_HOST=your_database_host
   DB_PORT=5432
   DB_NAME=your_database_name
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   
   # Server Configuration
   PORT=3000
   
   # Firebase Configuration (add your Firebase config here)
   ```

4. **Configure Firebase**
   
   - Place your Firebase Admin SDK JSON file in `src/firebase/`
   - Update Firebase configuration in `src/firebase/firebase.jsx`

5. **Set up the database**
   
   Run the necessary SQL scripts to create tables for:
   - Users
   - Delivery Requests
   - Matches
   - Messages

## 🚀 Running the Application

### Development Mode

1. **Start the backend server**
   ```bash
   node src/backend/server.js
   ```

2. **Start the frontend development server**
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
app2/
├── src/
│   ├── Components/          # React components
│   │   ├── home.jsx        # Home page
│   │   ├── LoginForm.jsx   # Login component
│   │   ├── RegistrationForm.jsx
│   │   ├── request.jsx     # Request delivery page
│   │   ├── deliver.jsx     # Offer delivery page
│   │   ├── chat.jsx        # Chat interface
│   │   └── MatchWaiting.jsx
│   ├── backend/            # Backend server
│   │   ├── server.js       # Express server entry point
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Authentication middleware
│   │   └── db/            # Database configuration
│   ├── contexts/          # React contexts
│   │   └── authContext/   # Authentication context
│   ├── firebase/          # Firebase configuration
│   ├── App.jsx            # Main app component
│   └── main.jsx           # Entry point
├── public/                # Static assets
├── index.html            # HTML template
├── vite.config.js        # Vite configuration
└── package.json          # Dependencies

```

## 🔐 Authentication

The application uses Firebase Authentication for secure user management. Users can:
- Register with email and password
- Log in to existing accounts
- Maintain authenticated sessions

## 💬 Real-time Features

The platform uses Socket.io for real-time features:
- Instant delivery matching notifications
- Live chat messaging
- Match status updates

## 🗃️ Database Schema

The application uses PostgreSQL with the following main tables:
- **users**: User accounts and profiles
- **requests**: Delivery requests
- **deliveries**: Delivery offers
- **matches**: Matched requests and deliverers
- **messages**: Chat messages between matched users

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- [@notaaaaaaa](https://github.com/notaaaaaaa)

## 🙏 Acknowledgments

- Built with React and Vite
- Powered by Firebase and PostgreSQL
- Real-time features by Socket.io
