//----------------------------------------------------------------
//*************************** Login ******************************
//----------------------------------------------------------------
document.getElementById('loginForm').addEventListener('submit', async (e) => { //"e" désigne l'évènnement
  e.preventDefault();   // évite d'avoir une erreur 
 
  const { email, password } = e.target.elements; 
  const data = { email: email.value, password: password.value }; //data = valeurs inscrites dans email et mot de passe

  try {
    const response = await fetch('http://localhost:5678/api/users/login', {
      method: 'POST',   // on utilise la méthode POST pour communiquer nos valeurs avec l'API
      headers: {   //on définit ce qu'on veut faire avec notre demande API
        'Accept': 'application/json',   //ici, le format de données qu'on veut recevoir
        'Content-Type': 'application/json'   //ici, le format de données que l'on envoi
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
    displayErrorMessage();   // Affichage d'un message d'erreur si on se trompe dans les valeurs
    e.target.reset();  // on réinitialise les valeurs mdp et email quand on soumet le formulaire
  }
});

//----------------------------------------------------------------
//********* Message d'erreur en cas de mauvaise données dans le formulaire *************
//----------------------------------------------------------------
function displayErrorMessage() {    
  const errorMessage = document.getElementById('error-message');
  errorMessage.textContent = 'Erreur dans l’identifiant ou le mot de passe';
  errorMessage.style.display = 'block';
}