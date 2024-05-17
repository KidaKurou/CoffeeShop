window.onload = function () {
  const profileButton = document.querySelector('a[href="/profile"]');
  const profileBlock = document.querySelector(".profile-block-class");
  const mouseInProfile = false;

  profileBlock.addEventListener("mouseenter", function () {
    mouseInProfile = true;
  });

  profileBlock.addEventListener("mouseleave", function () {
    mouseInProfile = false;
  });

  profileButton.addEventListener("mouseenter", function () {
    profileBlock.classList.remove("hidden");
  });

  profileButton.addEventListener("mouseleave", function () {
    // Delay hiding the profile block
    setTimeout(function () {
        if (!mouseInProfile) {
            profileBlock.classList.add("hidden");
      }
    }, 1000);
  });
};
