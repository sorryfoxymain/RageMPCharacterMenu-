# 🎭 Character Menu System for RageMP

A comprehensive character customization system with modern web interface for RageMP servers.

## 📋 Table of Contents
- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [File Structure](#file-structure)
- [Developer API](#developer-api)
- [Technical Information](#technical-information)

---

## 🎯 Features

### **Menu Sections:**

#### 👕 **Clothing**
- **Masks** - component 1 (up to 50 variants)
- **Tops** - component 11 (up to 350 variants)
- **Undershirts** - component 8 (up to 200 variants)
- **Legs** - component 4 (up to 150 variants)
- **Shoes** - component 6 (up to 100 variants)
- **Accessories** - component 7 (up to 50 variants)

#### 🎩 **Props**
- **Hats** - prop 0 (up to 150 variants)
- **Glasses** - prop 1 (up to 50 variants)

#### 👤 **Appearance**
- **Hairstyles** - slider (0-73)
- **Skin color** - slider (0-11)
- **Character gender** - toggle (male/female)

#### 🖋️ **Tattoos**
- **7 body zones**: left arm, right arm, left leg, right leg, torso, back, head
- **ID navigation** with limits for each zone
- **Texture support** for each tattoo

#### 🕺 **Animations**
- **Basic animations**: wave hand, salute, facepalm, thumbs up
- **Poses**: lay down, pushups, yoga, relaxed pose
- **Dances**: 3 different dances
- **Stop animation**

---

## 📋 Requirements

- **RageMP Server** (any current version)
- **Node.js** enabled on server
- **Authentication system** (to check `loggedIn` variable)

---

## 📦 Installation

### **1. Server Files**

Copy the following files to `packages/` folder:

```
packages/
└── character-menu/
    └── index.js                    # Server-side menu logic
```

### **2. Client Files**

Copy the following files to `client_packages/` folder:

```
client_packages/
├── character-menu/
│   └── index.js                    # Client-side logic
├── character-menu-ui/
│   ├── index.html                  # HTML interface
│   ├── style.css                   # Interface styles
│   └── script.js                   # JavaScript UI logic
└── index.js                        # (update for connection)
```

### **3. Update Main Client File**

Add this line to `client_packages/index.js`:

```javascript
require('./character-menu/index.js');
```

### **4. Complete File List:**

```
📁 packages/character-menu/index.js
📁 client_packages/character-menu/index.js
📁 client_packages/character-menu-ui/index.html
📁 client_packages/character-menu-ui/style.css
📁 client_packages/character-menu-ui/script.js
📁 client_packages/index.js (updated)
```

---

## 🎮 Usage

### **Opening the menu:**
```
/char
```
*Command available only for authenticated players*

### **Controls:**
- **Section navigation:** click on tabs
- **Change clothing:** `<` `>` buttons or enter number
- **Textures:** "Texture" field next to each element
- **Save:** "Save" button
- **Cancel:** "Cancel" button or `ESC`
- **Quick save:** `Ctrl + Enter`

### **Interface features:**
- **Compact design** - doesn't obscure character
- **Left positioning** - character visible on the right
- **Live preview** - changes visible immediately
- **Navigation limits** - can't exceed available models

---

## 🗂️ File Structure

### **packages/character-menu/index.js**
- `/char` command
- Character data saving handler
- Server-side appearance application
- Data validation

### **client_packages/character-menu/index.js**
- CEF browser management
- UI event handling
- Real-time change preview
- Save/restore original appearance

### **client_packages/character-menu-ui/**
- **index.html** - interface structure
- **style.css** - modern light-themed styling
- **script.js** - interaction logic, validation, navigation

---

## 🔧 Developer API

### **Client Functions:**
```javascript
// Check if menu is open
mp.characterMenu.isOpen()

// Close menu programmatically
mp.characterMenu.close()

// Get player's current clothing
mp.characterMenu.getCurrentClothing()

// Apply clothing array
mp.characterMenu.applyClothingArray(clothingArray)

// Reset appearance to default
mp.characterMenu.resetToDefault()

// Save original appearance
mp.characterMenu.saveOriginalAppearance()

// Restore original appearance
mp.characterMenu.restoreOriginalAppearance()
```

### **RageMP Events:**

#### **Server Events:**
- `charMenu:show` - open menu for player
- `charMenu:save` - save character data
- `charMenu:changeGender` - change character gender

#### **Client Events:**
- `menu:previewClothes` - clothing preview
- `menu:previewProp` - props preview (hats, glasses)
- `menu:previewHair` - hairstyle preview
- `menu:previewSkinColor` - skin color preview
- `menu:previewGender` - gender change preview
- `menu:previewTattoo` - tattoo preview
- `menu:playAnim` - play animation
- `menu:stopAnim` - stop animation
- `menu:save` - save all changes
- `menu:cancel` - cancel changes

---

## ⚙️ Technical Information

### **Character Data Format:**
```javascript
{
    gender: "mp_m_freemode_01",        // Character gender
    skinColor: 5,                      // Skin color (0-11)
    hairStyle: 15,                     // Hairstyle (0-73)
    clothes: [                         // Clothing array
        {
            componentId: 11,           // Component ID
            drawable: 4,               // Model ID
            texture: 2                 // Texture ID
        }
    ],
    props: [                          // Props array
        {
            componentId: 0,           // Prop ID (0=hats, 1=glasses)
            drawable: 10,             // Model ID
            texture: 0                // Texture ID
        }
    ],
    tattoos: [                        // Tattoos array
        {
            zone: "left_arm",         // Body zone
            tattooId: 5,              // Tattoo ID
            texture: 0                // Texture ID
        }
    ],
    animation: {                      // Current animation (optional)
        dict: "mp_player_int_upperwave",
        name: "mp_player_int_wave_01"
    }
}
```

### **Maximum Values:**
```javascript
// Clothing (components)
Masks: 50, Tops: 350, Undershirts: 200
Legs: 150, Shoes: 100, Accessories: 50

// Props
Hats: 150, Glasses: 50

// Tattoos (by zones)
Arms: 30, Legs: 20, Torso: 50, Back: 25, Head: 15
```

### **Interface Color Scheme:**
- **Primary color:** #4CAF50 (green)
- **Background:** white with gray cards
- **Tattoo accents:** #ff6b35 (orange-red)
- **Animation accents:** #ff9800 (orange)

---

## 🎨 Design

- **Modern flat design** in light colors
- **Compact left positioning** on screen
- **Responsive interface** with smooth animations
- **Intuitive tab navigation**
- **Live preview** of all changes

---

## 📝 Notes

- System requires authentication via `loggedIn` variable
- All changes are applied in real-time
- Original appearance is restored on cancel
- System automatically limits navigation to available models
- Supports saving all character parameters

---

**Developed for RageMP** | **Version:** 1.0 | **License:** MIT 
