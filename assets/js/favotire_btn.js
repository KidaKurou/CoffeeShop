document.querySelectorAll('.favorite-btn').forEach(button => {
  const profileBlock = document.querySelector('.profile-block-class');
  if (!profileBlock) {
    console.log("You need to login");
    return;
  }

  button.addEventListener('click', function() {
    const favoriteIcon = this.querySelector('img');
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
        const isFavorite = favoriteIcon.src.includes('fav-red-ic.svg');
        favoriteIcon.src = isFavorite ? '../img/fav-white-ic.svg' : '../img/fav-red-ic.svg';
        if (document.location.pathname === '/favourite') {
          location.reload();
        }
      }
    })
    .catch(error => console.error('Error:', error));
  });
});