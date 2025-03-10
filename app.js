const cart = [];
document.addEventListener("DOMContentLoaded", () => {
  const dessertsList = document.getElementById("dessertsList");
  const cartItems = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");

  const confirmOrderButton = document.createElement("button");
  confirmOrderButton.id = "confirm-order";
  confirmOrderButton.innerText = "Confirm Order";
  confirmOrderButton.style.display = "none"; // Initially hidden

  const orderConfirmationText = document.createElement("p");
  orderConfirmationText.id = "order-confirmation-text";
  orderConfirmationText.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" fill="none" viewBox="0 0 21 20">
  <path fill="#1EA575" d="M8 18.75H6.125V17.5H8V9.729L5.803 8.41l.644-1.072 2.196 1.318a1.256 1.256 0 0 1 .607 1.072V17.5A1.25 1.25 0 0 1 8 18.75Z"/>
  <path fill="#1EA575" d="M14.25 18.75h-1.875a1.25 1.25 0 0 1-1.25-1.25v-6.875h3.75a2.498 2.498 0 0 0 2.488-2.747 2.594 2.594 0 0 0-2.622-2.253h-.99l-.11-.487C13.283 3.56 11.769 2.5 9.875 2.5a3.762 3.762 0 0 0-3.4 2.179l-.194.417-.54-.072A1.876 1.876 0 0 0 5.5 5a2.5 2.5 0 1 0 0 5v1.25a3.75 3.75 0 0 1 0-7.5h.05a5.019 5.019 0 0 1 4.325-2.5c2.3 0 4.182 1.236 4.845 3.125h.02a3.852 3.852 0 0 1 3.868 3.384 3.75 3.75 0 0 1-3.733 4.116h-2.5V17.5h1.875v1.25Z"/>
  </svg>
  This is a <strong>carbon-neutral</strong> delivery`;
  orderConfirmationText.style.display = "none"; // Initially hidden

  // Append the new elements to the cart section
  const cartSection = document.querySelector(".cart");
  cartSection.appendChild(orderConfirmationText);
  cartSection.appendChild(confirmOrderButton);

  let data = []; // Declare data variable to store fetched data

  fetch("./data.json")
    .then((response) => response.json())
    .then((fetchedData) => {
      data = fetchedData; // Store fetched data in the variable
      renderDesserts(data);
    })
    .catch((error) => console.error("Error fetching data", error));

  function renderDesserts(data) {
    data.forEach((item, index) => {
      const productDiv = document.createElement("div");
      productDiv.classList.add("product");
      productDiv.innerHTML =
       `<img src="${item.image.desktop}" alt="${ item.name }" class = "product-image" />
          <button data-index="${index}" class="add-to-cart">
          <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" fill="none" viewBox="0 0 21 20"><g fill="#C73B0F" clip-path="url(#a)">
          <path d="M6.583 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM15.334 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM3.446 1.752a.625.625 0 0 0-.613-.502h-2.5V2.5h1.988l2.4 11.998a.625.625 0 0 0 .612.502h11.25v-1.25H5.847l-.5-2.5h11.238a.625.625 0 0 0 .61-.49l1.417-6.385h-1.28L16.083 10H5.096l-1.65-8.248Z"/><path d="M11.584 3.75v-2.5h-1.25v2.5h-2.5V5h2.5v2.5h1.25V5h2.5V3.75h-2.5Z"/></g><defs><clipPath id="a"><path fill="#fff" d="M.333 0h20v20h-20z"/></clipPath></defs>
          </svg>
          &nbsp;&nbsp;Add to Cart
          </button>
          <div class="quantity-controls" style="display: none;">
            <button class="decrement" data-index="${index}">
            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="none" viewBox="0 0 10 2"><path fill="#fff" d="M0 .375h10v1.25H0V.375Z"/>
            </svg>
            </button>
            <span>1</span>
            <button class="increment" data-index="${index}">
            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="10" fill="none" viewBox="0 0 10 10">
            <path fill="#fff" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"/>
            </svg>
            </button>
          </div>

        <div class="product-info">
          <p>${item.category}</p>
          <h4>${item.name}</h4>
          <p id = "item-price"><strong>$${item.price.toFixed(2)}</strong></p>

        </div>`;
      dessertsList.appendChild(productDiv);
    });

    dessertsList.addEventListener("click", (e) => {
      const itemIndex = parseInt(e.target.getAttribute("data-index"));
      const item = data[itemIndex];
      const productImage = dessertsList.querySelectorAll('.product-image')[itemIndex];   /* for active border*/

      if (e.target.classList.contains("add-to-cart")) {
        const cartItem = cart.find(
          (cartItem) => cartItem.item.name === item.name
        );
        if (cartItem) {
          cartItem.quantity++;
        } else {
          cart.push({ item, quantity: 1 });
        }
        updateProductButtons(itemIndex, true); // Update buttons to show quantity controls
        updateCart();
        productImage.classList.add("active-border");  // Add Border when quantity controls are shown active border 
      } else if (e.target.classList.contains("increment")) {
        const cartItem = cart.find(
          (cartItem) => cartItem.item.name === item.name
        );
        cartItem.quantity++;
        updateCart();
        updateProductQuantityDisplay(itemIndex);
      } else if (e.target.classList.contains("decrement")) {
        const cartItem = cart.find(
          (cartItem) => cartItem.item.name === item.name
        );
        if (cartItem.quantity > 1) {
          cartItem.quantity--;
        } else {
          const cartItemIndex = cart.indexOf(cartItem);
          cart.splice(cartItemIndex, 1);
          updateProductButtons(itemIndex, false); // Revert to "Add to Cart"
          productImage.classList.remove("active-border"); //Remove Border when quantity controls are hidden
        }
        updateCart();
        updateProductQuantityDisplay(itemIndex);
      }
    });
  }

  function initializeCart() {
    const initialSVG = `
     <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" fill="none" viewBox="0 0 128 128"><path fill="#260F08" d="M8.436 110.406c0 1.061 4.636 2.079 12.887 2.829 8.252.75 19.444 1.171 31.113 1.171 11.67 0 22.861-.421 31.113-1.171 8.251-.75 12.887-1.768 12.887-2.829 0-1.061-4.636-2.078-12.887-2.828-8.252-.75-19.443-1.172-31.113-1.172-11.67 0-22.861.422-31.113 1.172-8.251.75-12.887 1.767-12.887 2.828Z" opacity=".15"/>
     <path fill="#87635A" d="m119.983 24.22-47.147 5.76 4.32 35.36 44.773-5.467a2.377 2.377 0 0 0 2.017-1.734c.083-.304.104-.62.063-.933l-4.026-32.986Z"/><path fill="#AD8A85" d="m74.561 44.142 47.147-5.754 1.435 11.778-47.142 5.758-1.44-11.782Z"/><path fill="#CAAFA7" d="M85.636 36.78a2.4 2.4 0 0 0-2.667-2.054 2.375 2.375 0 0 0-2.053 2.667l.293 2.347a3.574 3.574 0 0 1-7.066.88l-1.307-10.667 14.48-16.88c19.253-.693 34.133 3.6 35.013 10.8l1.28 10.533a1.172 1.172 0 0 1-1.333 1.307 4.696 4.696 0 0 1-3.787-4.08 2.378 2.378 0 1 0-4.72.587l.294 2.346a2.389 2.389 0 0 1-.484 1.755 2.387 2.387 0 0 1-1.583.899 2.383 2.383 0 0 1-1.755-.484 2.378 2.378 0 0 1-.898-1.583 2.371 2.371 0 0 0-1.716-2.008 2.374 2.374 0 0 0-2.511.817 2.374 2.374 0 0 0-.493 1.751l.293 2.373a4.753 4.753 0 0 1-7.652 4.317 4.755 4.755 0 0 1-1.788-3.17l-.427-3.547a2.346 2.346 0 0 0-2.666-2.053 2.4 2.4 0 0 0-2.08 2.667l.16 1.173a2.378 2.378 0 1 1-4.72.587l-.107-1.28Z"/>
     <path stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width=".974" d="m81.076 28.966 34.187-4.16"/>
     <path fill="#87635A" d="M7.45 51.793c-.96 8.48 16.746 17.44 39.466 19.947 22.72 2.506 42.08-2.16 43.04-10.667l-3.947 35.493c-.96 8.48-20.24 13.334-43.04 10.667S2.463 95.74 3.423 87.18l4.026-35.387Z"/><path fill="#AD8A85" d="M5.823 65.953c-.96 8.453 16.746 17.44 39.573 20.027 22.827 2.586 42.053-2.187 43.013-10.667L87.076 87.1c-.96 8.48-20.24 13.333-43.04 10.666C21.236 95.1 3.53 86.22 4.49 77.74l1.334-11.787Z"/><path fill="#CAAFA7" d="M60.836 42.78a119.963 119.963 0 0 0-10.347-1.627c-24-2.667-44.453 1.893-45.333 10.373l-2.133 18.88a3.556 3.556 0 1 0 7.066.8 3.574 3.574 0 1 1 7.094.8l-.8 7.094a5.93 5.93 0 1 0 11.786 1.333 3.556 3.556 0 0 1 7.067.8l-.267 2.347a3.573 3.573 0 0 0 7.094.826l.133-1.2a5.932 5.932 0 1 1 11.787 1.36l-.4 3.52a3.573 3.573 0 0 0 7.093.827l.933-8.267a1.174 1.174 0 0 1 1.307-.906 1.146 1.146 0 0 1 1.04 1.306 5.947 5.947 0 0 0 11.813 1.334l.534-4.72a3.556 3.556 0 0 1 7.066.8 3.573 3.573 0 0 0 7.094.826l1.786-15.546a2.373 2.373 0 0 0-2.08-2.667L44.143 55.74l16.693-12.96Z"/>
     <path fill="#87635A" d="m59.156 57.66 1.68-14.88-16.827 13.173 15.147 1.707Z"/>
     <path stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width=".974" d="M9.796 52.06c-.667 5.866 16.24 12.586 37.733 15.04 14.774 1.68 27.867.906 34.854-1.654"/>
     </svg>
     `; // Placeholder for actual SVG content
    const initialText = "Your added items will appear here";

    cartItems.innerHTML = `<div class="initial-cart-state">
        ${initialSVG}
        <p class="cart-item-description">${initialText}</p>
      </div>`;
    cartTotal.parentElement.style.display = "none"; // Hide Order Total initially
  }

  function updateCart() {
    cartItems.innerHTML = "";
    let total = 0;
    cart.forEach((cartItem, index) => {
      const itemTotal = cartItem.item.price * cartItem.quantity;
      total += itemTotal;
      const cartItemDiv = document.createElement("div");
      cartItemDiv.classList.add("cart-item");
      cartItemDiv.innerHTML = `<span class = "cart-item-name"><strong>${
        cartItem.item.name
      }</strong></span>
        <span class = "cart-item-qyantity"><span class = "item-quantity"><strong>${
          cartItem.quantity
        }x</strong></span>&nbsp;&nbsp;&nbsp;&nbsp;@$${cartItem.item.price.toFixed(
        2
      )}&nbsp;&nbsp;&nbsp<strong>$${itemTotal.toFixed(2)}</strong></span>
        <button class="remove" data-index="${index}">
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10">
        <path fill="#CAAFA7" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"/>
        </svg>
        </button>
<hr style="margin: 10px 0; border: none; border-bottom: 0.3px solid hsl(14, 25%, 72%);">
        `;
      cartItems.appendChild(cartItemDiv);
    });

    cartCount.innerHTML = cart.length;
    cartTotal.innerHTML = `$${total.toFixed(2)}`;

    // Show or hide Order Total based on cart length
    cartTotal.parentElement.style.display = cart.length > 0 ? "flex" : "none";

    // Show confirmation text and button when cart is not empty
    if (cart.length > 0) {
      orderConfirmationText.style.display = "flex";
      confirmOrderButton.style.display = "block";
    } else {
      orderConfirmationText.style.display = "none";
      confirmOrderButton.style.display = "none";
      initializeCart();
    }
  }

  function updateProductButtons(itemIndex, isAdding) {
    const products = document.querySelectorAll(".product");
    const product = products[itemIndex];
    const button = product.querySelector(".add-to-cart");
    const quantityControls = product.querySelector(".quantity-controls");
    const quantitySpan = product.querySelector(".quantity-controls span");

    if (isAdding) {
      button.style.display = "none"; // Hide "Add to Cart"
      quantityControls.style.display = "flex"; // Show quantity controls
      quantitySpan.innerText = 1; // Set quantity display to 1
    } else {
      button.style.display = "flex"; // Show "Add to Cart"
      quantityControls.style.display = "none"; // Hide quantity controls
      quantitySpan.innerText = 1; // Reset to 1 when reverted
    }
  }

  function updateProductQuantityDisplay(itemIndex) {
    const products = document.querySelectorAll(".product");
    const product = products[itemIndex];
    const quantitySpan = product.querySelector(".quantity-controls span");

    const cartItem = cart.find(
      (cartItem) => cartItem.item.name === product.querySelector("h4").innerText
    );
    if (cartItem) {
      quantitySpan.innerText = cartItem.quantity; // Update displayed quantity
    }
  }

  function showPopup() {
    const popupOverlay = document.getElementById("popup-overlay");
    const orderSummary = document.getElementById("order-summary");
    // const popupTotal = document.getElementById("popup-total");

    orderSummary.innerHTML = ""; // Clear previous summaries
    let total = 0;

    cart.forEach((cartItem) => {
      const itemTotal = cartItem.item.price * cartItem.quantity;
      total += itemTotal;

      // Create a row for each item

      const itemDiv = document.createElement("div");
      itemDiv.className = "order-item";
      itemDiv.innerHTML = `
  <div class="item-details">
    <img src="${cartItem.item.image.desktop}" alt="${
        cartItem.item.name
      }" class="item-image" />
    <div class="item-info">
      <strong class="item-name">${cartItem.item.name}</strong>
      <span class="item-quantity-price">
        <span class="item-quantity"><strong>${
          cartItem.quantity
        }x</strong></span>&nbsp;&nbsp;&nbsp; @ $${cartItem.item.price.toFixed(
        2
      )}
      </span>
    </div>
  </div>
  <strong class="item-total">$${itemTotal.toFixed(2)}</strong>
`;
      orderSummary.appendChild(itemDiv);
    });

    const orderSummaryTotal = document.createElement("div");
    orderSummaryTotal.className = "orderSummaryTotal";
    orderSummaryTotal.innerHTML = `<p> Order Total <span class = "ordersummarytotal" ><strong>$${total.toFixed(
      2
    )}</strong></span></P>`;
    orderSummary.appendChild(orderSummaryTotal);

    // popupTotal.innerText = total.toFixed(2);
    popupOverlay.style.display = "flex"; // Show the popup
  }

  confirmOrderButton.addEventListener("click", showPopup); // Ensure the popup shows when clicked

  // Add event listener for the cart items to remove items
  cartItems.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove")) {
      const itemIndex = parseInt(e.target.getAttribute("data-index"));
      const cartItem = cart[itemIndex];

      // Find the index of the item in the dessertsList to revert it
      const productIndex = data.findIndex(
        (item) => item.name === cartItem.item.name
      );

      cart.splice(itemIndex, 1);
      updateCart();
      updateProductButtons(productIndex, false); // Revert the product button
    }
  });

  // Function to close the popup and reset the cart and dessert selections
  window.closePopup = function () {
    // Reset the cart
    cart.length = 0; // Clear the cart array
    updateCart(); // Update the cart display

    // Reset dessert selections
    const products = document.querySelectorAll(".product");
    products.forEach((product) => {
      const button = product.querySelector(".add-to-cart");
      const quantityControls = product.querySelector(".quantity-controls");
      const quantitySpan = product.querySelector(".quantity-controls span");

      button.style.display = "flex"; // Show "Add to Cart"
      quantityControls.style.display = "none"; // Hide quantity controls
      quantitySpan.innerText = 1; // Reset to 1
    });

    // Hide the popup
    const popupOverlay = document.getElementById("popup-overlay");
    popupOverlay.style.display = "none"; // Hide the popup overlay
  };

  initializeCart();
});
