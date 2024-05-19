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
    const grindType = grindTypeSelector.value;
    const weight = weightSelector.value;
    const quantity = parseInt(quantityElement.textContent);

    const currentPrice = (basePrice * parseInt(weight) / 250) * quantity;

    fetch("/add-to-cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ productId, grindType, weight, quantity, currentPrice }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Обновите UI корзины или покажите сообщение об успехе
          console.log("Товар добавлен в корзину");
        }
      })
      .catch((error) => console.error("Error:", error));
  });
});
