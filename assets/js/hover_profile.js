document.addEventListener('DOMContentLoaded', function () {
  const profileButton = document.querySelector('#profileBtn');
  const profileContent = document.querySelector(".profile-block-class");

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
});
