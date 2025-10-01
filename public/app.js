document
  .getElementById('loginForm')
  .addEventListener('submit', async function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const response = await fetch('/login', {
      method: 'POST',
      body: new URLSearchParams(formData),
    });
    alert(await response.text());
  });
