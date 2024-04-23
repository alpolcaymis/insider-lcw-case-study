(() => {
    const init = async () => {
        let productList = await getProducts();
        if (!productList) {
            console.error('Failed to fetch products.');
            return;
        }
        buildHTML(productList);
        buildCSS();
        setEvents();
    };

    const getProducts = async () => {
        try {
            const response = await fetch('https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching products:', error);
            return null;
        }
    };

    const buildHTML = (productList) => {
        const html = `
            <div class="carousel-wrapper">
                <h1>You Might Also Like</h1>
                <div class="carousel">
                    <div class="product-list">
                        ${productList.map(product => `
                            <div class="product-card" data-id="${product.id}">
                                <img src="${product.img}" alt="${product.name}" width="auto" height="500">
                                <div class="product-info">
                                    <p class="product-name">${product.name}</p>
                                    <p class="product-price">${product.price.toFixed(2)} $</p>
                                    <button class="favorite-btn">❤️</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <button class="prev-btn">&lt;</button>
                <button class="next-btn">&gt;</button>
            </div>
        `;
        document.querySelector('.product-detail').innerHTML = html;
    };

    const buildCSS = () => {
        const css = `
            .carousel-wrapper {
                position: relative;
                margin: 20px auto;
                max-width: 1000px;
                overflow: hidden;
            }
            .carousel {
                display: flex;
                overflow: hidden;
            }
            .product-list {
                display: flex;
                transition: transform 0.5s ease;
            }
            .product-card {
                flex: 0 0 calc(100% / 6.5);
                border: 1px solid #ccc;
                padding: 10px;
            }
            .product-info {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .favorite-btn {
                cursor: pointer;
                border: none;
                background: none;
                font-size: 1.5rem;
            }
            .prev-btn,
            .next-btn {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background-color: transparent;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 10px;
                color: #333;
                transition: color 0.3s;
            }
            .prev-btn:hover,
            .next-btn:hover {
                color: #000;
            }
            .prev-btn {
                left: 0;
            }
            .next-btn {
                right: 0;
            }
        `;
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    };

    const setEvents = () => {
        const productList = document.querySelector('.product-list');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const favoriteBtns = document.querySelectorAll('.favorite-btn');

        let currentIndex = 0;

        const slideCarousel = (direction) => {
            const cardWidth = productList.querySelector('.product-card').offsetWidth;
            if (direction === 'prev') {
                currentIndex = Math.max(currentIndex - 1, 0);
            } else {
                currentIndex = Math.min(currentIndex + 1, productList.children.length - 6.5);
            }
            productList.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        };

        prevBtn.addEventListener('click', () => slideCarousel('prev'));
        nextBtn.addEventListener('click', () => slideCarousel('next'));

        favoriteBtns.forEach(btn => {
            btn.addEventListener('click', (event) => {
                event.stopPropagation();
                const productId = event.target.closest('.product-card').dataset.id;
                toggleFavorite(productId);
            });
        });

        productList.addEventListener('click', (event) => {
            const productCard = event.target.closest('.product-card');
            if (productCard) {
                const productUrl = productList.querySelector(`[data-id="${productCard.dataset.id}"] a`).href;
                window.open(productUrl, '_blank');
            }
        });
    };

    const toggleFavorite = (productId) => {
        const favoriteIds = JSON.parse(localStorage.getItem('favoriteIds')) || [];
        const index = favoriteIds.indexOf(productId);
        if (index === -1) {
            favoriteIds.push(productId);
        } else {
            favoriteIds.splice(index, 1);
        }
        localStorage.setItem('favoriteIds', JSON.stringify(favoriteIds));
        updateFavorites();
    };

    const updateFavorites = () => {
        const favoriteIds = JSON.parse(localStorage.getItem('favoriteIds')) || [];
        const favoriteBtns = document.querySelectorAll('.favorite-btn');
        favoriteBtns.forEach(btn => {
            const productId = btn.closest('.product-card').dataset.id;
            if (favoriteIds.includes(productId)) {
                btn.style.color = 'blue';
            } else {
                btn.style.color = '';
            }
        });
    };

    init();
})();
