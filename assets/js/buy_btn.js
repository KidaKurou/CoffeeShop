document.querySelectorAll(".product-card").forEach((card) => {
  const productId = card.querySelector(".add-to-cart-btn").dataset.productId;
  const quantityElement = card.querySelector(".quantity");
  const grindTypeSelector = card.querySelector(".grindType-selector");
  const weightSelector = card.querySelector(".weight-selector");
  const basePrice = parseInt(card.dataset.price);

  card.querySelector(".quantity-decrease").addEventListener("click", () => {
    let quantity = parseInt(quantityElement.textContent);
    if (quantity > 1) {
      quantityElement.textContent = quantity - 1;
    }
    console.log("Decrease: " + quantity);
  });

  card.querySelector(".quantity-increase").addEventListener("click", () => {
    let quantity = parseInt(quantityElement.textContent);
    quantityElement.textContent = quantity + 1;
    console.log("Increase: " + quantity);
  });

  card.querySelector(".add-to-cart-btn").addEventListener("click", () => {
    // Check if the user is authenticated
    console.log("USER ID " + card.querySelector(".add-to-cart-btn").dataset.userId);
    if (card.querySelector(".add-to-cart-btn").dataset.userId !== undefined && card.querySelector(".add-to-cart-btn").dataset.userId !== "") {
      const grindType = grindTypeSelector.value;
      const weight = weightSelector.value;
      const quantity = parseInt(quantityElement.textContent);

      const currentPrice = ((basePrice * parseInt(weight)) / 250) * quantity;

      fetch("/add-to-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          productId,
          grindType,
          weight,
          quantity,
          currentPrice,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // Обновите UI корзины или покажите сообщение об успехе
            console.log("Товар добавлен в корзину");
            showPopup("success");
          }
        })
        .catch((error) => console.error("Error:", error));
    } else {
      // User is not authenticated, show the login pop-up
      const loginPopup = document.getElementById("login-popup");
      loginPopup.classList.remove("hidden");

      // Hide the pop-up after 5 seconds
      setTimeout(() => {
        loginPopup.classList.add("hidden");
      }, 5000);
    }
  });
});

function showPopup(type) {
  let popup = document.querySelector("#login-popup");
  document.getElementsByTagName('body')[0].appendChild(popup);
  popup.classList.remove("hidden");
  popup.querySelector("a").style.display = "none";
  if (type === "success") {
      popup.querySelector(".popup-h").textContent = "УСПЕХ!";
      popup.querySelector(".popup-c").textContent = "ТОВАР ДОБАВЛЕН В КОРЗИНУ!";
      popup.querySelector("#bg-popup").classList.add("bg-green-100");
  } else {
      popup.querySelector(".popup-h").textContent = "Ошибка!";
      popup.querySelector(".popup-c").textContent = "Ошибка при изменении информации в профиле.";
      popup.querySelector("#bg-popup").classList.add("bg-red-100");
  }
  // Remove the pop-up after 5 seconds
  setTimeout(() => {
      popup.classList.add('hidden');
      popup.querySelector("#bg-popup").classList.remove("bg-green-100");
      popup.querySelector("#bg-popup").classList.remove("bg-red-100");
      document.getElementsByTagName('body')[0].removeChild(popup);
  }, 5000);
}
