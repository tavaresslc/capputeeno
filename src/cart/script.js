
function getCartItems() {
    const cartItems = localStorage.getItem('cartItems');
    return cartItems ? JSON.parse(cartItems) : [];
}
  
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    const cartCountElement2 = document.getElementById('cart-count2');
    const cartItems = getCartItems();

    let totalCount = 0;
    
    for (const item of cartItems) {
        totalCount += item.quantity;
    }

    cartCountElement.textContent = cartItems.length.toString();
    cartCountElement2.textContent = totalCount.toString();
}

function calculateTotalPrice() {
    const cartItems = getCartItems();
    let totalPrice = 0;

    for (const item of cartItems) {
        totalPrice += item.price_in_cents * item.quantity;
    }

    return totalPrice;
}


function updateTotalPrice() {
    const totalPriceElement = document.getElementById('total-price');
    const totalPriceElement2 = document.getElementById('total-price2');

    if (totalPriceElement || totalPriceElement2) {
        const totalPrice = calculateTotalPrice();
        totalPriceElement.textContent = `R$${(totalPrice / 100).toFixed(2)}`;
        totalPriceElement2.textContent = `R$${(totalPrice / 100).toFixed(2)}`;
    }
}

function calculateDelivery() {
    const delivery = document.getElementById('delivery');

    if (delivery) {
        const totalPrice = calculateTotalPrice();
        if ((totalPrice / 100).toFixed(2) <= 900) {
            delivery.textContent = 'R$40.00';
        } else {
            delivery.textContent = 'Grátis';
        }
    }
}

function calculateTotal() {
    const total = document.getElementById('total');

    if (total) {
        const totalPrice = calculateTotalPrice();
        if ((totalPrice / 100).toFixed(2) <= 900) {
            total.textContent = `R$${((totalPrice / 100) + 40).toFixed(2) }`;
        } else {
            total.textContent = `R$${(totalPrice / 100).toFixed(2)}`
        }
    }
}
  
// Função para adicionar um item ao carrinho
function addToCart(product) {
    const cartItems = getCartItems();
    const existingItem = cartItems.find(item => item.id === product.id);

    if (existingItem) {
        // Se o item já existe no carrinho, atualize a quantidade
        const quantityInput = document.querySelector(`[data-item-id="${product.id}"] .item-quantity input`);
        if (quantityInput) {
            existingItem.quantity = parseInt(quantityInput.value);
        }
    } else {
        // Se o item não existe no carrinho, adicione-o com a quantidade inserida
        const quantityInput = document.querySelector(`[data-item-id="${product.id}"] .item-quantity input`);
        if (quantityInput) {
            product.quantity = parseInt(quantityInput.value);
        } else {
            product.quantity = 1;
        }
        cartItems.push(product);
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartCount();
    updateTotalPrice();
    calculateDelivery();
    calculateTotal();
}

// Função para remover um item do carrinho
function removeFromCart(productId) {
    const cartItems = getCartItems();
    const updatedCart = cartItems.filter(item => item.id !== productId);
    
    const cartContainer = document.querySelector('.cart-list');
    const cartItemToRemove = cartContainer.querySelector(`[data-item-id="${productId}"]`);

    if (cartItemToRemove) {
        setTimeout(() => {
            cartContainer.removeChild(cartItemToRemove);
            if (cartItems.length === 1  ) {
                cartContainer.innerHTML = '<b>Carrinho vazio</b>';
            }
        }, 200);
    }

    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    updateCartCount();
    updateTotalPrice();
    calculateDelivery();
    calculateTotal();
}

function updateCartItemQuantity(productId, newQuantity) {
    const cartItems = getCartItems();
    const updatedCart = cartItems.map(item => {
        if (item.id === productId) {
            item.quantity = newQuantity;
        }
        return item;
    });

    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
}

function displayCartItems() {
    const cartContainer = document.querySelector('.cart-list');
    const cartItems = getCartItems();

    if (cartItems.length === 0) {
        cartContainer.innerHTML = '<b>Carrinho vazio</b>';
    } else {
        cartContainer.innerHTML = '';

        cartItems.forEach(item => {
            const cartItemElement = document.createElement('li');
            cartItemElement.classList.add('cart-item');
            cartItemElement.setAttribute('data-item-id', item.id);

            const itemImageElement = document.createElement('img');
            itemImageElement.src = item.image_url;

            const itemNameElement = document.createElement('p');
            itemNameElement.textContent = item.name;
            itemNameElement.classList.add('item-name');

            const itemDescriptionElement = document.createElement('p');
            itemDescriptionElement.textContent = item.description;
            itemDescriptionElement.classList.add('item-desc');

            const itemPriceElement = document.createElement('p');
            itemPriceElement.textContent = `R$${(item.price_in_cents / 100).toFixed(2)}`;
            itemPriceElement.classList.add('item-price');

            const quantityElement = document.createElement('div'); 
            quantityElement.classList.add('item-quantity');

            const quantityInput = document.createElement('input'); 
            quantityInput.type = 'number';
            quantityInput.min = 1;
            quantityInput.value = item.quantity;

            quantityInput.addEventListener('input', () => {
                const maxDigits = 2;
                if (quantityInput.value.length > maxDigits) {
                    quantityInput.value = quantityInput.value.slice(0, maxDigits);
                }
            });

            const expandIcon = document.createElement('i');
            expandIcon.classList.add('fas', 'fa-chevron-down');

            quantityElement.appendChild(quantityInput);
            quantityElement.appendChild(expandIcon);

            const quantityOptions = document.createElement('div');
            quantityOptions.classList.add('quantity-options');

            const hr = document.createElement('hr');
            quantityOptions.appendChild(hr);

            const quantityList = document.createElement('ul');
            for (let i = 1; i <= 5; i++) {
                const li = document.createElement("li");
                li.textContent = i;
                quantityList.appendChild(li);
            }

            quantityOptions.appendChild(quantityList);

            quantityElement.appendChild(expandIcon);

            const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svgElement.setAttribute("width", "24");
            svgElement.setAttribute("height", "24");
            svgElement.setAttribute("viewBox", "0 0 24 24");
            svgElement.setAttribute("fill", "none");

            const paths = [
            { d: "M16.1378 21H7.85782C6.81082 21 5.94082 20.192 5.86282 19.147L4.96582 7H18.9998L18.1328 19.142C18.0578 20.189 17.1868 21 16.1378 21V21Z", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", stroke: "#DE3838" },
            { d: "M12 11V17", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", stroke: "#DE3838" },
            { d: "M4 7H20", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", stroke: "#DE3838" },
            { d: "M17 7L15.987 4.298C15.694 3.517 14.948 3 14.114 3H9.886C9.052 3 8.306 3.517 8.013 4.298L7 7", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", stroke: "#DE3838" },
            { d: "M15.4298 11L14.9998 17", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", stroke: "#DE3838" },
            { d: "M8.57016 11L9.00016 17", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", stroke: "#DE3838" }
            ];

            for (const pathData of paths) {
            const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
            pathElement.setAttribute("d", pathData.d);
            pathElement.setAttribute("stroke", pathData.stroke);
            pathElement.setAttribute("stroke-width", pathData.strokeWidth);
            pathElement.setAttribute("stroke-linecap", pathData.strokeLinecap);
            pathElement.setAttribute("stroke-linejoin", pathData.strokeLinejoin);
            svgElement.appendChild(pathElement);
            }

            const removeButton = document.createElement('button');
            removeButton.classList.add('item-trash');
            removeButton.addEventListener('click', () => removeFromCart(item.id));

            removeButton.appendChild(svgElement)

            const contentElement = document.createElement('div');
            contentElement.classList.add('content');

            const contentHeaderElement = document.createElement('div');
            contentHeaderElement.classList.add('header-content');

            const contentFooterElement = document.createElement('div');
            contentFooterElement.classList.add('footer-content');

            contentHeaderElement.appendChild(itemNameElement);
            contentHeaderElement.appendChild(removeButton);
            contentFooterElement.appendChild(quantityElement);
            contentFooterElement.appendChild(itemPriceElement);

            contentElement.appendChild(contentHeaderElement);
            contentElement.appendChild(itemDescriptionElement);
            contentElement.appendChild(contentFooterElement);
            contentElement.appendChild(quantityOptions);

            cartItemElement.appendChild(itemImageElement);
            cartItemElement.appendChild(contentElement);

            cartContainer.appendChild(cartItemElement);

            itemImageElement.addEventListener('click', () => {
                window.location.href = `../product/index.html?id=${item.id}`;
            })

            itemNameElement.addEventListener('click', () => {
                window.location.href = `../product/index.html?id=${item.id}`;
            });

            expandIcon.addEventListener('click', (e) => {
                e.stopPropagation(); 
                quantityOptions.classList.toggle('show');
            });

            quantityElement.addEventListener('click', () => {
                quantityOptions.classList.add('show');
            }); 

            quantityInput.addEventListener('change', () => {
                quantityInput.blur();
                const newQuantity = parseInt(quantityInput.value);
                item.quantity = newQuantity;
                updateCartItemQuantity(item.id, newQuantity);
                updateCartCount();
                updateTotalPrice();
                calculateDelivery();
                calculateTotal();
                quantityOptions.classList.remove('show');
            });

            quantityList.addEventListener('click', (e) => {
                if (e.target.tagName === 'LI') {
                    const newQuantity = parseInt(e.target.textContent);
                    item.quantity = newQuantity;
                    quantityInput.value = newQuantity;
                    updateCartItemQuantity(item.id, newQuantity);
                    updateCartCount();
                    updateTotalPrice();
                    calculateDelivery();
                    calculateTotal();
                    quantityElement.appendChild(expandIcon);
                    if (!quantityInput.blur()) {
                        quantityOptions.classList.remove('show');
                    }
                }
            });                              
            
            document.addEventListener("click", (e) => {
                const none = '';
                if (!quantityOptions.contains(e.target) && e.target !== quantityElement && !quantityElement.contains(e.target)) {
                    quantityOptions.classList.remove('show')
                }
                if(quantityInput.value === none || quantityInput.value === '0') {
                    quantityInput.value = 1;
                    const newQuantity = parseInt(quantityInput.value);
                    item.quantity = newQuantity;
                    updateCartItemQuantity(item.id, newQuantity);
                    updateCartCount();
                    updateTotalPrice();
                    calculateDelivery();
                    calculateTotal();
                }
            });

            quantityInput.addEventListener('keydown', (e) => {
                const none = '';
                if (e.key === 'Enter') {
                    quantityInput.blur();
                    if(quantityInput.value === none || quantityInput.value === '0') {
                        quantityInput.value = 1;
                        const newQuantity = parseInt(quantityInput.value);
                        item.quantity = newQuantity;
                        updateCartItemQuantity(item.id, newQuantity);
                        updateCartCount();
                        updateTotalPrice();
                        calculateDelivery();
                        calculateTotal();
                    }
                    quantityOptions.classList.remove('show');

                }
            });

        });
    }
}
  
function initializeCartPage() {
    const cartItems = getCartItems();
    updateCartCount();
    updateTotalPrice();
    displayCartItems();
    calculateDelivery();
    calculateTotal();
    console.log('Local Storage\nCart-Items:\n', cartItems);
}
  
document.addEventListener('DOMContentLoaded', initializeCartPage);
  