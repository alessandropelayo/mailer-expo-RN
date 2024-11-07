# React Native Front End

This project is a mobile front-end built with React Native using the Expo framework. The app allows users to connect and display data from [mailer-node-js](https://github.com/alessandropelayo/mailer-node-js)

## Prerequisites

- Node.js (version 20 or higher)

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Create a .env at the top folder level
   
   Expects: 
   ```bash
   EXPO_PUBLIC_API_URL=yourUrlHere
   ```
   This is the URL of your server running mailer-node-js

3. Start the app

   ```bash
    npx expo start
   ```

## Deployment

   For web:
   ```bash
    npx expo export -p web
   ```
