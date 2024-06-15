const getTotalOrder = async () => {
  const user = await JSON.parse(localStorage.getItem("user"));
  document.getElementById("totalProducts").innerHTML = user.totalProducts;
  document.getElementById("totalPrice").innerHTML = user.totalPrice;
};

getTotalOrder();

const approveOrder = async () => {
  const user = await JSON.parse(localStorage.getItem("user"));

  let res = await fetch("/approveOrder", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "post",
    body: JSON.stringify({
      orderId: user.orderId,
    }),
  });
  let data = await res.json();
  if (data.Error) {
    displayError(data.Error);
  } else {
    localStorage.clear()
    window.location.href = data.url;
  }
};
