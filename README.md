# 🧠 SQL Summarizer

SQL Summarizer is a web-based application that allows users to quickly understand and summarize SQL queries in plain English using AI. It features secure user authentication, a modern interactive dashboard, and Ollama integration for AI-powered query summarization.

---

## Features

- **User Authentication:** Signup, login, and logout functionality with secure password hashing using Flask-Bcrypt.  
- **SQL Query Summarization:** Paste SQL queries and get human-readable explanations using Ollama AI.  
- **Interactive Dashboard:** Light/Dark mode toggle with a visually appealing "Matrix-style" animation background.  
- **Secure & Containerized:** SQLite database for storage and Docker-ready for easy deployment.  

---

## Tech Stack

- **Backend:** Flask, Flask-SQLAlchemy, Flask-Bcrypt  
- **AI Integration:** Ollama LLM  
- **Frontend:** HTML, CSS, JavaScript  
- **Database:** SQLite  
- **Deployment:** Docker  

---

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Rutendra74/sql-summarizer.git
   cd sql-summarizer
## Project Structure
SQL_Summarizer/
│
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Docker Compose setup
├── instance/
│   └── users.db           # SQLite database (gitignored)
├── templates/
│   ├── index.html         # Main dashboard
│   ├── login.html         # Login page
│   └── signup.html        # Signup page
├── static/
│   ├── style.css          # CSS styles
│   └── script.js          # Frontend JS
└── README.md
