

import './css/styles.css'; 
import refs from './refs'; // Импорт объекта с ссылками на DOM-элементы
import fetchCountries from './fetchCountries'; // Импорт функции для запроса данных о странах
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix'; 
const DEBOUNCE_DELAY = 300; 

refs.input.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY)); // Вешаем слушатель на событие ввода в поле ввода с использованием 

function onInputSearch(e) {
  e.preventDefault(); // Отменяем действие по умолчанию для события ввода

  const query = e.target.value.trim(); // Получаем введенное значение из поля ввода и удаляем пробелы

  if (!query) {
    resetMarkup(refs.countryList); // Если значение пустое, сбрасываем разметку списка стран и информации о стране
    resetMarkup(refs.countryInfo);

    return;
  }

  fetchCountries(query) // Выполняем запрос данных о странах по введенному значению
    .then(countries => {
      if (countries.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        ); // Если найдено более 10 стран, показываем сообщение
      } else if (countries.length >= 2 && countries.length <= 10) {
        resetMarkup(refs.countryList); // Если найдено от 2 до 10 стран, сбрасываем разметку списка стран и создаем новую разметку
        createMarkupCountryList(countries);
        resetMarkup(refs.countryInfo); // Сбрасываем разметку информации о стране
      } else {
        resetMarkup(refs.countryInfo); // Если найдена только одна страна, сбрасываем разметку информации о стране
        createMarkupCountryInfo(countries); // Создаем новую разметку информации о стране
        resetMarkup(refs.countryList); // Сбрасываем разметку списка стран
        // refs.input.value = ''; // Если необходимо сбросить значение в поле ввода
      }
    })

    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name'); // Если произошла ошибка, показываем сообщение
      resetMarkup(refs.countryList); // Сбрасываем разметку списка стран
      resetMarkup(refs.countryInfo); // Сбрасываем разметку информации о стране

      return;
    });
}

// Функция для создания разметки списка стран
function createMarkupCountryList(countries) {
  const markup = countries
    .map(
      ({ name, flags }) => `<li class="country-list-item">
        <img class="country-list-img" src=${flags.svg} alt="flag" width="50" height="50"/>
        <p class="country-list-text">${name.official}</p>
      </li>`
    )
    .join('');
  return refs.countryList.insertAdjacentHTML('beforeend', markup);
}
// Функция для создания разметки информации о стране
function createMarkupCountryInfo(countries) {
  const markup = countries
    .map(
      ({ flags, name, capital, languages, population }) => 
      `<li class="country">
      <div class="country-name">
        <img src=${flags.svg} alt="flag" width= "100" heigth="100"/>
        <h1>${name.official}</h1>
      </div>
      <ul class="country-info">
        <li class="country-info-item">
          <p class="country-info-header">Capital:</p>
          <span class="country-info-value">${capital}</span>
        </li>
        <li class="country-info-item">
          <p class="country-info-header">Population:</p>
          <span class="country-info-value">${population}</span>
        </li>
        <li class="country-info-item">
          <p class="country-info-header">Languages:</p>
          <span class="country-info-value"
            >${Object.values(languages).join(', ')}</span
          >
        </li>
      </ul>
    </li>`
    )
    .join('');
  return refs.countryInfo.insertAdjacentHTML('beforeend', markup);
}

function resetMarkup(el) {
  el.innerHTML = '';
}