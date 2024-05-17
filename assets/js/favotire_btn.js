document.querySelectorAll('.favorite-btn').forEach(button => {
  button.addEventListener('click', function() {
    const productId = this.dataset.productId;
    console.log("clicked " + productId);
    fetch('/add-to-favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ productId: productId })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Update the UI to reflect the favorite status
        this.classList.toggle('text-red-500');
        this.classList.toggle('text-grey-400');
        console.log('Product added to favorites');
      }
    })
    .catch(error => console.error('Error:', error));
  });
});