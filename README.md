FullStack Intern Coding Challenge
Submitted By- Raman Kalra

StoreRater

StoreRater is a full-stack store-rating application. Customers can browse registered stores and submit or update a rating from 1 to 5. The project includes role-based access for administrators, normal users, and store owners.

Project structure

•	backend contains the Express API, authentication, role checks, and database services.
•	database contains the MySQL schema migration and seed script.
•	frontend contains the React application, pages,API client, and Tailwind styling.

Technology Stack
•	Node.js and Express for the API.
•	MySQL with mysql2 for data storage.
•	React and React Router for the user interface.
•	Tailwind CSS, compiled with PostCSS during the esbuild frontend build.
•	JWT and bcrypt for authentication and password hashing.

What the application does
•	Users can sign up, sign in, and change their password.
•	Public signup creates a normal user account. Administrators can create users with administrator, normal user, or store owner roles.
•	Administrators can view platform totals and manage user and store records through the dashboard.
•	Normal users can search the store list and submit or update store ratings.
•	Store owners can view their store's average rating and the users who rated it.
•	The API supports filtering and sorting for user and store listings.
•	Ratings are stored once per user and store. Updating a rating also refreshes the store's average and rating count.

Requirements
•	Node.js 18 or later and npm.
•	A running MySQL server.
•	A MySQL account with permission to create the application database and tables

Configuration :
Copy the backend environment example to create a local configuration file. Edit the database username and password for your MySQL installation. Keep the local environment file private; it is excluded from Git.

Copy-Item backend/.env.example backend/.env
The backend settings are DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME, PORT, FRONTEND_URL, and JWT_SECRET. The provided migration is set up for the default database name, store_rating_db. The MySQL account must have permission to create the database and tables.

The frontend currently calls the API at http://localhost:3001, configured in frontend/src/api/client.js. No frontend environment file is needed for the default local setup.

Install and prepare the database
Run these commands from the project root:
npm install
npm run migrate
npm run seed

The seed script creates the demo accounts and three stores. Running it again skips accounts and stores that already exist.
Demo accounts
•	Administrator: admin@platform.com / Admin@1234!
•	Store owner: owner1@store.com / Owner@1234!
•	Store owner: owner2@store.com / Owner@1234!
•	Normal user: user1@example.com / User@1234!!
•	Normal user: user2@example.com / User@1234!!

Run the application
Start the backend from the project root in one terminal:
npm run start:backend

In another terminal, build and serve the frontend:
npm run build:frontend
npm run start:frontend

Open the local URL printed by the frontend server. It requests port 3000 by default. If that port is already in use, the server selects another available port and prints it. Keep both the backend and frontend terminals running while using the application.

Useful commands
•	npm run migrate creates the database and tables.
•	npm run seed inserts demo users and stores.
•	npm run start:backend starts the API on port 3001 by default.
•	npm run build:frontend compiles React and Tailwind into frontend/dist.
•	npm run start:frontend serves the built frontend.
•	npm test runs Jest. There are currently no test files included in this submission.

API overview
•	POST /api/auth/signup creates a normal user account.
•	POST /api/auth/login signs in any account.
•	PATCH /api/auth/password changes the signed-in user's password.
•	GET /api/stores lists stores, with optional name and address search filters.
•	GET /api/stores/:id returns store details.
•	POST /api/stores creates a store for an administrator.
•	GET /api/stores/owner/dashboard returns the signed-in owner's store ratings.
•	GET /api/users and GET /api/users/:id list or view users for administrators.
•	GET /api/users/stats returns user, store, and rating totals.
•	POST /api/users creates a user for an administrator.
•	POST /api/ratings/stores/:storeId submits or updates a rating for the signed-in normal user.
•	GET /api/ratings/stores/:storeId returns that user's rating for the store.


