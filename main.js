import axios from 'axios';

/* 
axios.get('https://api.artdatabanken.se/data-stewardship-api/v1/api_info', {
    headers: {
        'Cache-Control': 'no-cache',
        'Ocp-Apim-Subscription-Key': '7e63dec8dda34dfeaa17eab001f53d2b'
    }
})
.then(response => {
    console.log(response.status); // Log the status code
    console.log(response.data);   // Log the response data
})
.catch(error => {
    console.error(error); // Handle any errors
});
 */


async function polisenEvents() {
  try {
      const response = await axios.get('https://polisen.se/api/events');
      const data = response.data;

      const eventTypes = ['Alkohollagen', 'Räddningsinsats', 'Trafikbrott', 'Trafikolycka', 'Anträffat gods', 'Fylleri/LOB', 'Ofog barn/ungdom'];

      const filteredData = data.filter(event => 
          eventTypes.includes(event.type) && event.location.name === 'Stockholm'
      );

      const parentDiv = document.querySelector('.brott');

      parentDiv.innerHTML = '';

      filteredData.slice(0, 3).forEach((event, index) => {
          const eventDiv = document.createElement('div');
          eventDiv.classList.add('event-item');
          eventDiv.innerHTML = `<strong>${event.name}</strong> <br> <small>${event.summary}</small>`;
          parentDiv.appendChild(eventDiv);
      });
  } catch (error) {
      console.error('Polisen', error);
  }
}

polisenEvents();



//---------------------------------------------------------------------------------------------------------------------------------------------------------------

//Väder
const weatherKey = "3cd90e7fb04a48ebb79111306241701";

async function getWeather(weatherUrl) {
  try {
    const response = await axios.get(weatherUrl);
    const weatherData = response.data;

    // Vädret just nu
    const currentTemp = weatherData.current.temp_c;
    const currentCondition = weatherData.current.condition.text;
    const currentIconUrl = `https:${weatherData.current.condition.icon}`;

    // Vädret imorgon
    const tomorrowTemp = weatherData.forecast.forecastday[1].day.avgtemp_c;
    const tomorrowCondition = weatherData.forecast.forecastday[1].day.condition.text;
    const tomorrowIconUrl = `https:${weatherData.forecast.forecastday[1].day.condition.icon}`;

    // Vädret in the övermorgon (toovermorrow som man säger i Amerikat)
    const toOverMorrowTemp = weatherData.forecast.forecastday[2].day.avgtemp_c;
    const ToOverMorrowCondition = weatherData.forecast.forecastday[2].day.condition.text;
    const ToOverMorrowIconUrl = `https:${weatherData.forecast.forecastday[2].day.condition.icon}`;

  
    const icon = document.getElementById("icon");
    const icon2 = document.getElementById("icon2");
    const icon3 = document.getElementById("icon3");

    icon.src = currentIconUrl;
    icon2.src = tomorrowIconUrl;
    icon3.src = ToOverMorrowIconUrl;

    let weatherToday = document.querySelector(".weather-today");
    let weatherTomorrow = document.querySelector(".weather-tomorrow");
    let weatherToovermorrow = document.querySelector(".weather-toovermorrow");

    weatherToday.innerHTML = `${icon.outerHTML} <p>${currentTemp}°C <br>${currentCondition} </p>`;
    weatherTomorrow.innerHTML = `${icon2.outerHTML} <p>${tomorrowTemp}°C <br> ${tomorrowCondition} </p>`;
    weatherToovermorrow.innerHTML = `${icon3.outerHTML} <p>${toOverMorrowTemp}°C <br> ${ToOverMorrowCondition} </p>`;

  } catch (error) {
    console.error("Weather did not fetch correctly", error);
  }
}


//Position
async function weatherPosition(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  let weatherUrl = `http://api.weatherapi.com/v1/forecast.json?key=${weatherKey}&q=${latitude},${longitude}&days=3&aqi=no&lang=sv`;

  try {
      await getWeather(weatherUrl);
  } catch (error) {
      console.error("Kan ej hämta väderdata", error);
  }
}

function weatherPositionError(error) {
  console.error("Kan ej hämta plats, default blir stockholm", error);
  let weatherUrl = `http://api.weatherapi.com/v1/forecast.json?key=${weatherKey}&q=Stockholm&days=3&aqi=no&lang=sv`;
  getWeather(weatherUrl).catch(err => console.error("Kan ej hämta väderdata", err));
}

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(weatherPosition, weatherPositionError);
} else {
  console.log("Kan ej hämta plats, default blir stockholm");
  let weatherUrl = `http://api.weatherapi.com/v1/forecast.json?key=${weatherKey}&q=Stockholm&days=3&aqi=no&lang=sv`;
  getWeather(weatherUrl).catch(error => console.error("Kan ej hämta väderdata", error));
  alert("Enabla positionering för bövelen!")
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------------

//Tid och sånt
async function fetchCurrentTimeAndDate() {
  try {
      const response = await axios.get('https://worldtimeapi.org/api/ip');
      const data = response.data;

      const currentTime = new Date(data.utc_datetime);

      const dateOptions = { day: '2-digit', month: 'long', year: 'numeric' };
      const timeOptions = { hour: '2-digit', minute: '2-digit' };

      const formattedDate = currentTime.toLocaleDateString('sv-SE', dateOptions);
      const formattedTime = currentTime.toLocaleTimeString('sv-SE', timeOptions);

      document.getElementById('current-time').innerHTML = `<strong>${formattedTime}</strong> ${formattedDate}`;
    } catch (error) {
      console.error('Error fetching current time and date:', error);
      document.getElementById('current-time').textContent = 'Kunde inte hämta tid & datum';
  }
}

fetchCurrentTimeAndDate();
setInterval(fetchCurrentTimeAndDate, 60000);

//---------------------------------------------------------------------------------------------------------------------------------------------------------------

 //Bakgrundsbild unsplash 

const accessKey = 'ptET6nkIG6r7lkSBO9ZtDDoY1Rp3g5O8CSoz49FvaBk'; 
const interval = 120000;

async function fetchRandomImage() {
  axios.get(`https://api.unsplash.com/photos/random?client_id=${accessKey}&query=dark+nature&orientation=landscape&color=black,dark`)

      .then(response => {
          const imageUrl = response.data.urls.full;
          console.log('Background URL', imageUrl);

          const img = new Image();
          img.src = imageUrl;

          //Väntar på att uppdatera tills bilden är färdigladdad
          img.onload = () => {
              document.body.style.backgroundImage = `url(${imageUrl})`;
          };
      })
      .catch(error => {
          console.error('Error fetching image:', error);
          document.body.style.backgroundImage = 'url("/error-placeholder.webp")';
      });
}

setInterval(fetchRandomImage, interval);
fetchRandomImage();

const backgroundBtn = document.getElementById('background-btn');
backgroundBtn.addEventListener('click', async function(event) {
  backgroundBtn.disabled = true;

 try {
  await fetchRandomImage()

 }
 catch {
  console.error('Kunde inte hämta ny bakgrundsbild från Unsplash', error)
 }
 setTimeout(() => {
  backgroundBtn.disabled = false;
}, 1000);

});


//---------------------------------------------------------------------------------------------------------------------------------------------------------------

//Rubrik

document.addEventListener('DOMContentLoaded', () => {
  const heading = document.getElementById('klickbar-rubrik');
  const defaultText = 'John Doe Dashboard'; 
  const savedTitle = localStorage.getItem('dashboardTitle');
  if (savedTitle) {
      heading.innerText = savedTitle;
  } else {
      heading.innerText = defaultText;
  }
  heading.addEventListener('blur', function() {
    localStorage.setItem('dashboardTitle', this.innerText.trim() || defaultText);
    console.log('Rubriken har ändrats till:', this.innerText);
});

  heading.addEventListener('click', function() {
      this.setAttribute('contenteditable', 'true');
      this.setAttribute('spellcheck', 'false');

      this.focus();
  });

//Blockerar enter så att man inte kan göra flera rader
  heading.addEventListener('keydown', function(event) {  
    if (event.key === 'Enter') {
        event.preventDefault();
    }
});

//Gör så att den går tillbaka till default så att man inte tappar bort diven om man lämnar den tom
  heading.addEventListener('blur', function() { 
      this.setAttribute('contenteditable', 'false');
      
      if (this.innerText.trim() === '') {
          this.innerText = defaultText;
      }
      console.log('Rubriken har ändrats till:', this.innerText);
  });
});


//---------------------------------------------------------------------------------------------------------------------------------------------------------------

//lägga till och ta bort länkar 


const addLinkBtn = document.getElementById('addLinkBtn');
const linkList = document.querySelector('.link-list');
const linkPopup = document.getElementById('linkPopup');
const closePopup = document.getElementById('closePopup');
const overlay =     document.getElementById('overlay')


//Sparar i localstorage
function updateLocalStorageLinks() {
  const links = [];
  document.querySelectorAll('.link a').forEach(anchorTag => {
      if (!anchorTag.closest('.link').hasAttribute('data-default-link')) {
          links.push({ url: anchorTag.href, title: anchorTag.textContent });
      }
  });
  localStorage.setItem('dashboardLinks', JSON.stringify(links));
}

//Tar bort vald div och sparar i localstorage
linkList.addEventListener('click', function(event) {
  if (event.target.closest('.removeBtn')) {
    event.target.closest('.link').remove();
    updateLocalStorageLinks();
  }
});

//Hämta favicon
function fetchFavicon(url) {
  if (url.startsWith("http://")) {
    url = url.slice(7);
  } else if (url.startsWith("https://")) {
    url = url.slice(8);
  }
  return `https://www.google.com/s2/favicons?domain=${url}`;

} 

//lägger till en Link-div när man trycker lägg till länk

function addLink(url, title) {
  // Fixar URL så att http://www. kommer med om man inte skrivit in det
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `http://www.${url}`;
  }
  const faviconUrl = fetchFavicon(url);

  const linkDiv = document.createElement("div");
  linkDiv.classList.add("link");
//URL och Titel
  const anchorTag = document.createElement("a");
  anchorTag.href = url;
  anchorTag.target = "_blank";
  anchorTag.style.textDecoration = "none";
  anchorTag.innerHTML = `
    <img class="favicon" src="${faviconUrl}" alt="Favicon">
    <span class="link-title">${title}</span>
  `;

  //Ta bort-knapp
  const removeBtn = document.createElement("button");
  removeBtn.classList.add("removeBtn");
  removeBtn.innerHTML = `
    <svg fill="#000000" width="12px" height="12px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0c8.844 0 16 7.156 16 16s-7.156 16-16 16-16-7.156-16-16 7.156-16 16-16zM16 30.031c7.719 0 14-6.313 14-14.031s-6.281-14-14-14-14 6.281-14 14 6.281 14.031 14 14.031zM14.906 17h-5.906c-0.563 0-1-0.438-1-1s0.438-1 1-1h14c0.563 0 1 0.438 1 1s-0.438 1-1 1h-8.094z"></path>
    </svg>
  `;



  linkDiv.appendChild(anchorTag);
  linkDiv.appendChild(removeBtn);
  linkList.appendChild(linkDiv);
  updateLocalStorageLinks();

}
//Tar in sparade Link-divvar från localstorage
document.addEventListener('DOMContentLoaded', () => {
  const savedLinks = JSON.parse(localStorage.getItem('dashboardLinks') || '[]');
  savedLinks.forEach(link => addLink(link.url, link.title));
});

const submitLink = document.getElementById('submitLink');


//Knappen för att lägga till länk
addLinkBtn.addEventListener('click', () => {
  const numberOfLinks = document.querySelectorAll('.link-list .link').length;
  overlay.style.pointerEvents = 'auto'
  
  //Begränsar antal links till 5
  if (numberOfLinks < 5) {
    overlay.style.pointerEvents = 'auto';
    linkPopup.classList.add('visible');
    overlay.classList.add('visible');
    linkPopup.style.opacity = '1';
    overlay.style.opacity = '1';

  } else {
    addLinkBtn.disabled = true;
    const alertPopup = document.getElementById('alertPopup');
    alertPopup.style.display = 'block';
    alertPopup.style.opacity = '1';

    setTimeout(() => {
      alertPopup.style.opacity = '0';
    }, 1000);

    setTimeout(() => {
      addLinkBtn.disabled = false;
    }, 1200);
  }
});

//Stänger Lägg till-popupen
const closePopupFunction = () => {
  overlay.style.pointerEvents = 'none';
  linkPopup.style.opacity = '0';
  overlay.style.opacity = '0';
  setTimeout(() => {
      linkPopup.classList.remove('visible');
      overlay.classList.remove('visible');
  }, 500);
};

closePopup.addEventListener('click', closePopupFunction);

//Submittar URL och titel som användaren skrivit in och stänger popupen
submitLink.addEventListener('click', (e) => {
  e.preventDefault();
  const url = document.getElementById('popupUrlInput').value;
  const title = document.getElementById('popupTitleInput').value;
  if (url && title) {
    addLink(url, title);
    document.getElementById('popupUrlInput').value = ''; // Reset URL input
    document.getElementById('popupTitleInput').value = ''; // Reset title input
    closePopupFunction();

  } else {
    alert("Skriv in både adress och titel");
  }

  
});

//----------------------------------------------

//Notes

//Laddar notes från localstorage
document.addEventListener('DOMContentLoaded', () => {
  const savedNotes = localStorage.getItem('savedNotes');
  if (savedNotes) {
      document.getElementById('notes').value = savedNotes;
  }

});

//Sparar notes i localstorage
function saveNotes() {
  const notes = document.getElementById('notes').value;
  localStorage.setItem('savedNotes', notes);
}

document.getElementById('notes').addEventListener('input', saveNotes);

