document.getElementById('forms').addEventListener('submit', (e) => {
    e.preventDefault()
    const userid = document.getElementById('userid').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    errorMessage.style.display = 'none';
    errorMessage.textContent = '';

    if (!userid || !password) {
        errorMessage.textContent = 'Please fill out all fields!';
        errorMessage.style.display = 'block';
        return;
    }

    const formData = {
        userid: userid,
        password: password
    };

    fetch('/venderlogin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Invalid credentials or server error');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert('Login successful!');
            window.location.href = '/vendorhomepage/'+ userid;
        } else {
            errorMessage.textContent = data.message || 'Invalid credentials';
            errorMessage.style.display = 'block';
        }
    })
    .catch(error => {
        errorMessage.textContent = 'An error occurred: ' + error.message;
        errorMessage.style.display = 'block';
        console.error('Error:', error);
    });
});
