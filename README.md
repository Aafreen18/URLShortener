# URL Shortener

A simple URL Shortener application built using **Node.js**.  
It allows users to shorten long URLs and redirect to the original links using short codes.

---

## 📁 Project Structure

URLShortener/
├── data/
│   └── links.json    # Persistent storage for URL mappings
├── public/
│   ├── index.html    # Clean, responsive frontend
│   └── style.css     # Custom styling for the interface
├── app.js            # Core Express server and logic
├── package.json      # Node.js dependencies and scripts
└── README.md         # Project documentation

---

## 🚀 Features

- Shorten long URLs
- Redirect short URLs to original URLs
- Stores links in a JSON file
- Simple and lightweight

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js  
- **Frontend:** HTML, CSS  
- **Data Storage:** JSON file (`links.json`)  
- **Tools:** npm, VS Code  
---

# Clone the repository
git clone <repository-url>

# Go into the project folder
cd URLShortener

# Install dependencies
npm install

# Start the server
node app.js

# Open in browser
http://localhost:3000
