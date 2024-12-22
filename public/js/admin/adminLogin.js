document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('forms');
    const errorMessageElement = document.getElementById('error-message');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const userid = document.getElementById('userid').value;
        const password = document.getElementById('password').value;

        errorMessageElement.textContent = '';
        errorMessageElement.style.display = 'none';

        if (!userid || !password) {
            errorMessageElement.textContent = 'Please fill in all fields.';
            errorMessageElement.style.display = 'block';
            return;
        }

        const formData = {
            userid: userid,
            password: password,
        };

        fetch('/adminlogin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                window.location.href = './adminhome';
            } else {
                errorMessageElement.textContent = data.message || 'Invalid credentials. Please try again.';
                errorMessageElement.style.display = 'block';
            }
        })
        .catch((error) => {
            errorMessageElement.textContent = 'An error occurred. Please try again later.';
            errorMessageElement.style.display = 'block';
            console.error('Error:', error);
        });
    });

    document.getElementById('userid').addEventListener('input', () => {
        errorMessageElement.style.display = 'none';
    });
    document.getElementById('password').addEventListener('input', () => {
        errorMessageElement.style.display = 'none';
    });
});
