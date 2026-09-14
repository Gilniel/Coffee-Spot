# ☕ Coffee Spot

Coffee Spot is a full-stack web application for discovering, reviewing, and sharing coffee bar experiences.

Built with Node.js, Express, MongoDB, Mongoose, EJS, Cloudinary, Mapbox, and Passport.js.

This project was one of my first complete full-stack web applications and the project where I began using Git and GitHub as part of my development workflow.

## ✨ Features

- Create, view, update, and delete coffee bar listings
- User registration, login, and logout
- Session-based authentication
- Authorization so only listing owners can edit or delete their coffee bars
- User reviews
- Image uploads with Cloudinary
- Location geocoding and interactive maps with Mapbox
- Server-side validation with Joi
- MongoDB-backed session storage
- Security middleware with Helmet and express-mongo-sanitize
- Responsive server-rendered views with EJS and Bootstrap

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Frontend
- EJS
- EJS-Mate
- Bootstrap
- JavaScript
- CSS

### Authentication & Sessions
- Passport.js
- Passport Local
- Passport Local Mongoose
- Express Session
- Connect Mongo

### Validation & Security
- Joi
- Helmet
- express-mongo-sanitize

### Media & Maps
- Cloudinary
- Multer
- Mapbox SDK

## 📁 Project Structure

```text
Coffee-Spot/
├── cloudinary/
├── controllers/
├── models/
├── public/
├── routes/
├── seeds/
├── utils/
├── views/
├── app.js
├── middleware.js
├── schemas.js
└── package.json
