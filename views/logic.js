const registerForm = document.querySelector('form');

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    //get values
    const email = registerForm.email.value;
    const password = registerForm.password.value;

    try {
        const response = await fetch('/register', {
            method: 'POST',
            // body: JSON.stringify({ email: email, password: password})
            body: JSON.stringify({ email, password}),
            headers: { 'Content-Type':'application/json' }
        })
        console.log('test');
    } catch (error) {
        console.log(error);
    }

})