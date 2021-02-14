// Adding Spinner at line 31 and 36 
// Adding Error message if the fetch does not work at line 41
// Making Input box empty at line 32, 23, 40, etc
// fetch result validation at 23

const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
// selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
    if (images == 0) {
        document.getElementById("otherWord").innerText = "Please try with another name.";
        toggleSpinner();
        document.getElementById("search").value = "";
    }
    else {
        document.getElementById("otherWord").innerText = "";
        imagesArea.style.display = 'block';
        gallery.innerHTML = '';
        // show gallery title
        galleryHeader.style.display = 'flex';
        images.forEach(image => {
            let div = document.createElement('div');
            div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
            div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
            gallery.appendChild(div)
        })
        document.getElementById("search").value = "";
        toggleSpinner();
    }
}

const getImages = (query) => {
    const url = `https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`;
    toggleSpinner();
    fetch(url)
        .then(response => response.json())
        .then(data => showImages(data.hits))
        .catch(err => displayError("Something went wrong. Please try again later"))
}

let slideIndex = 0;
const selectItem = (event, img) => {
    let element = event.target;
    let item = sliders.indexOf(img);
    if (item === -1) {
        sliders.push(img);
        element.classList.add('added');
    } else {
        sliders.splice(item, 1);
        element.classList.remove('added');
    }
}
var timer
const createSlider = () => {
    // check slider image length
    if (sliders.length < 2) {
        alert('Select at least 2 image.')
        return;
    }
    // crate slider previous next area
    sliderContainer.innerHTML = '';
    const prevNext = document.createElement('div');
    prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
    prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

    sliderContainer.appendChild(prevNext)
    document.querySelector('.main').style.display = 'block';
    // hide image aria
    imagesArea.style.display = 'none';
    let duration = document.getElementById('duration').value;
    if (duration == "" || duration < 1000) {
        alert("If time is not set or set less than 1000ms then 1000ms as default")
        duration = 1000;
    }
    sliders.forEach(slide => {
        let item = document.createElement('div')
        item.className = "slider-item";
        item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
        sliderContainer.appendChild(item)
    })
    changeSlide(0)
    timer = setInterval(function () {
        slideIndex++;
        changeSlide(slideIndex);
    }, duration);
    document.getElementById("duration").value = "";
}

// change slider index 
const changeItem = index => {
    changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

    const items = document.querySelectorAll('.slider-item');
    if (index < 0) {
        slideIndex = items.length - 1
        index = slideIndex;
    };

    if (index >= items.length) {
        index = 0;
        slideIndex = 0;
    }

    items.forEach(item => {
        item.style.display = "none"
    })

    items[index].style.display = "block"
}

searchBtn.addEventListener('click', function () {
    document.querySelector('.main').style.display = 'none';
    clearInterval(timer);
    const search = document.getElementById('search').value;
    getImages(search)
    sliders.length = 0;
})

sliderBtn.addEventListener('click', function () {
    createSlider()
})

document.getElementById("search")
    .addEventListener("keyup", function (event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            document.getElementById("search-btn").click();
        }
    });

const toggleSpinner = () => {
    const spinnerTiggle = document.getElementById("spinnerToggle")
    spinnerTiggle.classList.toggle("d-none");
}

const displayError = getError => {
    document.getElementById("errorMessege").innerText = getError;
    document.getElementById("search").value = "";
    toggleSpinner();
}

