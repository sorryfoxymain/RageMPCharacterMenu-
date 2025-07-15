
let currentCharacterData = {
    gender: 'mp_m_freemode_01',
    skinColor: 0,
    hairStyle: 0,
    clothes: [],
    props: [], 
    tattoos: [],
    animation: null
};

let currentClothingValues = {};
let currentPropValues = {}; 
let currentTattooValues = {};


const MAX_VALUES = {
    clothes: {
        1: 50,   
        4: 150,  
        6: 100,  
        7: 50,   
        8: 200,  
        11: 350  
    },
    props: {
        0: 150,  
        1: 50    
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


document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeClothingControls();
    initializeAppearanceControls();
    initializeTattooControls();
    initializeAnimationControls();
    initializeMainButtons();
    createTattooSelectors(); 
    
    console.log('Character Menu UI initialized');
});


function createTattooSelectors() {
    const tattooZones = document.querySelectorAll('.tattoo-zone');
    
    tattooZones.forEach(zone => {
        const zoneType = zone.querySelector('.tattoo-input').getAttribute('data-zone');
        const controls = zone.querySelector('.tattoo-controls');
        
       
        const oldInputs = zone.querySelectorAll('.nav-btn, .tattoo-input, .tattoo-checkbox');
        oldInputs.forEach(el => el.style.display = 'none');
        
       
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


function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
       
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}


function initializeClothingControls() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const drawableInputs = document.querySelectorAll('.drawable-input');
    const textureInputs = document.querySelectorAll('.texture-input');
    
    
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
    
    
    const drawableInput = document.querySelector(`.drawable-input[data-component="${componentId}"]:not([data-prop])`);
    if (drawableInput) {
        drawableInput.value = newDrawable;
    }
    
    updateClothingPreview(componentId, newDrawable, null);
}


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
    
    
    const drawableInput = document.querySelector(`.drawable-input[data-component="${componentId}"][data-prop]`);
    if (drawableInput) {
        drawableInput.value = newDrawable;
    }
    
    updatePropPreview(componentId, newDrawable, null);
}


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
    
    
    if (typeof mp !== 'undefined') {
        mp.trigger('menu:previewClothes', JSON.stringify(clothingData));
    }
    
    console.log('Clothing preview updated:', clothingData);
}


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
    
    
    if (typeof mp !== 'undefined') {
        mp.trigger('menu:previewProp', JSON.stringify(propData));
    }
    
    console.log('Prop preview updated:', propData);
}


function initializeAppearanceControls() {
    const hairSlider = document.getElementById('hairSlider');
    const hairValue = document.getElementById('hairValue');
    const skinColorSlider = document.getElementById('skinColorSlider');
    const skinColorValue = document.getElementById('skinColorValue');
    const genderButtons = document.querySelectorAll('.gender-btn');
    
    
    if (hairSlider) {
        hairSlider.addEventListener('input', function() {
            const hairStyle = parseInt(this.value);
            hairValue.textContent = hairStyle;
            currentCharacterData.hairStyle = hairStyle;
            
            
            if (typeof mp !== 'undefined') {
                mp.trigger('menu:previewHair', hairStyle);
            }
            
            console.log('Hair style changed:', hairStyle);
        });
    }
    
    
    if (skinColorSlider) {
        skinColorSlider.addEventListener('input', function() {
            const skinColor = parseInt(this.value);
            skinColorValue.textContent = skinColor;
            currentCharacterData.skinColor = skinColor;
            
            
            if (typeof mp !== 'undefined') {
                mp.trigger('menu:previewSkinColor', skinColor);
            }
            
            console.log('Skin color changed:', skinColor);
        });
    }
    
    
    genderButtons.forEach(button => {
        button.addEventListener('click', function() {
            const gender = this.getAttribute('data-gender');
            
            
            genderButtons.forEach(btn => btn.classList.remove('active'));
            
            this.classList.add('active');
            
            currentCharacterData.gender = gender;
            
            
            if (typeof mp !== 'undefined') {
                mp.trigger('menu:previewGender', gender);
            }
            
            console.log('Gender changed:', gender);
        });
    });
}


function initializeTattooControls() {
    const tattooInputs = document.querySelectorAll('.tattoo-input');
    const tattooTextures = document.querySelectorAll('.tattoo-texture');
    
    
    tattooInputs.forEach(input => {
        input.addEventListener('input', function() {
            const zone = this.getAttribute('data-zone');
            const tattooId = parseInt(this.value) || 0;
            
            updateTattooPreview(zone, tattooId, null);
        });
    });
    
    
    tattooTextures.forEach(input => {
        input.addEventListener('input', function() {
            const zone = this.getAttribute('data-zone');
            const texture = parseInt(this.value) || 0;
            
            updateTattooPreview(zone, null, texture);
        });
    });
}


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
    
    
    const tattooInput = document.querySelector(`.tattoo-input[data-zone="${zone}"]`);
    if (tattooInput) {
        tattooInput.value = newTattooId;
    }
    
    updateTattooPreview(zone, newTattooId, null);
}


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
    
    
    if (typeof mp !== 'undefined') {
        mp.trigger('menu:previewTattoo', JSON.stringify(data));
    }
    
    console.log('Tattoo preview updated:', data);
}


function initializeAnimationControls() {
    const animButtons = document.querySelectorAll('.anim-btn');
    const stopAnimButton = document.querySelector('.stop-anim-btn');
    
    
    animButtons.forEach(button => {
        button.addEventListener('click', function() {
            const dict = this.getAttribute('data-dict');
            const name = this.getAttribute('data-name');
            
            const animationData = { dict: dict, name: name };
            currentCharacterData.animation = animationData;
            
            
            if (typeof mp !== 'undefined') {
                mp.trigger('menu:playAnim', JSON.stringify(animationData));
            }
            
            console.log('Animation played:', animationData);
            
            
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);
        });
    });
    
    
    if (stopAnimButton) {
        stopAnimButton.addEventListener('click', function() {
            currentCharacterData.animation = null;
            
            
            if (typeof mp !== 'undefined') {
                mp.trigger('menu:stopAnim');
            }
            
            console.log('Animation stopped');
            
            
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    }
}


function initializeMainButtons() {
    const saveButton = document.getElementById('saveBtn');
    const cancelButton = document.getElementById('cancelBtn');
    const closeButton = document.getElementById('closeBtn');
    
    
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            saveCharacterData();
        });
    }
    
    
    if (cancelButton) {
        cancelButton.addEventListener('click', function() {
            cancelChanges();
        });
    }
    
    
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            cancelChanges();
        });
    }
}


function saveCharacterData() {
    
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
    
    
    if (typeof mp !== 'undefined') {
        mp.trigger('menu:save', JSON.stringify(finalData));
    }
    
    
    const saveBtn = document.getElementById('saveBtn');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = 'Сохранено!';
    saveBtn.style.background = '#4CAF50';
    
    setTimeout(() => {
        saveBtn.textContent = originalText;
    }, 2000);
}


function cancelChanges() {
    console.log('Cancelling changes');
    
    
    if (typeof mp !== 'undefined') {
        mp.trigger('menu:cancel');
    }
}


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
    
    
    document.getElementById('hairSlider').value = 0;
    document.getElementById('hairValue').textContent = '0';
    document.getElementById('skinColorSlider').value = 0;
    document.getElementById('skinColorValue').textContent = '0';
    
    
    document.querySelectorAll('.drawable-input, .texture-input, .tattoo-input, .tattoo-texture').forEach(input => {
        input.value = '';
    });
    
    
    document.querySelectorAll('.gender-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    console.log('UI reset to defaults');
};

window.loadCharacterData = function(data) {
    try {
        const characterData = typeof data === 'string' ? JSON.parse(data) : data;
        
       
        currentCharacterData = { ...characterData };
        
        
        if (characterData.skinColor !== undefined) {
            document.getElementById('skinColorSlider').value = characterData.skinColor;
            document.getElementById('skinColorValue').textContent = characterData.skinColor;
        }
        
        
        if (characterData.clothes && Array.isArray(characterData.clothes)) {
            characterData.clothes.forEach(item => {
                currentClothingValues[item.componentId] = {
                    drawable: item.drawable,
                    texture: item.texture
                };
                
                
                const drawableInput = document.querySelector(`.drawable-input[data-component="${item.componentId}"]`);
                const textureInput = document.querySelector(`.texture-input[data-component="${item.componentId}"]`);
                
                if (drawableInput) drawableInput.value = item.drawable;
                if (textureInput) textureInput.value = item.texture;
            });
        }
        
        
        if (characterData.tattoos && Array.isArray(characterData.tattoos)) {
            characterData.tattoos.forEach(tattoo => {
                currentTattooValues[tattoo.zone] = {
                    tattooId: tattoo.tattooId,
                    enabled: true
                };
                
                
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


document.addEventListener('keydown', function(event) {
    
    if (event.key === 'Escape') {
        cancelChanges();
    }
    
    
    if (event.key === 'Enter' && event.ctrlKey) {
        saveCharacterData();
    }
});

console.log('Character Menu UI Script loaded successfully!'); 
