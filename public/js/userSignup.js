document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('forms');
    const errorMessageElement = document.getElementById('error-message');

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent the form from submitting normally

        const name = document.getElementById('name').value;
        const gmail = document.getElementById('gmail').value;
        const password = document.getElementById('password').value;

        // Form validation
        if (!name || !gmail || !password) {
            errorMessageElement.textContent = 'Please fill in all fields.';
            errorMessageElement.style.display = 'block';
            return;
        }

        // Prepare data to send to the server
        const formData = {
            name: name,
            gmail: gmail,
            password: password
        };

        // Send data to the server using Fetch API
        fetch('/usersignup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            // Handle the response from the server
            if (data.success) {
                window.location.href = './user-dashboard';  // Redirect to user dashboard
            } else {
                errorMessageElement.textContent = data.message;  // Display error message from server
                errorMessageElement.style.display = 'block';
            }
        })
        .catch(error => {
            errorMessageElement.textContent = 'An error occurred. Please try again later.';
            errorMessageElement.style.display = 'block';
        });
    });

    // Clear error message when the user starts typing
    document.getElementById('name').addEventListener('input', () => errorMessageElement.style.display = 'none');
    document.getElementById('gmail').addEventListener('input', () => errorMessageElement.style.display = 'none');
    document.getElementById('password').addEventListener('input', () => errorMessageElement.style.display = 'none');
});
