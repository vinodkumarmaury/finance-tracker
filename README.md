# Personal Finance Visualizer

A simple web application for tracking personal finances, built with **Next.js, React, shadcn/ui, Recharts, and MongoDB**. The application allows users to track their expenses, categorize transactions, and set monthly budgets with insightful visualizations.

## Features

### Stage 1: Basic Transaction Tracking
- Add, Edit, and Delete transactions (amount, date, description)
- View transaction list
- Monthly expenses bar chart
- Basic form validation

### Stage 2: Categories
- All Stage 1 features +
- Predefined categories for transactions
- Category-wise pie chart
- Dashboard with:
  - Total expenses summary
  - Category breakdown
  - Most recent transactions

### Stage 3: Budgeting
- All Stage 2 features +
- Set monthly category budgets
- Budget vs. actual comparison chart
- Simple spending insights

## Tech Stack
- **Frontend:** Next.js, React, shadcn/ui, Recharts
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **UI Components:** TailwindCSS, shadcn/ui

## Installation

### Prerequisites
- Node.js & npm installed
- MongoDB database set up

### Steps to Run Locally
```bash
# Clone the repository
git clone https://github.com/yourusername/personal-finance-visualizer.git
cd personal-finance-visualizer

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env  # Update MongoDB connection string & other secrets

# Run the application
npm run dev
```

## Deployment
### Vercel (Recommended for Frontend)
1. Push the project to GitHub
2. Connect GitHub repository to Vercel
3. Configure environment variables
4. Deploy!

### Backend Deployment
- Deploy on **Render, Railway, or Vercel (serverless functions)**
- Ensure MongoDB connection is accessible from the deployed backend

## Evaluation Criteria
- **Feature Implementation (40%)**
- **Code Quality (30%)**
- **UI/UX Design (30%)**

## Submission Requirements
- GitHub Repository: [Insert Link]
- Live Deployment URL: [Insert Link]
- README with setup instructions

## License
This project is open-source and available under the [MIT License](LICENSE).
