window.onload = function () {
  document.querySelectorAll('#dropdownDefault').forEach(function (element) {
    element.addEventListener("click", function (event) {
      let dropdown = this.nextSibling.nextSibling;
      document.querySelectorAll('#dropdown').forEach(function (element) {
        if (element !== dropdown && !element.classList.contains("hidden")) {
          element.classList.add("hidden");
        }
      });
      dropdown.classList.toggle("hidden");
    });
  });
}