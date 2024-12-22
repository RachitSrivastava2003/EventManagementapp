document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('addProductForm');
    const errorMessageElement = document.getElementById('error-message');

    // Event listener for the form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const productName = form.querySelector('input[placeholder="Product Name"]').value;
        const productPrice = form.querySelector('input[placeholder="Product Price"]').value;
        const vendorId = document.getElementById('id').value;

        // Validate the input
        if (!productName || !productPrice) {
            errorMessageElement.textContent = 'Please fill in all fields correctly.';
            errorMessageElement.style.display = 'block';
            return;
        }

        
        // Create form data to send with POST request
        const formData = {
            productname: productName,
            price: productPrice,
            id: vendorId
        };
    
        console.log(JSON.stringify(formData));
        // Send the form data to the server
        fetch('/additem', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                errorMessageElement.style.display = 'none';
                window.location.href='/additem/'+vendorId;
            } else {
                errorMessageElement.textContent = data.message || 'An error occurred!';
                errorMessageElement.style.display = 'block';
            }
        })
        .catch(err => {
            errorMessageElement.textContent = 'An error occurred: ' + err.message;
            errorMessageElement.style.display = 'block';
        });
    });

    
});
