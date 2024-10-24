// src/components/TelegramWebApp.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TelegramWebApp = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Create the Telegram WebApp script
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-web-app.js';
    script.async = true;
    document.body.append(script);

    // Initialize Telegram WebApp once script is loaded
    script.onload = () => {
      const tg = window.Telegram.WebApp;
      
      // Enable closing confirmation dialog
      tg.enableClosingConfirmation();

      // Initialize the WebApp
      tg.ready();

      // Set app header color
      tg.setHeaderColor('#000000');

      // You can expand the viewport to the maximum available height
      tg.expand();

      // Access user data if needed
      const user = tg.initDataUnsafe?.user;
      if (user) {
        console.log('Telegram User:', user);
        // You can store user data in your app's state management here
      }
    };

    // Cleanup
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default TelegramWebApp;