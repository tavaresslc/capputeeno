
function getProductById(productId) {
  const productsData = JSON.parse(localStorage.getItem('productsData'));
  
  if (productsData && productsData.data && productsData.data.allProducts) {
    const products = productsData.data.allProducts;
    const product = products.find(item => item.id === productId);
  
    if (product) {
      return product;
    }
  }
  
  return null;
}
  
function displayProductDetails() {
    const productSection = document.querySelector('.product');
    const productId = new URLSearchParams(window.location.search).get('id');

    if (productId) {
      const product = getProductById(productId);
  
      if (product) {

        const productImage = document.createElement('img');
        productImage.src = product.image_url;
  
        const productCategory = document.createElement('p');
        productCategory.classList.add('product-category');
        if (product.category === 'mugs') {
            productCategory.textContent = `Caneca`;
        } else if (product.category === 't-shirts') {
            productCategory.textContent = `Camiseta`;
        }
  
        const productName = document.createElement('p');
        productName.classList.add('product-name');
        productName.textContent = product.name;
  
        const productPrice = document.createElement('h2');
        productPrice.textContent = `R$${(product.price_in_cents / 100).toFixed(2)}`;

        const shipping = document.createElement('p');
        shipping.classList.add('shipping');
        shipping.textContent = '*Frete de R$40,00 para todo o Brasil. Grátis para compras acima de R$900,00.';

        const descriptionTitle = document.createElement('p');
        descriptionTitle.classList.add('description-title');
        descriptionTitle.textContent = 'DESCRIÇÃO';

        const productDescription = document.createElement('p');
        productDescription.classList.add('product-description');
        productDescription.textContent = product.description;

        const productText = document.createElement('div');
        productText.classList.add('product-text');

        productText.appendChild(productCategory);
        productText.appendChild(productName);
        productText.appendChild(productPrice);
        productText.appendChild(shipping);
        productText.appendChild(descriptionTitle);
        productText.appendChild(productDescription);

        const addToCartButton = document.createElement('button');
        const addToCartButtonIcon = document.createElement('i');

        const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svgElement.setAttribute("width", "24");
        svgElement.setAttribute("height", "24");
        svgElement.setAttribute("viewBox", "0 0 24 24");
        svgElement.setAttribute("fill", "none");

        svgElement.innerHTML = `
        <path d="M4 7V5C4 4.44772 4.44772 4 5 4H19C19.5523 4 20 4.44772 20 5V7" stroke="#F5F5FA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M20 7H4C3.44772 7 3 7.44772 3 8V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V8C21 7.44772 20.5523 7 20 7Z" stroke="#F5F5FA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M16 11C16 13.2091 14.2091 15 12 15C9.79086 15 8 13.2091 8 11" stroke="#F5F5FA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        `;

        addToCartButtonIcon.appendChild(svgElement);
        const addToCartButtonText = document.createElement('p');
        addToCartButton.classList.add('cart-button');

        addToCartButton.appendChild(addToCartButtonIcon);
        addToCartButtonText.textContent = 'Adicionar ao carrinho';
        addToCartButton.appendChild(addToCartButtonText);
        productText.appendChild(addToCartButton);

        productSection.appendChild(productImage);
        productSection.appendChild(productText);
      } else {
        productSection.textContent = 'Produto não encontrado.';
      }
    } else {
      productSection.textContent = 'ID do produto não especificado.';
    }
}

displayProductDetails();

function addToCartButtonClick() {
  const productId = new URLSearchParams(window.location.search).get('id');
  const product = getProductById(productId);
  if (product) {
    window.location.href = '../cart/index.html';
    addToCart(product);
    alert('Produto adicionado ao carrinho!');
  } else {
    alert('Produto esgotado.');
  }
}

const addToCartButton = document.querySelector('.cart-button');
if (addToCartButton) {
  addToCartButton.addEventListener('click', addToCartButtonClick);
}