// Character Menu Server-side
mp.events.add('playerCommand', (player, command) => {
    const args = command.split(' ');
    const cmd = args[0].toLowerCase();
    
    switch (cmd) {
        case 'char':
            // Проверяем, что игрок авторизован
            const isLoggedIn = player.getVariable('loggedIn');
            console.log(`[CharMenu] Player ${player.name} trying to use /char command. LoggedIn status: ${isLoggedIn}`);

            }
            
            // Вызываем клиентский event для показа меню
            player.call('charMenu:show');
            player.outputChatBox('!{00FF00}Меню персонажа открыто.');
            console.log(`[CharMenu] Opening character menu for player ${player.name}`);
            break;
    }
});

// Remote события обрабатываются через общий обработчик в auth.js

// Обработчик сохранения данных персонажа
function handleSaveCharacter(player, characterData) {
    try {
        console.log(`[CharMenu] Saving character data for player ${player.name}`);
        
        // TODO: Добавить валидацию входящих данных от клиента
        
        if (!characterData || typeof characterData !== 'object') {
            player.outputChatBox('!{FF0000}Ошибка: Неверные данные персонажа.');
            return;
        }

        const { gender, skinColor, hairStyle, clothes, props, tattoos, animation } = characterData;

        // Применяем модель персонажа (пол)
        if (gender && (gender === 'mp_m_freemode_01' || gender === 'mp_f_freemode_01')) {
            player.model = mp.joaat(gender);
        }

        // Применяем прическу
        if (hairStyle !== undefined && typeof hairStyle === 'number') {
            player.setClothing(2, hairStyle, 0, 0); // Волосы
        }

        // Применяем цвет кожи
        if (skinColor !== undefined && typeof skinColor === 'number') {
            player.setHeadOverlay(10, skinColor, 1.0, 0, 0); // Skin tone overlay
        }

        // Применяем одежду
        if (clothes && Array.isArray(clothes)) {
            clothes.forEach(item => {
                if (item.componentId !== undefined && item.drawable !== undefined && item.texture !== undefined) {
                    player.setClothing(item.componentId, item.drawable, item.texture, 0);
                }
            });
        }

        // Применяем props (очки и т.д.)
        if (props && Array.isArray(props)) {
            props.forEach(prop => {
                if (prop.componentId !== undefined && prop.drawable !== undefined && prop.texture !== undefined) {
                    player.setProp(prop.componentId, prop.drawable, prop.texture);
                }
            });
        }

        // Применяем татуировки
        if (tattoos && Array.isArray(tattoos)) {
            // Сначала очищаем все декорации
            player.clearDecorations();
            
            tattoos.forEach(tattoo => {
                if (tattoo.zone && tattoo.tattooId !== undefined) {
                    // Применяем татуировку через декорации
                    // Здесь нужно будет добавить правильные хеши татуировок
                    player.setDecoration(mp.joaat('mpbeach_overlays'), tattoo.tattooId);
                }
            });
        }

        // Проигрываем анимацию (опционально)
        if (animation && animation.dict && animation.name) {
            player.playAnimation(animation.dict, animation.name);
        }

        player.outputChatBox('!{00FF00}Внешность персонажа успешно сохранена!');
        console.log(`[CharMenu] Player ${player.name} saved character appearance`);

    } catch (error) {
        console.error(`[CharMenu] Error saving character data for player ${player.name}:`, error);
        player.outputChatBox('!{FF0000}Ошибка при сохранении данных персонажа.');
    }
}

// Обработчик смены пола (опционально)
function handleChangeGender(player, gender) {
    try {
        console.log(`[CharMenu] Changing gender for player ${player.name} to ${gender}`);
        
        if (gender === 'mp_m_freemode_01' || gender === 'mp_f_freemode_01') {
            player.model = mp.joaat(gender);
            player.outputChatBox(`!{00FF00}Пол изменен на: ${gender === 'mp_m_freemode_01' ? 'Мужской' : 'Женский'}`);
        }
    } catch (error) {
        console.error(`[CharMenu] Error changing gender for player ${player.name}:`, error);
    }
}

// Экспортируем функции в глобальную область для доступа из других модулей
global.handleSaveCharacter = handleSaveCharacter;
global.handleChangeGender = handleChangeGender;

console.log('[CharMenu] Character Menu system loaded successfully!'); 
