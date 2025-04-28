// 页面加载动画
window.addEventListener('load', function () {
    const loader = document.querySelector('.page-loader');
    loader.style.display = 'none';
});

// 滚动到顶部按钮
const scrollToTopButton = document.getElementById('scroll-to-top');

window.addEventListener('scroll', function () {
    if (window.pageYOffset > 300) {
        scrollToTopButton.style.display = 'flex';
    } else {
        scrollToTopButton.style.display = 'none';
    }
});

scrollToTopButton.addEventListener('click', function () {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// 搜索功能
const searchInput = document.getElementById('searchInput');
const resultDiv = document.getElementById('result');

searchInput.addEventListener('input', function () {
    const searchTerm = this.value.toLowerCase();
    const gameCards = document.querySelectorAll('.game-card');

    resultDiv.innerHTML = '';

    if (searchTerm.length < 2) {
        resultDiv.style.display = 'none';
        return;
    }

    let hasResults = false;

    gameCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();

        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            const div = document.createElement('div');
            div.innerHTML = `<a href="#${card.id}">${card.querySelector('h3').textContent}</a>`;
            resultDiv.appendChild(div);
            hasResults = true;
        }
    });

    resultDiv.style.display = hasResults ? 'block' : 'none';
});

// 标签过滤器
const tagButtons = document.querySelectorAll('.tag-button');
const gameCards = document.querySelectorAll('.game-card');

tagButtons.forEach(button => {
    button.addEventListener('click', function () {
        const tag = this.getAttribute('data-tag');

        tagButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        gameCards.forEach(card => {
            const cardTags = card.getAttribute('data-tags').split(',');
            if (tag === 'all' || cardTags.includes(tag)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// 年龄验证模态框
const modal = document.getElementById('ageModal');
const confirmButton = document.getElementById('confirmButton');
const exitButton = document.getElementById('exitButton');
const checkbox = document.getElementById('ageCheckbox');

function showModal() {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function hideModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

confirmButton.addEventListener('click', function () {
    if (checkbox.checked) {
        hideModal();
        localStorage.setItem('ageVerified', 'true');
    } else {
        alert('请确认您已年满18岁并同意条款和条件。');
    }
});

exitButton.addEventListener('click', function () {
    window.location.href = 'https://www.google.com';
});

// 检查是否已经验证过年龄
if (!localStorage.getItem('ageVerified')) {
    showModal();
}

// 音乐播放器
const musicPlayer = document.getElementById('musicPlayer');
const playButton = document.getElementById('playButton');
const pauseButton = document.getElementById('pauseButton');
const nextButton = document.getElementById('nextButton');
const prevButton = document.getElementById('prevButton');

const playlist = [
    'music/song1.mp3',
    'music/song2.mp3',
    'music/song3.mp3'
];

let currentSongIndex = 0;

function playMusic() {
    musicPlayer.src = playlist[currentSongIndex];
    musicPlayer.play();
    playButton.style.display = 'none';
    pauseButton.style.display = 'flex';
}

function pauseMusic() {
    musicPlayer.pause();
    playButton.style.display = 'flex';
    pauseButton.style.display = 'none';
}

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    playMusic();
}

function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    playMusic();
}

playButton.addEventListener('click', playMusic);
pauseButton.addEventListener('click', pauseMusic);
nextButton.addEventListener('click', nextSong);
prevButton.addEventListener('click', prevSong);

musicPlayer.addEventListener('ended', nextSong);

// Mobile menu toggle functionality
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');

menuToggle.addEventListener('click', function () {
    menuToggle.classList.toggle('active');
    nav.classList.toggle('active');
});

// 点击导航链接时关闭菜单
const navLinks = document.querySelectorAll('nav a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        nav.classList.remove('active');
    });
}); 