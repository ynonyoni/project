let products;

const getProducts = async () => {
  const user = await JSON.parse(localStorage.getItem("user"));
  if (!user) {
   window.location.href = '/'
  }
  let res = await fetch("/getProducts"); //get
  products = await res.json();
  displayProducts([...products]);
};

getProducts();

const displayProducts = (list) => {
  const e = document.querySelector("table");
  if (e) e.remove();
  const table = document.createElement("table");
  table.classList.add("table");
  const thead = document.createElement("thead");
  const th = document.createElement("th");
  for (let key in list[0]) {
    if (key !== "select") {
      const td = document.createElement("td");
      td.textContent = key;
      td.classList.add(key);
      th.appendChild(td);
    }
  }
  thead.appendChild(th);
  const tbody = document.createElement("tbody");
  list.forEach((item) => {
    let product = tbody.insertRow();
    product.id = item.name;
    product.name = item.name;
    product.classList.add("product");
    if (item.select) product.classList.add("select");
    product.onclick = () => {
      if (product.classList.contains("select")) {
        products.find(p => p.name === product.name).select = false
        product.classList.remove("select");
      } else {
        products.find(p => p.name === product.name).select = true
        product.classList.add("select");
      }
    };
    for (let key in item) {
      if (key !== "select") {
        const elem = product.insertCell();
        elem.textContent = item[key];
        elem.classList.add(key);
      }
    }
  });
  let con = document.getElementById("products-con");
  table.appendChild(thead);
  table.appendChild(tbody);
  con.append(table);
}

const getSelectedOption = () => {
  const option = document.getElementById("sort").value;
  document.getElementById("search").value = ''
  sortProducts(option);
};

const sortProducts = (id) => {
  let sortedProducts 
  if (id === 'name') {
   sortedProducts = products.toSorted((a, b) => a.name.trim().toLowerCase().localeCompare(b.name.trim().toLowerCase()));
  }else{
    sortedProducts = products.toSorted((a, b) => a.price - b.price);
  }
  displayProducts(sortedProducts);
};

const searchProducts = (arrayOfObjects, substring) => {
  const searchResult = arrayOfObjects.filter((obj) => {
    const name = obj.name.toLowerCase();
    return name.startsWith(substring.toLowerCase());
  });
  return searchResult;
};

const searchText = () => {
  const text = document.getElementById("search").value;
  if (text === "") {
    displayProducts([...products]);
  } else {
    const searchResults = searchProducts([...products], text);
    displayProducts(searchResults);
  }
  document.getElementById("sort").value=""
};

const buyProducts = async () => {
  const order = products.filter((item) => item.select);
  if (order.length === 0) {
    displayMessage('Nothing has been added to cart')
    return
  }
  const totalPrice = order.reduce((accumulator, currentItem) => accumulator + currentItem.price,0);
  const totalProducts = order.length;

  const user = await JSON.parse(localStorage.getItem("user"));
  user.totalPrice = totalPrice
  user.totalProducts = totalProducts
// input to server
  const res = await fetch("/saveOrder", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "post",
    body: JSON.stringify({
      name: user.name,
      email: user.email,
      order,
    }),
  });
// output from server
  const data = await res.json();
  if (data.error) {
    displayMessage(data.error);
  } else {
    user.orderId = data._id;
    await localStorage.setItem("user", JSON.stringify(user));
    window.location.href = data.url;
  }
};
