const userValidation = async () => {
  let email = document.getElementById("email").value;
  if (!validateEmail(email)) {
    displayMessage("Please enter a valid email adress");
    return false;
  }
  let password = document.getElementById("password").value;
  if (!validatePassword(password)) {
    displayMessage("You entered an incorrect password");
    return false;
  }

  let res = await fetch("/userValidation", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "post",
    body: JSON.stringify({
      email,
      password,
    }),
  });
  const data = await res.json();
  if (data.error) {
    displayMessage(data.error);
  } else {
    const user = {
      email,
      name: data.name,
    };
    await localStorage.setItem("user", JSON.stringify(user));
    window.location.href = data.url;
  }
};
