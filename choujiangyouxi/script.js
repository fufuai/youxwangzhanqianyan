document.addEventListener('DOMContentLoaded', function () {
    // 获取DOM元素
    const prizeWheel = document.getElementById('prizeWheel');
    const spinButton = document.getElementById('spinButton');
    const resultText = document.getElementById('resultText');
    const resultContainer = document.getElementById('resultContainer');
    const prizeName = document.getElementById('prizeName');
    const wheelPointer = document.querySelector('.wheel-pointer');
    const wheelSections = document.querySelectorAll('.wheel-section');

    // 重置指针初始位置
    wheelPointer.style.transform = 'translate(-50%, -50%)';

    // 各扇区对应的写真集目录和初始图片
    // 扇区位置说明:
    // 0 - 激情热吻: 顶部位置(12点钟方向)
    // 1 - 浪漫按摩: 右上位置(72度方向)
    // 2 - 情趣内衣: 右下位置(144度方向) 
    // 3 - 角色扮演: 左下位置(216度方向)
    // 4 - 甜蜜惩罚: 左上位置(288度方向)
    const photoCollections = [
        {
            dir: './images/[雲少女写真] 写SchoolGirl.II [27P]/',
            initialImage: './images/bg1.jpg',
            totalImages: 27,
            currentIndex: 0,
            imagesLoaded: false,
            images: []
        },
        {
            dir: './images/六味帝皇酱 - 溪水体操服 [60P]/',
            initialImage: './images/bg2.jpg',
            totalImages: 60,
            currentIndex: 0,
            imagesLoaded: false,
            images: []
        },
        {
            dir: './images/虎森森 体操服 [36P]/',
            initialImage: './images/bg3.jpg',
            totalImages: 36,
            currentIndex: 0,
            imagesLoaded: false,
            images: []
        },
        {
            dir: './images/Coser@周叽是可爱兔兔 Vol.012： 体操服 [31P]/',
            initialImage: './images/bg4.jpg',
            totalImages: 31,
            currentIndex: 0,
            imagesLoaded: false,
            images: []
        },
        {
            dir: './images/[いくみ]いくみと温泉(ROM) [95P]/',
            initialImage: './images/bg5.jpg',
            totalImages: 95,
            currentIndex: 0,
            imagesLoaded: false,
            images: []
        }
    ];

    // 奖品名称
    const prizeNames = [
        "激情热吻", // 12点钟方向
        "浪漫按摩", // 72度方向
        "情趣内衣", // 144度方向
        "角色扮演", // 216度方向
        "甜蜜惩罚"  // 288度方向
    ];

    // 奖品描述
    const prizeDescriptions = [
        "来一个长达5分钟的激情热吻，点燃你的欲望",
        "享受30分钟的精油全身按摩，放松身心",
        "伴侣为你穿上准备好的情趣内衣，尽享视觉盛宴",
        "选择你最喜欢的角色，享受不一样的刺激体验",
        "由对方选择一种小小的惩罚，增添情趣"
    ];

    // 奖品列表
    const prizes = [
        { name: prizeNames[0], probability: 0.18, image: photoCollections[0].initialImage, position: "顶部(12点钟方向)", description: prizeDescriptions[0], gameLink: "./games/hot-kiss.html" },
        { name: prizeNames[1], probability: 0.18, image: photoCollections[1].initialImage, position: "右上(72度方向)", description: prizeDescriptions[1], gameLink: "./games/massage.html" },
        { name: prizeNames[2], probability: 0.18, image: photoCollections[2].initialImage, position: "右下(144度方向)", description: prizeDescriptions[2], gameLink: "./games/lingerie.html" },
        { name: prizeNames[3], probability: 0.18, image: photoCollections[3].initialImage, position: "左下(216度方向)", description: prizeDescriptions[3], gameLink: "./games/roleplay.html" },
        { name: prizeNames[4], probability: 0.28, image: photoCollections[4].initialImage, position: "左上(288度方向)", description: prizeDescriptions[4], gameLink: "./games/punishment.html" }
    ];

    // 显示奖品位置信息
    console.log("奖品位置信息：");
    prizes.forEach((prize, index) => {
        console.log(`${prize.name}: ${prize.position}`);
    });

    // 用户抽奖次数（假设存储在localStorage中）
    let userDrawCount = parseInt(localStorage.getItem('userDrawCount') || '0');

    // 尝试使用更简单的方法加载图片，通过预定义的数量
    function loadImagesSimple() {
        photoCollections.forEach((collection, index) => {
            const images = [];
            for (let i = 1; i <= collection.totalImages; i++) {
                // 尝试常见的文件扩展名
                images.push(`${collection.dir}${i}.jpg`);
            }
            collection.images = images;
            collection.imagesLoaded = true;

            // 测试第一张图片是否可加载
            const testImg = new Image();
            testImg.onload = function () {
                console.log(`${collection.dir}中的图片可以加载`);
            };
            testImg.onerror = function () {
                console.warn(`无法加载${collection.dir}中的图片，可能需要检查路径或文件名`);
            };
            if (images.length > 0) {
                testImg.src = images[0];
            }
        });
    }

    // 加载图片
    loadImagesSimple();

    // 更新抽奖次数显示
    function updateDrawCount() {
        const remainingDraws = 5 - userDrawCount;
        if (remainingDraws <= 0) {
            spinButton.disabled = true;
            spinButton.textContent = '今日抽奖次数已用完';
        } else {
            spinButton.textContent = `开始旋转（剩余${remainingDraws}次）`;
        }
    }

    // 初始化抽奖次数显示
    updateDrawCount();

    // 轮播图片
    function rotateImages() {
        wheelSections.forEach((section, index) => {
            const collection = photoCollections[index];
            if (collection.imagesLoaded && collection.images.length > 0) {
                collection.currentIndex = (collection.currentIndex + 1) % collection.images.length;
                const nextImage = collection.images[collection.currentIndex];

                // 创建一个新图片对象用于预加载
                const preloadImg = new Image();
                preloadImg.onload = function () {
                    // 图片加载成功后更新背景
                    section.style.backgroundImage = `url('${nextImage}')`;
                    section.style.backgroundSize = 'cover';
                    section.style.backgroundPosition = 'center';
                    prizes[index].image = nextImage;
                };
                preloadImg.onerror = function () {
                    console.error(`无法加载图片: ${nextImage}`);
                    // 加载失败时尝试使用初始图片
                    section.style.backgroundImage = `url('${collection.initialImage}')`;
                    prizes[index].image = collection.initialImage;
                };
                preloadImg.src = nextImage;
            }
        });
    }

    // 立即尝试首次更新背景图片
    wheelSections.forEach((section, index) => {
        // 设置初始背景图片
        const initialImage = photoCollections[index].initialImage;
        const img = new Image();
        img.onload = function () {
            section.style.backgroundImage = `url('${initialImage}')`;
            section.style.backgroundSize = 'cover';
            section.style.backgroundPosition = 'center';
        };
        img.onerror = function () {
            console.error(`无法加载初始图片: ${initialImage}`);
            section.style.backgroundColor = 'rgba(255, 121, 198, 0.2)';
        };
        img.src = initialImage;
    });

    // 启动轮播，每5秒切换一次
    const carouselInterval = setInterval(rotateImages, 5000);

    // 根据概率选择奖品
    function selectPrize() {
        const random = Math.random();
        let probabilitySum = 0;

        for (let i = 0; i < prizes.length; i++) {
            probabilitySum += prizes[i].probability;
            if (random < probabilitySum) {
                return i;
            }
        }

        // 默认返回最后一个奖项（如果概率总和不为1）
        return prizes.length - 1;
    }

    // 计算旋转角度
    function calculateRotation(prizeIndex) {
        // 每个奖项占72度，旋转到奖项的中心位置
        const baseAngle = 360 / prizes.length;
        const targetAngle = baseAngle * prizeIndex;

        // 添加一个小偏移，确保指向扇形中央
        const offset = baseAngle / 2;

        // 多转几圈增加动画效果（4-6圈随机）
        const extraRotation = (4 + Math.floor(Math.random() * 3)) * 360;

        return extraRotation + targetAngle + offset;
    }

    // 显示奖品图片和文字
    function showPrizeResult(prizeIndex) {
        const prize = prizes[prizeIndex];

        // 设置奖品名称
        prizeName.textContent = prize.name;
        prizeName.style.color = '#ff79c6';
        prizeName.style.fontSize = '1.8rem';
        prizeName.style.textShadow = '0 0 10px rgba(255, 0, 150, 0.5)';
        prizeName.style.marginBottom = '15px';

        // 清除之前的结果图片和内容
        const imageContainer = document.getElementById('imageContainer');
        imageContainer.innerHTML = '';

        // 创建并显示奖品图片
        const resultImage = document.createElement('img');
        resultImage.alt = prize.name;
        resultImage.style.maxWidth = '100%';
        resultImage.style.maxHeight = '300px';
        resultImage.style.objectFit = 'contain';
        resultImage.style.borderRadius = '10px';
        resultImage.style.boxShadow = '0 0 20px rgba(255, 121, 198, 0.6)';
        resultImage.style.opacity = '0';
        resultImage.style.transition = 'opacity 0.5s ease-in';

        // 确保图片正确加载后再显示
        resultImage.onload = function () {
            resultImage.style.opacity = '1';
        };

        // 设置图片源
        resultImage.src = prize.image;

        // 添加图片容器的点击事件
        imageContainer.style.cursor = 'pointer';
        imageContainer.onclick = function () {
            window.location.href = prize.gameLink;
        };

        // 添加图片到容器
        imageContainer.appendChild(resultImage);

        // 更新文字结果
        resultText.textContent = prize.description;
        resultText.style.fontSize = '1.2rem';
        resultText.style.color = '#f8f8f2';
        resultText.style.margin = '20px 0';

        // 设置开始游戏按钮
        const startGameBtn = document.getElementById('startGameBtn');
        startGameBtn.href = prize.gameLink;
        startGameBtn.style.display = 'inline-block';

        // 显示结果容器
        resultContainer.style.display = 'block';
        resultContainer.style.animation = 'fadeIn 0.5s ease-in-out';
    }

    // 点击抽奖按钮
    spinButton.addEventListener('click', function () {
        // 检查抽奖次数
        if (userDrawCount >= 5) {
            alert('今日抽奖次数已用完，明天再来吧！');
            return;
        }

        // 禁用按钮，防止重复点击
        spinButton.disabled = true;
        spinButton.textContent = '正在旋转...';

        // 隐藏结果容器
        resultContainer.style.display = 'none';

        // 选择奖品
        const selectedPrizeIndex = selectPrize();
        const rotationAngle = calculateRotation(selectedPrizeIndex);

        console.log('选中奖品:', prizes[selectedPrizeIndex].name);
        console.log('奖品位置:', prizes[selectedPrizeIndex].position);
        console.log('旋转角度:', rotationAngle);

        // 播放旋转音效
        const audio = new Audio('./sound/wheel.mp3');
        audio.volume = 0.5;
        audio.play().catch(e => console.log('无法播放音效:', e));

        // 指针旋转而非轮盘旋转
        wheelPointer.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.83, 0.67)';
        wheelPointer.style.transform = `translate(-50%, -50%) rotate(${rotationAngle}deg)`;

        // 动画结束后显示结果
        setTimeout(function () {
            // 播放获奖音效
            const winAudio = new Audio('./sound/win.mp3');
            winAudio.volume = 0.6;
            winAudio.play().catch(e => console.log('无法播放获奖音效:', e));

            // 显示奖品结果
            showPrizeResult(selectedPrizeIndex);

            // 增加抽奖次数并保存
            userDrawCount++;
            localStorage.setItem('userDrawCount', userDrawCount.toString());

            // 更新抽奖次数显示
            updateDrawCount();

            // 重置按钮状态
            if (userDrawCount < 5) {
                spinButton.disabled = false;
                spinButton.textContent = `开始旋转（剩余${5 - userDrawCount}次）`;
            }
        }, 4200); // 等待旋转动画完成
    });

    // 每天重置抽奖次数
    function checkDailyReset() {
        const lastResetDate = localStorage.getItem('lastResetDate');
        const currentDate = new Date().toDateString();

        if (lastResetDate !== currentDate) {
            // 重置次数
            userDrawCount = 0;
            localStorage.setItem('userDrawCount', userDrawCount.toString());
            localStorage.setItem('lastResetDate', currentDate);

            // 更新UI
            updateDrawCount();
            spinButton.disabled = false;
        }
    }

    // 检查是否需要重置
    checkDailyReset();

    // 页面关闭时清除定时器
    window.addEventListener('beforeunload', function () {
        clearInterval(carouselInterval);
    });

    // 添加键盘快捷键支持
    document.addEventListener('keydown', function (event) {
        // 空格键或回车键启动转盘
        if ((event.code === 'Space' || event.code === 'Enter') && !spinButton.disabled) {
            event.preventDefault();
            spinButton.click();
        }
    });
}); 