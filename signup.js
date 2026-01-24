const imageUploader = document.getElementById('imageUploader');
const profilePicInput = document.getElementById('profilePic');

imageUploader.addEventListener('click', () => {
    profilePicInput.click();
});

profilePicInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imageUploader.innerHTML = `<img src="${e.target.result}" alt="Profile Picture">`;
        }
        reader.readAsDataURL(file);
    }
});
