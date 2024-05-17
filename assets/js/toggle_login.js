window.onload = function() {
    document.querySelectorAll('#toggle_login').forEach(function(element) {
        element.addEventListener("click", function(event) {
            let login = document.querySelector('#login-section');
            let register = document.querySelector('#register-section');
            if (login.classList.contains('hidden')) {
                login.classList.remove('hidden');
                register.classList.add('hidden');
            } else {
                login.classList.add('hidden');
                register.classList.remove('hidden');
            }
        })
    });

    document.querySelector('#register-section form').addEventListener('submit', function(event) {
        const password = document.querySelector('#register-section #password').value;
        const confirmPassword = document.querySelector('#register-section #confirm-password').value;
        if (password !== confirmPassword) {
          event.preventDefault(); // Prevent form submission
          alert('Passwords do not match');
          console.log("Passwords do not match " + password + " " + confirmPassword);
        }
      });
}