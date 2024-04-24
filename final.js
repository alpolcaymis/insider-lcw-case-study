(() => {
    const init = () => {
        buildHTML();
        buildCSS();
        setEvents();
        fetchData();
    };

    const buildHTML = () => {
        const html = `
            <div class="carousel-wrapper">
                <button class="prev-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32"><path fill="black" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
                </button>
                <div class="container">
                    <p class="title">You Might Also Like</p>
                    <div class="carousel">
                        <div class="carousel-inner"></div>
                    </div>
                </div>
                <button class="next-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32"><path fill="black" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
                </button>
            </div>
        `;
        document.querySelector('.product-detail').innerHTML = html;
    };

    const buildCSS = () => {
        const css = `
            .carousel-wrapper {
                display: flex;
                justify-content: center;
                position: relative;
                background-color: #FAF9F7;
            }
            .container {
                text-align: center;
                width: 95%;
                padding: 0;
            }
            .carousel {
                position: relative;
                overflow: hidden;
                margin: 0 auto;
                width: 100%;
            }
            .carousel-inner {
                display: flex;
                transition: transform 0.5s ease;
            }
            .prev-btn, .next-btn {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                z-index: 1;
            }
            .prev-btn {
                left: 0;
            }
            .next-btn {
                right: 0;
            }
            .prev-btn svg, .next-btn svg {
                fill: black;
            }
            .product-card {
                position: relative;
                flex: 0 0 calc(100% / 7);
                margin-right: 5px;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                padding: 0;
            }
           
            .product-card img {
                width: 100%;
                height: auto;
                cursor: pointer;
            }
            .product-card .product-image {
                position: relative;
            }
            .product-card .product-image .favorite-wrapper {
                position: absolute;
                top: 5px;
                right: 5px;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 24px;
                height: 24px;
                background-color: white;
                border: 1px solid rgb(182, 183, 185);
                border-radius: 5px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.16);
            }
            .favorite {
                position: absolute;
                top: -5px;
                right: 8.5px;
                cursor: pointer;
                color: #ccc;
                font-size: 2.88rem;
                transition: color 0.3s ease;
                height: 24px;
                z-index: 2; 
            }
            .favorite.active {
                color: #4a90e2;
            }
            
            .product-card .product-info {
                width: 100%; 
                padding: 0 3px 3px;
                font-size: 0.8rem;
                text-align: left;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                height: 100%;
                background-color: white;
            }
            .product-card p {
                margin: 1px 0 2px 0;
            }
            .product-card .price {
                font-weight: bold;
                font-size: 1.3rem;
                color: #193DB0;
            }
            .title {
                text-align: left;
                margin-left: 0;
                margin-bottom: 0;
                font-size: 3.1rem;
                font-weight: lighter;
                padding: 2rem 0;
                color: rgb(41, 50, 59);
                line-height: 3rem;
            }
        `;
        const style = document.createElement('style');
        style.classList.add('carousel-style');
        style.innerHTML = css;
        document.head.appendChild(style);
    };

    const setEvents = () => {
        document.querySelector('.prev-btn').addEventListener('click', () => {
            moveCarousel(-1);
        });
        document.querySelector('.next-btn').addEventListener('click', () => {
            moveCarousel(1);
        });
        document.querySelector('.carousel-inner').addEventListener('click', (event) => {
            if (event.target.classList.contains('product-card')) {
                const url = event.target.dataset.url;
                window.open(url, '_blank');
            } else if (event.target.classList.contains('favorite')) {
                event.stopPropagation();
                event.target.classList.toggle('active');
                const productId = event.target.parentNode.dataset.id;
                updateFavorite(productId);
            } else if (event.target.tagName === 'IMG') {
                const url = event.target.parentNode.parentNode.dataset.url;
                window.open(url, '_blank');
            }
        });
    };

    const moveCarousel = (direction) => {
        const carouselInner = document.querySelector('.carousel-inner');
        const width = carouselInner.offsetWidth / 7; // Adjust for 7 products
        const currentScroll = carouselInner.scrollLeft;
        carouselInner.scrollTo({
            left: currentScroll + direction * width,
            behavior: 'smooth'
        });
    };

    const fetchData = () => {
        const localStorageData = localStorage.getItem('products');
        if (localStorageData) {
            renderProducts(JSON.parse(localStorageData));
        } else {
            fetch('https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json')
                .then(response => response.json())
                .then(data => {
                    localStorage.setItem('products', JSON.stringify(data));
                    renderProducts(data);
                })
                .catch(error => console.error('Error fetching data:', error));
        }
    };

    const renderProducts = (products) => {
        const carouselInner = document.querySelector('.carousel-inner');
        carouselInner.innerHTML = '';
        products.forEach(product => {
            const favoriteClass = localStorage.getItem(product.id) === 'true' ? 'active' : '';
            const productCard = `
                <div class="product-card" data-id="${product.id}" data-url="${product.url}">
                <span class="favorite ${favoriteClass}">&hearts;</span>

                    <div class="product-image">
                        <div class="favorite-wrapper">
                            
                        </div>
                        <img src="${product.img}" alt="${product.name}">
                    </div>
                    <div class="product-info">
                        <p>${product.name}</p>
                        <p class="price">$ ${product.price}</p>
                    </div>
                </div>
            `;
            carouselInner.innerHTML += productCard;
        });
    };

    const updateFavorite = (productId) => {
        const favoriteIcon = document.querySelector(`[data-id="${productId}"] .favorite`);
        if (favoriteIcon.classList.contains('active')) {
            localStorage.setItem(productId, 'true');
        } else {
            localStorage.removeItem(productId);
        }
    };

    init();
})();
