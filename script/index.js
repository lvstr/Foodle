// Fungsi Foodle Cart
let foodleCart = (() => {
  // Private methods and propeties
  cart = [];

  // Class Constructor Item
  class Item {
    constructor(name, price, count) {
      this.name = name;
      this.price = price;
      this.count = count;
    }
  }

  // Fungsi menyimpan Cart
  let saveCart = () => {
    localStorage.setItem("foodleCart", JSON.stringify(cart));
  };

  // Fungsi load Cart
  let loadCart = () => {
    cart = JSON.parse(localStorage.getItem("foodleCart"));
  };
  if (localStorage.getItem("foodleCart") != null) {
    loadCart();
  }

  // Public methods dan propeties
  let obj = {};

  // Tambah Item ke Cart
  obj.addItemToCart = (name, price, count) => {
    for (let item in cart) {
      if (cart[item].name === name) {
        cart[item].count++;
        saveCart();
        return;
      }
    }
    let item = new Item(name, price, count);
    cart.push(item);
    saveCart();
  };

  // Hapus Item dari Cart
  obj.removeItemFromCart = (name) => {
    for (let item in cart) {
      if (cart[item].name === name) {
        cart[item].count--;
        if (cart[item].count === 0) {
          cart.splice(item, 1);
        }
        break;
      }
    }
    saveCart();
  };

  // Set count untuk jumlah Item
  obj.setCountForItem = (name, count) => {
    for (let i in cart) {
      if (cart[i].name === name) {
        cart[i].count = count;
        break;
      }
    }
  };

  // Hapus semua Item dari Cart
  obj.removeItemFromCartAll = (name) => {
    for (let item in cart) {
      if (cart[item].name === name) {
        cart.splice(item, 1);
        break;
      }
    }
    saveCart();
  };

  // Bersihkan Cart
  obj.clearCart = () => {
    cart = [];
    saveCart();
  };

  // Jumlah Item di Cart
  obj.totalCount = () => {
    let totalCount = 0;
    for (let item in cart) {
      totalCount += cart[item].count;
    }
    return totalCount;
  };

  // Total Cart
  obj.totalCart = () => {
    let totalCart = 0;
    for (let item in cart) {
      totalCart += cart[item].price * cart[item].count;
    }
    return Number(totalCart.toFixed(2));
  };

  // Daftar Cart
  obj.listCart = () => {
    let cartCopy = [];
    for (i in cart) {
      item = cart[i];
      itemCopy = {};
      for (p in item) {
        itemCopy[p] = item[p];
      }
      itemCopy.total = Number(item.price * item.count).toFixed(2);
      cartCopy.push(itemCopy);
    }
    return cartCopy;
  };

  return obj;
})();

// Fungsi Pemicu dan Event

document.addEventListener("DOMContentLoaded", () => {
  // Event Handler
  const eventHandler = (selector, event, childSelector, handler) => {
    let is = function (el, selector) {
      return (
        el.matches ||
        el.matchesSelector ||
        el.msMatchesSelector ||
        el.mozMatchesSelector ||
        el.webkitMatchesSelector ||
        el.oMatchesSelector
      ).call(el, selector);
    };

    let elements = document.querySelectorAll(selector);
    [].forEach.call(elements, function (el, i) {
      el.addEventListener(event, function (e) {
        if (is(e.target, childSelector)) {
          handler(e);
        }
      });
    });
  };

  // Tambah item

  let addToCart = document.querySelectorAll(".add-to-cart");
  addToCart.forEach((cart) => {
    cart.addEventListener("click", (event) => {
      event.preventDefault();
      let name = cart.dataset.name;
      let price = Number(cart.dataset.price);
      foodleCart.addItemToCart(name, price, 1);
      displayCart();
    });
  });

  // Bersihkan Item
  let clearItemInCart = document.getElementById("clear-cart");
  clearItemInCart.addEventListener("click", () => {
    foodleCart.clearCart();
    displayCart();
  });

  let displayCart = () => {
    let cartArray = foodleCart.listCart();
    let output = "";
    for (let i in cartArray) {
      output += `

    <tr> 
    <td> ${cartArray[i].name} </td>
    <td>(Rp. ${cartArray[i].price})</td>
    <td>
    
    <div class='input-group'>
    <button id='minus-item' class='input-group-addon btn btn-primary' data-name="${cartArray[i].name}">-</button>
    
    <input type='number' id='item-count' class='form-control' data-name='${cartArray[i].name}' value='${cartArray[i].count}'>
    <button id='plus-item' class='btn btn-primary input-group-addon' data-name="${cartArray[i].name}">+</button>
    
    </div>
    </td>

    <td>
    <button id='delete-item' class='btn btn-danger' data-name="${cartArray[i].name}"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
  </svg></button>
    </td>


    <td>
    Rp. ${cartArray[i].total}
    </td>
    </tr>
    
    
    `;
    }

    document.getElementById("show-cart").innerHTML = output;
    document.getElementById("total-cart").innerHTML = foodleCart.totalCart();
    document.getElementById("total-count").innerHTML = foodleCart.totalCount();
  };

  // Tombol hapus item
$('#show-cart').on("click", "#delete-item", function(event) {
  let name = $(this).data('name')
  foodleCart.removeItemFromCartAll(name);
  displayCart();
})
// Tombol kurang Item
$('#show-cart').on("click", "#minus-item", function(event) {
  let name = $(this).data('name')
  foodleCart.removeItemFromCart(name);
  displayCart();
})
// Tombol tambah Item
$('#show-cart').on("click", "#plus-item", function(event) {
  let name = $(this).data('name')
  foodleCart.addItemToCart(name);
  displayCart();
})

// Input jumlah Item
$('#show-cart').on("change", "#item-count", function(event) {
   let name = $(this).data('name');
   let count = Number($(this).val());
  foodleCart.setCountForItem(name, count);
  displayCart();
});

  displayCart();
});
