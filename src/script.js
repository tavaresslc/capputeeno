
const url = 'http://localhost:3333';

const query = `
  query {
    allProducts {
      id
      name
      price_in_cents
      image_url
      category
      sales
      created_at
      description
    }
  }
`;

const itemsPerPage = 12;
let currentPage = 1; 
let currentCategory = 'all'; 
let currentSortType = 'newest';
let currentSearchText = '';

function fetchAndStoreDataInLocalStorage() {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  };

  fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('API não disponível');
      }
    })
    .then(data => {
      localStorage.setItem('productsData', JSON.stringify(data));

      console.log('Local Storage\nProducts:\n', data);

      renderDataFromLocalStorage(currentCategory, currentSortType, currentSearchText);
    })
    .catch(error => {
      console.error('Erro ao buscar dados da API:', error);
      // Se ocorrer um erro ao buscar da API, buscar dados do arquivo products.json
      fetch('products.json') // Suponha que o arquivo products.json está no mesmo diretório
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Erro ao buscar dados do arquivo products.json');
          }
        })
        .then(data => {
          localStorage.setItem('productsData', JSON.stringify(data));

          console.log('Local Storage\nProducts:\n', data);

          renderDataFromLocalStorage(currentCategory, currentSortType, currentSearchText);
        })
        .catch(error => {
          console.error('Erro ao buscar dados do arquivo products.json:', error);
        });
    });
}

const arrow = document.querySelector(".arrow");

function fadeInBody() {
  document.body.style.opacity = 1;
}

function renderDataFromLocalStorage(category, sortType, searchText) {
  const productsData = JSON.parse(localStorage.getItem('productsData'));
  const productsList = document.querySelector('.products-list');

  if (productsData && productsData.data && productsData.data.allProducts) {
    let products = productsData.data.allProducts;

    if (searchText) {
      products = products.filter(product => product.name.toLowerCase().includes(searchText));
    }

    if (category !== 'all') {
      products = products.filter(product => product.category === category);
    }

    if (sortType === 'newest') {
      products.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortType === 'price-high') {
      products.sort((a, b) => b.price_in_cents - a.price_in_cents);
    } else if (sortType === 'price-low') {
      products.sort((a, b) => a.price_in_cents - b.price_in_cents);
    } else if (sortType === 'best-sellers') {
      products.sort((a, b) => b.sales - a.sales);
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const productsToDisplay = products.slice(startIndex, endIndex);

    if (productsList) {
      productsList.innerHTML = '';

      productsToDisplay.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('card');

        const image = document.createElement('img');
        image.src = product.image_url;

        const text = document.createElement('div');
        text.classList.add('text');

        const title = document.createElement('h3');
        title.textContent = product.name;

        const hr = document.createElement('hr');

        const price = document.createElement('p');
        price.textContent = `R$${(product.price_in_cents / 100).toFixed(2)}`;

        card.appendChild(image);
        text.appendChild(title);
        text.appendChild(hr);
        text.appendChild(price);
        card.appendChild(text);

        productsList.appendChild(card);

        card.addEventListener('click', () => {
          window.location.href = `product/index.html?id=${product.id}`;
        });
      });

    } else {
      console.error('Elemento .products-list não encontrado na página.');
    }
    updatePaginationButtons();
  } else {
    console.error('Nenhum dado disponível no localStorage');
  }
}

function updatePaginationButtons() {
  const productsData = JSON.parse(localStorage.getItem('productsData'));
  const totalPages = Math.ceil(productsData.data.allProducts.length / itemsPerPage);
  const pageNumbersContainer = document.querySelector('.page-numbers')
  const pageNumbersContainer2 = document.querySelector('.page-numbers2');

  // Clear existing page number buttons
  pageNumbersContainer.innerHTML = '';
  pageNumbersContainer2.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('button');
    const pageButton2 = document.createElement('button');
    pageButton.textContent = i;
    pageButton2.textContent = i;
    pageButton.addEventListener('click', () => goToPage(i));
    if (i === currentPage) {
      pageButton.classList.add('selected');
    }
    pageButton2.addEventListener('click', () => goToPage(i));
    if (i === currentPage) {
      pageButton2.classList.add('selected');
    }
    pageNumbersContainer.appendChild(pageButton);
    pageNumbersContainer2.appendChild(pageButton2);
  }
}

function goToPage(page) {
  currentPage = page;
  renderDataFromLocalStorage(currentCategory, currentSortType, currentSearchText);
}

function previousPage() {
  if (currentPage > 1) {
    goToPage(currentPage - 1);
  }
}

function nextPage() {
  const productsData = JSON.parse(localStorage.getItem('productsData'));
  const totalPages = Math.ceil(productsData.data.allProducts.length / itemsPerPage);
  if (currentPage < totalPages) {
    goToPage(currentPage + 1);
  }
}

function searchProducts(searchText) {
  if (window.location.pathname.includes('cart/index.html')|| window.location.pathname.includes('product/index.html')) {
    window.location.href = `../index.html?search=${searchText}`;
  }
  searchText = searchText || '';
  currentSearchText = searchText;
  renderDataFromLocalStorage(currentCategory, currentSortType, currentSearchText);
}

const searchButton = document.querySelector('.input-box button');

if (searchButton) {
  searchButton.addEventListener('click', () => {
    const searchInput = document.querySelector('.input-box input');
    const searchText = searchInput.value.toLowerCase().trim();
    searchProducts(searchText);
    searchInput.value = '';
    searchInput.blur();
  });
}

const searchInput = document.querySelector('.input-box input');
if (searchInput) {
  searchInput.addEventListener('keypress', event => {
    if (event.key === 'Enter') {
      const searchText = searchInput.value.toLowerCase().trim();
      searchProducts(searchText);
      searchInput.value = '';
      searchInput.blur();
    }
  });
}

const filterByTypeItems = document.querySelectorAll('.filter-by-type li');

filterByTypeItems.forEach(item => {
  item.addEventListener('click', () => {
    filterByTypeItems.forEach(categoryItem => categoryItem.classList.remove('selected'));

    item.classList.add('selected');

    currentCategory = item.getAttribute('data-category');

    renderDataFromLocalStorage(currentCategory, currentSortType, currentSearchText);
  });
});

const sortButtons = document.querySelectorAll('.sort-button');

sortButtons.forEach(button => {
  button.addEventListener('click', () => {

    sortButtons.forEach(btn => btn.classList.remove('selected'));

    button.classList.add('selected');

    currentSortType = button.getAttribute('data-sort');

    renderDataFromLocalStorage(currentCategory, currentSortType, currentSearchText);
  });
});

if (!window.location.pathname.includes('cart/index.html') && !window.location.pathname.includes('product/index.html')) {

  const filter = document.querySelector(".filter-header");
  const options = document.querySelector(".filter-options");
  const optionsList = document.querySelectorAll(".filter-options li");
  const filterContainer = document.querySelector(".filter-container");

  options.style.visibility = "hidden";
  filterContainer.style.zIndex = "0";

  filter.addEventListener("click", () => {
    if (options.style.visibility === "visible") {
      options.style.visibility = "hidden";
      filterContainer.style.zIndex = "0";
    } else {
      options.style.visibility = "visible";
      filterContainer.style.zIndex = "999";
    }
  });

  optionsList.forEach((item) => {
    item.addEventListener("click", () => {
      options.style.visibility = "hidden";
      filterContainer.style.zIndex = "0";
    });
  });

  document.addEventListener("click", (e) => {
    if (!options.contains(e.target) && e.target !== filter && !filter.contains(e.target)) {
      options.style.visibility = "hidden";
      filterContainer.style.zIndex = "0";
    }
  });

}

document.addEventListener('DOMContentLoaded', () => {
  renderDataFromLocalStorage(currentCategory, currentSortType, currentSearchText);
});

function initializePagination() {
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get('search');
  
  if (searchParam) {
    const searchInput = document.querySelector('.input-box input');
    searchInput.value = searchParam;
    currentSearchText = searchParam;
    renderDataFromLocalStorage(currentCategory, currentSortType, currentSearchText);
  } else {
    fetchAndStoreDataInLocalStorage();
  }
}

initializePagination();
