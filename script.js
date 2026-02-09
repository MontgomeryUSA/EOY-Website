const section1 = document.querySelector('.section-1');
const section2 = document.querySelector('.section-2');
const riseItems = section1.querySelectorAll('.rise')


const images = [
  "cs images/cs-image-1.png",
  "cs images/cs-image-2.png"
];

let currentIndex = 0;
const imgElement = document.querySelector('.carousel-image');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

function updateImage() {
  imgElement.style.opacity = 0;
  setTimeout(() => {
    imgElement.src = images[currentIndex];
    imgElement.style.opacity = 1;
  }, 200);
}

prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  updateImage();
});

nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % images.length;
  updateImage();
});

