const arrow = document.querySelector('.scroll-arrow');
const section1 = document.querySelector('.section-1');
const section2 = document.querySelector('.section-2');
const riseItems = section1.querySelectorAll('.rise');

arrow.addEventListener('click', () => {
  arrow.classList.add('animate');

  riseItems.forEach((item, index) => {
    setTimeout(() => {
      item.classList.add('appliedRise');
    }, index * 150);
  });

  section2.classList.add('reveal');

  scrollToElement(section2, 900);
});

function scrollToElement(target, duration = 1000) {
  const startTime = performance.now();
  const startY = window.scrollY;

  function animation(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const ease = progress < 0.5
      ? 4 * progress ** 3
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    const targetY = target.getBoundingClientRect().top + window.scrollY;
    const distance = targetY - startY;

    window.scrollTo(0, startY + distance * ease);

    if (progress < 1) requestAnimationFrame(animation);
  }

  requestAnimationFrame(animation);
}

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

const scrollTopArrow = document.querySelector('.section-2 .scroll-top-arrow');

scrollTopArrow.addEventListener('click', () => {
  riseItems.forEach(item => item.classList.remove('appliedRise'));

  section1.scrollIntoView({ behavior: 'smooth' });
});
