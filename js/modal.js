//----------------------------------------------------------------
//*************************** Modal ******************************
//----------------------------------------------------------------
const modalGallery = document.querySelector('.modalGallery'); //galerie de la modal
const token = localStorage.getItem('token');   // Token stocké dans le localstorage
const modalAddpic = document.getElementById('modalAddpic'); // ouvrir la seconde modal
const chosenImgBlock = document.querySelector('.chosenImgBlock'); // prévisualisation d'une image
const modalSupp = document.querySelector('.modalSupp'); // supprimer toute les images
const modalTitle = document.querySelector('.modalTitle'); // titre de la modal
const addItemForm = document.getElementById('addItemForm'); // formulaire ajout d'image + info du fichier à mettre
const uploadButton = document.getElementById('uploadButton'); // bouton d'envoie d'image
const photoInput = document.getElementById('photoInput'); // ajouter un fichier image
const formPhoto = document.querySelector('.formPhoto'); // formulaire d'ajout d'image
const titleInput = document.getElementById('titleInput'); // titre du nouvel élément
const formData = document.querySelector('.formData'); // formulaire ajout d'image
const modalMessage = document.getElementById('modalMessage'); // message si le formulaire n'est pas correctement rempli

// Quand on clique sur modifier, toggle, ajoute la catégorie "active" (CSS) à la div qui définie la modal pour l'afficher
document.querySelectorAll('.modalTrigger').forEach(trigger => trigger.addEventListener('click', () => {   
  document.querySelector('.modalContainer').classList.toggle('active');
  resetForm()
}));

//----------------------------------------------------------------
//***************** Affichage du tableau "data" dans la galerie de la modal ************
//----------------------------------------------------------------
function dataFetchedModal(data) {   
  modalGallery.innerHTML = '';

  data.forEach((item, index) => { // pour chaqued éléments du tableau, on crée une "carte" dans la galerie
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    const figcaption = document.createElement('figcaption');

    figure.classList.add('figure');
    img.src = item.imageUrl;   // la source de l'image est définit par son url
    figcaption.textContent = 'éditer';


    const iconArrow = document.createElement('i');
    iconArrow.classList.add('fa-solid', 'fa-arrows-up-down-left-right', 'iconArrow');
    iconArrow.setAttribute('aria-hidden', 'true');
    

    
    const iconTrash = document.createElement('i');
    iconTrash.classList.add('fa-solid', 'fa-trash-can', 'iconTrash');
    iconTrash.setAttribute('aria-hidden', 'true');
    iconTrash.addEventListener('click', (e) => {
      e.preventDefault();
      deleteItem(e, item.id); // Appelle la fonction de suppression d'élément quand on clique sur la corbeille
      figure.remove(); // Retire l'élément du DOM
    });

    figure.appendChild(iconArrow);
    figure.appendChild(iconTrash);
    figure.appendChild(img);
    figure.appendChild(figcaption);
    
    modalGallery.appendChild(figure);
  });
}

//----------------------------------------------------------------
//******************** Supprimer un élément de la modal *****************
//----------------------------------------------------------------
async function deleteItem(e, itemId) {
  e.preventDefault();
  try {
    const response = await fetch(`http://localhost:5678/api/works/${itemId}`, {   // Requête DELETE à l'API en se absant sur l'id de l'item sélectionné
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,   // pour supprimer un élément on utilise le token comme droit d'utilisation
      }
    });

    if (response.ok) {
      console.log('Item deleted successfully');
      data = data.filter((item) => item.id !== itemId);   // dans le tableau data, on filtre l'élément qu'on veut supprimer en séléectionnant son id 
      // Mise à jour des galeries de la page d'acceuil et de la modal
      dataFetched(data);
      dataFetchedModal(data);
    } else {
      console.error('Error deleting item:', response.status);
    }
  } catch (error) {
    console.error('Error deleting item:', error);
  }
}

//-----------------------------------------------------------------
//******* Modification de l'apparence de la modal quand on clique sur 'Ajouter Photo' *********
//-----------------------------------------------------------------
modalAddpic.addEventListener('click', () => {
  addItemForm.style.display = 'block';
  modalTitle.textContent = 'Ajout photo';
  modalGallery.classList.add('hidden');
  modalAddpic.style.display = 'none';
  uploadButton.style.display = 'block';
  modalSupp.style.display = 'none';
  chosenImgBlock.style.display = 'none';
});


//--------------------------------------------------------------------
//*** Retour à l'apparence initial de la modal quand on clique sur la flèche gauche ******
//--------------------------------------------------------------------
document.querySelector('.fa-arrow-left').addEventListener('click', () => {
  resetForm();
});

//--------------------------------------------------------------------
//************************* Ajouter un item *****************************
//--------------------------------------------------------------------
uploadButton.addEventListener('click', async (e) => {
  e.preventDefault();   

  // Vérification que tous les éléments du formulaires sont remplis
  if (titleInput.value.trim() === '' || photoInput.files.length === 0 || categorySelect.value === '') {
    modalErrorMessage('Remplissez les champs'); // si le formulaire est vide, on a un message d'erreur via la fonction "modalErrorMessage"
    return; // arrêt de la fonction pour pouvoir envoyer de nouveau le formulaire
  } else {
    modalMessage.style.display = 'none'; //si le formulaire est rempli, pas de message d'erreur

  }

  const formData = new FormData();   // création de l'objet formdata pour collecter les nouvelles données de l'lément qu'on veut ajouter
  formData.append('image', photoInput.files[0]);   // on recupère le fichier qu'on a sélectionné pour notre nouvel élément de galerie
  formData.append('title', titleInput.value);
  formData.append('category', categorySelect.value);

  try {
    const response = await fetch('http://localhost:5678/api/works', {   
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData
    });

    if (response.ok) {
      const newItem = await response.json();
      console.log('Item added successfully');
      data.push(newItem);
      dataFetched(data);
      dataFetchedModal(data);
      resetForm();
    } else {
      console.error('Error adding item:', response.status);
    }
  } catch (error) {
    modalErrorMessage();   // Display an error message if there is an error with the request
  }
});

//------------------------------------------------------------------
//************* affichage de l'image choisie dans le fomulaire ******************
//------------------------------------------------------------------
photoInput.addEventListener('change', () => {
  const file = photoInput.files[0];

  if (file) {   // vérification de si un fichier à été sélectionné
    chosenImgBlock.style.display = 'block';
    const chosenImg = document.createElement('img');
    chosenImg.classList.add('chosenImg');
    chosenImg.src = URL.createObjectURL(file);   // on donne à l'image une url temporaire pour pouvoir lui donner une source
    chosenImgBlock.appendChild(chosenImg);
  } 
});

//-------------------------------------------------------------------
//************************* Réinitialisation du formulaire de la modal ************************
//-------------------------------------------------------------------
function resetForm() {
  addItemForm.reset();
  chosenImgBlock.innerHTML = '';

  modalMessage.style.display = 'none';

  addItemForm.style.display = 'none';
  modalTitle.textContent = 'Galerie photo';
  modalGallery.classList.remove('hidden');
  modalAddpic.style.display = 'block';
  uploadButton.style.display = 'none';
  modalSupp.style.display = 'block';
}

//-------------------------------------------------------------------
//*********** Alerte si le formulaire de la modal n'est pas rempli **********
//-------------------------------------------------------------------
function modalErrorMessage() {    
  modalMessage.classList.add('modalMessage');
  modalMessage.textContent = 'Remplissez les champs';
  modalMessage.style.display = 'block';
}
