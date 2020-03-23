checkAuth();

function checkAuth() {
  const token = isUserLoggedIn();
  if (!token) {
    window.location.href = '/login.html';
  }
}