const displayMessage = (message) => {
  document.getElementById("message-con").style.display = "block";
  document.getElementById("message").innerHTML = message;
};

const hideMessage = (id) => {
  document.getElementById("message-con").style.display = "none";
};

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validatePassword = (password) => {
  return (password.length >= 5 && password.length <= 10)
}