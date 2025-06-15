// Character Menu Client-side
let characterMenuBrowser = null;
let isMenuOpen = false;
let originalAppearance = null;

// Структура для сохранения оригинальной внешности
const saveOriginalAppearance = () => {
    try {
        const player = mp.players.local;
        originalAppearance = {
            model: player.model,
            skinColor: 0, // Будет получен через API
            clothes: [],
            tattoos: []
        };

        // Сохраняем текущую одежду
        for (let i = 0; i < 12; i++) {
            const drawable = player.getDrawableVariation(i);
            const texture = player.getTextureVariation(i);
            
            if (drawable > 0) {
                originalAppearance.clothes.push({
                    componentId: i,
                    drawable: drawable,
                    texture: texture
                });
            }
        }

        mp.console.logInfo('Original appearance saved');
    } catch (error) {
        mp.console.logError('Error saving original appearance:', error);
    }
};

// Восстановление оригинальной внешности
const restoreOriginalAppearance = () => {
    if (!originalAppearance) return;

    try {
        const player = mp.players.local;
        
        // Восстанавливаем модель
        if (originalAppearance.model) {
            player.model = originalAppearance.model;
        }

        // Восстанавливаем одежду
        if (originalAppearance.clothes) {
            originalAppearance.clothes.forEach(clothing => {
                player.setComponentVariation(
                    clothing.componentId,
                    clothing.drawable,
                    clothing.texture,
                    0
                );
            });
        }

        // Восстанавливаем цвет кожи
        if (originalAppearance.skinColor !== undefined) {
            player.setHeadOverlay(1, originalAppearance.skinColor, 0, 0);
        }

        // Очищаем декорации (татуировки)
        player.clearDecorations();

        mp.console.logInfo('Original appearance restored');
    } catch (error) {
        mp.console.logError('Error restoring original appearance:', error);
    }
};

// Функция закрытия меню
const closeCharacterMenu = () => {
    if (characterMenuBrowser) {
        characterMenuBrowser.destroy();
        characterMenuBrowser = null;
    }
    
    mp.gui.cursor.show(false, false);
    isMenuOpen = false;
    originalAppearance = null;
    
    mp.console.logInfo('Character menu closed');
};

// Обработчик показа меню персонажа
mp.events.add('charMenu:show', () => {
    try {
        if (isMenuOpen) {
            mp.console.logInfo('Character menu is already open');
            return;
        }

        // Сохраняем оригинальную внешность
        saveOriginalAppearance();

        // Создаем браузер
        characterMenuBrowser = mp.browsers.new('package://character-menu-ui/index.html');
        mp.gui.cursor.show(true, true);
        isMenuOpen = true;

        mp.console.logInfo('Character menu opened');

    } catch (error) {
        mp.console.logError('Error opening character menu:', error);
    }
});

// Обработчики событий от UI
mp.events.add('menu:previewClothes', (clothingDataJson) => {
    try {
        const clothingData = JSON.parse(clothingDataJson);
        const player = mp.players.local;
        
        player.setComponentVariation(
            clothingData.componentId,
            clothingData.drawable,
            clothingData.texture,
            0
        );
        
        mp.console.logInfo(`Clothing preview: Component ${clothingData.componentId}, Drawable ${clothingData.drawable}, Texture ${clothingData.texture}`);
        
    } catch (error) {
        mp.console.logError('Error previewing clothes:', error);
    }
});

mp.events.add('menu:previewHair', (hairStyle) => {
    try {
        const player = mp.players.local;
        
        // Применяем прическу
        player.setComponentVariation(2, hairStyle, 0, 0);
        
        mp.console.logInfo(`Hair style preview: ${hairStyle}`);
        
    } catch (error) {
        mp.console.logError('Error previewing hair style:', error);
    }
});

mp.events.add('menu:previewSkinColor', (skinColor) => {
    try {
        const player = mp.players.local;
        
        // Применяем цвет кожи через head overlay (skin tone)
        player.setHeadOverlay(10, skinColor, 1.0, 0, 0);
        
        mp.console.logInfo(`Skin color preview: ${skinColor}`);
        
    } catch (error) {
        mp.console.logError('Error previewing skin color:', error);
    }
});

mp.events.add('menu:previewProp', (propDataJson) => {
    try {
        const propData = JSON.parse(propDataJson);
        const player = mp.players.local;
        
        // Применяем prop (очки, шапки как аксессуары)
        player.setPropIndex(
            propData.componentId,
            propData.drawable,
            propData.texture,
            true
        );
        
        mp.console.logInfo(`Prop preview: Component ${propData.componentId}, Drawable ${propData.drawable}, Texture ${propData.texture}`);
        
    } catch (error) {
        mp.console.logError('Error previewing prop:', error);
    }
});

mp.events.add('menu:previewGender', (gender) => {
    try {
        // Отправляем запрос на сервер для смены пола
        mp.events.callRemote('charMenu:changeGender', gender);
        
        mp.console.logInfo(`Gender preview: ${gender}`);
        
    } catch (error) {
        mp.console.logError('Error previewing gender:', error);
    }
});

mp.events.add('menu:previewTattoo', (tattooDataJson) => {
    try {
        const tattooData = JSON.parse(tattooDataJson);
        const player = mp.players.local;
        
        // Простая реализация татуировок через декорации
        // В реальном проекте здесь должны быть правильные хеши коллекций
        const tattooHash = mp.joaat('mpbeach_overlays'); // Пример коллекции
        player.setDecoration(tattooHash, tattooData.tattooId);
        
        mp.console.logInfo(`Tattoo preview: Zone ${tattooData.zone}, ID ${tattooData.tattooId}`);
        
    } catch (error) {
        mp.console.logError('Error previewing tattoo:', error);
    }
});

mp.events.add('menu:playAnim', (animationDataJson) => {
    try {
        const animationData = JSON.parse(animationDataJson);
        const player = mp.players.local;
        
        // Загружаем словарь анимаций, если нужно
        mp.game.streaming.requestAnimDict(animationData.dict);
        
        // Ждем загрузки и проигрываем анимацию
        const checkAnimDict = setInterval(() => {
            if (mp.game.streaming.hasAnimDictLoaded(animationData.dict)) {
                clearInterval(checkAnimDict);
                
                player.taskPlayAnim(
                    animationData.dict,
                    animationData.name,
                    8.0,  // blendInSpeed
                    8.0,  // blendOutSpeed
                    -1,   // duration (-1 = infinite)
                    1,    // flag
                    0.0,  // playbackRate
                    false, // lockX
                    false, // lockY
                    false  // lockZ
                );
                
                mp.console.logInfo(`Animation played: ${animationData.dict} - ${animationData.name}`);
            }
        }, 100);
        
        // Очищаем интервал через 5 секунд, если анимация не загрузилась
        setTimeout(() => {
            clearInterval(checkAnimDict);
        }, 5000);
        
    } catch (error) {
        mp.console.logError('Error playing animation:', error);
    }
});

mp.events.add('menu:stopAnim', () => {
    try {
        const player = mp.players.local;
        player.clearTasks();
        
        mp.console.logInfo('Animation stopped');
        
    } catch (error) {
        mp.console.logError('Error stopping animation:', error);
    }
});

mp.events.add('menu:save', (characterDataJson) => {
    try {
        const characterData = JSON.parse(characterDataJson);
        
        // Отправляем данные на сервер
        mp.events.callRemote('charMenu:save', characterData);
        
        // Закрываем меню
        closeCharacterMenu();
        
        mp.console.logInfo('Character data saved and sent to server');
        
    } catch (error) {
        mp.console.logError('Error saving character data:', error);
    }
});

mp.events.add('menu:cancel', () => {
    try {
        // Восстанавливаем оригинальную внешность
        restoreOriginalAppearance();
        
        // Закрываем меню
        closeCharacterMenu();
        
        mp.console.logInfo('Character menu cancelled, appearance restored');
        
    } catch (error) {
        mp.console.logError('Error cancelling character menu:', error);
    }
});

// Обработчик для закрытия меню при нажатии ESC
mp.keys.bind(0x1B, false, () => { // 0x1B = ESC key
    if (isMenuOpen) {
        mp.events.call('menu:cancel');
    }
});

// Дополнительные утилиты для работы с внешностью

// Функция получения текущей одежды
const getCurrentClothing = () => {
    const player = mp.players.local;
    const clothing = [];
    
    for (let i = 0; i < 12; i++) {
        const drawable = player.getDrawableVariation(i);
        const texture = player.getTextureVariation(i);
        
        if (drawable > 0) {
            clothing.push({
                componentId: i,
                drawable: drawable,
                texture: texture
            });
        }
    }
    
    return clothing;
};

// Функция применения одежды по массиву
const applyClothingArray = (clothingArray) => {
    const player = mp.players.local;
    
    clothingArray.forEach(clothing => {
        player.setComponentVariation(
            clothing.componentId,
            clothing.drawable,
            clothing.texture,
            0
        );
    });
};

// Функция сброса одежды к дефолту
const resetToDefaultClothing = () => {
    const player = mp.players.local;
    
    // Сбрасываем все компоненты одежды к значениям по умолчанию
    for (let i = 0; i < 12; i++) {
        player.setComponentVariation(i, 0, 0, 0);
    }
    
    // Очищаем все декорации
    player.clearDecorations();
    
    mp.console.logInfo('Clothing reset to default');
};

// События для внешнего использования (если нужно)
mp.events.add('charMenu:loadData', (characterDataJson) => {
    if (characterMenuBrowser && isMenuOpen) {
        characterMenuBrowser.execute(`loadCharacterData('${characterDataJson}')`);
    }
});

mp.events.add('charMenu:resetUI', () => {
    if (characterMenuBrowser && isMenuOpen) {
        characterMenuBrowser.execute('resetToDefaults()');
    }
});

// Обработчик уничтожения браузера при выходе
mp.events.add('playerQuit', () => {
    if (characterMenuBrowser) {
        characterMenuBrowser.destroy();
        characterMenuBrowser = null;
    }
});

// Обработка spawn/respawn игрока
mp.events.add('playerSpawn', () => {
    // Сбрасываем состояние меню при респавне
    isMenuOpen = false;
    originalAppearance = null;
    
    if (characterMenuBrowser) {
        characterMenuBrowser.destroy();
        characterMenuBrowser = null;
    }
    
    mp.gui.cursor.show(false, false);
});

// Экспорт функций для использования в других скриптах
mp.characterMenu = {
    isOpen: () => isMenuOpen,
    close: closeCharacterMenu,
    getCurrentClothing: getCurrentClothing,
    applyClothingArray: applyClothingArray,
    resetToDefault: resetToDefaultClothing,
    saveOriginalAppearance: saveOriginalAppearance,
    restoreOriginalAppearance: restoreOriginalAppearance
};

mp.console.logInfo('Character Menu Client system loaded successfully!'); 