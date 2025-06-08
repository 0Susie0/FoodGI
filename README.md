# FoodGI - Food Glycemic Index Tracker

A React Native mobile application designed to help diabetic patients track and recognize the glycemic index (GI) of foods to better manage their blood sugar levels.

## Features

- User authentication (login/signup)
- Food GI search and recognition
- Personal food log and history
- Blood glucose tracking
- Meal planning suggestions based on GI values

## Project Structure

```
FoodGI/
├── src/
│   ├── api/           # API integration
│   ├── assets/        # Images, fonts, etc.
│   ├── components/    # Reusable components
│   ├── navigation/    # Navigation configuration
│   ├── screens/       # App screens
│   ├── services/      # Business logic
│   ├── store/         # State management
│   ├── utils/         # Utility functions
│   └── App.js         # App entry point
├── package.json       # Dependencies and scripts
└── README.md          # This file
```

## Authentication

The app uses Firebase Authentication to manage user accounts, providing:
- Email/password authentication
- Social login options
- Secure session management
- Password reset functionality

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- React Native setup (follow [React Native Environment Setup](https://reactnative.dev/docs/environment-setup))

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up your Firebase project and add configuration
4. Start the development server:
   ```
   npm start
   ```

## Usage

After authentication, users can:
1. Search for foods to view their GI values
2. Log meals and track blood glucose levels
3. Get personalized recommendations for meal planning

## Technologies

- React Native
- Firebase (Authentication and Firestore)
- Redux/Context API for state management
- React Navigation for screen navigation 