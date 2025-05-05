// 搜索功能
document.addEventListener('DOMContentLoaded', function () {
    // 获取搜索元素
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');

    if (!searchInput || !searchButton) {
        console.error('搜索元素未找到');
        return;
    }

    // 执行搜索功能
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (!searchTerm) return;

        // 将搜索词存储到本地存储以便跨页面使用
        localStorage.setItem('searchTerm', searchTerm);

        // 显示搜索结果
        filterVideosBySearch(searchTerm);
    }

    // 根据搜索词过滤视频
    function filterVideosBySearch(searchTerm) {
        let hasResults = false;

        // 获取所有视频卡片
        const allVideoCards = document.querySelectorAll('.video-card');

        // 如果没有视频卡片，可能是因为页面结构不同
        if (allVideoCards.length === 0) {
            console.error('未找到视频卡片元素');
            return;
        }

        // 清除现有的无结果消息
        const existingMessage = document.getElementById('noResultsMessage');
        if (existingMessage) {
            existingMessage.remove();
        }

        // 遍历视频卡片并根据标题和频道名称进行过滤
        allVideoCards.forEach(card => {
            const title = card.querySelector('.video-title').textContent.toLowerCase();
            const channel = card.querySelector('.channel-name').textContent.toLowerCase();

            if (title.includes(searchTerm) || channel.includes(searchTerm)) {
                card.style.display = 'block';
                hasResults = true;
            } else {
                card.style.display = 'none';
            }
        });

        // 如果没有结果，显示提示消息
        if (!hasResults) {
            const noResultsMessage = document.createElement('div');
            noResultsMessage.id = 'noResultsMessage';
            noResultsMessage.style.textAlign = 'center';
            noResultsMessage.style.padding = '30px';
            noResultsMessage.style.fontSize = '18px';
            noResultsMessage.style.color = '#ff66cc';
            noResultsMessage.innerHTML = `没有找到与 "<strong>${searchTerm}</strong>" 相关的视频`;

            // 将消息插入到第一个视频网格之前
            const firstVideoGrid = document.querySelector('.video-grid');
            if (firstVideoGrid) {
                firstVideoGrid.parentNode.insertBefore(noResultsMessage, firstVideoGrid);
            } else {
                // 如果找不到视频网格，插入到主内容区域
                const mainContent = document.querySelector('main');
                if (mainContent) {
                    mainContent.appendChild(noResultsMessage);
                }
            }
        }

        // 如果页面有分页，也需要隐藏
        const pagination = document.querySelector('.pagination');
        if (pagination) {
            pagination.style.display = hasResults ? 'flex' : 'none';
        }
    }

    // 添加搜索按钮点击事件
    searchButton.addEventListener('click', performSearch);

    // 添加回车键搜索功能
    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // 检查是否有保存的搜索词，如有则执行搜索
    const savedSearchTerm = localStorage.getItem('searchTerm');
    if (savedSearchTerm) {
        searchInput.value = savedSearchTerm;
        setTimeout(function () {
            filterVideosBySearch(savedSearchTerm);
        }, 100); // 短暂延迟以确保DOM已完全加载
    }

    // 添加清除搜索的功能（当输入框为空并按下回车或点击搜索按钮时）
    searchInput.addEventListener('input', function () {
        if (this.value === '') {
            localStorage.removeItem('searchTerm');
            // 显示所有视频
            const allVideoCards = document.querySelectorAll('.video-card');
            allVideoCards.forEach(card => {
                card.style.display = 'block';
            });

            // 删除无结果消息
            const existingMessage = document.getElementById('noResultsMessage');
            if (existingMessage) {
                existingMessage.remove();
            }

            // 恢复分页的显示
            const pagination = document.querySelector('.pagination');
            if (pagination) {
                pagination.style.display = 'flex';
            }
        }
    });
}); 