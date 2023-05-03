import AOS from 'aos';
import 'aos/dist/aos.css';
AOS.init();


const Home = (argument = '') => {
  const cleanedArgument = argument.trim().replace(/\s+/g, '-');
  let page = 1;
  let displayedResults = 0;


  
  const handleSearchByTitle = () => {
    const searchForm = document.getElementById("search-by-title-form");
  
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const titleInput = document.getElementById("t");
      const title = titleInput.value.trim();
  
      if (title) {
        // Naviguer vers la page "pagelist" avec le titre recherché en tant que paramètre
        window.location.hash = `#pagelist/${title}`;
      }
    });
  };
  


  const displayResults = (articles) => {
    const limitedArticles = articles.slice(0, 9);
    const resultsContent = limitedArticles.map((article) => (
      `<div class="col-md-4">
        <a href="#pagedetail/${article.id}" class="card-link">
          <article class="cardGame" data-aos="fade-up">
            <div class="card-inner">
              <div class="card-front">
                <img src="${article.background_image}" alt="image">
              </div>
              <div class="card-back">
                <h4>${article.released}</h4>
                <h4>${article.rating} (${article.ratings_count} votes)</h4>
              </div>
            </div>
            <div class="card-header">
              <h3>${article.name}</h3>
            </div>
          </article>
        </a>
      </div>`
    ));
    const resultsContainer = document.querySelector('#results-row');
    resultsContainer.innerHTML += resultsContent.join("\n");
    displayedResults += limitedArticles.length;
    if (displayedResults >= 27) {
      const showMoreBtn = document.getElementById("show-more-btn");
      showMoreBtn.style.display = "none";
    }
  };
  
  
  

  const fetchList = (url, argument) => {
    const finalURL = argument ? `${url}&search=${argument}` : url;
    fetch(finalURL)
      .then((response) => response.json())
      .then((responseData) => {
        const filteredResults = responseData.results.filter((result) => result.rating !== null || result.rating !== 0);
        displayResults(filteredResults);
        console.log(filteredResults);
      });
  };

  const loadMoreGames = () => {
    fetchList(`https://api.rawg.io/api/games?key=${process.env.API_KEY}&dates=2023-05-01,2024-05-01&ordering=-metacritic&page=${page}`, cleanedArgument);
    page++;
    if (page > 3) {
      const showMoreBtn = document.getElementById("show-more-btn");
      showMoreBtn.style.display = "none";
    }
  };

  const render = () => {
    const pageContent = document.getElementById("card-container");
  
    pageContent.innerHTML = `
      <div class="row" id="results-row"></div><br><br>
      <button class="btn btn-primary" id="show-more-btn">Show More</button>
    `;
  
    const showMoreBtn = document.getElementById("show-more-btn");
    showMoreBtn.addEventListener("click", loadMoreGames);
  
    handleSearchByTitle(); // Ajoutez cet appel de fonction ici
    loadMoreGames();
  };


  render();


};

export { Home };
