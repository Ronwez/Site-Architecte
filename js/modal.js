//----------------------------------------------------------------
//*************************** Modal ******************************
//----------------------------------------------------------------
const modalGallery = document.querySelector('.modalGallery');
const token = localStorage.getItem('token');   // Retrieve the token from localStorage
const modalBtn = document.getElementById('modalBtn');
const chosenImgBlock = document.querySelector('.chosenImgBlock');
const modalSupp = document.querySelector('.modalSupp');
const modalTitle = document.querySelector('.modalTitle');
const addItemForm = document.getElementById('addItemForm');
const uploadButton = document.getElementById('uploadButton');
const photoInput = document.getElementById('photoInput');
const formPhoto = document.querySelector('.formPhoto');
const titleInput = document.getElementById('titleInput');
const formData = document.querySelector('.formData');
const modalMessage = document.getElementById('modalMessage');

// Toggle the visibility of the modal when one of the element of modalTriggers is clicked
document.querySelectorAll('.modalTrigger').forEach(trigger => trigger.addEventListener('click', () => {   
  document.querySelector('.modalContainer').classList.toggle('active');
  resetForm()
}));

//----------------------------------------------------------------
//***************** Display data in the modal gallery ************
//----------------------------------------------------------------
function dataFetchedModal(data) {   
  modalGallery.innerHTML = '';

  data.forEach((item, index) => {
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    const figcaption = document.createElement('figcaption');

    figure.classList.add('figure');
    img.src = item.imageUrl;   // Set the image source to the item's imageUrl
    figcaption.textContent = 'éditer';

    if (index === 0) {
      const iconArrow = document.createElement('i');
      iconArrow.classList.add('fa-solid', 'fa-arrows-up-down-left-right', 'iconArrow');
      iconArrow.setAttribute('aria-hidden', 'true');
      figure.appendChild(iconArrow);
    }
    
    const iconTrash = document.createElement('i');
    iconTrash.classList.add('fa-solid', 'fa-trash-can', 'iconTrash');
    iconTrash.setAttribute('aria-hidden', 'true');
    iconTrash.addEventListener('click', (e) => {
      e.preventDefault();
      deleteItem(e, item.id); // Call the deleteItem function passing the item ID
      figure.remove(); // Remove the figure element from the DOM
    });

    figure.appendChild(iconTrash);
    figure.appendChild(img);
    figure.appendChild(figcaption);

    modalGallery.appendChild(figure);
  });
}

//----------------------------------------------------------------
//******************** Delete items in the modal *****************
//----------------------------------------------------------------
async function deleteItem(e, itemId) {
  e.preventDefault();
  try {
    const response = await fetch(`http://localhost:5678/api/works/${itemId}`, {   // Make a DELETE request to the Swagger API to delete the item
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,   // Include the token in the Authorization header
      }
    });

    if (response.ok) {
      console.log('Item deleted successfully');
      data = data.filter((item) => item.id !== itemId);   // Remove the deleted item from the data array
      // Update the gallery and modalGallery with the updated data
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
//******* Modify modal appearance, when click on modalBtn *********
//-----------------------------------------------------------------
modalBtn.addEventListener('click', () => {
  addItemForm.style.display = 'block';
  modalTitle.textContent = 'Ajout photo';
  modalGallery.classList.add('hidden');
  modalBtn.style.display = 'none';
  uploadButton.style.display = 'block';
  modalSupp.style.display = 'none';
  chosenImgBlock.style.display = 'none';
});


//--------------------------------------------------------------------
//*** Modify appearance of modal, when click on arrow back icon ******
//--------------------------------------------------------------------
document.querySelector('.fa-arrow-left').addEventListener('click', () => {
  resetForm();
});

//--------------------------------------------------------------------
//************************* Add new item *****************************
//--------------------------------------------------------------------
uploadButton.addEventListener('click', async (e) => {
  e.preventDefault();   // Prevent the default form submission

  // Check if the required form fields are filled
  if (titleInput.value.trim() === '' || photoInput.files.length === 0 || categorySelect.value === '') {
    modalErrorMessage('Remplissez les champs'); // Display error message
    return; // Exit the function to prevent form submission
  } else {
    modalMessage.style.display = 'none';
  }

  const formData = new FormData();   // Create a FormData object to store the form data
  formData.append('image', photoInput.files[0]);   // Get the selected file from the file input
  formData.append('title', titleInput.value);
  formData.append('category', categorySelect.value);

  try {
    const response = await fetch('http://localhost:5678/api/works', {   // Make a POST request
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
//************* display chosen image in formPhoto ******************
//------------------------------------------------------------------
photoInput.addEventListener('change', () => {
  const file = photoInput.files[0];

  if (file) {   // Check if a file is selected
    chosenImgBlock.style.display = 'block';
    const chosenImg = document.createElement('img');
    chosenImg.classList.add('chosenImg');
    chosenImg.src = URL.createObjectURL(file);   // Set the source of the image to a temporary URL for the selected file
    chosenImgBlock.appendChild(chosenImg);
  } 
});

//-------------------------------------------------------------------
//************************* Reset modal form ************************
//-------------------------------------------------------------------
function resetForm() {
  addItemForm.reset();
  chosenImgBlock.innerHTML = '';

  modalMessage.style.display = 'none';

  addItemForm.style.display = 'none';
  modalTitle.textContent = 'Galerie photo';
  modalGallery.classList.remove('hidden');
  modalBtn.style.display = 'block';
  uploadButton.style.display = 'none';
  modalSupp.style.display = 'block';
}

//-------------------------------------------------------------------
//*********** Alert a user if the modal form is not filled **********
//-------------------------------------------------------------------
function modalErrorMessage() {    
  modalMessage.classList.add('modalMessage');
  modalMessage.textContent = 'Remplissez les champs';
  modalMessage.style.display = 'block';
}
