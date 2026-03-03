🌤️ Weather Forecast Application

A responsive React application that allows users to manage cities and display a 7-day weather forecast using the 7Timer API.

This project demonstrates modern front-end development practices including component-based architecture, React hooks, routing, reusable logic, and client-side data persistence.

🔎 Overview

The Weather Forecast Application enables users to manage a personalized list of cities and view their weekly weather forecast based on geographic coordinates.

All data is stored locally in the browser using localStorage — no backend or external database is required.

✨ Key Features
🏙️ City Management

Add cities with name, country, latitude, and longitude

Edit existing city details

Delete cities

Mark and unmark cities as favorites

⭐ Favorites Dashboard

Display all favorite cities on the Home page

Show a 7-day weather forecast for each favorite city

🌍 Country Filtering

Filter displayed cities by country

🌦️ 7-Day Weather Forecast

Forecast data retrieved from the 7Timer API

Dynamic color styling based on weather conditions

💾 Local Data Persistence

Data stored in browser localStorage

No backend required

📱 Responsive UI

Built with React Bootstrap

Fully responsive layout

Clean, weather-themed design

🛠️ Tech Stack

React (Functional Components & Hooks)

React Router DOM

React Bootstrap

Custom Hooks (e.g., useCountries)

Local Storage API

7Timer API

📄 Application Pages
HomePage

Displays favorite cities

Shows 7-day weather forecast

Allows filtering by country

AddCityPage

Add, edit, delete cities

Manage favorites

AboutPage

Project description

Developer information

⚙️ Installation & Running the Project
1. Clone the Repository
git clone https://github.com/NadeenHY-dev/React-based-weather-application.git
cd React-based-weather-application
2. Install Dependencies

Make sure Node.js (v14 or later) is installed.

npm install
3. Start the Development Server
npm start
4. Open in Browser

The app will run at:

http://localhost:3000
🌐 API Reference

Weather data is provided by the 7Timer API:

http://www.7timer.info/doc.php

Forecasts are fetched using geographic coordinates (latitude and longitude).

📂 Project Structure
src/
│
├── pages/
│   ├── HomePage.js
│   ├── AddCityPage.js
│   └── AboutPage.js
│
├── components/
├── hooks/
├── services/
└── App.js
👩‍💻 Author

Nadeen Haj Yahia
📧 nadeenha@edu.jmc.ac.il
