# SecureAuth Pro - Enterprise Authentication Demo

A authentication system demonstrating modern security practices including Multi-Factor Authentication (MFA), Single Sign-On (SSO), and real SMS integration.

## Features

### Authentication Methods
- **Username/Password** with strength validation
- **Multi-Factor Authentication (MFA)** via SMS, Authenticator App, Email
- **Single Sign-On (SSO)** with Microsoft, Google, Okta, SAML
- **Real SMS Integration** using Twilio API

### Security Features
- Password strength validation with real-time feedback
- Rate limiting to prevent abuse
- Phone number validation (E.164 format)
- Session management and monitoring
- Input sanitization and validation
- Audit logging for security events

### Enterprise Capabilities
- User lifecycle management
- Role-based access control simulation
- Admin dashboard with statistics
- Compliance and audit trails
- Responsive design for all devices

## Live Demo

**Frontend**: [View Authentication Demo](https://your-username.github.io/secure-auth-enterprise-demo/)

**Backend API**: Requires local setup (see installation below)

## Real SMS Demo

This project includes **actual SMS functionality** using Twilio:

1. Select SMS for Multi-Factor Authentication
2. Enter your real phone number
3. Receive verification code on your phone
4. Complete authentication with real code

![SMS Demo](https://via.placeholder.com/600x300/4299e1/ffffff?text=SMS+Authentication+Demo)

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Twilio account (free trial available)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/secure-auth-enterprise-demo.git
   cd secure-auth-enterprise-demo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Twilio (Optional# 🔐 SecureAuth Pro - Enterprise Authentication Demo

A comprehensive enterprise authentication system demonstrating modern security practices including Multi-Factor Authentication (MFA), Single Sign-On (SSO), and real SMS integration.

##  Features

###  Authentication Methods
- **Username/Password** with strength validation
- **Multi-Factor Authentication (MFA)** via SMS, Authenticator App, Email
- **Single Sign-On (SSO)** with Microsoft, Google, Okta, SAML
- **Real SMS Integration** using Twilio API

### Security Features
- Password strength validation with real-time feedback
- Rate limiting to prevent abuse
- Phone number validation (E.164 format)
- Session management and monitoring
- Input sanitization and validation
- Audit logging for security events

### Enterprise Capabilities
- User lifecycle management
- Role-based access control simulation
- Admin dashboard with statistics
- Compliance and audit trails
- Responsive design for all devices

## Live Demo

**Frontend**: [View Authentication Demo](https://your-username.github.io/secure-auth-enterprise-demo/)

**Backend API**: Requires local setup (see installation below)

## Real SMS Demo

This project includes **actual SMS functionality** using Twilio:

1. Select SMS for Multi-Factor Authentication
2. Enter your real phone number
3. Receive verification code on your phone
4. Complete authentication with real code

![SMS Demo](https://via.placeholder.com/600x300/4299e1/ffffff?text=SMS+Authentication+Demo)

##  Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Twilio account (free trial available)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/secure-auth-enterprise-demo.git
   cd secure-auth-enterprise-demo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Twilio (Optional for SMS)**
   - Sign up at [twilio.com](https://www.twilio.com/try-twilio)
   - Get your Account SID, Auth Token, and phone number
   - Update credentials in `sms-server.js`

4. **Start the backend server**
   ```bash
   npm start
   ```

5. **Open the frontend**
   - Open `index.html` in your browser
   - Or serve via HTTP server: `npx http-server`

## 🔧 API Endpoints

### SMS Verification
```http
POST /api/send-verification-code
Content-Type: application/json

{
  "phoneNumber": "+1234567890",
  "userEmail": "user@example.com"
}
```

### Code Verification
```http
POST /api/verify-code
Content-Type: application/json

{
  "phoneNumber": "+1234567890",
  "code": "123456"
}
```

### Health Check
```http
GET /health
```

## Project Structure

```
secure-auth-enterprise-demo/
├── index.html              # Frontend authentication interface
├── sms-server.js           # Backend SMS API server
├── package.json            # Node.js dependencies and scripts
├── README.md               # Project documentation
└── .gitignore             # Git ignore rules
```

## Technical Implementation

### Frontend Technologies
- **HTML5** with semantic markup
- **CSS3** with custom animations and responsive design
- **Vanilla JavaScript** with modern ES6+ features
- **Fetch API** for HTTP requests
- **LocalStorage** for session management

### Backend Technologies
- **Node.js** with Express framework
- **Twilio API** for SMS functionality
- **CORS** for cross-origin requests
- **Rate limiting** for security
- **Input validation** and sanitization

### Security Features
- **Password complexity** validation
- **Phone number** format validation (E.164)
- **Rate limiting** (3 attempts per minute)
- **Code expiration** (5 minutes)
- **Session management** with timeouts
- **CORS configuration** for security

## 🏗️ Enterprise Architecture

This demo simulates enterprise-level authentication that would typically integrate with:

- **Identity Providers**: Azure AD, Okta, Google Workspace
- **Databases**: SQL Server, PostgreSQL, MongoDB
- **Caching**: Redis for session management
- **Monitoring**: Application insights and logging
- **Deployment**: Docker containers, Kubernetes

## 📈 Demo Scenarios

### For Technical Interviews
1. **Show multi-factor authentication flow**
2. **Demonstrate real SMS integration**
3. **Explain security considerations**
4. **Discuss enterprise scalability**
5. **Walk through code architecture**

### Test Credentials (Demo Mode)
- **Email**: `demo@example.com`
- **Password**: `password123`
- **MFA**: Any 6-digit code in demo mode

## Security Considerations

### Production Recommendations
- Store Twilio credentials in environment variables
- Implement proper JWT token validation
- Use HTTPS for all communications
- Add input sanitization and SQL injection prevention
- Implement proper session management
- Add comprehensive audit logging
- Use secure cookie configurations

## Contributing

This is a demonstration project for educational and interview purposes. Feel free to fork and modify for your own use.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Author

**Nadia Swansey**
- GitHub: [@nadiaswansey](https://github.com/nadiaswansey)
- LinkedIn: [Nadia Swansey](https://linkedin.com/in/nadiaswansey)
- Portfolio: [nadiaswansey.github.io](https://nadiaswansey.github.io)

## Educational Purpose

This project demonstrates:
- Modern authentication patterns
- API integration best practices
- Security implementation strategies
- Enterprise-grade code organization
- Real-world development workflows

Perfect for showcasing technical skills in interviews for:
- **Software Developer** positions
- **Cybersecurity Engineer** roles
- **Full-Stack Developer** opportunities
- **Authentication Specialist** positions

---

 **Star this repository** if you find it helpful for your own authentication projects!
