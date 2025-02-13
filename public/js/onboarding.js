const onboardingForm = document.getElementById('onboarding-form');

if (onboardingForm) {
  onboardingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    if (username !== '') {
      // Save username locally so it can be used later
      localStorage.setItem('username', username);
      
      // Register user via API
      try {
        const response = await fetch('/api/user/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: username }),
        });
        
        const data = await response.json();
        console.log('User registered:', data);
        
        // Redirect to the chat room
        window.location.href = '/chat';
      } catch (error) {
        console.error('Error registering user:', error);
      }
    }
  });
}
