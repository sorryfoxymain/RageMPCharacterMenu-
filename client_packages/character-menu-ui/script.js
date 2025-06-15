// Character Menu UI Script
let currentCharacterData = {
    gender: 'mp_m_freemode_01',
    skinColor: 0,
    hairStyle: 0,
    clothes: [],
    props: [], // Добавляем для очков и аксессуаров
    tattoos: [],
    animation: null
};

let currentClothingValues = {};
let currentPropValues = {}; // Для очков и головных уборов
let currentTattooValues = {};

// Максимальные значения для компонентов одежды и props
const MAX_VALUES = {
    clothes: {
        1: 50,   // Маски  
        4: 150,  // Нижняя одежда
        6: 100,  // Обувь
        7: 50,   // Аксессуары
        8: 200,  // Топ
        11: 350  // Верхняя одежда
    },
    props: {
        0: 150,  // Головные уборы
        1: 50    // Очки
    },
    tattoos: {
        left_arm: 30,
        right_arm: 30,
        left_leg: 20,
        right_leg: 20,
        torso: 50,
        back: 25,
        head: 15
    }
};

// Предустановленные татуировки для упрощения
const TATTOO_PRESETS = {
    left_arm: [
        { id: 0, name: "Без татуировки" },
        { id: 1, name: "Племенная" },
        { id: 2, name: "Дракон" },
        { id: 3, name: "Роза" },
        { id: 4, name: "Череп" }
    ],
    right_arm: [
        { id: 0, name: "Без татуировки" },
        { id: 1, name: "Молния" },
        { id: 2, name: "Орел" },
        { id: 3, name: "Сердце" }
    ],
    torso: [
        { id: 0, name: "Без татуировки" },
        { id: 1, name: "Большой дракон" },
        { id: 2, name: "Волк" },
        { id: 3, name: "Крылья" }
    ],
    back: [
        { id: 0, name: "Без татуировки" },
        { id: 1, name: "Ангел" },
        { id: 2, name: "Крест" }
    ],
    left_leg: [
        { id: 0, name: "Без татуировки" },
        { id: 1, name: "Змея" },
        { id: 2, name: "Пламя" }
    ],
    right_leg: [
        { id: 0, name: "Без татуировки" },
        { id: 1, name: "Стрела" },
        { id: 2, name: "Волна" }
    ],
    head: [
        { id: 0, name: "Без татуировки" },
        { id: 1, name: "Лицевая" }
    ]
};

// Инициализация интерфейса
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeClothingControls();
    initializeAppearanceControls();
    initializeTattooControls();
    initializeAnimationControls();
    initializeMainButtons();
    createTattooSelectors(); // Создаем выпадающие списки для татуировок
    
    console.log('Character Menu UI initialized');
});

// Создание выпадающих списков для татуировок
function createTattooSelectors() {
    const tattooZones = document.querySelectorAll('.tattoo-zone');
    
    tattooZones.forEach(zone => {
        const zoneType = zone.querySelector('.tattoo-input').getAttribute('data-zone');
        const controls = zone.querySelector('.tattoo-controls');
        
        // Скрываем старые элементы
        const oldInputs = zone.querySelectorAll('.nav-btn, .tattoo-input, .tattoo-checkbox');
        oldInputs.forEach(el => el.style.display = 'none');
        
        // Создаем выпадающий список
        const select = document.createElement('select');
        select.className = 'tattoo-select';
        select.setAttribute('data-zone', zoneType);
        
        if (TATTOO_PRESETS[zoneType]) {
            TATTOO_PRESETS[zoneType].forEach(tattoo => {
                const option = document.createElement('option');
                option.value = tattoo.id;
                option.textContent = tattoo.name;
                select.appendChild(option);
            });
        }
        
        select.addEventListener('change', function() {
            const tattooId = parseInt(this.value);
            updateTattooPreview(zoneType, tattooId);
        });
        
        controls.appendChild(select);
    });
}

// Система табов
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Убираем активный класс со всех табов
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Добавляем активный класс к выбранному табу
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Инициализация контролов одежды
function initializeClothingControls() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const drawableInputs = document.querySelectorAll('.drawable-input');
    const textureInputs = document.querySelectorAll('.texture-input');
    
    // Обработка кнопок навигации
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const componentId = parseInt(this.getAttribute('data-component'));
            const action = this.getAttribute('data-action');
            const isProp = this.hasAttribute('data-prop');
            const zone = this.getAttribute('data-zone');
            
            if (this.closest('.clothes-controls')) {
                if (isProp) {
                    handlePropNavigation(componentId, action);
                } else {
                    handleClothingNavigation(componentId, action);
                }
            } else if (this.closest('.tattoo-controls')) {
                handleTattooNavigation(zone, action);
            }
        });
    });
    
    // Обработка изменений в полях ввода одежды
    drawableInputs.forEach(input => {
        input.addEventListener('input', function() {
            const componentId = parseInt(this.getAttribute('data-component'));
            const drawable = parseInt(this.value) || 0;
            const isProp = this.hasAttribute('data-prop');
            
            if (isProp) {
                updatePropPreview(componentId, drawable, null);
            } else {
                updateClothingPreview(componentId, drawable, null);
            }
        });
    });
    
    textureInputs.forEach(input => {
        input.addEventListener('input', function() {
            const componentId = parseInt(this.getAttribute('data-component'));
            const texture = parseInt(this.value) || 0;
            const isProp = this.hasAttribute('data-prop');
            
            if (isProp) {
                updatePropPreview(componentId, null, texture);
            } else {
                updateClothingPreview(componentId, null, texture);
            }
        });
    });
}

// Обработка навигации по одежде с ограничениями
function handleClothingNavigation(componentId, action) {
    if (!currentClothingValues[componentId]) {
        currentClothingValues[componentId] = { drawable: 0, texture: 0 };
    }
    
    const currentDrawable = currentClothingValues[componentId].drawable;
    const maxDrawable = MAX_VALUES.clothes[componentId] || 50;
    let newDrawable = currentDrawable;
    
    if (action === 'prev') {
        newDrawable = Math.max(0, currentDrawable - 1);
    } else if (action === 'next') {
        newDrawable = Math.min(maxDrawable, currentDrawable + 1);
    }
    
    currentClothingValues[componentId].drawable = newDrawable;
    
    // Обновляем поле ввода
    const drawableInput = document.querySelector(`.drawable-input[data-component="${componentId}"]:not([data-prop])`);
    if (drawableInput) {
        drawableInput.value = newDrawable;
    }
    
    updateClothingPreview(componentId, newDrawable, null);
}

// Обработка навигации по props (очки и головные уборы)
function handlePropNavigation(componentId, action) {
    if (!currentPropValues[componentId]) {
        currentPropValues[componentId] = { drawable: 0, texture: 0 };
    }
    
    const currentDrawable = currentPropValues[componentId].drawable;
    const maxDrawable = MAX_VALUES.props[componentId] || 30;
    let newDrawable = currentDrawable;
    
    if (action === 'prev') {
        newDrawable = Math.max(0, currentDrawable - 1);
    } else if (action === 'next') {
        newDrawable = Math.min(maxDrawable, currentDrawable + 1);
    }
    
    currentPropValues[componentId].drawable = newDrawable;
    
    // Обновляем поле ввода
    const drawableInput = document.querySelector(`.drawable-input[data-component="${componentId}"][data-prop]`);
    if (drawableInput) {
        drawableInput.value = newDrawable;
    }
    
    updatePropPreview(componentId, newDrawable, null);
}

// Обновление превью одежды
function updateClothingPreview(componentId, drawable, texture) {
    if (!currentClothingValues[componentId]) {
        currentClothingValues[componentId] = { drawable: 0, texture: 0 };
    }
    
    if (drawable !== null) {
        currentClothingValues[componentId].drawable = drawable;
    }
    if (texture !== null) {
        currentClothingValues[componentId].texture = texture;
    }
    
    const clothingData = {
        componentId: componentId,
        drawable: currentClothingValues[componentId].drawable,
        texture: currentClothingValues[componentId].texture
    };
    
    // Отправляем данные клиенту RageMP
    if (typeof mp !== 'undefined') {
        mp.trigger('menu:previewClothes', JSON.stringify(clothingData));
    }
    
    console.log('Clothing preview updated:', clothingData);
}

// Обновление превью props (очки и головные уборы)
function updatePropPreview(componentId, drawable, texture) {
    if (!currentPropValues[componentId]) {
        currentPropValues[componentId] = { drawable: 0, texture: 0 };
    }
    
    if (drawable !== null) {
        currentPropValues[componentId].drawable = drawable;
    }
    if (texture !== null) {
        currentPropValues[componentId].texture = texture;
    }
    
    const propData = {
        componentId: componentId,
        drawable: currentPropValues[componentId].drawable,
        texture: currentPropValues[componentId].texture
    };
    
    // Отправляем данные клиенту RageMP
    if (typeof mp !== 'undefined') {
        mp.trigger('menu:previewProp', JSON.stringify(propData));
    }
    
    console.log('Prop preview updated:', propData);
}

// Инициализация контролов внешности
function initializeAppearanceControls() {
    const hairSlider = document.getElementById('hairSlider');
    const hairValue = document.getElementById('hairValue');
    const skinColorSlider = document.getElementById('skinColorSlider');
    const skinColorValue = document.getElementById('skinColorValue');
    const genderButtons = document.querySelectorAll('.gender-btn');
    
    // Слайдер волос
    if (hairSlider) {
        hairSlider.addEventListener('input', function() {
            const hairStyle = parseInt(this.value);
            hairValue.textContent = hairStyle;
            currentCharacterData.hairStyle = hairStyle;
            
            // Отправляем данные клиенту RageMP
            if (typeof mp !== 'undefined') {
                mp.trigger('menu:previewHair', hairStyle);
            }
            
            console.log('Hair style changed:', hairStyle);
        });
    }
    
    // Слайдер цвета кожи
    if (skinColorSlider) {
        skinColorSlider.addEventListener('input', function() {
            const skinColor = parseInt(this.value);
            skinColorValue.textContent = skinColor;
            currentCharacterData.skinColor = skinColor;
            
            // Отправляем данные клиенту RageMP
            if (typeof mp !== 'undefined') {
                mp.trigger('menu:previewSkinColor', skinColor);
            }
            
            console.log('Skin color changed:', skinColor);
        });
    }
    
    // Кнопки смены пола
    genderButtons.forEach(button => {
        button.addEventListener('click', function() {
            const gender = this.getAttribute('data-gender');
            
            // Убираем активный класс со всех кнопок
            genderButtons.forEach(btn => btn.classList.remove('active'));
            // Добавляем активный класс к выбранной кнопке
            this.classList.add('active');
            
            currentCharacterData.gender = gender;
            
            // Отправляем данные клиенту RageMP
            if (typeof mp !== 'undefined') {
                mp.trigger('menu:previewGender', gender);
            }
            
            console.log('Gender changed:', gender);
        });
    });
}

// Инициализация контролов татуировок
function initializeTattooControls() {
    const tattooInputs = document.querySelectorAll('.tattoo-input');
    const tattooTextures = document.querySelectorAll('.tattoo-texture');
    
    // Обработка изменений в полях ввода татуировок
    tattooInputs.forEach(input => {
        input.addEventListener('input', function() {
            const zone = this.getAttribute('data-zone');
            const tattooId = parseInt(this.value) || 0;
            
            updateTattooPreview(zone, tattooId, null);
        });
    });
    
    // Обработка изменений в полях текстуры татуировок
    tattooTextures.forEach(input => {
        input.addEventListener('input', function() {
            const zone = this.getAttribute('data-zone');
            const texture = parseInt(this.value) || 0;
            
            updateTattooPreview(zone, null, texture);
        });
    });
}

// Обработка навигации по татуировкам
function handleTattooNavigation(zone, action) {
    if (!currentTattooValues[zone]) {
        currentTattooValues[zone] = { tattooId: 0, texture: 0 };
    }
    
    const currentTattooId = currentTattooValues[zone].tattooId;
    const maxTattooId = MAX_VALUES.tattoos[zone] || 20;
    let newTattooId = currentTattooId;
    
    if (action === 'prev') {
        newTattooId = Math.max(0, currentTattooId - 1);
    } else if (action === 'next') {
        newTattooId = Math.min(maxTattooId, currentTattooId + 1);
    }
    
    currentTattooValues[zone].tattooId = newTattooId;
    
    // Обновляем поле ввода
    const tattooInput = document.querySelector(`.tattoo-input[data-zone="${zone}"]`);
    if (tattooInput) {
        tattooInput.value = newTattooId;
    }
    
    updateTattooPreview(zone, newTattooId, null);
}

// Обновление превью татуировки
function updateTattooPreview(zone, tattooId, texture) {
    if (!currentTattooValues[zone]) {
        currentTattooValues[zone] = { tattooId: 0, texture: 0 };
    }
    
    if (tattooId !== null) {
        currentTattooValues[zone].tattooId = tattooId;
    }
    if (texture !== null) {
        currentTattooValues[zone].texture = texture;
    }
    
    const data = {
        zone: zone,
        tattooId: currentTattooValues[zone].tattooId,
        texture: currentTattooValues[zone].texture
    };
    
    // Отправляем данные клиенту RageMP
    if (typeof mp !== 'undefined') {
        mp.trigger('menu:previewTattoo', JSON.stringify(data));
    }
    
    console.log('Tattoo preview updated:', data);
}

// Инициализация контролов анимаций
function initializeAnimationControls() {
    const animButtons = document.querySelectorAll('.anim-btn');
    const stopAnimButton = document.querySelector('.stop-anim-btn');
    
    // Кнопки анимаций
    animButtons.forEach(button => {
        button.addEventListener('click', function() {
            const dict = this.getAttribute('data-dict');
            const name = this.getAttribute('data-name');
            
            const animationData = { dict: dict, name: name };
            currentCharacterData.animation = animationData;
            
            // Отправляем данные клиенту RageMP
            if (typeof mp !== 'undefined') {
                mp.trigger('menu:playAnim', JSON.stringify(animationData));
            }
            
            console.log('Animation played:', animationData);
            
            // Визуальная обратная связь
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);
        });
    });
    
    // Кнопка остановки анимации
    if (stopAnimButton) {
        stopAnimButton.addEventListener('click', function() {
            currentCharacterData.animation = null;
            
            // Отправляем данные клиенту RageMP
            if (typeof mp !== 'undefined') {
                mp.trigger('menu:stopAnim');
            }
            
            console.log('Animation stopped');
            
            // Визуальная обратная связь
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    }
}

// Инициализация основных кнопок
function initializeMainButtons() {
    const saveButton = document.getElementById('saveBtn');
    const cancelButton = document.getElementById('cancelBtn');
    const closeButton = document.getElementById('closeBtn');
    
    // Кнопка сохранения
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            saveCharacterData();
        });
    }
    
    // Кнопка отмены
    if (cancelButton) {
        cancelButton.addEventListener('click', function() {
            cancelChanges();
        });
    }
    
    // Кнопка закрытия
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            cancelChanges();
        });
    }
}

// Сохранение данных персонажа
function saveCharacterData() {
    // Собираем данные одежды
    const clothesArray = [];
    for (const componentId in currentClothingValues) {
        const clothing = currentClothingValues[componentId];
        if (clothing.drawable > 0 || clothing.texture > 0) {
            clothesArray.push({
                componentId: parseInt(componentId),
                drawable: clothing.drawable,
                texture: clothing.texture
            });
        }
    }
    
    // Собираем данные props (очки и головные уборы)
    const propsArray = [];
    for (const componentId in currentPropValues) {
        const prop = currentPropValues[componentId];
        if (prop.drawable > 0 || prop.texture > 0) {
            propsArray.push({
                componentId: parseInt(componentId),
                drawable: prop.drawable,
                texture: prop.texture
            });
        }
    }
    
    // Собираем данные татуировок
    const tattoosArray = [];
    for (const zone in currentTattooValues) {
        const tattoo = currentTattooValues[zone];
        if (tattoo.tattooId > 0) {
            tattoosArray.push({
                zone: zone,
                tattooId: tattoo.tattooId,
                texture: tattoo.texture || 0
            });
        }
    }
    
    // Формируем финальные данные
    const finalData = {
        gender: currentCharacterData.gender,
        skinColor: currentCharacterData.skinColor,
        hairStyle: currentCharacterData.hairStyle,
        clothes: clothesArray,
        props: propsArray,
        tattoos: tattoosArray,
        animation: currentCharacterData.animation
    };
    
    console.log('Saving character data:', finalData);
    
    // Отправляем данные клиенту RageMP
    if (typeof mp !== 'undefined') {
        mp.trigger('menu:save', JSON.stringify(finalData));
    }
    
    // Визуальная обратная связь
    const saveBtn = document.getElementById('saveBtn');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = 'Сохранено!';
    saveBtn.style.background = '#4CAF50';
    
    setTimeout(() => {
        saveBtn.textContent = originalText;
    }, 2000);
}

// Отмена изменений
function cancelChanges() {
    console.log('Cancelling changes');
    
    // Отправляем команду отмены клиенту RageMP
    if (typeof mp !== 'undefined') {
        mp.trigger('menu:cancel');
    }
}

// Функции для внешнего вызова из RageMP клиента
window.resetToDefaults = function() {
    currentCharacterData = {
        gender: 'mp_m_freemode_01',
        skinColor: 0,
        hairStyle: 0,
        clothes: [],
        props: [],
        tattoos: [],
        animation: null
    };
    
    currentClothingValues = {};
    currentPropValues = {};
    currentTattooValues = {};
    
    // Сбрасываем значения в UI
    document.getElementById('hairSlider').value = 0;
    document.getElementById('hairValue').textContent = '0';
    document.getElementById('skinColorSlider').value = 0;
    document.getElementById('skinColorValue').textContent = '0';
    
    // Сбрасываем все поля ввода
    document.querySelectorAll('.drawable-input, .texture-input, .tattoo-input, .tattoo-texture').forEach(input => {
        input.value = '';
    });
    
    // Сбрасываем кнопки пола
    document.querySelectorAll('.gender-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    console.log('UI reset to defaults');
};

window.loadCharacterData = function(data) {
    try {
        const characterData = typeof data === 'string' ? JSON.parse(data) : data;
        
        // Загружаем основные данные
        currentCharacterData = { ...characterData };
        
        // Обновляем UI
        if (characterData.skinColor !== undefined) {
            document.getElementById('skinColorSlider').value = characterData.skinColor;
            document.getElementById('skinColorValue').textContent = characterData.skinColor;
        }
        
        // Загружаем одежду
        if (characterData.clothes && Array.isArray(characterData.clothes)) {
            characterData.clothes.forEach(item => {
                currentClothingValues[item.componentId] = {
                    drawable: item.drawable,
                    texture: item.texture
                };
                
                // Обновляем поля ввода
                const drawableInput = document.querySelector(`.drawable-input[data-component="${item.componentId}"]`);
                const textureInput = document.querySelector(`.texture-input[data-component="${item.componentId}"]`);
                
                if (drawableInput) drawableInput.value = item.drawable;
                if (textureInput) textureInput.value = item.texture;
            });
        }
        
        // Загружаем татуировки
        if (characterData.tattoos && Array.isArray(characterData.tattoos)) {
            characterData.tattoos.forEach(tattoo => {
                currentTattooValues[tattoo.zone] = {
                    tattooId: tattoo.tattooId,
                    enabled: true
                };
                
                // Обновляем поля ввода
                const tattooInput = document.querySelector(`.tattoo-input[data-zone="${tattoo.zone}"]`);
                const tattooCheckbox = document.querySelector(`.tattoo-checkbox[data-zone="${tattoo.zone}"]`);
                
                if (tattooInput) tattooInput.value = tattoo.tattooId;
                if (tattooCheckbox) tattooCheckbox.checked = true;
            });
        }
        
        console.log('Character data loaded:', characterData);
        
    } catch (error) {
        console.error('Error loading character data:', error);
    }
};

// Обработка клавиш
document.addEventListener('keydown', function(event) {
    // ESC - закрыть меню
    if (event.key === 'Escape') {
        cancelChanges();
    }
    
    // Enter - сохранить
    if (event.key === 'Enter' && event.ctrlKey) {
        saveCharacterData();
    }
});

console.log('Character Menu UI Script loaded successfully!'); 