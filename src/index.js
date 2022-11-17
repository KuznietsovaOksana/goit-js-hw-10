import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

import countryCard from './templates/country-card.hbs';
import countryList from './templates/country-list.hbs';

import { fetchCountries } from './fetchCountries.js';

const debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange(event) {
  const { target } = event;
  const query = target.value.trim();

  if (!query) {
    countryListEl.innerHTML = '';
    countryInfoEl.innerHTML = '';
    return;
  }

  fetchCountries(query).then(renderCountryCard).catch(onFetchError);
}

function renderCountryCard(countries) {
  if (countries.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.',
      {
        clickToClose: true,
        timeout: 2000,
      }
    );
  }

  if (countries.length >= 2 && countries.length < 10) {
    const markup = countries
      .map(country => {
        return countryList(country);
      })
      .join('');
    countryListEl.innerHTML = markup;
    countryInfoEl.innerHTML = '';
  }

  if (countries.length === 1) {
    const markup = countries
      .map(country => {
        return countryCard(country);
      })
      .join('');
    countryInfoEl.innerHTML = markup;
    countryListEl.innerHTML = '';
  }
}

function onFetchError(error) {
  if (error.message === '404') {
    Notiflix.Notify.failure('Oops, there is no country with that name', {
      clickToClose: true,
      timeout: 2000,
    });
    console.dir(error);
    countryInfoEl.innerHTML = '';
    countryListEl.innerHTML = '';
  }
}
