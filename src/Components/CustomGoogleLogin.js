// GoogleCustomLoginButton.jsx
import React from 'react';
import {jwtDecode} from 'jwt-decode';
import { Button } from '@mui/material';

const GoogleCustomLoginButton = () => {
  const handleLogin = () => {
    window.google.accounts.id.initialize({
      client_id: '322051925111-k6amdp4sqr2dskobsg9hf9eh4gur8ap0.apps.googleusercontent.com',
      callback: handleCredentialResponse,
    });

    window.google.accounts.id.prompt(); // opens the One Tap prompt
  };

  const handleCredentialResponse = (response) => {
    if (response.credential) {
      const decoded = jwtDecode(response.credential);
      console.log('ID Token:', response.credential);
      console.log('Decoded Info:', decoded);
    } else {
      console.error('Login failed or cancelled');
    }
  };

  return (
    <Button
    size='small'
      onClick={handleLogin}
      
      sx={{
           bgcolor: "#f6f7fb",
                                color: "#1976d2",
                                fontWeight: "bold",
                                fontSize: 14,
                                px: 2,  
                                py: 1,
                               boxShadow: "8px 8px 16px #e0e0e0, -8px -8px 16px #ffffff",
                                transition: "box-shadow 0.2s",
                                  textTransform: "none",
      }}
    > 
      Continue with Google
    </Button>
  );
};

export default GoogleCustomLoginButton;
