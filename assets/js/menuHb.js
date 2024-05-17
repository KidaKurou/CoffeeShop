window.onload = function() {
    const hamburger = document.querySelector(".buy-menu");
    const menu = document.querySelector(".buy-dropdown");
    hamburger.addEventListener("mouseover", function() {
        if (menu.style.display === "block") {
            menu.style.display = "none";
        } else {
            menu.style.display = "block";
        }
    });

    hamburger.addEventListener("mouseout", function() {
        menu.style.display = "none";
    })
}