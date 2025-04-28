// 广告加载器
document.addEventListener('DOMContentLoaded', function () {
    // 加载广告组件
    loadAdComponent();
});

// 加载广告组件
function loadAdComponent() {
    const adContainer = document.getElementById('ad-container-placeholder');
    if (!adContainer) return;

    // 使用fetch加载广告组件
    fetch('ad-component.html')
        .then(response => response.text())
        .then(html => {
            adContainer.innerHTML = html;
            // 初始化所有广告轮播
            initializeAllSlideshows();
        })
        .catch(error => {
            console.error('加载广告组件失败:', error);
        });
}

// 初始化所有广告轮播
function initializeAllSlideshows() {
    startSlideshow('adSlideshow1');
    startSlideshow('adSlideshow2');
    startSlideshow('adSlideshow3');
    startSlideshow('adSlideshow4');
}

// 广告轮播功能
function startSlideshow(slideshowId) {
    const slideshow = document.getElementById(slideshowId);
    if (!slideshow) return;

    const images = slideshow.getElementsByTagName('img');
    if (images.length === 0) return;

    let index = 0;

    function showNextImage() {
        images[index].classList.remove('active');
        index = (index + 1) % images.length;
        images[index].classList.add('active');
    }

    setInterval(showNextImage, 3000);
}