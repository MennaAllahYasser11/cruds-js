

let title = document.getElementById("title");
let price = document.getElementById("price");
let discount = document.getElementById("discount");
let total = document.createElement("span"); 
total.id = "total"; // Set the id for later use
let count = document.getElementById("count");
let category = document.getElementById("category");
let submit = document.getElementById("submit");

let mood = "create";
let tmp;


function getTotal() {
  console.log("Calculating Total");
  if (price.value !== "") {
    let result = parseFloat(price.value); 
    if (discount.value !== "") {
      // If a discount is provided, subtract it
      result -= parseFloat(discount.value);
    }
    result = result < 0 ? 0 : result; // Set to 0 if result is negative
    
    // Display total without decimal if it's a whole number
    total.innerHTML = Number.isInteger(result) ? result : result.toFixed(2);
  } else {
    total.innerHTML = ""; // Clear the total if price is empty
  }
}


// Create product
let dataPro = JSON.parse(localStorage.getItem("product")) || [];

submit.onclick = function () {
  let newPro = {
    title: title.value.toLowerCase(),
    price: price.value,
    discount: discount.value,
    total: total.innerHTML,
    count: count.value,
    category: category.value.toLowerCase(),
  };

  if (mood === "create") {
    if (newPro.count > 1) {
      for (let i = 0; i < newPro.count; i++) {
        dataPro.push(newPro);
      }
    } else {
      dataPro.push(newPro);
    }
  } else {
    dataPro[tmp] = newPro;
    mood = "create";
    submit.innerHTML = "Create";
    count.style.display = "block";
  }

  localStorage.setItem("product", JSON.stringify(dataPro));
  console.log(dataPro);
  clearData();
  showData();
};

// Clear inputs
function clearData() {
  title.value = "";
  price.value = "";
  discount.value = "";
  count.value = "";
  category.value = "";
  total.innerHTML = "";
}

// Read Data
function showData() {
  let table = "";
  for (let i = 0; i < dataPro.length; i++) {
    table += `
        <tr>
            <td>${i + 1}</td>
            <td>${dataPro[i].title}</td>
            <td>${dataPro[i].price}</td>
            <td>${dataPro[i].category}</td>
            <td>${dataPro[i].discount}</td>
            <td>${dataPro[i].total}</td>
            <td><button onclick="updateData(${i})" class="updatebtn">Update</button></td>
            <td><button onclick="deleteData(${i})" class="deletebtn">Delete</button></td>
        </tr>
        `;
  }

  document.getElementById("tbody").innerHTML = table;

  let btnDelete = document.getElementById("deleteAll");
  if (dataPro.length > 0) {
    btnDelete.innerHTML = `<button class="btn-delete rounded-3 p-3" onclick="deleteAll()">Delete All (${dataPro.length})</button>`;
  } else {
    btnDelete.innerHTML = ``;
  }
}

// Delete data
function deleteData(i) {
  console.log(i);
  dataPro.splice(i, 1);
  localStorage.setItem("product", JSON.stringify(dataPro));
  showData();
}

function deleteAll() {
  localStorage.removeItem("product");
  dataPro = [];
  showData();
}

// Update
function updateData(i) {
  title.value = dataPro[i].title;
  price.value = dataPro[i].price;
  discount.value = dataPro[i].discount;

  getTotal();
  count.style.display = "none";
  category.value = dataPro[i].category;
  submit.innerHTML = "Update";
  mood = "update";
  tmp = i;

  scroll({
    top: 0,
    behavior: "smooth",
  });
}

// Search
let searchMood = "title";
function getSearchMood(id) {
  let search = document.getElementById("search");
  searchMood = id === "searchTitle" ? "title" : "category";
  search.placeholder = "Search By " + searchMood;
  search.focus();
  search.value = "";
}

function searchData(value) {
  let table = "";
  for (let i = 0; i < dataPro.length; i++) {
    if (
      (searchMood === "title" && dataPro[i].title.includes(value.toLowerCase())) ||
      (searchMood === "category" && dataPro[i].category.includes(value.toLowerCase()))
    ) {
      table += `
            <tr>
                <td>${i + 1}</td>
                <td>${dataPro[i].title}</td>
                <td>${dataPro[i].price}</td>
                <td>${dataPro[i].category}</td>
                <td>${dataPro[i].discount}</td>
                <td>${dataPro[i].total}</td>
              <td><button onclick="updateData(${i})" class="updatebtn">Update</button></td>
            <td><button onclick="deleteData(${i})" class="deletebtn">Delete</button></td>
            </tr>
            `;
    }
  }
  document.getElementById("tbody").innerHTML = table;
}

// Show data on page load
showData();
