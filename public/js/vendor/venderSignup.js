document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('forms');
    const errorMessageElement = document.getElementById('error-message');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const gmail = document.getElementById('gmail').value;
        const password = document.getElementById('password').value;
        const category = document.getElementById('category').value;

        if (!name || !gmail || !password || !category) {
            errorMessageElement.textContent = 'Please fill in all fields.';
            errorMessageElement.style.display = 'block';
            return;
        }


        const formData = {
            name: name,
            gmail: gmail,
            password: password,
            category: category
        };

        fetch('/vendersignup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = '/venderlogin';
            } else {
                errorMessageElement.textContent = data.message;  
                errorMessageElement.style.display = 'block';
            }
        })
        .catch(error => {
            errorMessageElement.textContent = 'An error occurred. Please try again later.';
            errorMessageElement.style.display = 'block';
        });
    });

    document.getElementById('name').addEventListener('input', () => errorMessageElement.style.display = 'none');
    document.getElementById('gmail').addEventListener('input', () => errorMessageElement.style.display = 'none');
    document.getElementById('password').addEventListener('input', () => errorMessageElement.style.display = 'none');
});
