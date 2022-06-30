const gallery = document.querySelector('.gallery');
const form = document.querySelector('.search-form');
const userChoise = document.querySelector('input');
const moreButton = document.querySelector('.load-more');
const submitButton = document.querySelector('button[type=submit]');
import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
let userString = '';
let pageNumber = 1;
moreButton.style.opacity = '0';
var lightbox = new SimpleLightbox('.gallery a');
//
function fetching(value) {
  return axios
    .get(
      `https://pixabay.com/api/?key=28343254-7f5bc0b854f6ee91fb4d58501&q=${value}&image_type=photo&page=${pageNumber}&per_page=40&orientation=horizontal&safesearch=true`
    )
    .then(response => {
      return response.data;
    });
}
function addingPics(object) {
  for (const image of object) {
    const newImage = `
              <div class="photo-card">
              <a href='${image.largeImageURL}'>
    <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy"/>
    </a>
    <div class="info">
      <p class="info-item">
        <b>Likes <br>${image.likes}</b>
      </p>
      <p class="info-item">
        <b>Views <br>${image.views}</b>
      </p>
      <p class="info-item">
        <b>Comments <br>${image.comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads <br>${image.downloads}</b>
      </p>
    </div>
  </div>
              `;
    gallery.insertAdjacentHTML('beforeend', newImage);
  }
}
async function search(event) {
  event.preventDefault();
  submitButton.disabled = true;
  userString = userChoise.value;
  gallery.innerHTML = '';
  pageNumber = 1;
  moreButton.style.opacity = '0';
  const response = await fetching(userString);
  if (response.totalHits != 0) {
    await addingPics(response.hits);
    lightbox.refresh();
    Notiflix.Notify.success(`Hooray! We found ${response.totalHits} images.`);
    moreButton.style.opacity = '1';
  } else {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    moreButton.style.opacity = '0';
  }
  submitButton.disabled = false;
}
async function moreImages(event) {
  event.preventDefault();
  pageNumber++;
  console.log("somt")
  // moreButton.disabled = true;
  try {
    const response = await fetching(userString);
    console.log();
    addingPics(response.hits);
    lightbox.refresh();
  } catch (error) {
    moreButton.style.opacity = '0';
    Notiflix.Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
    console.log("somt")
  }
  // moreButton.disabled = false;
}
form.addEventListener('submit', search);
moreButton.addEventListener('click', moreImages);
