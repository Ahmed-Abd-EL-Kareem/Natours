# Natours - Tour Booking Application

A Node.js, Express, and MongoDB application for booking tours.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy the example environment file and configure your variables:

```bash
cp config.env.example config.env
```

Then edit `config.env` with your actual values:

- `DATABASE_PASSWORD`: Your MongoDB password
- `JWT_SECRET`: A secure random string for JWT tokens
- `EMAIL_USERNAME` & `EMAIL_PASSWORD`: Your email service credentials
- `SENDGRID_PASSWORD`: Your SendGrid API key
- `STRIPE_SECRET_KEY`: Your Stripe secret key

### 3. Import Sample Data (Optional)

```bash
npm run import-dev-data
```

### 4. Start the Application

```bash
npm start
```

## Security Notes

- Never commit `config.env` or any files containing real API keys
- Use environment variables for all sensitive information
- The `config.env.example` file shows the required variables without real values

## Available Scripts

- `npm start`: Start the production server
- `npm run dev`: Start the development server with nodemon
- `npm run import-dev-data`: Import sample data to the database
- `npm run delete-dev-data`: Delete all sample data from the database
