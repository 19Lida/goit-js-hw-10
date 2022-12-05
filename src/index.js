import './css/styles.css';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/api-service';
var debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;
const refs = {
  inputEl: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};
refs.inputEl.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));
function onSearch(event) {
  event.preventDefault();

  // const nameCountry = refs.inputEl.value.trim();
  // fetchCountries(nameCountry)
  //   .then(response => {
  //     return response;
  //   })
  //   .then(countries => {
  //     console.log(countries);
  //   })
  //   .catch(error => {
  //     console.log(error);
  //   });
  const nameCountry = refs.inputEl.value.trim();
  if (!nameCountry) {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
    return;
  }
  console.log(nameCountry);
  fetchCountries(nameCountry).then(onCountry).catch(onError);
}

function onCountry(countries) {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
  if (countries.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  }
  if (countries.length > 2 && countries.length < 10) {
    const list = countries
      .map(({ flags, name }) => {
        return `<li class="country-list__item"><img src="${flags.svg}" alt="" width="50" height="50"><h2 class="country-list__title">${name.official}</h2></li>`;
      })
      .join('');
    refs.countryList.innerHTML = list;
  }
  if (countries.length === 1) {
    console.log(countries);
    const markup = countries
      .map(({ flags, name, capital, population, languages }) => {
        let lang = '';
        for (let key in languages) {
          lang = languages[key];
        }
        return `<div> <img src="${flags.svg}" alt="${
          name.official
        }" width="70" height="50">
  
  <p>Capital: ${capital}</p>
  <p>Population: ${population}</p>
  <p>Language: ${Object.values(languages).map(lang => lang)}</p>

  </div>`;
      })
      .join('');
    refs.countryInfo.innerHTML = markup;
  }
}
function onError() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}
