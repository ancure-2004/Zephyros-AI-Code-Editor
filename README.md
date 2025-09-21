<img width="100%" height="300" src="./frontend/public/Screenshot 2025-08-21 015803.png" >

# <img height="50" width="50" src="./frontend/public/logo.png"> Zephyros - Collaborative AI Code Editor
![Status](https://img.shields.io/badge/status-active-success.svg)  

<div align="right">
  <h2>Current Demo Video</h2>
  <img align="right" alt="coding" width="500" src="./frontend/public/Zephyros.gif" >
</div>

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)

> **Zephyros**,
> Real-time collaborative coding powered by Socket.io, with integrated live chat for seamless communication.
> In-browser development using WebContainers, AI-assisted coding, and full server execution for an end-to-end workflow.

## Features ✅

- **Authentication:** Fully implemented frontend & backend login/signup system.
- **Home Page:** Responsive and clean landing page.

## Planned Features 🌟

- **Real-time Collaborative Code Editor**: Multiple users can edit the same code simultaneously.
- **Integrated Chat**: Communicate with collaborators in real-time.
- **AI Assistant**: Invoke AI using `@` to get code suggestions, run code, or perform tasks.
- **Multi-language Support**: Planned support for popular programming languages.
- **Web Containers**: Planned to have a In-browser development using WebContainers

## Tech Stack 🛠️

- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js, MongoDB
- **Real-time Communication:** Socket.IO / WebSockets (planned)
- **AI Integration:** Gemini API (planned)

## Project Status 📝

- Authentication: ✅ Completed
- Home Page: ✅ Completed
- Collaborative Code Editor: 🚧 In Progress
- AI Assistant: 🚧 In Progress
- Real Time Chat: 🚧 In Progress
- WebContainers: 🚧 In Progress

---

## 📂 Current Project Structure  
```bash
Zephyros-AI-Code-Editor/
├── Backend/
│   ├── app.js
│   ├── controllers/
│   ├── db/
│   ├── middlewares/
│   ├── models/
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   ├── routes/
│   ├── server.js
│   ├── services/
└── frontend/
    ├── .gitignore
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── public/
    ├── README.md
    ├── src/
    │   ├── App.jsx
    │   ├── assets/
    │   ├── config/
    │   ├── routes/
    │   ├── screens/
    │   ├── context/
    │   ├── index.css
    │   ├── main.jsx
    └── vite.config.js

```

---

## 🚀 Getting Started  

```bash
# Clone the repository
git clone https://github.com/ancure-2004/Zephyros-AI-Code-Editor.git

# Install dependencies
cd Zephyros-AI-Code-Editor

#Frontend dependencies
cd frontend
npm install

#backend dependencies
cd backend
npm install

# Run backend
cd backend
npx nodemon

# Run frontend
cd frontend
npm run dev
```
---

## Environment Variables

Create a `.env` file in the **backend** root directory and add the following variables:

```env
PORT="Enter PORT"
MONGODB_URI="Enter your mongoDB connection string"
JWT_SECRET="Enter Your secret key"
REDIS_HOST = "Your Redis Host Key"
REDIS_PORT = "Redis Port"
REDIS_PASSWORD = "Your Redis Password"
```
---

## 🤝 Contributing
# We welcome contributions!
- Fork the repository
- Create a new branch (git checkout -b feature-name)
- Make your changes and commit (git commit -m 'Add feature')
- Push to the branch (git push origin feature-name)
- Open a Pull Request

---

## License

This project is licensed under the [MIT License](LICENSE).

### Contact
- 📧 ankur2004tyagi@gmail.com
- 🔗 www.linkedin.com/in/ankur-tyagi2004
