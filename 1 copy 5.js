(() => {
    const init = () => {
        buildHTML();
        buildCSS();
        setEvents();
        fetchData();
    };

    const buildHTML = () => {
        const html = `
            <div class="container">
                <h1>You Might Also Like</h1>
                <div class="carousel">
                    <div class="carousel-inner"></div>
                    <button class="prev-btn">&lt;</button>
                    <button class="next-btn">&gt;</button>
                </div>
            </div>
        `;
        document.querySelector('.product-detail').innerHTML = html;
    };

    const buildCSS = () => {
        const css = `
            .container {
                text-align: center;
            }
            .carousel {
                position: relative;
                overflow: hidden;
                margin: 0 auto;
                width: 80%;
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
            .product-card {
                flex: 0 0 33.33%;
                padding: 10px;
                box-sizing: border-box;
            }
            .product-card img {
                width: 100%;
                height: auto;
            }
            .product-card h3 {
                margin: 0;
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
            }
        });
    };

    const moveCarousel = (direction) => {
        const carouselInner = document.querySelector('.carousel-inner');
        const width = carouselInner.offsetWidth;
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
            const productCard = `
                <div class="product-card" data-url="${product.url}">
                    <img src="${product.img}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>$${product.price}</p>
                </div>
            `;
            carouselInner.innerHTML += productCard;
        });
    };

    init();
})();
