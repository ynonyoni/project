let orders;

const initOrders = async () => {
  let res = await fetch("/getOrdersApprove");
  let data = await res.json();
  if (data.error) {
    displayError(data.error);
  } else {
    orders = data.orders;
    displayOrders([...orders]);
    setSelectOptions(orders);
  }
};

initOrders();

const displayOrder = (order, orderCon) => {
  const orderId = document.createElement("order-id");

  const id = document.createElement("div");
  id.id = "_id"
  id.innerHTML = order._id;
  const name = document.createElement("div");
  name.id = "name"
  name.innerHTML = order.name;

  orderId.append(id);
  orderId.append(name);
  orderCon.append(orderId);

  orderId.onclick = (event) => {
    const products = event.currentTarget.nextElementSibling;
    if (products.classList.contains("hide")) {
      orderId.classList.add('select')
      products.classList.remove("hide");
    } else {
      orderId.classList.remove('select')
      products.classList.add("hide");
    }
  };
  const productsCon = document.createElement("products-con");
  productsCon.classList.add("hide");
  const table = document.createElement("table");
  table.classList.add("table");
  const thead = document.createElement("thead");
  const th = document.createElement("th");
  for (let key in order.products[0]) {
    if (key !== "select") {
      const td = document.createElement("td");
      td.textContent = key;
      td.classList.add(key);
      th.appendChild(td);
    }
  }
  thead.appendChild(th);
  const tbody = document.createElement("tbody");
  order.products.forEach((item, index) => {
    let product = tbody.insertRow();
    product.classList.add("product");
    for (let key in item) {
      if (key !== "select") {
        const elem = product.insertCell();
        elem.textContent = item[key];
        elem.classList.add(key);
      }
    }
  });
  table.append(thead);
  table.append(tbody);
  productsCon.append(table);
  orderCon.append(productsCon);
};

const displayOrders = (orders) => {
  const e = document.querySelector("orders-con");
  if (e) e.remove();

  const con = document.getElementById("container");
  const ordersCon = document.createElement("orders-con");
  orders.forEach(async (order) => {
    const orderCon = document.createElement("order-con");
    await displayOrder(order, orderCon);
    ordersCon.append(orderCon);
  });
  con.append(ordersCon);
};

const getUnique = (arr, key) => {
  const uniqueKey = new Set();
  arr.forEach((item) => uniqueKey.add(item[key].trim()));
  return Array.from(uniqueKey);
};

const setSelectOptions = (orders) => {
  const selectOptions = getUnique(orders, "name");
  const select = document.getElementById("select");
  selectOptions.forEach((option) => {
    const elem = document.createElement("option");
    elem.value = option;
    elem.innerHTML = option;
    select.append(elem);
  });
};

const getSelectedOption = () => {
  const option = document.getElementById("select").value;
  document.getElementById("search").value = "";
  displayOrders(searchOrders([...orders], option, "name"));
};

const searchOrders = (arrayOfObjects, option, key) => {
  const searchResult = arrayOfObjects.filter((obj) => {
    const search = obj[key].toLowerCase();
    return search.startsWith(option.toLowerCase())
  });
  return searchResult;
};

const searchText = () => {
  const text = document.getElementById("search").value;
  if (text === "") {
    displayOrders([...orders]);
  } else {
    let searchResults = searchOrders([...orders], text, '_id');
    if (searchResults.length) displayOrders(searchResults);
    else {
      searchResults = searchOrders([...orders], text, 'name');
      displayOrders(searchResults);
    }
  }
  document.getElementById("select").value=""
};
