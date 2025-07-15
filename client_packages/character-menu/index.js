let characterMenuBrowser = null;
let isMenuOpen = false;
let originalAppearance = null;

const saveOriginalAppearance = () => {
    try {
        const player = mp.players.local;
        originalAppearance = {
            model: player.model,
            skinColor: 0, 
            clothes: [],
            tattoos: []
        };

        
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


const restoreOriginalAppearance = () => {
    if (!originalAppearance) return;

    try {
        const player = mp.players.local;
        
        
        if (originalAppearance.model) {
            player.model = originalAppearance.model;
        }

        
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

        
        if (originalAppearance.skinColor !== undefined) {
            player.setHeadOverlay(1, originalAppearance.skinColor, 0, 0);
        }

        
        player.clearDecorations();

        mp.console.logInfo('Original appearance restored');
    } catch (error) {
        mp.console.logError('Error restoring original appearance:', error);
    }
};


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


mp.events.add('charMenu:show', () => {
    try {
        if (isMenuOpen) {
            mp.console.logInfo('Character menu is already open');
            return;
        }

        
        saveOriginalAppearance();

        
        characterMenuBrowser = mp.browsers.new('package://character-menu-ui/index.html');
        mp.gui.cursor.show(true, true);
        isMenuOpen = true;

        mp.console.logInfo('Character menu opened');

    } catch (error) {
        mp.console.logError('Error opening character menu:', error);
    }
});


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
        
        
        player.setComponentVariation(2, hairStyle, 0, 0);
        
        mp.console.logInfo(`Hair style preview: ${hairStyle}`);
        
    } catch (error) {
        mp.console.logError('Error previewing hair style:', error);
    }
});

mp.events.add('menu:previewSkinColor', (skinColor) => {
    try {
        const player = mp.players.local;
        
        
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
        
       
        const tattooHash = mp.joaat('mpbeach_overlays'); 
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
        
        
        mp.game.streaming.requestAnimDict(animationData.dict);
        
        
        const checkAnimDict = setInterval(() => {
            if (mp.game.streaming.hasAnimDictLoaded(animationData.dict)) {
                clearInterval(checkAnimDict);
                
                player.taskPlayAnim(
                    animationData.dict,
                    animationData.name,
                    8.0,  
                    8.0,  
                    -1,   
                    1,    
                    0.0,  
                    false, 
                    false, 
                    false  
                );
                
                mp.console.logInfo(`Animation played: ${animationData.dict} - ${animationData.name}`);
            }
        }, 100);
        
        
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
        
        
        mp.events.callRemote('charMenu:save', characterData);
        
        
        closeCharacterMenu();
        
        mp.console.logInfo('Character data saved and sent to server');
        
    } catch (error) {
        mp.console.logError('Error saving character data:', error);
    }
});

mp.events.add('menu:cancel', () => {
    try {
        
        restoreOriginalAppearance();
        
        
        closeCharacterMenu();
        
        mp.console.logInfo('Character menu cancelled, appearance restored');
        
    } catch (error) {
        mp.console.logError('Error cancelling character menu:', error);
    }
});


mp.keys.bind(0x1B, false, () => { 
    if (isMenuOpen) {
        mp.events.call('menu:cancel');
    }
});




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


const resetToDefaultClothing = () => {
    const player = mp.players.local;
    
    
    for (let i = 0; i < 12; i++) {
        player.setComponentVariation(i, 0, 0, 0);
    }
    
    
    player.clearDecorations();
    
    mp.console.logInfo('Clothing reset to default');
};


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


mp.events.add('playerQuit', () => {
    if (characterMenuBrowser) {
        characterMenuBrowser.destroy();
        characterMenuBrowser = null;
    }
});


mp.events.add('playerSpawn', () => {
    
    isMenuOpen = false;
    originalAppearance = null;
    
    if (characterMenuBrowser) {
        characterMenuBrowser.destroy();
        characterMenuBrowser = null;
    }
    
    mp.gui.cursor.show(false, false);
});


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
