//----------------------------------------------------------------
//*************************** Login ******************************
//----------------------------------------------------------------
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();   // Prevent the default form submission

  //const email = e.target.email.value;
  //const password = e.target.password.value;
  //const data = {email, password};   
  const { email, password } = e.target.elements;
  const data = { email: email.value, password: password.value }; 

  try {
    const response = await fetch('http://localhost:5678/api/users/login', {
      method: 'POST',   // To know the method used by the request
      headers: {   //The headers we want to add to our request
        'Accept': 'application/json',   //What we expect as a format
        'Content-Type': 'application/json'   //What we send as a format
      },
      body: JSON.stringify(data)   //Convert data into JSON format and add to the login request
    });

    if (response.ok) {   // If the response is successful (status code between 200 and 400)      
      const responseData = await response.json();   
      localStorage.setItem('token', responseData.token);   // Store the received token in local storage
      window.location.href = 'index.html';   // Login successful, redirect to homepage
      console.log(responseData);
    } else {
      throw new Error('');   // Connection failed, handle error here
    } 
  } catch {
    displayErrorMessage();   // Display an error message if there is an error with the request
    e.target.reset();
  }
});

//----------------------------------------------------------------
//********* Alert a user in case of wrong login data *************
//----------------------------------------------------------------
function displayErrorMessage() {    
  const errorMessage = document.getElementById('error-message');
  errorMessage.textContent = 'Erreur dans l’identifiant ou le mot de passe';
  errorMessage.style.display = 'block';
}