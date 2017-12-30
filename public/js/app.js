const container = document.querySelector('#container-articles');
const container_two = document.querySelector('#container-articles-others');
const searchForm = document.querySelector('#search-form');
const searchBar = searchForm.querySelector('#search-bar');
const searchBtn = document.querySelector('#search-icon');
const searchHide = document.querySelector('#search-hide');
const items = Array.from(document.querySelectorAll('.news-headline'));
const header = document.querySelector('header');
const selectGroup = document.querySelector('#select-group');
const btn = document.querySelector('#select-source');
const ul = document.querySelector('#list-source');
const icon = document.querySelector('#icon');

const apiKey = 'a0b860be65e74eca9e9b7d66d37be7a8';
const everything = `https://newsapi.org/v2/everything?q=bitcoin&apiKey=${apiKey}`;

const defaultSource = 'techcrunch';

const imgSrc = './images/image_unavailable.jpeg';
 
//////////////////// register service worker start ////////////////////
let sourcesArray = ["abc-news", "abc-news-au", "al-jazeera-english", "ars-technica", "associated-press", "australian-financial-review", "axios", "bbc-news", "bbc-sport", "bleacher-report", "bloomberg", "breitbart-news", "business-insider", "business-insider-uk", "buzzfeed", "cbc-news", "cbs-news", "cnbc", "cnn", "crypto-coins-news", "daily-mail", "engadget", "entertainment-weekly", "espn", "espn-cric-info", "financial-post", "financial-times", "football-italia", "fortune", "four-four-two", "fox-news", "fox-sports", "google-news", "google-news-au", "google-news-ca", "google-news-in", "google-news-uk", "hacker-news", "ign", "independent", "mashable", "medical-news-today", "metro", "mirror", "msnbc", "mtv-news", "mtv-news-uk", "national-geographic", "nbc-news", "news24", "new-scientist", "news-com-au", "newsweek", "new-york-magazine", "next-big-future", "nfl-news", "nhl-news", "politico", "polygon", "recode", "reddit-r-all", "reuters", "rte", "talksport", "techcrunch", "techradar", "the-economist", "the-globe-and-mail", "the-guardian-au", "the-guardian-uk", "the-hill", "the-hindu", "the-huffington-post", "the-irish-times", "the-lad-bible", "the-new-york-times", "the-next-web", "the-sport-bible", "the-telegraph", "the-times-of-india", "the-verge", "the-wall-street-journal", "the-washington-post", "time", "usa-today", "vice-news", "wired"];

if("serviceWorker" in navigator){
  try{
    navigator.serviceWorker.register('sw.js');
    //console.log("sw registered");
  }catch(err){
    //console.log("not registered");
  }
}

function rep(str){
  return str.replace(/http/i, "https") && str.replace(/https/i, "https");
}

//////////////////// register service worker end////////////////////
searchHide.addEventListener('click', e => {
  if(icon.classList.contains("fa-search")){
    return false;
  }
  searchForm.style.display = 'none';
  searchBtn.style.display = 'inline-block' ;
  e.stopImmediatePropagation();

});

function manageSearchFormStyle() {
  searchForm.style.display = 'inline-block';
  searchForm.style.position = 'absolute';
  searchForm.style.top = '0';
  searchForm.style.left = '0';
  searchForm.style.width = '100%';
  searchForm.style.backgroundColor = '#f4f4f4';
  searchForm.style.borderBottom = '1px solid #333';
}

searchBtn.addEventListener('click', e => {
  searchBtn.style.display = 'none';
  manageSearchFormStyle();

  searchBar.style.display = 'inline-block';
  searchHide.style.width = 'inline-block';

  searchBar.style.width = '90%';
  searchHide.style.width = '10%';
  icon.classList.remove("fa-search");
  icon.classList.add("fa-chevron-left");
});

function replaceHTTP(str) {
  return str.replace(/http/i/g, "https");
}

window.addEventListener('load', async e => {

  fetchData();
  await fetchSources();

  ul.addEventListener('click', e => {
    fetchData(e.target.dataset.id);
    ul.classList.remove('show');

    if(!ul.classList.contains('show')){
      ul.classList.remove('show');
    } 
});

btn.addEventListener('click', e => {

  if(!ul.classList.contains('show')){
    ul.classList.add('show');
  } else {
    ul.classList.remove('show');
  }

});

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  if(searchForm.value == null || searchBar.value == ""){
    fetchData();
  }
  	container.innerHTML = `
		<div id="loader">
			<i class="fa fa-spinner fa-spin" style="font-size:2em;"></i>
		</div>
	  `;
    fetch(`https://newsapi.org/v2/everything?q=${searchBar.value}&apiKey=${apiKey}`)
      .then(res => res.json())
      .then(data => {
        container.innerHTML = data.articles.map(article => {
          if((article.urlToImage == null) || (!article.urlToImage.includes("https"))) {
            return `
            <div class="news-card">
              <h2 class="news-headline">${article.title}</h2>
              <img class="news-image" src="${imgSrc}" alt="Image not Available">
              <span class="news-source">${article.source.name}</span>
              <button class="news-link" data-title="${article.title}" data-image="${imgSrc}" data-description="${article.description}" data-url="${article.url}">
                Read More
              </button>
            </div>
          `;
          } else {
          return `
          <div class="news-card">
              <h2 class="news-headline">${article.title}</h2>
              <img class="news-image" src="${rep(article.urlToImage)}" alt="Image not Available">
              <span class="news-source">${article.source.name}</span>
              <button class="news-link" data-title="${article.title}" data-image="${rep(article.urlToImage)}" data-description="${article.description}" data-url="${article.url}">
                Read More
              </button>
            </div>
          `;
      }
      }).join('')
  }).catch(err => {
    container.innerHTML = `
    <div id="loader">
      <button id="refresh">No Internet Connection <i class="fa fa-refresh"></i></button>
    </div>
  `;
  })
});


container.addEventListener('click', readMore);
container_two.addEventListener('click', readMore);


function readMore(e) {
  if(e.target.classList.contains('news-link')){
    document.body.style.overflowY = "hidden";
    let title = e.target.dataset.title;
    let image = e.target.dataset.image;;
    let description = e.target.dataset.description;
    let url = e.target.dataset.url;
    openModal(title, image, description, url);
  }else if(e.target.id == "refresh"){
    fetchData(defaultSource);
  }else{
    return false;
  }
}

function openModal(title, image, description, url) {
  modalOverlay = document.querySelector('#modal-overlay');
  title = modalOverlay.querySelector('#modal-title').innerHTML = title;
  img = modalOverlay.querySelector('#modal-image').src = image;
  description = modalOverlay.querySelector('#modal-text').innerHTML = description;
  link = modalOverlay.querySelector('#modal-link').href = url;
  modalOverlay.style.display = "block";
  modalOverlay.style.opacity = "1";

  modalOverlay.addEventListener('click', e => {
    if(e.target.id == "modal-close" ) {
      modalOverlay.style.display = "none";
      document.body.style.overflowY = "scroll";
    } else if(e.target.id == "modal-link"){
      return true;
    } else {
      return false;
    }
  });
}

async function fetchData(source = defaultSource) {
  
	container.innerHTML = `
		<div id="loader">
      <i class="fa fa-spinner fa-spin" style="font-size:2em;"></i>
		</div>
  `;
  
  fetch(`https://newsapi.org/v2/top-headlines?sources=${source}&apiKey=${apiKey}`)
    .then(response => response.json())
    .then(data => {
        container.innerHTML = data.articles.map(article => {
          if((article.urlToImage == null) || (!article.urlToImage.includes("https"))) {
            //console.log(article.urlToImage);
            return `
            <div class="news-card">
              <h2 class="news-headline">${article.title}</h2>
              <img class="news-image" src="${imgSrc}" alt="Image not Available">
              <span class="news-source">${article.source.name}</span>
              <button id="rm"class="news-link" data-title="${article.title}" data-image="${imgSrc}" data-description="${article.description}" data-url="${article.url}">
                Read More
              </button>
            </div>
          `;
          } else {
          return `
          <div class="news-card">
              <h2 class="news-headline">${article.title}</h2>
              <img class="news-image" src="${rep(article.urlToImage)}" alt="Image not Available">
              <span class="news-source">${article.source.name}</span>
              <button class="news-link" data-title="${article.title}" data-image="${rep(article.urlToImage)}" data-description="${article.description}" data-url="${article.url}">
                Read More
              </button>
            </div>
          `;
      }
  }).join('');
}).catch(err => {
  ///////////////////////////////////////////////////////////////////////////////////////////////////console.error('No internet connection available');
  container.innerHTML = `
  <div id="loader">
    <button id="refresh">No Internet Connection <i class="fa fa-refresh"></i></button>
  </div>
`;
})
    
}

async function fetchSources (){
  let tab = "&nbsp;&nbsp;";

  fetch(`https://newsapi.org/v2/sources?apiKey=${apiKey}`)
  .then(response => response.json())
  .then(data =>  {

  ul.innerHTML = `<span>News Sources</span>` + data.sources.filter(source => source.language.includes('en'))
    .map(source => {
      return `
      <li class="list" data-id="${source.id}">
        ${source.name}${tab}(${source.category})
      </li>`;
    }).join('')  
  }).catch(err => {
    container.innerHTML = `
    <div id="loader">
      <button id="refresh">No Internet Connection <i class="fa fa-refresh"></i></button>
    </div>
  `;
  })

}})

window.onscroll = () => {
  let d = document.documentElement;
  let offset = d.scrollTop + window.innerHeight - 100;
  let height = d.offsetHeight;

  if (offset === height) {
    let rand = Math.round(Math.random() * sourcesArray.length);
    let randSource = sourcesArray[rand];

    container_two.innerHTML = `
    <div id="loader-two">
      <i class="fa fa-spinner fa-spin" style="font-size:2em;"></i>
    </div>
  `;
  
  fetch(`https://newsapi.org/v2/top-headlines?sources=${randSource}&apiKey=${apiKey}`)
  .then(response => response.json())
  .then(data => {
      container_two.innerHTML = `<span id="news-related">- In Other News -</span>` 
      + data.articles.map(article => {
        if((article.urlToImage == null) || (!article.urlToImage.includes("https"))) {
          return `
          <div class="news-card">
            <h2 class="news-headline">${article.title}</h2>
            <img class="news-image" src="${imgSrc}" alt="Image not Available">
            <span class="news-source">${article.source.name}</span>
            <button class="news-link" data-title="${article.title}" data-image="${imgSrc}" data-description="${article.description}" data-url="${article.url}">
            Read More
          </button>
          </div>
        `;
        } else  {
        return `
        <div class="news-card">
            <h2 class="news-headline">${article.title}</h2>
            <img class="news-image" src="${rep(article.urlToImage)}" alt="Image not Available">
            <span class="news-source">${article.source.name}</span>
            <button class="news-link" data-title="${article.title}" data-image="${rep(article.urlToImage)}" data-description="${article.description}" data-url="${article.url}">
            Read More
          </button>
          </div>
        `;
        }
      }).join('') + `
      <footer>
      <div class="container">
        <p>
          <i class="fa fa-thumbs-up"></i> to <a href="newsapi.org">Newsapi.org</a> for this awesome REST Api
        </p>
        <p>Send me a message on whatsapp <a href="#">(+234) 8178383363</a></p>
      </div>
    </footer>
      `;
  }).catch(err => {
    container.innerHTML = `
    <div id="loader">
      <button id="refresh">No Internet Connection <i class="fa fa-refresh"></i></button>
    </div>
  `;
  })
    
  }
};

