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
    })
}