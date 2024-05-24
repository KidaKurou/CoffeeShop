document.addEventListener('DOMContentLoaded', function () {
  const profileButton = document.querySelector('#profileBtn');
  const profileContent = document.querySelector(".profile-block-class");

  const editButton = document.querySelector('#editButton');
  const acceptButton = document.querySelector('#acceptButton');
  const nameInput = document.querySelector('#nameInput');
  const nameText = document.querySelector('#nameText');
  const emailInput = document.querySelector('#emailInput');
  const emailText = document.querySelector('#emailText');
  const phoneInput = document.querySelector('#phoneInput');
  const phoneText = document.querySelector('#phoneText');
  const addressInput = document.querySelector('#addressInput');
  const addressText = document.querySelector('#addressText');

  if (profileButton && profileContent) {
    profileButton.addEventListener('mouseenter', function () {
      profileContent.classList.remove('hidden');
    });
    
    profileButton.addEventListener('mouseleave', function () {
      setTimeout(function () {
        if (!profileContent.matches(':hover')) {
          profileContent.classList.add('hidden');
        }
      }, 500); // Задержка перед скрытием блока профиля
    });

    editButton.addEventListener('click', () => {
      // Toggle visibility of input fields and text
      nameInput.classList.toggle('hidden');
      nameText.classList.toggle('hidden');
      emailInput.classList.toggle('hidden');
      emailText.classList.toggle('hidden');
      phoneInput.classList.toggle('hidden');
      phoneText.classList.toggle('hidden');
      addressInput.classList.toggle('hidden');
      addressText.classList.toggle('hidden');

      editButton.classList.add('hidden');
      acceptButton.classList.remove('hidden');
    });

    acceptButton.addEventListener('click', () => {
      fetch('/updateUserProfile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: nameInput.value,
          email: emailInput.value,
          phone: phoneInput.value,
          address: addressInput.value
        }),
      })
      .then(response => response.json())
      .then(data => {
        // Handle response
        if(data.success) {
          // Update the UI or notify the user of success
          nameText.textContent = nameInput.value;
          emailText.textContent = emailInput.value;
          phoneText.textContent = phoneInput.value || 'Добавьте телефон';
          addressText.textContent = addressInput.value || 'Добавьте адрес';
          // Hide input fields and show text elements
          nameInput.classList.add('hidden');
          emailInput.classList.add('hidden');
          phoneInput.classList.add('hidden');
          addressInput.classList.add('hidden');
          nameText.classList.remove('hidden');
          emailText.classList.remove('hidden');
          phoneText.classList.remove('hidden');
          addressText.classList.remove('hidden');
          // Swap the buttons back
          acceptButton.classList.add('hidden');
          editButton.classList.remove('hidden');

          showPopup('success');
        } else {
          // Handle errors
          showPopup('error');
          console.error('Error updating profile:', data.message);
        }
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
    });
  }
});

function showPopup(type) {
  let popup = document.querySelector("#login-popup");
  document.getElementsByTagName('body')[0].appendChild(popup);
  popup.classList.remove("hidden");
  popup.querySelector("a").style.display = "none";
  if (type === "success") {
      popup.querySelector(".popup-h").textContent = "Успех!";
      popup.querySelector(".popup-c").textContent = "Информация в профиле обновлена!";
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
