const nameListInput = document.getElementById('nameList');
const bgImageInput = document.getElementById('bgImage');
const imagePreview = document.getElementById('imagePreview');
const fontSizeInput = document.getElementById('fontSize');
const fontSizeNumber = document.getElementById('fontSizeNumber');
const textColorInput = document.getElementById('textColor');
const generateBtn = document.getElementById('generateBtn');
const printBtn = document.getElementById('printBtn');
const printContainer = document.getElementById('printContainer');
const placeholderText = document.getElementById('placeholderText');

const bgSelect = document.getElementById('bgSelect');
const bgUploadLabel = document.getElementById('bgUploadLabel');
const offsetXInput = document.getElementById('offsetX');
const offsetYInput = document.getElementById('offsetY');

let currentBackgroundImage = '';

// 處理預設背景與上傳選項切換
bgSelect.addEventListener('change', function(e) {
    if (e.target.value === 'upload') {
        bgUploadLabel.style.display = 'inline-block';
        if (bgImageInput.files.length > 0) {
            // Restore previously uploaded image
            const reader = new FileReader();
            reader.onload = function(event) {
                currentBackgroundImage = event.target.result;
                imagePreview.style.backgroundImage = `url(${currentBackgroundImage})`;
                imagePreview.innerHTML = '';
            }
            reader.readAsDataURL(bgImageInput.files[0]);
        } else {
            currentBackgroundImage = '';
            imagePreview.style.backgroundImage = 'none';
            imagePreview.innerHTML = '<span>🖼️ 尚未選擇圖片</span>';
        }
    } else {
        bgUploadLabel.style.display = 'none';
        currentBackgroundImage = e.target.value; // e.g. "bg1.png"
        imagePreview.style.backgroundImage = `url(${currentBackgroundImage})`;
        imagePreview.innerHTML = '';
    }
});

// 處理圖片上傳
bgImageInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            currentBackgroundImage = event.target.result;
            imagePreview.style.backgroundImage = `url(${currentBackgroundImage})`;
            imagePreview.innerHTML = ''; // 清除文字
        }
        reader.readAsDataURL(file);
    }
});

// 雙向同步字體大小
fontSizeInput.addEventListener('input', function(e) {
    fontSizeNumber.value = e.target.value;
});
fontSizeNumber.addEventListener('input', function(e) {
    fontSizeInput.value = e.target.value;
});

// 產生名牌預覽
generateBtn.addEventListener('click', function() {
    const namesText = nameListInput.value;
    // 將換行符號分割，並過濾掉空白行
    const names = namesText.split('\n').map(n => n.trim()).filter(n => n !== '');
    
    const fontSize = fontSizeInput.value + 'px';
    const textColor = textColorInput.value;
    const offsetX = offsetXInput.value;
    const offsetY = offsetYInput.value;
    
    if (names.length === 0) {
        alert('請先在左側貼上至少一個名字！');
        return;
    }

    // 隱藏提示文字，清空舊的預覽
    placeholderText.style.display = 'none';
    printContainer.innerHTML = '';

    const tagsPerPage = 9; // 3x3 網格
    const pageCount = Math.ceil(names.length / tagsPerPage);

    // 依序產生每一頁
    for (let i = 0; i < pageCount; i++) {
        const page = document.createElement('div');
        page.className = 'a4-page';
        
        // 取得這一頁應該顯示的 9 個名字
        const pageNames = names.slice(i * tagsPerPage, (i + 1) * tagsPerPage);
        
        // 產生 9 個名牌格子
        for (let j = 0; j < tagsPerPage; j++) {
            const name = pageNames[j] || ''; // 如果沒有名字就留白
            const tag = document.createElement('div');
            tag.className = 'nametag';
            
            // 設定背景
            if (currentBackgroundImage) {
                tag.style.backgroundImage = `url(${currentBackgroundImage})`;
            } else {
                tag.style.backgroundColor = '#f8fafc'; // 沒有圖片時的預設背景色
            }

            // 加入文字
            if (name) {
                const textDiv = document.createElement('div');
                textDiv.className = 'nametag-text';
                textDiv.style.fontSize = fontSize;
                textDiv.style.color = textColor;
                textDiv.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
                textDiv.textContent = name;
                tag.appendChild(textDiv);
            }
            
            page.appendChild(tag);
        }
        
        printContainer.appendChild(page);
    }
    
    // 啟用列印按鈕
    printBtn.disabled = false;
});

// 觸發列印功能
printBtn.addEventListener('click', function() {
    window.print();
});
