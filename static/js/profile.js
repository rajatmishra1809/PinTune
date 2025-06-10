document.addEventListener('DOMContentLoaded', function() {
    const profileForm = document.getElementById('profile-form');
    const profileNameInput = document.getElementById('profile-name');
    const profileEmailInput = document.getElementById('profile-email');
    const registrationMessageDiv = document.getElementById('registration-message');

    profileForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        registrationMessageDiv.textContent = 'Registering...';
        registrationMessageDiv.classList.remove('text-green-600', 'text-red-600');
        registrationMessageDiv.classList.add('text-gray-600');

        const name = profileNameInput.value;
        const email = profileEmailInput.value;

        if (!name || !email) {
            registrationMessageDiv.textContent = 'Please enter both name and email.';
            registrationMessageDiv.classList.remove('text-gray-600');
            registrationMessageDiv.classList.add('text-red-600');
            return;
        }

        try {
            const response = await fetch('/register_profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: name, email: email })
            });

            const data = await response.json();

            if (response.ok) {
                registrationMessageDiv.textContent = data.message;
                registrationMessageDiv.classList.remove('text-gray-600', 'text-red-600');
                registrationMessageDiv.classList.add('text-green-600');
                profileNameInput.value = '';
                profileEmailInput.value = '';
            } else {
                registrationMessageDiv.textContent = data.error || 'Registration failed.';
                registrationMessageDiv.classList.remove('text-gray-600', 'text-green-600');
                registrationMessageDiv.classList.add('text-red-600');
            }

        } catch (error) {
            registrationMessageDiv.textContent = 'An error occurred during registration. Please try again.';
            registrationMessageDiv.classList.remove('text-gray-600', 'text-green-600');
            registrationMessageDiv.classList.add('text-red-600');
        }
    });
});
