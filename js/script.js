//----------------------------------------------------------------
//**************** Fetch data from Swagger ******************
//----------------------------------------------------------------
let data = [];   // Array to store the fetched data
const gallery = document.querySelector('.gallery');
const filters = document.querySelector('.filterButtons');

async function fetchData() {   // fetch data asynchronously from the Swagger API endpoint
  try {
    const response = await fetch('http://localhost:5678/api/works');   // Make a GET request to the Swagger API endpoint
    data = await response.json();   // Convert the response to JSON & store in the array
    dataFetched(data);   // Display the gallery with all elements
    dataFetchedModal(data);   // Display the modal with all elements
  } catch (error) {
    console.error('Error:', error);
  }
}

//----------------------------------------------------------------
//**************** Button 'Tous' ******************
//----------------------------------------------------------------
document.querySelector('.btnAllItems').addEventListener('click', () => {
  dataFetched(data);   // Display all items in the gallery
});

//----------------------------------------------------------------
//******************** Filter buttons *******************
//----------------------------------------------------------------
function filterItemsByCategory(category) {   // Filter items by category
  dataFetched(data.filter(item => item.category.name === category));   // Filter items based on the specified category
}

document.getElementById("btnObjets").addEventListener("click", () => {
  filterItemsByCategory("Objets");   // Filter items by "Objets" category
});

document.getElementById("btnAppartements").addEventListener("click", () => {
  filterItemsByCategory("Appartements");
});

document.getElementById("btnHotelsRestaurants").addEventListener("click", () => {
  filterItemsByCategory("Hotels & restaurants");
});

//----------------------------------------------------------------
//**************** Display all items in gallery ******************
//----------------------------------------------------------------
function dataFetched(data) {   // Function to display the fetched data in the gallery
  gallery.innerHTML = '';   // Clear the gallery
  data.forEach(item => {   // Iterate over each item in the data array
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    const figcaption = document.createElement('figcaption');

    img.src = item.imageUrl;   // Set the image source to the item's imageUrl
    figcaption.textContent = item.title;   // Set the figcaption text to the item's title

    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}

//----------------------------------------------------------------
//******** Login / Logout *******
//----------------------------------------------------------------
document.getElementById('logout').addEventListener('click', () => {
  localStorage.removeItem('token');
});

(async () => {   
  if (localStorage.getItem('token')) {   // Check if a token is stored in the local storage
        // If a token exists, hide the login and filterButtons elements
    document.getElementById('login').style.display = 'none';
    document.querySelector('.filterButtons').style.display = 'none';
  } else {
      // If no token exists, hide other elements
    document.querySelector('.headerBar').style.display = 'none';
    document.querySelector('.positionFigcaption').style.display = 'none';
    document.querySelector('.position').style.display = 'none';
    document.getElementById('logout').style.display = 'none';
  }
})();

fetchData();   // Fetch data from the API endpoint
