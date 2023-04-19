import './css/styles.css';
import Notiflix from 'notiflix';
var debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;


// Инициализация библиотеки
Notiflix.Notify.init();

// Функция для выполнения поиска страны
const searchCountry = (searchQuery) => {
  // Очищаем результаты поиска перед новым запросом
  const countryList = document.querySelector('.country-list');
  countryList.innerHTML = '';

  // Выполняем запрос с использованием fetch и возвращаем промис
  return new Promise((resolve, reject) => {
    fetch(`https://restcountries.com/v3.1/name/${searchQuery}`)
      .then(response => {
        // Проверяем статус ответа
        if (response.status === 404) {
          // Если страна не найдена, выводим уведомление и вызываем reject
          Notiflix.Notify.failure('Oops, there is no country with that name');
          reject('Country not found');
        }
        return response.json();
      })
      .then(countries => {
        // Если найдено 10 или меньше стран, обрабатываем полученные данные
        if (countries.length <= 10) {
          countries.forEach(country => {
            const { name, capital, population, flags, languages } = country;

            // Преобразуем объект языков в строку вида "ключ: значение"
            const languageStr = Object.entries(languages).map(([key, value]) => `${value}`).join(', ');

            // Создаем элементы списка с данными о стране
            const countryItem = document.createElement('li');
            countryItem.innerHTML = `
              <div>
                <img src="${flags.svg}" alt="${name.common}" />
              </div>
              <div>
                <h2>${name.official}</h2>
                <p>Capital: ${capital}</p>
                <p>Population: ${population}</p>
                <p>Languages: ${languageStr}</p>
              </div>
            `;

            // Добавляем элемент списка в список стран
            countryList.appendChild(countryItem);
          });
          // Вызываем resolve с результатами поиска
          resolve(countries);
        } else {
          // Если найдено более 10 стран, выводим уведомление и вызываем reject
          Notiflix.Notify.warning('Too many matches found. Please enter a more specific name.');
          reject('Too many matches found');
        }
      })
      .catch(error => {
        console.error(error);
        // Вызываем reject с ошибкой
        reject(error);
      });
  });
};

const handleSearchInput = debounce((event) => {
  const searchQuery = event.target.value;
  searchCountry(searchQuery)
    .catch(error => {
      // Обрабатываем ошибку, если нужно
    });
}, DEBOUNCE_DELAY);

const searchBox = document.getElementById('search-box');
searchBox.addEventListener('input', handleSearchInput);