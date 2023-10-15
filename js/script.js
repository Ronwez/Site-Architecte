//----------------------------------------------------------------
//**************** récupération des données  ******************
//----------------------------------------------------------------
let data = [];   // tableau contenant les éléments de la galerie
const gallery = document.querySelector('.gallery');
const filters = document.querySelector('.filterButtons');

async function fetchData() {   // on récupère les données du serveur via l'API
  try {
    const response = await fetch('http://localhost:5678/api/works');   // requête pour obtenir les travaux de l'architect
    data = await response.json();   // réception des travaux sous formats json et transcription dans le tableau "data"
    dataFetched(data);   // on lie le tableau des différents travaux à une fonction pour l'afficher dans la galerie de la page d'accueil
    dataFetchedModal(data);   // pareil mais pour la galerie de la modal
  } catch (error) {
    console.error('Error:', error);
  }
}

//----------------------------------------------------------------
//**************** Button 'Tous' ******************
//----------------------------------------------------------------
document.querySelector('.btnAllItems').addEventListener('click', () => {
  dataFetched(data);   // affiche tous les éléments de la galerie 
});

//----------------------------------------------------------------
//******************** Filter buttons *******************
//----------------------------------------------------------------
function filterItemsByCategory(category) {   // filtre les différents travaux par catégorie
  dataFetched(data.filter(item => item.category.name === category));   // demande de filtre en fonciton d'une catégorie spécifique
}

document.getElementById("btnObjets").addEventListener("click", () => {
  filterItemsByCategory("Objets");   // la catégorie spécifique ici, est "objets"
});

document.getElementById("btnAppartements").addEventListener("click", () => {
  filterItemsByCategory("Appartements");
});

document.getElementById("btnHotelsRestaurants").addEventListener("click", () => {
  filterItemsByCategory("Hotels & restaurants");
});

//----------------------------------------------------------------
//**************** Affichage des éléments dans la galerie ******************
//----------------------------------------------------------------
function dataFetched(data) {   // Fonction qui intègre le tableau data à la galerie
  gallery.innerHTML = '';   // suppression de ce qu'on à dans la gallerie
  data.forEach(item => {   // constrcutyion des éléments dans la gallerie pour chaque item/"travaux"
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    const figcaption = document.createElement('figcaption');

    img.src = item.imageUrl;   // on définit la source de l'image par son url
    figcaption.textContent = item.title;   // le texte dans "figcaption" est défini comme le titre de l'item

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
  if (localStorage.getItem('token')) {   // vérification de si on a le token de connexion 
        // Si on a le token, alors on supprime des éléments du html 
    document.getElementById('login').style.display = 'none';
    document.querySelector('.filterButtons').style.display = 'none';
  } else {
      // Si on a pas de token, alors les élémnets qui montrent la connexion, osnt supprimés
    document.querySelector('.headerBar').style.display = 'none';
    document.querySelector('.positionFigcaption').style.display = 'none';
    document.querySelector('.position').style.display = 'none';
    document.getElementById('logout').style.display = 'none';
  }
})();

fetchData();   // Fetch data from the API endpoint
