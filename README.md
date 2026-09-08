Library Management System

A full-stack web application for managing library books, issuing and returning books using QR codes, tracking book availability, and maintaining transaction history.

NOTE:
    MUST LOGIN IN USING THE BELOW CREDENTIALS 
       Demo Login
    Email: admin@library.com
    Password: admin123
deployed application:
  Frontend: https://library-management-system-blush-two.vercel.app/login
  Backend : https://library-management-system-816p.onrender.com

Features Implemented

• Add and manage books with Book ID, title, author, ISBN, category, and total copies
• Generate and download QR codes for books
• Scan QR codes using a camera
• Issue and return books
• Record borrower details and issue/return timestamps
• Track available and issued copies
• Prevent issuing books when no copies are available
• Search and filter books
• View, search, and filter transaction history
• Export transaction history as CSV
• Dashboard showing total, available, issued, and overdue books
• Librarian login and authentication
• Input validation and error handling

Additional Features

• Manual Book ID entry when QR scanning is not used
• Protected frontend routes and backend APIs
• Responsive layout

Technology Stack

Frontend: React, Vite, JavaScript, React Router, Axios, QRCode, HTML5 QR Code, CSS

Backend: Node.js, Express.js, JWT, bcryptjs, json2csv

Database: MongoDB and Mongoose

Project Structure

The project is divided into two main parts:

client – React frontend

server – Node.js and Express backend

The server contains separate folders for controllers, models, routes, middleware, and database configuration.

How to Run

Requirements:

• Node.js and npm
• MongoDB or MongoDB Atlas

Backend Setup:

Clone the repository and open the project folder.
Open a terminal and go to the server folder.
Run npm install.
Create a .env file inside the server folder.
Add the MongoDB connection string and JWT secret to the .env file.
Run node createAdmin.js to create the librarian account.

Frontend Setup:

Open another terminal.
Go to the client folder.
Run npm install.

Start the Application:

In the first terminal, go to the server folder and run:

npm run dev

In the second terminal, go to the client folder and run:

npm run dev

Open the frontend URL shown in the terminal, normally:

http://localhost:5173

The backend normally runs on:

http://localhost:5000

Database Configuration

MongoDB is used to store the application data.

Users store librarian login details.

Books store book information and availability.

Transactions store issue, return, borrower, and timestamp details.

The MongoDB connection is provided through MONGO_URI in the server .env file.

The .env file is excluded from GitHub.

APIs Implemented

Authentication:

POST /api/auth/login – Librarian login

Books:

POST /api/books – Add a book
GET /api/books – Get all books
GET /api/books/:id – Get a specific book
PUT /api/books/:id – Update a book
DELETE /api/books/:id – Delete a book

Transactions:

POST /api/transactions/issue – Issue a book
POST /api/transactions/return – Return a book
GET /api/transactions – Get transaction history
GET /api/transactions/export – Export transactions as CSV

Dashboard:

GET /api/dashboard/stats – Get library statistics
GET /api/dashboard/issued – Get currently issued books

Important Implementation Decisions

• The QR code contains only the unique Book ID. The backend verifies the Book ID using MongoDB.
• Total copies and available copies are stored separately so multiple copies of a book can be tracked.
• Issue and return records are stored as transactions to maintain complete history.
• Backend validation is used to handle invalid Book IDs, duplicate books, unavailable books, and invalid returns.
• JWT is used to protect the application and APIs.
• bcryptjs is used to securely hash librarian passwords.

Concepts Learned

• React and React Router
• Express REST APIs
• MongoDB and Mongoose
• JWT authentication
• QR code generation and scanning
• Axios API integration
• Basic validation and error handling
• Git and GitHub

Project Status

The project has been implemented and tested locally. It currently supports book management, QR-based issue and return, availability tracking, transaction history, CSV export, dashboard statistics, and librarian authentication