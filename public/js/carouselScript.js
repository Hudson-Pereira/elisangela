const carouselWrapper = document.querySelector('.carousel-wrapper');
const carouselItems = document.querySelectorAll('.carousel-item');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const itemWidth = carouselItems[0].offsetWidth + 30;
let currentIndex = 0;
let counter = 0;
let isTransitioning = false;

carouselItems.forEach((item, index) => {
    if (index < 3) {
        const clone = item.cloneNode(true);
        carouselWrapper.appendChild(clone);
    }
});

function updateCarousel() {
    if (isTransitioning) return;
    isTransitioning = true;

    carouselWrapper.style.transition = 'transform 0.5s ease-in-out';
    carouselWrapper.style.transform = `translateX(-${(currentIndex + 1) * itemWidth}px)`;

    setTimeout(() => {
        if (currentIndex >= carouselItems.length) {
            currentIndex = 0;
            carouselWrapper.style.transition = 'none';
            carouselWrapper.style.transform = `translateX(-${itemWidth}px)`;
        }
        isTransitioning = false;
    }, 500);
}

nextBtn.addEventListener('click', () => {
    currentIndex++;
    updateCarousel();
});

prevBtn.addEventListener('click', () => {
    currentIndex--;
    if (currentIndex < 0) {
        currentIndex = carouselItems.length - 1;
        carouselWrapper.style.transition = 'none';
        carouselWrapper.style.transform = `translateX(-${carouselItems.length * itemWidth}px)`;
        setTimeout(() => {
            carouselWrapper.style.transition = 'transform 0.5s ease-in-out';
            carouselWrapper.style.transform = `translateX(-${(carouselItems.length - 1) * itemWidth}px)`;
        }, 0);
    } else {
        updateCarousel();
    }
});

carouselWrapper.style.transform = `translateX(-${itemWidth}px)`;
function autoSlide() {
    counter++;
    if (counter >= carouselItems.length) {
        counter = 0;
    }
    carouselWrapper.style.transform = `translateX(-${counter * itemWidth}px)`;
}

setInterval(autoSlide, 3000); // Roda a cada 3 segundos