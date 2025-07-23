// GoogleCustomLoginButton.jsx
import React from 'react';
import {jwtDecode} from 'jwt-decode';

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
    <button
      onClick={handleLogin}
      style={{
        padding: '10px 20px',
        backgroundColor: '#4285F4',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer',
      }}
    >
      Continue with Google
    </button>
  );
};

export default GoogleCustomLoginButton;
