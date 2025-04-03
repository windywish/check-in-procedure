// Room Simulation - Handles the player's hotel room and interactions
const roomSimulation = {
    state: {
        roomNumber: '3021',
        roomItems: [],
        currentView: 'main', // main, bathroom, desk, window, door
        bathtubState: {
            filled: false,
            temperature: 20, // celsius
            hasYellowDuck: false,
            hasLeatherItems: false,
            configuredAsHyperlink: false
        },
        toiletries: {
            soap: true,
            shampoo: true,
            towels: 2
        },
        interactionHistory: [],
        anomalyLevel: 0,
        viewingPhantomNote: false
    },
    
    // Initialize room simulation
    init() {
        // Set up initial room state
        this.setupInitialRoom();
        
        // Add room button to UI
        this.addRoomButton();
        
        // Connect to app
        if (typeof app !== 'undefined') {
            app.room = this;
            
            // Get room number from app state if available
            if (app.state.player.room) {
                this.state.roomNumber = app.state.player.room;
            }
        }
    },
    
    setupInitialRoom() {
        // Add basic room items
        this.state.roomItems = [
            { id: 'bed', name: 'Bed', description: 'A standard hotel bed with crisp white sheets.', interactable: true },
            { id: 'desk', name: 'Desk', description: 'A wooden desk with a lamp and hotel information booklet.', interactable: true },
            { id: 'tv', name: 'Television', description: 'A flat-screen TV mounted on the wall.', interactable: true },
            { id: 'window', name: 'Window', description: 'A small window offering a view of the city.', interactable: true },
            { id: 'bathroom-door', name: 'Bathroom Door', description: 'Door to the bathroom.', interactable: true },
            { id: 'room-door', name: 'Room Door', description: 'The main door to your hotel room.', interactable: true },
            { id: 'closet', name: 'Closet', description: 'A small closet for your belongings.', interactable: true }
        ];
        
        // Check if app has inventory for the player
        if (typeof app !== 'undefined' && !app.state.player.inventory) {
            app.state.player.inventory = [];
            
            // Add some basic items
            app.state.player.inventory.push(
                { id: 'key-card', name: 'Room Key Card', type: 'key', description: 'Access card for room ' + this.state.roomNumber }
            );
        }
    },
    
    addRoomButton() {
        // Create room button element
        const roomButton = document.createElement('div');
        roomButton.className = 'room-button';
        roomButton.innerHTML = '<i class="fas fa-bed"></i>';
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .room-button {
                position: fixed;
                bottom: 20px;
                left: 80px;
                width: 50px;
                height: 50px;
                background-color: var(--secondary-color);
                color: white;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                box-shadow: var(--box-shadow);
                z-index: 90;
                transition: all 0.3s ease;
            }
            
            .room-button:hover {
                background-color: var(--tertiary-color);
                transform: scale(1.1);
            }
            
            .room-button i {
                font-size: 1.2rem;
            }
        `;
        document.head.appendChild(style);
        
        // Add room button to body
        document.body.appendChild(roomButton);
        
        // Show room modal on click
        roomButton.addEventListener('click', () => {
            this.showRoomModal();
        });
    },
    
    showRoomModal() {
        // Check if modal already exists
        let roomModal = document.getElementById('room-modal');
        
        if (!roomModal) {
            // Create modal if it doesn't exist
            roomModal = document.createElement('div');
            roomModal.className = 'modal';
            roomModal.id = 'room-modal';
            
            roomModal.innerHTML = `
                <div class="modal-content room-content">
                    <div class="modal-header">
                        <h3>Room ${this.state.roomNumber}</h3>
                        <span class="close-button">&times;</span>
                    </div>
                    <div class="room-view-container">
                        <div class="room-view" id="room-main-view">
                            <!-- Main room view will be inserted here -->
                        </div>
                        <div class="room-view hidden" id="room-bathroom-view">
                            <!-- Bathroom view will be inserted here -->
                        </div>
                        <div class="room-view hidden" id="room-desk-view">
                            <!-- Desk view will be inserted here -->
                        </div>
                        <div class="room-view hidden" id="room-window-view">
                            <!-- Window view will be inserted here -->
                        </div>
                        <div class="room-view hidden" id="room-door-view">
                            <!-- Door view will be inserted here -->
                        </div>
                    </div>
                    <div class="room-controls">
                        <div class="view-selector">
                            <button class="view-button active" data-view="main">
                                <i class="fas fa-home"></i>
                                <span>Main View</span>
                            </button>
                            <button class="view-button" data-view="bathroom">
                                <i class="fas fa-bath"></i>
                                <span>Bathroom</span>
                            </button>
                            <button class="view-button" data-view="desk">
                                <i class="fas fa-desktop"></i>
                                <span>Desk</span>
                            </button>
                            <button class="view-button" data-view="window">
                                <i class="fas fa-window-maximize"></i>
                                <span>Window</span>
                            </button>
                            <button class="view-button" data-view="door">
                                <i class="fas fa-door-closed"></i>
                                <span>Door</span>
                            </button>
                        </div>
                        <div class="inventory-quick-access" id="room-inventory">
                            <!-- Inventory items will be inserted here -->
                        </div>
                    </div>
                    <div class="room-status">
                        <p id="room-status-message">Looking around your hotel room.</p>
                    </div>
                </div>
            `;
            
            document.body.appendChild(roomModal);
            
            // Add additional styles
            const style = document.createElement('style');
            style.textContent = `
                .room-content {
                    max-width: 800px;
                    width: 90%;
                    height: 90vh;
                    max-height: 700px;
                    display: flex;
                    flex-direction: column;
                }
                
                .room-view-container {
                    flex: 1;
                    position: relative;
                    overflow: hidden;
                    border-radius: var(--border-radius);
                    background-color: #f0f0f0;
                }
                
                .room-view {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    transition: all 0.5s ease;
                }
                
                .room-view.hidden {
                    opacity: 0;
                    pointer-events: none;
                }
                
                .room-scene {
                    width: 100%;
                    height: 100%;
                    position: relative;
                    background-color: #e0e0e0;
                    overflow: hidden;
                }
                
                .room-object {
                    position: absolute;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .room-object:hover {
                    transform: scale(1.05);
                }
                
                .room-controls {
                    padding: 15px 0;
                    display: flex;
                    justify-content: space-between;
                    border-top: 1px solid #eee;
                }
                
                .view-selector {
                    display: flex;
                    gap: 10px;
                }
                
                .view-button {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 5px;
                    background: none;
                    border: none;
                    padding: 5px 10px;
                    border-radius: var(--border-radius);
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .view-button i {
                    font-size: 1.2rem;
                    color: var(--primary-color);
                }
                
                .view-button span {
                    font-size: 0.8rem;
                }
                
                .view-button:hover {
                    background-color: #f0f0f0;
                }
                
                .view-button.active {
                    background-color: var(--primary-color);
                }
                
                .view-button.active i,
                .view-button.active span {
                    color: white;
                }
                
                .inventory-quick-access {
                    display: flex;
                    gap: 5px;
                }
                
                .inventory-item {
                    width: 40px;
                    height: 40px;
                    background-color: #f0f0f0;
                    border-radius: var(--border-radius);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .inventory-item:hover {
                    background-color: var(--accent-color);
                    color: white;
                }
                
                .room-status {
                    padding: 10px;
                    border-top: 1px solid #eee;
                    font-style: italic;
                    color: var(--light-text);
                }
                
                /* Bathroom specific styles */
                .bathtub {
                    width: 200px;
                    height: 100px;
                    background-color: white;
                    border-radius: 10px;
                    position: relative;
                    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
                }
                
                .bathtub-water {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 0%;
                    background-color: rgba(100, 180, 255, 0.5);
                    border-radius: 0 0 10px 10px;
                    transition: height 1s ease;
                }
                
                .bathtub-duck {
                    position: absolute;
                    width: 30px;
                    height: 30px;
                    background-color: #ffd700;
                    border-radius: 50%;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: #ff9900;
                    font-size: 1rem;
                    display: none;
                }
                
                .bathtub-controls {
                    display: flex;
                    gap: 10px;
                    margin-top: 10px;
                }
                
                /* Desk specific styles */
                .desk-surface {
                    width: 300px;
                    height: 150px;
                    background-color: #8b4513;
                    border-radius: 5px;
                    position: relative;
                }
                
                .desk-item {
                    position: absolute;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .desk-item:hover {
                    transform: translateY(-5px);
                }
                
                /* Window specific styles */
                .window-frame {
                    width: 250px;
                    height: 150px;
                    background-color: #87CEEB;
                    border: 10px solid #8b4513;
                    border-radius: 5px;
                    position: relative;
                    overflow: hidden;
                }
                
                .window-view {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: #87CEEB;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    color: white;
                    text-align: center;
                }
                
                /* Door specific styles */
                .door-frame {
                    width: 150px;
                    height: 250px;
                    background-color: #8b4513;
                    border-radius: 5px 5px 0 0;
                    position: relative;
                }
                
                .peephole {
                    position: absolute;
                    width: 20px;
                    height: 20px;
                    background-color: #000;
                    border-radius: 50%;
                    top: 80px;
                    left: 50%;
                    transform: translateX(-50%);
                    cursor: pointer;
                }
                
                .door-handle {
                    position: absolute;
                    width: 30px;
                    height: 15px;
                    background-color: #c0c0c0;
                    border-radius: 5px;
                    top: 130px;
                    right: 20px;
                    cursor: pointer;
                }
                
                /* Anomaly effect styles */
                @keyframes subtle-flicker {
                    0% { opacity: 1; }
                    25% { opacity: 0.95; }
                    50% { opacity: 0.98; }
                    75% { opacity: 0.93; }
                    100% { opacity: 1; }
                }
                
                .anomaly-effect-low {
                    animation: subtle-flicker 2s infinite;
                }
                
                @keyframes moderate-distortion {
                    0% { transform: scale(1) skew(0deg, 0deg); }
                    25% { transform: scale(1.01) skew(0.5deg, 0.2deg); }
                    50% { transform: scale(0.99) skew(-0.3deg, 0.1deg); }
                    75% { transform: scale(1.02) skew(0.1deg, -0.4deg); }
                    100% { transform: scale(1) skew(0deg, 0deg); }
                }
                
                .anomaly-effect-medium {
                    animation: moderate-distortion 3s infinite;
                }
                
                @keyframes heavy-distortion {
                    0% { transform: scale(1) rotate(0deg); filter: hue-rotate(0deg); }
                    25% { transform: scale(1.03) rotate(0.5deg); filter: hue-rotate(10deg); }
                    50% { transform: scale(0.98) rotate(-1deg); filter: hue-rotate(-5deg); }
                    75% { transform: scale(1.02) rotate(1.5deg); filter: hue-rotate(15deg); }
                    100% { transform: scale(1) rotate(0deg); filter: hue-rotate(0deg); }
                }
                
                .anomaly-effect-high {
                    animation: heavy-distortion 4s infinite;
                }
            `;
            document.head.appendChild(style);
            
            // Set up close button
            roomModal.querySelector('.close-button').addEventListener('click', () => {
                roomModal.classList.remove('show');
            });
            
            // Set up view buttons
            roomModal.querySelectorAll('.view-button').forEach(button => {
                button.addEventListener('click', () => {
                    const view = button.dataset.view;
                    this.changeRoomView(view);
                    
                    // Update active button
                    roomModal.querySelectorAll('.view-button').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    button.classList.add('active');
                });
            });
            
            // Create room views
            this.createMainRoomView();
            this.createBathroomView();
            this.createDeskView();
            this.createWindowView();
            this.createDoorView();
            
            // Update inventory display
            this.updateInventoryDisplay();
        }
        
        // Show modal
        roomModal.classList.add('show');
    },
    
    changeRoomView(view) {
        // Hide all views
        document.querySelectorAll('.room-view').forEach(viewEl => {
            viewEl.classList.add('hidden');
        });
        
        // Show selected view
        const selectedView = document.getElementById(`room-${view}-view`);
        if (selectedView) {
            selectedView.classList.remove('hidden');
        }
        
        // Update state
        this.state.currentView = view;
        
        // Update status message
        const statusMessage = document.getElementById('room-status-message');
        if (statusMessage) {
            switch(view) {
                case 'main':
                    statusMessage.textContent = 'Looking around your hotel room.';
                    break;
                case 'bathroom':
                    statusMessage.textContent = 'Examining the bathroom.';
                    break;
                case 'desk':
                    statusMessage.textContent = 'Looking at the desk area.';
                    break;
                case 'window':
                    statusMessage.textContent = 'Gazing out the window.';
                    break;
                case 'door':
                    statusMessage.textContent = 'Standing by the door.';
                    break;
            }
        }
        
        // Check for special view-based events
        this.checkViewEvents(view);
    },
    
    createMainRoomView() {
        const mainView = document.getElementById('room-main-view');
        if (!mainView) return;
        
        // Create room scene
        const roomScene = document.createElement('div');
        roomScene.className = 'room-scene';
        
        roomScene.innerHTML = `
            <div class="room-object bed" style="bottom: 20%; left: 20%; width: 200px; height: 120px; background-color: #f8f8f8; border: 2px solid #ddd; border-radius: 10px;">
                <div style="position: absolute; top: 0; left: 0; width: 100%; height: 30px; background-color: #ddd; border-radius: 8px 8px 0 0;"></div>
            </div>
            
            <div class="room-object desk" style="bottom: 20%; right: 20%; width: 150px; height: 80px; background-color: #8b4513; border-radius: 5px;">
                <div style="position: absolute; top: -30px; left: 50%; transform: translateX(-50%); width: 30px; height: 30px; background-color: #ffd700; border-radius: 50%;"></div>
            </div>
            
            <div class="room-object tv" style="top: 20%; right: 20%; width: 120px; height: 80px; background-color: #000; border: 5px solid #333; border-radius: 5px;"></div>
            
            <div class="room-object window" style="top: 20%; left: 20%; width: 100px; height: 80px; background-color: #87CEEB; border: 5px solid #8b4513; border-radius: 5px;"></div>
            
            <div class="room-object bathroom-door" style="top: 50%; right: 10%; width: 60px; height: 120px; background-color: #8b4513; border-radius: 5px 5px 0 0;"></div>
            
            <div class="room-object room-door" style="top: 50%; left: 10%; width: 60px; height: 120px; background-color: #8b4513; border-radius: 5px 5px 0 0;"></div>
            
            <div class="room-object closet" style="bottom: 20%; left: 50%; transform: translateX(-50%); width: 120px; height: 100px; background-color: #8b4513; border-radius: 5px;"></div>
        `;
        
        mainView.appendChild(roomScene);
        
        // Add click handlers to objects
        roomScene.querySelectorAll('.room-object').forEach(object => {
            object.addEventListener('click', () => {
                const objectClass = Array.from(object.classList).find(c => c !== 'room-object');
                
                switch(objectClass) {
                    case 'bed':
                        this.interactWithBed();
                        break;
                    case 'desk':
                        this.changeRoomView('desk');
                        break;
                    case 'tv':
                        this.interactWithTV();
                        break;
                    case 'window':
                        this.changeRoomView('window');
                        break;
                    case 'bathroom-door':
                        this.changeRoomView('bathroom');
                        break;
                    case 'room-door':
                        this.changeRoomView('door');
                        break;
                    case 'closet':
                        this.interactWithCloset();
                        break;
                }
            });
        });
    },
    
    createBathroomView() {
        const bathroomView = document.getElementById('room-bathroom-view');
        if (!bathroomView) return;
        
        // Create bathroom scene
        const bathroomScene = document.createElement('div');
        bathroomScene.className = 'room-scene';
        
        bathroomScene.innerHTML = `
            <div class="bathtub-container" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                <div class="bathtub">
                    <div class="bathtub-water" style="height: ${this.state.bathtubState.filled ? '80%' : '0%'};"></div>
                    <div class="bathtub-duck" style="display: ${this.state.bathtubState.hasYellowDuck ? 'flex' : 'none'};">
                        <i class="fas fa-duck"></i>
                    </div>
                </div>
                <div class="bathtub-controls">
                    <button class="fill-bathtub-btn">Fill Bathtub</button>
                    <button class="drain-bathtub-btn">Drain Bathtub</button>
                    <button class="add-duck-btn">Add Yellow Duck</button>
                </div>
            </div>
            
            <div class="toilet" style="position: absolute; bottom: 20%; right: 20%; width: 60px; height: 80px; background-color: white; border-radius: 5px;"></div>
            
            <div class="sink" style="position: absolute; top: 20%; right: 20%; width: 80px; height: 50px; background-color: white; border-radius: 5px;"></div>
        `;
        
        bathroomView.appendChild(bathroomScene);
        
        // Add event listeners for bathroom interactions
        bathroomScene.querySelector('.fill-bathtub-btn').addEventListener('click', () => {
            this.fillBathtub();
        });
        
        bathroomScene.querySelector('.drain-bathtub-btn').addEventListener('click', () => {
            this.drainBathtub();
        });
        
        bathroomScene.querySelector('.add-duck-btn').addEventListener('click', () => {
            this.addDuckToBathtub();
        });
        
        bathroomScene.querySelector('.toilet').addEventListener('click', () => {
            this.interactWithToilet();
        });
        
        bathroomScene.querySelector('.sink').addEventListener('click', () => {
            this.interactWithSink();
        });
    },
    
    createDeskView() {
        const deskView = document.getElementById('room-desk-view');
        if (!deskView) return;
        
        // Create desk scene
        const deskScene = document.createElement('div');
        deskScene.className = 'room-scene';
        
        deskScene.innerHTML = `
            <div class="desk-container" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                <div class="desk-surface">
                    <div class="desk-item hotel-info" style="top: 20px; left: 30px; width: 80px; height: 50px; background-color: #fff; border: 1px solid #ddd; display: flex; justify-content: center; align-items: center;">
                        <i class="fas fa-book" style="font-size: 1.5rem; color: var(--primary-color);"></i>
                    </div>
                    
                    <div class="desk-item desk-lamp" style="top: 10px; right: 30px; width: 30px; height: 60px; display: flex; flex-direction: column; align-items: center;">
                        <div style="width: 30px; height: 30px; background-color: #ffd700; border-radius: 15px 15px 0 0;"></div>
                        <div style="width: 10px; height: 30px; background-color: #c0c0c0;"></div>
                    </div>
                    
                    <div class="desk-item notepad" style="bottom: 20px; left: 120px; width: 60px; height: 40px; background-color: #fff; border: 1px solid #ddd; display: flex; justify-content: center; align-items: center;">
                        <i class="fas fa-sticky-note" style="font-size: 1.2rem; color: var(--accent-color);"></i>
                    </div>
                </div>
                <div class="desk-chair" style="position: absolute; bottom: -80px; left: 50%; transform: translateX(-50%); width: 80px; height: 80px; background-color: #444; border-radius: 10px;"></div>
            </div>
        `;
        
        deskView.appendChild(deskScene);
        
        // Add event listeners for desk interactions
        deskScene.querySelector('.hotel-info').addEventListener('click', () => {
            this.interactWithHotelInfo();
        });
        
        deskScene.querySelector('.desk-lamp').addEventListener('click', () => {
            this.toggleDeskLamp();
        });
        
        deskScene.querySelector('.notepad').addEventListener('click', () => {
            this.interactWithNotepad();
        });
    },
    
    createWindowView() {
        const windowView = document.getElementById('room-window-view');
        if (!windowView) return;
        
        // Create window scene
        const windowScene = document.createElement('div');
        windowScene.className = 'room-scene';
        
        windowScene.innerHTML = `
            <div class="window-container" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                <div class="window-frame">
                    <div class="window-view">
                        <i class="fas fa-cloud-rain" style="font-size: 2rem; margin-bottom: 10px;"></i>
                        <div>A rainy day in the city</div>
                    </div>
                </div>
                <div class="window-sill" style="width: 270px; height: 20px; background-color: #8b4513; border-radius: 0 0 5px 5px;"></div>
            </div>
        `;
        
        windowView.appendChild(windowScene);
        
        // Add event listener for window view
        windowScene.querySelector('.window-view').addEventListener('click', () => {
            this.observeFromWindow();
        });
    },
    
    createDoorView() {
        const doorView = document.getElementById('room-door-view');
        if (!doorView) return;
        
        // Create door scene
        const doorScene = document.createElement('div');
        doorScene.className = 'room-scene';
        
        doorScene.innerHTML = `
            <div class="door-container" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                <div class="door-frame">
                    <div class="door-number" style="position: absolute; top: 30px; left: 50%; transform: translateX(-50%); background-color: #c0c0c0; padding: 5px 10px; border-radius: 3px;">${this.state.roomNumber}</div>
                    <div class="peephole"></div>
                    <div class="door-handle"></div>
                </div>
            </div>
        `;
        
        doorView.appendChild(doorScene);
        
        // Add event listeners for door interactions
        doorScene.querySelector('.peephole').addEventListener('click', () => {
            this.lookThroughPeephole();
        });
        
        doorScene.querySelector('.door-handle').addEventListener('click', () => {
            this.openDoor();
        });
    },
    
    updateInventoryDisplay() {
        const inventoryContainer = document.getElementById('room-inventory');
        if (!inventoryContainer) return;
        
        // Clear existing items
        inventoryContainer.innerHTML = '';
        
        // Get player inventory
        const inventory = typeof app !== 'undefined' ? app.state.player.inventory : [];
        
        // Show up to 5 items
        const displayItems = inventory.slice(0, 5);
        
        // Create inventory items
        displayItems.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'inventory-item';
            itemEl.title = item.name;
            
            // Choose icon based on item type
            let iconClass = 'fa-question';
            switch(item.type) {
                case 'key':
                    iconClass = 'fa-key';
                    break;
                case 'document':
                    iconClass = 'fa-file-alt';
                    break;
                case 'apparel':
                    iconClass = 'fa-tshirt';
                    break;
            }
            
            itemEl.innerHTML = `<i class="fas ${iconClass}"></i>`;
            
            // Add click handler
            itemEl.addEventListener('click', () => {
                this.useInventoryItem(item);
            });
            
            inventoryContainer.appendChild(itemEl);
        });
    },
    
    // Room interaction methods
    
    interactWithBed() {
        // Show message
        this.updateStatusMessage('The bed looks comfortable. You could rest here.');
        
        if (typeof app !== 'undefined') {
            app.showNotification({
                type: 'info',
                title: 'Hotel Bed',
                message: 'You lie down on the bed for a moment. It\'s quite comfortable.'
            });
        }
        
        // Add to interaction history
        this.recordInteraction('bed');
        
        // Check for anomalies
        if (this.checkForAnomalies()) {
            // Random chance to find something under the pillow
            if (Math.random() < 0.3) {
                setTimeout(() => {
                    if (typeof app !== 'undefined') {
                        app.showNotification({
                            type: 'info',
                            title: 'Hidden Object',
                            message: 'You notice something tucked under the pillow... a small piece of paper with the number "9321" written on it.'
                        });
                        
                        // Add to discovered secrets if this is new
                        if (!app.state.player.discoveredSecrets.includes('bed-note')) {
                            app.state.player.discoveredSecrets.push('bed-note');
                            
                            // Increase puzzle progress
                            app.state.gameState.puzzleProgress += 10;
                        }
                    }
                }, 2000);
            }
        }
    },
    
    interactWithTV() {
        // Show message
        this.updateStatusMessage('You turn on the TV. Nothing interesting is showing.');
        
        if (typeof app !== 'undefined') {
            app.showNotification({
                type: 'info',
                title: 'Television',
                message: 'You turn on the TV. It\'s showing standard hotel programming.'
            });
        }
        
        // Add to interaction history
        this.recordInteraction('tv');
        
        // Check for anomalies
        if (this.checkForAnomalies()) {
            // TV could show strange content
            setTimeout(() => {
                if (typeof app !== 'undefined') {
                    app.showNotification({
                        type: 'warning',
                        title: 'Strange Broadcast',
                        message: 'The TV suddenly changes channel by itself. You see a brief image of a figure wearing a deer mask before it returns to normal programming.'
                    });
                    
                    // Add to discovered secrets if this is new
                    if (!app.state.player.discoveredSecrets.includes('tv-anomaly')) {
                        app.state.player.discoveredSecrets.push('tv-anomaly');
                        
                        // Increase anomaly level
                        app.state.gameState.anomalyLevel += 5;
                    }
                }
            }, 3000);
        }
    },
    
    interactWithCloset() {
        // Show message
        this.updateStatusMessage('You open the closet to check your belongings.');
        
        if (typeof app !== 'undefined') {
            app.showNotification({
                type: 'info',
                title: 'Closet',
                message: 'You open the closet to check if anything is stored inside.'
            });
        }
        
        // Add to interaction history
        this.recordInteraction('closet');
        
        // Check if player has leather items
        if (typeof app !== 'undefined' && app.state.player.inventory) {
            const leatherItems = app.state.player.inventory.filter(item => 
                item.id.includes('leather')
            );
            
            if (leatherItems.length > 0) {
                setTimeout(() => {
                    app.showNotification({
                        type: 'info',
                        title: 'Leather Items',
                        message: `You have ${leatherItems.length} leather items stored in the closet.`
                    });
                    
                    // If player has discovered Leatherman Gambit
                    if (app.supplementary && app.supplementary.state.unlockedProcedures.includes('a11')) {
                        setTimeout(() => {
                            app.showNotification({
                                type: 'info',
                                title: 'Leatherman Gambit',
                                message: 'These leather items could be useful for the Leatherman Gambit...'
                            });
                        }, 2000);
                    }
                }, 1000);
            } else {
                setTimeout(() => {
                    app.showNotification({
                        type: 'info',
                        title: 'Empty Closet',
                        message: 'The closet is currently empty.'
                    });
                }, 1000);
            }
        }
    },
    
    fillBathtub() {
        // Show message
        this.updateStatusMessage('Filling the bathtub with water...');
        
        // Update state
        this.state.bathtubState.filled = true;
        
        // Update UI
        const bathtubWater = document.querySelector('.bathtub-water');
        if (bathtubWater) {
            bathtubWater.style.height = '80%';
        }
        
        if (typeof app !== 'undefined') {
            app.showNotification({
                type: 'info',
                title: 'Bathtub',
                message: 'You fill the bathtub with water.'
            });
        }
        
        // Add to interaction history
        this.recordInteraction('fill-bathtub');
        
        // Check for water schedule based on floor
        if (typeof app !== 'undefined') {
            const floor = parseInt(this.state.roomNumber.substring(0, 2));
            
            // Check if this floor has special water rules
            if (app.state.hotel.waterSchedule && app.state.hotel.waterSchedule[floor]) {
                const waterRule = app.state.hotel.waterSchedule[floor];
                
                // Check if water is available based on rules
                let waterAvailable = true;
                if (typeof waterRule.hasWater === 'function') {
                    waterAvailable = waterRule.hasWater(app.state.hotel.currentTime);
                } else if (waterRule.hasWater === false) {
                    waterAvailable = false;
                }
                
                if (!waterAvailable) {
                    setTimeout(() => {
                        app.showNotification({
                            type: 'error',
                            title: 'No Water',
                            message: waterRule.note || 'There is no water available on this floor at this time.'
                        });
                        
                        // Empty the tub
                        this.state.bathtubState.filled = false;
                        
                        if (bathtubWater) {
                            bathtubWater.style.height = '0%';
                        }
                    }, 2000);
                    return;
                }
                
                // Check if hot water is available
                let hotWaterAvailable = true;
                if (typeof waterRule.hotWater === 'function') {
                    hotWaterAvailable = waterRule.hotWater(app.state.hotel.currentTime);
                } else if (waterRule.hotWater === false) {
                    hotWaterAvailable = false;
                }
                
                if (!hotWaterAvailable) {
                    setTimeout(() => {
                        app.showNotification({
                            type: 'warning',
                            title: 'Cold Water',
                            message: 'Only cold water is available on this floor at this time.'
                        });
                    }, 2000);
                }
            }
        }
    },
    
    drainBathtub() {
        // Show message
        this.updateStatusMessage('Draining the bathtub...');
        
        // Update state
        this.state.bathtubState.filled = false;
        
        // Update UI
        const bathtubWater = document.querySelector('.bathtub-water');
        if (bathtubWater) {
            bathtubWater.style.height = '0%';
        }
        
        if (typeof app !== 'undefined') {
            app.showNotification({
                type: 'info',
                title: 'Bathtub',
                message: 'You drain the bathtub.'
            });
        }
        
        // Add to interaction history
        this.recordInteraction('drain-bathtub');
    },
    
    addDuckToBathtub() {
        // Show message
        this.updateStatusMessage('You place a yellow rubber duck in the bathtub.');
        
        // Update state
        this.state.bathtubState.hasYellowDuck = true;
        
        // Update UI
        const bathtubDuck = document.querySelector('.bathtub-duck');
        if (bathtubDuck) {
            bathtubDuck.style.display = 'flex';
        }
        
        if (typeof app !== 'undefined') {
            app.showNotification({
                type: 'info',
                title: 'Yellow Duck',
                message: 'You place a rubber duck in the bathtub.'
            });
        }
        
        // Add to interaction history
        this.recordInteraction('add-duck');
        
        // Check if tub is filled and has duck - potential rule violation!
        if (this.state.bathtubState.filled && this.state.bathtubState.hasYellowDuck) {
            setTimeout(() => {
                if (typeof app !== 'undefined') {
                    app.showNotification({
                        type: 'warning',
                        title: 'Rule Violation',
                        message: 'This appears to violate Clause 15 of the hotel rules...'
                    });
                    
                    // Record violation
                    app.state.player.violations.push({
                        rule: '15',
                        time: app.state.hotel.currentTime.getTime(),
                        description: 'Placed yellow duck in filled bathtub'
                    });
                    
                    // Check if player has leather items equipped
                    const leatherEquipped = app.supplementary ? app.supplementary.state.leatherItemsEquipped : 0;
                    
                    if (leatherEquipped >= 4) {
                        // Leatherman Gambit - activate bathtub hyperlink!
                        setTimeout(() => {
                            this.activateBathtubHyperlink();
                        }, 3000);
                    }
                }
            }, 2000);
        }
    },
    
    activateBathtubHyperlink() {
        if (typeof app === 'undefined') return;
        
        app.showNotification({
            type: 'info',
            title: 'Bathtub Hyperlink',
            message: 'Your leather items have activated the bathtub hyperlink system! The water begins to shimmer with data patterns.'
        });
        
        // Update state
        this.state.bathtubState.configuredAsHyperlink = true;
        
        // Add visual effects to the bathtub
        const bathtubWater = document.querySelector('.bathtub-water');
        if (bathtubWater) {
            bathtubWater.style.backgroundColor = 'rgba(100, 180, 255, 0.7)';
            bathtubWater.style.boxShadow = '0 0 20px rgba(100, 180, 255, 0.5)';
            
            // Add pulsing animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes data-pulse {
                    0% { opacity: 0.7; box-shadow: 0 0 20px rgba(100, 180, 255, 0.5); }
                    50% { opacity: 0.9; box-shadow: 0 0 30px rgba(100, 180, 255, 0.8); }
                    100% { opacity: 0.7; box-shadow: 0 0 20px rgba(100, 180, 255, 0.5); }
                }
                
                .hyperlink-active {
                    animation: data-pulse 3s infinite;
                }
            `;
            document.head.appendChild(style);
            
            bathtubWater.classList.add('hyperlink-active');
        }
        
        // Add interactive data access button
        const bathtubControls = document.querySelector('.bathtub-controls');
        if (bathtubControls) {
            // Add access data button if it doesn't exist
            if (!document.querySelector('.access-data-btn')) {
                const accessButton = document.createElement('button');
                accessButton.className = 'access-data-btn';
                accessButton.textContent = 'Access Data';
                accessButton.style.backgroundColor = '#2c3e50';
                accessButton.style.color = 'white';
                
                accessButton.addEventListener('click', () => {
                    this.accessBathtubData();
                });
                
                bathtubControls.appendChild(accessButton);
            }
        }
        
        // Complete task if it exists
        if (app.state.player.taskList.some(t => t.id === 'task-bathtub')) {
            app.completeTask('task-bathtub');
        }
    },
    
    accessBathtubData() {
        if (typeof app === 'undefined') return;
        
        app.showNotification({
            type: 'info',
            title: 'Accessing Data Network',
            message: 'Connecting to hotel data network through bathtub hyperlink...'
        });
        
        // Create data access interface
        this.showDataAccessInterface();
    },
    
    showDataAccessInterface() {
        // Create modal for data access
        const dataModal = document.createElement('div');
        dataModal.className = 'modal show';
        dataModal.id = 'data-access-modal';
        
        dataModal.innerHTML = `
            <div class="modal-content data-content">
                <div class="modal-header">
                    <h3>Data Access Terminal</h3>
                    <span class="close-button">&times;</span>
                </div>
                <div class="data-terminal">
                    <div class="terminal-output">
                        <div class="terminal-line">Bathtub Hyperlink System v3.2</div>
                        <div class="terminal-line">Accessing hotel network...</div>
                        <div class="terminal-line">Connection established.</div>
                        <div class="terminal-line">----------------------------------</div>
                        <div class="terminal-line">Select data repository to access:</div>
                        <div class="terminal-line">----------------------------------</div>
                    </div>
                    <div class="data-options">
                        <button class="data-option" data-option="guest-records">Guest Records</button>
                        <button class="data-option" data-option="maintenance-logs">Maintenance Logs</button>
                        <button class="data-option" data-option="night-elk">Night Elk Files</button>
                        <button class="data-option" data-option="security">Security System</button>
                    </div>
                    <div class="terminal-input">
                        <span class="prompt">&gt;</span>
                        <input type="text" id="terminal-command" placeholder="Enter command...">
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(dataModal);
        
        // Add specialized CSS
        const style = document.createElement('style');
        style.textContent = `
            .data-content {
                max-width: 800px;
                background-color: #000;
                color: #33ff33;
                font-family: monospace;
            }
            
            .data-terminal {
                padding: 20px;
                height: 500px;
                display: flex;
                flex-direction: column;
            }
            
            .terminal-output {
                flex: 1;
                overflow-y: auto;
                margin-bottom: 20px;
                line-height: 1.5;
            }
            
            .terminal-line {
                margin-bottom: 5px;
            }
            
            .data-options {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
                margin-bottom: 20px;
            }
            
            .data-option {
                background-color: #000;
                color: #33ff33;
                border: 1px solid #33ff33;
                padding: 10px;
                cursor: pointer;
                font-family: monospace;
                transition: all 0.3s ease;
            }
            
            .data-option:hover {
                background-color: #33ff33;
                color: #000;
            }
            
            .terminal-input {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .prompt {
                font-weight: bold;
            }
            
            #terminal-command {
                flex: 1;
                background-color: #000;
                color: #33ff33;
                border: none;
                outline: none;
                font-family: monospace;
                font-size: 1rem;
            }
            
            .password-protected {
                color: #ff3333;
            }
            
            .access-granted {
                color: #33ff33;
                font-weight: bold;
            }
            
            .command-error {
                color: #ff3333;
            }
            
            @keyframes cursor-blink {
                0%, 49% { opacity: 1; }
                50%, 100% { opacity: 0; }
            }
            
            .cursor {
                display: inline-block;
                width: 8px;
                height: 15px;
                background-color: #33ff33;
                animation: cursor-blink 1s infinite;
                vertical-align: middle;
            }
        `;
        document.head.appendChild(style);
        
        // Set up close button
        dataModal.querySelector('.close-button').addEventListener('click', () => {
            dataModal.classList.remove('show');
            setTimeout(() => {
                dataModal.remove();
            }, 300);
        });
        
        // Set up data options
        dataModal.querySelectorAll('.data-option').forEach(option => {
            option.addEventListener('click', () => {
                const dataType = option.dataset.option;
                this.accessDataRepository(dataType);
            });
        });
        
        // Set up terminal input
        const terminalInput = dataModal.querySelector('#terminal-command');
        terminalInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                const command = terminalInput.value.trim();
                this.processTerminalCommand(command);
                terminalInput.value = '';
            }
        });
        
        // Auto-focus input
        setTimeout(() => {
            terminalInput.focus();
        }, 500);
    },
    
    accessDataRepository(dataType) {
        const terminalOutput = document.querySelector('.terminal-output');
        if (!terminalOutput) return;
        
        // Add accessing message
        this.addTerminalLine(`Accessing ${dataType}...`);
        
        setTimeout(() => {
            switch(dataType) {
                case 'guest-records':
                    this.accessGuestRecords();
                    break;
                    
                case 'maintenance-logs':
                    this.accessMaintenanceLogs();
                    break;
                    
                case 'night-elk':
                    this.accessNightElkFiles();
                    break;
                    
                case 'security':
                    this.accessSecuritySystem();
                    break;
            }
        }, 1000);
    },
    
    accessGuestRecords() {
        this.addTerminalLine('Guest Records Database');
        this.addTerminalLine('----------------------');
        this.addTerminalLine('Recent check-ins:');
        this.addTerminalLine('- Room 3021: Yucheng (3-day stay, perfume designer)');
        this.addTerminalLine('- Room 3305: [REDACTED] (Indefinite stay, staff clearance)');
        this.addTerminalLine('- Room 4012: Jones, M. (2-day stay, business)');
        this.addTerminalLine('- Room 5008: Smith, A. (5-day stay, tourist)');
        this.addTerminalLine('----------------------');
        this.addTerminalLine('Note: Room 3305 records require level 2 clearance to access.');
        
        // Add to discovered secrets
        if (typeof app !== 'undefined') {
            if (!app.state.player.discoveredSecrets.includes('room-3305')) {
                app.state.player.discoveredSecrets.push('room-3305');
                
                // Increase puzzle progress
                app.state.gameState.puzzleProgress += 10;
                
                // Add notification
                app.showNotification({
                    type: 'info',
                    title: 'New Information',
                    message: 'You discovered information about Room 3305, which seems to have special status.'
                });
            }
        }
    },
    
    accessMaintenanceLogs() {
        this.addTerminalLine('Maintenance Log System');
        this.addTerminalLine('----------------------');
        this.addTerminalLine('Recent maintenance issues:');
        this.addTerminalLine('- Floor 8: [ACCESS DENIED]');
        this.addTerminalLine('- Floor 9: Water temperature regulation malfunction (ongoing)');
        this.addTerminalLine('- Floor 10: Hot/cold water exchange timing adjusted (resolved)');
        this.addTerminalLine('- Floor 14: Night-time water supply restored (resolved)');
        this.addTerminalLine('----------------------');
        this.addTerminalLine('Note: Floor 8 maintenance records are restricted.');
        
        // Add to discovered secrets
        if (typeof app !== 'undefined') {
            if (!app.state.player.discoveredSecrets.includes('floor-8-maintenance')) {
                app.state.player.discoveredSecrets.push('floor-8-maintenance');
                
                // Increase puzzle progress
                app.state.gameState.puzzleProgress += 5;
            }
        }
    },
    
    accessNightElkFiles() {
        this.addTerminalLine('Attempting to access Night Elk Files...');
        this.addTerminalLine('');
        this.addTerminalLine('ACCESS DENIED', 'password-protected');
        this.addTerminalLine('');
        this.addTerminalLine('Password required to access this repository.');
        this.addTerminalLine('Hint: 4-digit numeric code');
        this.addTerminalLine('');
        this.addTerminalLine('Use command: access night-elk [password]');
        
        // Add to discovered secrets
        if (typeof app !== 'undefined') {
            // This is a major clue for the Night Elk puzzle
            if (!app.state.player.discoveredSecrets.includes('night-elk-password')) {
                app.state.player.discoveredSecrets.push('night-elk-password');
                
                // Add notification
                app.showNotification({
                    type: 'info',
                    title: 'Password Protected',
                    message: 'The Night Elk files require a 4-digit numeric password. You\'ve seen this number somewhere before...'
                });
            }
        }
    },
    
    accessSecuritySystem() {
        this.addTerminalLine('Security System Access');
        this.addTerminalLine('----------------------');
        this.addTerminalLine('Current security status: NORMAL');
        this.addTerminalLine('');
        this.addTerminalLine('Access points:');
        this.addTerminalLine('- Elevator monitoring');
        this.addTerminalLine('- Corridor cameras');
        this.addTerminalLine('- Room access logs');
        this.addTerminalLine('');
        this.addTerminalLine('Note: Full access requires security clearance.');
        this.addTerminalLine('Limited functions available with command: security [function]');
    },
    
    processTerminalCommand(command) {
        this.addTerminalLine(`> ${command}`);
        
        // Handle various commands
        if (command.toLowerCase() === 'help') {
            this.showHelpCommands();
        } else if (command.toLowerCase() === 'clear') {
            this.clearTerminal();
        } else if (command.toLowerCase().startsWith('access night-elk')) {
            this.processNightElkAccess(command);
        } else if (command.toLowerCase().startsWith('security')) {
            this.processSecurityCommand(command);
        } else if (command.toLowerCase() === 'ls' || command.toLowerCase() === 'dir') {
            this.listRepositories();
        } else if (command.toLowerCase() === 'exit') {
            document.getElementById('data-access-modal').querySelector('.close-button').click();
        } else {
            this.addTerminalLine('Command not recognized. Type "help" for available commands.', 'command-error');
        }
    },
    
    showHelpCommands() {
        this.addTerminalLine('Available commands:');
        this.addTerminalLine('- help: Show this help message');
        this.addTerminalLine('- clear: Clear terminal output');
        this.addTerminalLine('- ls / dir: List available data repositories');
        this.addTerminalLine('- access night-elk [password]: Access Night Elk files with password');
        this.addTerminalLine('- security [function]: Access security functions');
        this.addTerminalLine('- exit: Close terminal');
    },
    
    clearTerminal() {
        const terminalOutput = document.querySelector('.terminal-output');
        if (terminalOutput) {
            terminalOutput.innerHTML = '';
            this.addTerminalLine('Terminal cleared.');
        }
    },
    
    listRepositories() {
        this.addTerminalLine('Available data repositories:');
        this.addTerminalLine('- guest-records');
        this.addTerminalLine('- maintenance-logs');
        this.addTerminalLine('- night-elk (password protected)');
        this.addTerminalLine('- security');
    },
    
    processNightElkAccess(command) {
        // Extract password from command
        const parts = command.split(' ');
        if (parts.length < 3) {
            this.addTerminalLine('Usage: access night-elk [password]', 'command-error');
            return;
        }
        
        const password = parts[2];
        
        // Check if password is correct (9321)
        if (password === '9321') {
            this.addTerminalLine('Password accepted. Accessing Night Elk files...', 'access-granted');
            
            setTimeout(() => {
                this.showNightElkFiles();
            }, 1500);
            
            // Major discovery for the game plot
            if (typeof app !== 'undefined') {
                // This is a major advancement in the Night Elk puzzle
                app.state.gameState.puzzleProgress += 30;
                
                // Add notification
                app.showNotification({
                    type: 'success',
                    title: 'Night Elk Access',
                    message: 'You\'ve successfully accessed the secret Night Elk files!'
                });
                
                // Add to discovered secrets
                if (!app.state.player.discoveredSecrets.includes('night-elk-access')) {
                    app.state.player.discoveredSecrets.push('night-elk-access');
                }
            }
        } else {
            this.addTerminalLine('Incorrect password. Access denied.', 'command-error');
        }
    },
    
    showNightElkFiles() {
        this.addTerminalLine('NIGHT ELK PROGRAM');
        this.addTerminalLine('================');
        this.addTerminalLine('Classification: CONFIDENTIAL');
        this.addTerminalLine('');
        this.addTerminalLine('Project Overview:');
        this.addTerminalLine('The Night Elk Program is a psychological experiment designed to study');
        this.addTerminalLine('human perception of reality under controlled anomalous conditions.');
        this.addTerminalLine('');
        this.addTerminalLine('Key Components:');
        this.addTerminalLine('1. Reality Distortion Protocol');
        this.addTerminalLine('2. Quantum Procedural Induction');
        this.addTerminalLine('3. Memory Manipulation Techniques');
        this.addTerminalLine('');
        this.addTerminalLine('Current Subjects:');
        this.addTerminalLine('- Subject YC-3021 (active)');
        this.addTerminalLine('- Subject MS-4012 (control)');
        this.addTerminalLine('- Subject AS-5008 (control)');
        this.addTerminalLine('');
        this.addTerminalLine('Note from Project Director Kuang:');
        this.addTerminalLine('"The ¥1,000,000 incentive appears to be working as designed.');
        this.addTerminalLine('Continue monitoring subject YC-3021 for signs of procedural integration."');
        
        // Add to discovered secrets
        if (typeof app !== 'undefined') {
            // This reveals the truth about the Night Elk program
            if (!app.state.player.discoveredSecrets.includes('night-elk-truth')) {
                app.state.player.discoveredSecrets.push('night-elk-truth');
                
                // This is a major revelation - player is part of an experiment
                setTimeout(() => {
                    app.showNotification({
                        type: 'warning',
                        title: 'Disturbing Discovery',
                        message: 'You appear to be a test subject in the Night Elk Program, referred to as "Subject YC-3021".'
                    });
                }, 5000);
            }
        }
    },
    
    processSecurityCommand(command) {
        // Extract function from command
        const parts = command.split(' ');
        if (parts.length < 2) {
            this.addTerminalLine('Usage: security [function]', 'command-error');
            this.addTerminalLine('Available functions: status, cameras, elevator');
            return;
        }
        
        const function_ = parts[1].toLowerCase();
        
        switch(function_) {
            case 'status':
                this.addTerminalLine('Security Status: NORMAL');
                this.addTerminalLine('Last incident: None in past 72 hours');
                break;
                
            case 'cameras':
                this.addTerminalLine('Camera Feed Access:');
                this.addTerminalLine('- Floor 3 Corridor: Normal activity');
                this.addTerminalLine('- Floor 5 Area B: Normal activity');
                this.addTerminalLine('- Floor 8: [FEED UNAVAILABLE]');
                
                // Add to discovered secrets
                if (typeof app !== 'undefined') {
                    if (!app.state.player.discoveredSecrets.includes('floor-8-cameras')) {
                        app.state.player.discoveredSecrets.push('floor-8-cameras');
                        
                        // Add notification
                        app.showNotification({
                            type: 'info',
                            title: 'Strange Discovery',
                            message: 'The cameras on Floor 8 appear to be disabled or unavailable.'
                        });
                    }
                }
                break;
                
            case 'elevator':
                this.addTerminalLine('Elevator Status:');
                this.addTerminalLine('- Elevator 1: Operational');
                this.addTerminalLine('- Elevator 2: Operational');
                this.addTerminalLine('- Elevator 3: Operational');
                this.addTerminalLine('');
                this.addTerminalLine('8th Floor Access: RESTRICTED');
                this.addTerminalLine('Override requires authorization code.');
                
                // Add to discovered secrets
                if (typeof app !== 'undefined') {
                    if (!app.state.player.discoveredSecrets.includes('elevator-override')) {
                        app.state.player.discoveredSecrets.push('elevator-override');
                    }
                }
                break;
                
            default:
                this.addTerminalLine(`Unknown security function: ${function_}`, 'command-error');
                this.addTerminalLine('Available functions: status, cameras, elevator');
        }
    },
    
    addTerminalLine(text, className = '') {
        const terminalOutput = document.querySelector('.terminal-output');
        if (!terminalOutput) return;
        
        const line = document.createElement('div');
        line.className = `terminal-line ${className}`;
        line.textContent = text;
        
        terminalOutput.appendChild(line);
        
        // Scroll to bottom
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    },
    
    interactWithToilet() {
        // Show message
        this.updateStatusMessage('You examine the toilet. It\'s clean and well-maintained.');
        
        if (typeof app !== 'undefined') {
            app.showNotification({
                type: 'info',
                title: 'Toilet',
                message: 'The toilet is clean and well-maintained.'
            });
        }
        
        // Add to interaction history
        this.recordInteraction('toilet');
        
        // Random chance to find a clue based on discovered information
        if (typeof app !== 'undefined' && app.state.player.discoveredSecrets.includes('toilet-area-l')) {
            if (Math.random() < 0.5) {
                setTimeout(() => {
                    app.showNotification({
                        type: 'info',
                        title: 'Strange Discovery',
                        message: 'You notice something etched inside the toilet tank lid: the numbers "9321" and a crude drawing of what looks like an elk.'
                    });
                    
                    // Add to discovered secrets
                    if (!app.state.player.discoveredSecrets.includes('toilet-numbers')) {
                        app.state.player.discoveredSecrets.push('toilet-numbers');
                        
                        // Increase puzzle progress
                        app.state.gameState.puzzleProgress += 15;
                    }
                }, 2000);
            }
        }
    },
    
    interactWithSink() {
        // Show message
        this.updateStatusMessage('You turn on the sink faucet.');
        
        if (typeof app !== 'undefined') {
            app.showNotification({
                type: 'info',
                title: 'Sink',
                message: 'You turn on the sink faucet and wash your hands.'
            });
        }
        
        // Add to interaction history
        this.recordInteraction('sink');
        
        // Check for water schedule based on floor (similar to bathtub)
        if (typeof app !== 'undefined') {
            const floor = parseInt(this.state.roomNumber.substring(0, 2));
            
            // Check if this floor has special water rules
            if (app.state.hotel.waterSchedule && app.state.hotel.waterSchedule[floor]) {
                const waterRule = app.state.hotel.waterSchedule[floor];
                
                // Check if water is available based on rules
                let waterAvailable = true;
                if (typeof waterRule.hasWater === 'function') {
                    waterAvailable = waterRule.hasWater(app.state.hotel.currentTime);
                } else if (waterRule.hasWater === false) {
                    waterAvailable = false;
                }
                
                if (!waterAvailable) {
                    setTimeout(() => {
                        app.showNotification({
                            type: 'error',
                            title: 'No Water',
                            message: waterRule.note || 'There is no water available on this floor at this time.'
                        });
                    }, 2000);
                    return;
                }
            }
        }
    },
    
    interactWithHotelInfo() {
        // Show message
        this.updateStatusMessage('You browse through the hotel information booklet.');
        
        if (typeof app !== 'undefined') {
            app.showNotification({
                type: 'info',
                title: 'Hotel Information',
                message: 'You read through the hotel information booklet to learn more about the facilities and rules.'
            });
        }
        
        // Add to interaction history
        this.recordInteraction('hotel-info');
        
        // Show hotel rules as a separate modal
        this.showHotelRulesModal();
    },
    
    showHotelRulesModal() {
        const rulesModal = document.createElement('div');
        rulesModal.className = 'modal show';
        rulesModal.id = 'hotel-rules-modal';
        
        rulesModal.innerHTML = `
            <div class="modal-content rules-content">
                <div class="modal-header">
                    <h3>Hotel Information & Rules</h3>
                    <span class="close-button">&times;</span>
                </div>
                <div class="rules-container">
                    <div class="hotel-description">
                        <p>The "Amman" hotel chain balance beam branch is located at No. 109 Hesheng Road, Shancheng District. It has been established for 20 years and 276 days.</p>
                    </div>
                    <div class="rules-list">
                        <h4>Hotel Rules & Procedures</h4>
                        <div class="rule-item">
                            <strong>1.</strong> 3 elevators, directly to the 1st to 7th floors, and then from the 9th floor to the 15th floor, less than the 8th floor
                        </div>
                        <div class="rule-item">
                            <strong>3.</strong> Candies, cakes, and snacks at the front desk can be tasted for free, not for sale, limited quantity, and cannot be brought into the room
                        </div>
                        <div class="rule-item">
                            <strong>5.</strong> Breakfast time is: 7:00-8:30 am, not applicable to internal staff
                        </div>
                        <div class="rule-item">
                            <strong>6.</strong> A public toilet is provided on each floor of the corridor. It is not allowed to take a bath, wash clothes or engage in large-scale activities and private activities.
                        </div>
                        <div class="rule-item">
                            <strong>9.</strong> 9th floor: no hot water
                        </div>
                        <div class="rule-item">
                            <strong>10.</strong> 10th floor: hot and cold exchange
                        </div>
                        <div class="rule-item">
                            <strong>14.</strong> 14th floor: water supply after 10:00 pm
                        </div>
                        <div class="rule-item">
                            <strong>15.</strong> 1st floor: no water supply (except Saturday and Sunday)
                        </div>
                        <div class="rule-item">
                            <strong>Note:</strong> The person in charge, Kuang Shengyou, reserves the final right of interpretation of the service and all design requirements and exceptions.
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(rulesModal);
        
        // Add specialized CSS
        const style = document.createElement('style');
        style.textContent = `
            .rules-content {
                max-width: 700px;
            }
            
            .hotel-description {
                margin-bottom: 20px;
                padding-bottom: 10px;
                border-bottom: 1px solid #eee;
            }
            
            .rules-list {
                max-height: 400px;
                overflow-y: auto;
            }
            
            .rule-item {
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 1px solid #f0f0f0;
            }
        `;
        document.head.appendChild(style);
        
        // Set up close button
        rulesModal.querySelector('.close-button').addEventListener('click', () => {
            rulesModal.classList.remove('show');
            setTimeout(() => {
                rulesModal.remove();
            }, 300);
        });
        
        // Mark task as completed
        if (typeof app !== 'undefined') {
            const reviewRulesTask = app.state.player.taskList.find(t => t.id === 'task-2');
            if (reviewRulesTask && !reviewRulesTask.completed) {
                app.completeTask('task-2');
            }
            
            // Set flag for having reviewed rules
            app.narrative.state.plotFlags.reviewedRules = true;
        }
    },
    
    toggleDeskLamp() {
        // Show message
        this.updateStatusMessage('You toggle the desk lamp.');
        
        const deskLamp = document.querySelector('.desk-lamp');
        if (!deskLamp) return;
        
        // Toggle lamp on/off
        if (!deskLamp.classList.contains('lamp-on')) {
            deskLamp.classList.add('lamp-on');
            deskLamp.querySelector('div:first-child').style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.7)';
            
            if (typeof app !== 'undefined') {
                app.showNotification({
                    type: 'info',
                    title: 'Desk Lamp',
                    message: 'You turn on the desk lamp.'
                });
            }
        } else {
            deskLamp.classList.remove('lamp-on');
            deskLamp.querySelector('div:first-child').style.boxShadow = 'none';
            
            if (typeof app !== 'undefined') {
                app.showNotification({
                    type: 'info',
                    title: 'Desk Lamp',
                    message: 'You turn off the desk lamp.'
                });
            }
        }
        
        // Add to interaction history
        this.recordInteraction('desk-lamp');
    },
    
    interactWithNotepad() {
        // Show message
        this.updateStatusMessage('You examine the notepad on the desk.');
        
        if (typeof app !== 'undefined') {
            app.showNotification({
                type: 'info',
                title: 'Notepad',
                message: 'You examine the notepad on the desk. It appears to be blank.'
            });
        }
        
        // Add to interaction history
        this.recordInteraction('notepad');
        
        // Check for anomalies
        if (this.checkForAnomalies()) {
            // Random chance to find hidden text on the notepad
            if (Math.random() < 0.4) {
                setTimeout(() => {
                    if (typeof app !== 'undefined') {
                        app.showNotification({
                            type: 'info',
                            title: 'Hidden Message',
                            message: 'When you tilt the notepad at an angle, you notice faint impressions on the paper - someone wrote on the previous page. It seems to say "Check toilet in Area L" and "9321".'
                        });
                        
                        // Add to discovered secrets
                        if (!app.state.player.discoveredSecrets.includes('toilet-area-l')) {
                            app.state.player.discoveredSecrets.push('toilet-area-l');
                            
                            // Increase puzzle progress
                            app.state.gameState.puzzleProgress += 15;
                        }
                    }
                }, 2000);
            }
        }
    },
    
    observeFromWindow() {
        // Show message
        this.updateStatusMessage('You gaze out the window at the rainy cityscape.');
        
        if (typeof app !== 'undefined') {
            app.showNotification({
                type: 'info',
                title: 'Window View',
                message: 'You look out the window. It\'s raining heavily outside. The city looks gray and somewhat distorted through the rain.'
            });
        }
        
        // Add to interaction history
        this.recordInteraction('window');
        
        // Random chance to notice something strange outside
        if (Math.random() < 0.3) {
            setTimeout(() => {
                if (typeof app !== 'undefined') {
                    app.showNotification({
                        type: 'warning',
                        title: 'Strange Sight',
                        message: 'Through the rain, you notice someone standing across the street, looking directly at your window. They appear to be wearing some kind of animal mask... perhaps a deer or elk?'
                    });
                    
                    // Add to discovered secrets
                    if (!app.state.player.discoveredSecrets.includes('window-watcher')) {
                        app.state.player.discoveredSecrets.push('window-watcher');
                        
                        // Increase anomaly level
                        app.state.gameState.anomalyLevel += 5;
                    }
                }
            }, 3000);
        }
    },
    
    lookThroughPeephole() {
        // Show message
        this.updateStatusMessage('You look through the door peephole into the corridor.');
        
        if (typeof app !== 'undefined') {
            app.showNotification({
                type: 'info',
                title: 'Peephole',
                message: 'You peer through the peephole into the corridor. It appears empty.'
            });
        }
        
        // Add to interaction history
        this.recordInteraction('peephole');
        
        // Random chance to see something unusual
        if (Math.random() < 0.3 || this.state.viewingPhantomNote) {
            setTimeout(() => {
                if (typeof app !== 'undefined') {
                    app.showNotification({
                        type: 'warning',
                        title: 'Unexpected Sight',
                        message: 'Just as you\'re about to look away, you notice someone has placed something on your door. It looks like a note.'
                    });
                    
                    // Add ability to read note
                    this.state.viewingPhantomNote = true;
                    this.addDoorNote();
                }
            }, 2000);
        }
    },
    
    addDoorNote() {
        const doorView = document.querySelector('.door-container');
        if (!doorView) return;
        
        // Check if note already exists
        if (doorView.querySelector('.door-note')) return;
        
        // Create note element
        const noteElement = document.createElement('div');
        noteElement.className = 'door-note';
        noteElement.style.cssText = `
            position: absolute;
            top: 60px;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
            height: 70px;
            background-color: #fff;
            border: 1px solid #ddd;
            padding: 5px;
            font-size: 0.8rem;
            cursor: pointer;
            z-index: 10;
            display: flex;
            justify-content: center;
            align-items: center;
        `;
        
        noteElement.innerHTML = '<i class="fas fa-sticky-note"></i>';
        
        doorView.appendChild(noteElement);
        
        // Add animation to draw attention
        const noteAnimation = document.createElement('style');
        noteAnimation.textContent = `
            @keyframes note-pulse {
                0% { transform: translateX(-50%) scale(1); }
                50% { transform: translateX(-50%) scale(1.1); }
                100% { transform: translateX(-50%) scale(1); }
            }
            
            .door-note {
                animation: note-pulse 2s infinite;
            }
        `;
        document.head.appendChild(noteAnimation);
        
        // Add click handler
        noteElement.addEventListener('click', () => {
            this.readDoorNote();
        });
    },
    
    readDoorNote() {
        // Create note modal
        const noteModal = document.createElement('div');
        noteModal.className = 'modal show';
        noteModal.id = 'note-modal';
        
        noteModal.innerHTML = `
            <div class="modal-content note-content">
                <div class="modal-header">
                    <h3>Mysterious Note</h3>
                    <span class="close-button">&times;</span>
                </div>
                <div class="note-body">
                    <p>The Night Elk waits in Area L.</p>
                    <p>9321 is the key.</p>
                    <p>Trust no one, especially not the front desk.</p>
                    <p>- K</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(noteModal);
        
        // Add specialized CSS
        const style = document.createElement('style');
        style.textContent = `
            .note-content {
                max-width: 400px;
            }
            
            .note-body {
                padding: 20px;
                font-family: 'Courier New', monospace;
                line-height: 1.6;
                background-color: #fffdf0;
                border: 1px solid #e0e0e0;
                border-radius: 5px;
            }
        `;
        document.head.appendChild(style);
        
        // Set up close button
        noteModal.querySelector('.close-button').addEventListener('click', () => {
            noteModal.classList.remove('show');
            setTimeout(() => {
                noteModal.remove();
            }, 300);
        });
        
        // Add to discovered secrets
        if (typeof app !== 'undefined') {
            if (!app.state.player.discoveredSecrets.includes('mysterious-note')) {
                app.state.player.discoveredSecrets.push('mysterious-note');
                
                // Progress Night Elk puzzle significantly
                app.state.gameState.puzzleProgress += 20;
                
                // Increase anomaly level
                app.state.gameState.anomalyLevel += 10;
            }
        }
        
        // Reset note state
        this.state.viewingPhantomNote = false;
        
        // Remove note from door
        setTimeout(() => {
            const noteElement = document.querySelector('.door-note');
            if (noteElement) {
                noteElement.remove();
            }
        }, 1000);
    },
    
    openDoor() {
        // Show message
        this.updateStatusMessage('You try to open the door to your room.');
        
        if (typeof app !== 'undefined') {
            app.showNotification({
                type: 'info',
                title: 'Room Door',
                message: 'You open the door to check the hallway.'
            });
        }
        
        // Add to interaction history
        this.recordInteraction('door');
        
        // Show corridor view
        this.showCorridorView();
    },
    
    showCorridorView() {
        // Create corridor modal
        const corridorModal = document.createElement('div');
        corridorModal.className = 'modal show';
        corridorModal.id = 'corridor-modal';
        
        corridorModal.innerHTML = `
            <div class="modal-content corridor-content">
                <div class="modal-header">
                    <h3>Floor ${this.state.roomNumber.substring(0, 2)} Corridor</h3>
                    <span class="close-button">&times;</span>
                </div>
                <div class="corridor-view">
                    <div class="corridor-scene">
                        <div class="corridor-floor"></div>
                        <div class="corridor-ceiling"></div>
                        <div class="corridor-left-wall"></div>
                        <div class="corridor-right-wall"></div>
                        <div class="corridor-end"></div>
                        
                        <div class="room-doors">
                            <div class="room-door left-door" data-room="${this.state.roomNumber.substring(0, 2)}19">
                                <div class="door-number">${this.state.roomNumber.substring(0, 2)}19</div>
                            </div>
                            <div class="room-door right-door" data-room="${this.state.roomNumber.substring(0, 2)}20">
                                <div class="door-number">${this.state.roomNumber.substring(0, 2)}20</div>
                            </div>
                            <div class="room-door left-door yours" data-room="${this.state.roomNumber}">
                                <div class="door-number">${this.state.roomNumber}</div>
                                <div class="your-room-label">Your Room</div>
                            </div>
                            <div class="room-door right-door" data-room="${this.state.roomNumber.substring(0, 2)}22">
                                <div class="door-number">${this.state.roomNumber.substring(0, 2)}22</div>
                            </div>
                        </div>
                        
                        <div class="corridor-elements">
                            <div class="elevator-access">
                                <i class="fas fa-arrow-up"></i>
                                <span>Elevator</span>
                            </div>
                            
                            <div class="public-bathroom">
                                <i class="fas fa-restroom"></i>
                                <span>Restroom</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="corridor-actions">
                    <button id="return-to-room" class="action-button">
                        <i class="fas fa-door-closed"></i> Return to Room
                    </button>
                    <button id="go-to-elevator" class="action-button">
                        <i class="fas fa-arrow-up"></i> Go to Elevator
                    </button>
                    <button id="check-public-bathroom" class="action-button">
                        <i class="fas fa-restroom"></i> Check Public Bathroom
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(corridorModal);
        
        // Add specialized CSS
        const style = document.createElement('style');
        style.textContent = `
            .corridor-content {
                max-width: 800px;
                height: 600px;
                display: flex;
                flex-direction: column;
            }
            
            .corridor-view {
                flex: 1;
                position: relative;
                overflow: hidden;
            }
            
            .corridor-scene {
                width: 100%;
                height: 100%;
                position: relative;
                perspective: 800px;
                background-color: #2c3e50;
            }
            
            .corridor-floor {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 40%;
                background: linear-gradient(to bottom, #34495e 0%, #2c3e50 100%);
                transform: rotateX(60deg);
                transform-origin: bottom;
            }
            
            .corridor-ceiling {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 30%;
                background: linear-gradient(to top, #34495e 0%, #2c3e50 100%);
                transform: rotateX(-60deg);
                transform-origin: top;
            }
            
            .corridor-left-wall, .corridor-right-wall {
                position: absolute;
                top: 30%;
                height: 40%;
                width: 100%;
                background-color: #34495e;
            }
            
            .corridor-left-wall {
                left: 0;
                transform: rotateY(75deg);
                transform-origin: left;
            }
            
            .corridor-right-wall {
                right: 0;
                transform: rotateY(-75deg);
                transform-origin: right;
            }
            
            .corridor-end {
                position: absolute;
                top: 30%;
                left: 50%;
                transform: translateX(-50%);
                width: 30%;
                height: 40%;
                background-color: #2c3e50;
                z-index: -1;
            }
            
            .room-doors {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10;
            }
            
            .room-door {
                position: absolute;
                width: 60px;
                height: 100px;
                background-color: #8b4513;
                border-radius: 5px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .room-door:hover {
                transform: scale(1.05);
                box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
            }
            
            .left-door {
                left: 20%;
            }
            
            .right-door {
                right: 20%;
            }
            
            .room-door.yours {
                background-color: #d35400;
            }
            
            .door-number {
                position: absolute;
                top: 10px;
                left: 50%;
                transform: translateX(-50%);
                background-color: #c0c0c0;
                padding: 2px 5px;
                border-radius: 3px;
                font-size: 0.7rem;
            }
            
            .your-room-label {
                position: absolute;
                bottom: -20px;
                left: 50%;
                transform: translateX(-50%);
                color: white;
                font-size: 0.7rem;
                white-space: nowrap;
            }
            
            .corridor-elements {
                position: absolute;
                bottom: 10%;
                left: 0;
                width: 100%;
                display: flex;
                justify-content: space-around;
            }
            
            .elevator-access, .public-bathroom {
                display: flex;
                flex-direction: column;
                align-items: center;
                color: white;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .elevator-access:hover, .public-bathroom:hover {
                transform: scale(1.1);
                color: #f39c12;
            }
            
            .elevator-access i, .public-bathroom i {
                font-size: 2rem;
                margin-bottom: 5px;
            }
            
            .corridor-actions {
                padding: 15px;
                display: flex;
                gap: 10px;
                justify-content: center;
                border-top: 1px solid #eee;
            }
        `;
        document.head.appendChild(style);
        
        // Position doors based on room number
        const roomNumber = parseInt(this.state.roomNumber.substring(2));
        const roomDoors = corridorModal.querySelectorAll('.room-door');
        
        roomDoors.forEach((door, index) => {
            const baseTop = 30 + (index * 10);
            door.style.top = `${baseTop}%`;
        });
        
        // Set up close button
        corridorModal.querySelector('.close-button').addEventListener('click', () => {
            corridorModal.classList.remove('show');
            setTimeout(() => {
                corridorModal.remove();
            }, 300);
        });
        
        // Set up action buttons
        corridorModal.querySelector('#return-to-room').addEventListener('click', () => {
            corridorModal.classList.remove('show');
            setTimeout(() => {
                corridorModal.remove();
            }, 300);
        });
        
        corridorModal.querySelector('#go-to-elevator').addEventListener('click', () => {
            corridorModal.classList.remove('show');
            setTimeout(() => {
                corridorModal.remove();
                
                // Show elevator modal if available
                if (typeof app !== 'undefined' && app.elevator) {
                    app.elevator.showElevatorModal();
                }
            }, 300);
        });
        
        corridorModal.querySelector('#check-public-bathroom').addEventListener('click', () => {
            corridorModal.classList.remove('show');
            setTimeout(() => {
                corridorModal.remove();
                
                // Show public bathroom view
                this.showPublicBathroomView();
            }, 300);
        });
        
        // Set up interactive elements
        corridorModal.querySelector('.elevator-access').addEventListener('click', () => {
            corridorModal.querySelector('#go-to-elevator').click();
        });
        
        corridorModal.querySelector('.public-bathroom').addEventListener('click', () => {
            corridorModal.querySelector('#check-public-bathroom').click();
        });
        
        // Check for anomalies
        if (this.checkForAnomalies()) {
            setTimeout(() => {
                this.triggerCorridorAnomaly(corridorModal);
            }, 5000);
        }
    },
    
    showPublicBathroomView() {
        // Create bathroom modal
        const bathroomModal = document.createElement('div');
        bathroomModal.className = 'modal show';
        bathroomModal.id = 'public-bathroom-modal';
        
        bathroomModal.innerHTML = `
            <div class="modal-content bathroom-content">
                <div class="modal-header">
                    <h3>Public Bathroom - Floor ${this.state.roomNumber.substring(0, 2)}</h3>
                    <span class="close-button">&times;</span>
                </div>
                <div class="bathroom-view">
                    <div class="bathroom-scene">
                        <div class="bathroom-stalls">
                            <div class="bathroom-stall" data-stall="1">
                                <div class="stall-door"></div>
                            </div>
                            <div class="bathroom-stall" data-stall="2">
                                <div class="stall-door"></div>
                            </div>
                            <div class="bathroom-stall" data-stall="3">
                                <div class="stall-door"></div>
                            </div>
                        </div>
                        <div class="bathroom-sinks">
                            <div class="bathroom-sink"></div>
                            <div class="bathroom-sink"></div>
                        </div>
                    </div>
                </div>
                <div class="bathroom-actions">
                    <button id="return-to-corridor" class="action-button">
                        <i class="fas fa-arrow-left"></i> Return to Corridor
                    </button>
                    <button id="check-stalls" class="action-button">
                        <i class="fas fa-door-closed"></i> Check Stalls
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(bathroomModal);
        
        // Add specialized CSS
        const style = document.createElement('style');
        style.textContent = `
            .bathroom-content {
                max-width: 700px;
                height: 500px;
                display: flex;
                flex-direction: column;
            }
            
            .bathroom-view {
                flex: 1;
                position: relative;
                overflow: hidden;
            }
            
            .bathroom-scene {
                width: 100%;
                height: 100%;
                background-color: #e0e0e0;
                position: relative;
                display: flex;
                flex-direction: column;
            }
            
            .bathroom-stalls {
                display: flex;
                justify-content: space-around;
                padding: 30px;
                flex: 2;
            }
            
            .bathroom-stall {
                width: 120px;
                height: 150px;
                background-color: #d0d0d0;
                position: relative;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .bathroom-stall:hover {
                transform: scale(1.05);
            }
            
            .stall-door {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: #a0a0a0;
                transform-origin: left;
                transition: transform 0.5s ease;
            }
            
            .stall-door.open {
                transform: rotateY(-80deg);
            }
            
            .bathroom-sinks {
                display: flex;
                justify-content: center;
                gap: 50px;
                padding: 20px;
                flex: 1;
            }
            
            .bathroom-sink {
                width: 80px;
                height: 50px;
                background-color: white;
                border-radius: 5px;
            }
            
            .bathroom-actions {
                padding: 15px;
                display: flex;
                gap: 10px;
                justify-content: center;
                border-top: 1px solid #eee;
            }
            
            .stall-note {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 60px;
                height: 40px;
                background-color: #fff;
                border: 1px solid #ddd;
                padding: 5px;
                font-size: 0.7rem;
                text-align: center;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
        `;
        document.head.appendChild(style);
        
        // Set up close button
        bathroomModal.querySelector('.close-button').addEventListener('click', () => {
            bathroomModal.classList.remove('show');
            setTimeout(() => {
                bathroomModal.remove();
            }, 300);
        });
        
        // Set up action buttons
        bathroomModal.querySelector('#return-to-corridor').addEventListener('click', () => {
            bathroomModal.classList.remove('show');
            setTimeout(() => {
                bathroomModal.remove();
                
                // Show corridor view
                this.showCorridorView();
            }, 300);
        });
        
        bathroomModal.querySelector('#check-stalls').addEventListener('click', () => {
            // Open all stall doors
            bathroomModal.querySelectorAll('.stall-door').forEach(door => {
                door.classList.add('open');
            });
            
            // Check for Night Elk clue
            this.checkForBathroomClues(bathroomModal);
        });
        
        // Set up stall interactions
        bathroomModal.querySelectorAll('.bathroom-stall').forEach(stall => {
            stall.addEventListener('click', () => {
                const stallDoor = stall.querySelector('.stall-door');
                stallDoor.classList.toggle('open');
                
                // Check for clues if opened
                if (stallDoor.classList.contains('open')) {
                    const stallNumber = stall.dataset.stall;
                    this.checkStallForClues(stall, stallNumber);
                }
            });
        });
    },
    
    checkForBathroomClues(bathroomModal) {
        // Special case for Area L toilet if on 9th floor
        if (this.state.roomNumber.substring(0, 2) === '09' && typeof app !== 'undefined') {
            // This is the Area L bathroom mentioned in clues
            if (app.state.player.discoveredSecrets.includes('toilet-area-l')) {
                // Add Night Elk poster to stall 3
                const stall3 = bathroomModal.querySelector('.bathroom-stall[data-stall="3"]');
                if (stall3) {
                    setTimeout(() => {
                        app.showNotification({
                            type: 'info',
                            title: 'Torn Poster',
                            message: 'You notice a torn poster in the third stall with information about the Night Elk Program.'
                        });
                        
                        // Create the torn poster
                        const posterElement = document.createElement('div');
                        posterElement.className = 'stall-note night-elk-poster';
                        posterElement.innerHTML = `
                            <div style="font-weight: bold;">NIGHT ELK</div>
                            <div style="font-size: 0.6rem;">CODE: 9321</div>
                        `;
                        
                        stall3.appendChild(posterElement);
                        
                        // Add to discovered secrets
                        if (!app.state.player.discoveredSecrets.includes('night-elk-poster')) {
                            app.state.player.discoveredSecrets.push('night-elk-poster');
                            
                            // Major progress for Night Elk puzzle
                            app.state.gameState.puzzleProgress += 25;
                        }
                    }, 1000);
                }
            }
        } else {
            // Random chance for bathroom graffiti
            if (Math.random() < 0.3) {
                // Choose a random stall
                const stalls = bathroomModal.querySelectorAll('.bathroom-stall');
                const randomStall = stalls[Math.floor(Math.random() * stalls.length)];
                
                if (randomStall) {
                    setTimeout(() => {
                        // Create graffiti
                        const graffitiElement = document.createElement('div');
                        graffitiElement.className = 'stall-note graffiti';
                        graffitiElement.style.transform = 'translate(-50%, -50%) rotate(-5deg)';
                        
                        // Choose random graffiti content
                        const graffitiOptions = [
                            "The 8th floor exists",
                            "9321 is the key",
                            "Kuang watches all",
                            "Front desk lies"
                        ];
                        
                        graffitiElement.textContent = graffitiOptions[Math.floor(Math.random() * graffitiOptions.length)];
                        
                        randomStall.appendChild(graffitiElement);
                        
                        if (typeof app !== 'undefined') {
                            app.showNotification({
                                type: 'info',
                                title: 'Bathroom Graffiti',
                                message: `You notice some graffiti in one of the stalls: "${graffitiElement.textContent}"`
                            });
                        }
                    }, 1000);
                }
            }
        }
    },
    
    checkStallForClues(stall, stallNumber) {
        // Random chance for finding something in this stall
        if (Math.random() < 0.2) {
            setTimeout(() => {
                if (typeof app !== 'undefined') {
                    app.showNotification({
                        type: 'info',
                        title: 'Stall Inspection',
                        message: `You check stall ${stallNumber}. It appears to be clean and empty.`
                    });
                }
            }, 500);
        }
    },
    
    triggerCorridorAnomaly(corridorModal) {
        // Different types of corridor anomalies
        const anomalyTypes = [
            'flickering-lights',
            'mysterious-figure',
            'door-number-change',
            'whispers'
        ];
        
        // Select a random anomaly
        const anomalyType = anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)];
        
        switch(anomalyType) {
            case 'flickering-lights':
                // Lights flicker in the corridor
                const corridorScene = corridorModal.querySelector('.corridor-scene');
                
                if (corridorScene) {
                    // Add flickering animation
                    const flickerAnimation = document.createElement('style');
                    flickerAnimation.textContent = `
                        @keyframes light-flicker {
                            0% { filter: brightness(1); }
                            25% { filter: brightness(0.7); }
                            30% { filter: brightness(1.1); }
                            40% { filter: brightness(0.6); }
                            50% { filter: brightness(1); }
                            60% { filter: brightness(0.9); }
                            70% { filter: brightness(1.1); }
                            80% { filter: brightness(0.8); }
                            100% { filter: brightness(1); }
                        }
                        
                        .flickering-lights {
                            animation: light-flicker 0.5s 3;
                        }
                    `;
                    document.head.appendChild(flickerAnimation);
                    
                    corridorScene.classList.add('flickering-lights');
                    
                    if (typeof app !== 'undefined') {
                        app.showNotification({
                            type: 'warning',
                            title: 'Power Fluctuation',
                            message: 'The corridor lights briefly flicker, leaving you in darkness for a moment.'
                        });
                    }
                    
                    // Remove effect after a delay
                    setTimeout(() => {
                        corridorScene.classList.remove('flickering-lights');
                    }, 2000);
                }
                break;
                
            case 'mysterious-figure':
                // Create a mysterious figure at the end of the corridor
                const corridorEnd = corridorModal.querySelector('.corridor-end');
                
                if (corridorEnd) {
                    const figure = document.createElement('div');
                    figure.className = 'mysterious-figure';
                    figure.style.cssText = `
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width: 30px;
                        height: 70px;
                        background-color: rgba(0, 0, 0, 0.8);
                        border-radius: 10px 10px 0 0;
                        opacity: 0;
                        transition: opacity 2s ease;
                    `;
                    
                    // Add deer antlers to the figure
                    const antlers = document.createElement('div');
                    antlers.style.cssText = `
                        position: absolute;
                        top: -15px;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 40px;
                        height: 20px;
                        display: flex;
                        justify-content: space-between;
                    `;
                    
                    const leftAntler = document.createElement('div');
                    leftAntler.style.cssText = `
                        width: 5px;
                        height: 20px;
                        background-color: rgba(0, 0, 0, 0.8);
                        transform: rotate(-30deg);
                    `;
                    
                    const rightAntler = document.createElement('div');
                    rightAntler.style.cssText = `
                        width: 5px;
                        height: 20px;
                        background-color: rgba(0, 0, 0, 0.8);
                        transform: rotate(30deg);
                    `;
                    
                    antlers.appendChild(leftAntler);
                    antlers.appendChild(rightAntler);
                    figure.appendChild(antlers);
                    
                    corridorEnd.appendChild(figure);
                    
                    // Fade in the figure
                    setTimeout(() => {
                        figure.style.opacity = '0.8';
                        
                        if (typeof app !== 'undefined') {
                            app.showNotification({
                                type: 'warning',
                                title: 'Mysterious Figure',
                                message: 'You notice a dark figure standing at the end of the corridor. It appears to have... antlers?'
                            });
                        }
                        
                        // Add to discovered secrets
                        if (typeof app !== 'undefined') {
                            if (!app.state.player.discoveredSecrets.includes('corridor-figure')) {
                                app.state.player.discoveredSecrets.push('corridor-figure');
                                
                                // Increase anomaly level
                                app.state.gameState.anomalyLevel += 8;
                            }
                        }
                        
                        // Fade out after a delay
                        setTimeout(() => {
                            figure.style.opacity = '0';
                            
                            // Remove after fade out
                            setTimeout(() => {
                                figure.remove();
                            }, 2000);
                        }, 5000);
                    }, 1000);
                }
                break;
                
            case 'door-number-change':
                // Room numbers briefly change to something else
                const doorNumbers = corridorModal.querySelectorAll('.door-number');
                
                if (doorNumbers.length > 0) {
                    // Store original door numbers
                    const originalNumbers = Array.from(doorNumbers).map(door => door.textContent);
                    
                    // Change to alternate numbering
                    doorNumbers.forEach(doorNumber => {
                        const alternateNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
                        doorNumber.textContent = alternateNumber;
                        
                        // Add transition effect
                        doorNumber.style.transition = 'transform 0.5s ease, color 0.5s ease';
                        doorNumber.style.transform = 'scale(1.2)';
                        doorNumber.style.color = '#e74c3c';
                    });
                    
                    if (typeof app !== 'undefined') {
                        app.showNotification({
                            type: 'warning',
                            title: 'Reality Fluctuation',
                            message: 'The room numbers briefly change to different numbers before your eyes.'
                        });
                    }
                    
                    // Restore original numbers after a delay
                    setTimeout(() => {
                        doorNumbers.forEach((doorNumber, index) => {
                            doorNumber.textContent = originalNumbers[index];
                            doorNumber.style.transform = 'scale(1)';
                            doorNumber.style.color = 'initial';
                        });
                    }, 3000);
                }
                break;
                
            case 'whispers':
                // Whispers can be heard in the corridor
                if (typeof app !== 'undefined') {
                    app.showNotification({
                        type: 'warning',
                        title: 'Strange Sounds',
                        message: 'You hear faint whispers in the corridor. It sounds like someone saying "9321" and "Night Elk" repeatedly.'
                    });
                    
                    // Add to discovered secrets
                    if (!app.state.player.discoveredSecrets.includes('corridor-whispers')) {
                        app.state.player.discoveredSecrets.push('corridor-whispers');
                        
                        // Increase anomaly level
                        app.state.gameState.anomalyLevel += 5;
                    }
                }
                break;
        }
    },
    
    // Utility methods
    
    updateStatusMessage(message) {
        const statusMessage = document.getElementById('room-status-message');
        if (statusMessage) {
            statusMessage.textContent = message;
        }
    },
    
    recordInteraction(interactionType) {
        this.state.interactionHistory.push({
            type: interactionType,
            time: typeof app !== 'undefined' ? app.state.hotel.currentTime.getTime() : Date.now()
        });
    },
    
    useInventoryItem(item) {
        if (typeof app !== 'undefined') {
            app.showNotification({
                type: 'info',
                title: 'Inventory Item',
                message: `You are using: ${item.name}`
            });
        }
        
        // Handle different item types
        switch(item.type) {
            case 'key':
                // If it's a key card and we're looking at the door, use it
                if (this.state.currentView === 'door' && item.id === 'key-card') {
                    this.openDoor();
                } else {
                    this.updateStatusMessage(`You examine your ${item.name}.`);
                }
                break;
                
            case 'apparel':
                // Toggle equipped state for apparel items
                if (typeof app !== 'undefined' && app.supplementary && typeof app.supplementary.toggleItemEquipped === 'function') {
                    app.supplementary.toggleItemEquipped(item.id);
                    
                    const equipped = app.state.player.inventory.find(i => i.id === item.id)?.equipped;
                    this.updateStatusMessage(`You ${equipped ? 'put on' : 'take off'} the ${item.name}.`);
                } else {
                    this.updateStatusMessage(`You examine the ${item.name}.`);
                }
                break;
                
            default:
                this.updateStatusMessage(`You examine the ${item.name}.`);
        }
    },
    
    checkForAnomalies() {
        // Get anomaly level from app if available
        const anomalyLevel = typeof app !== 'undefined' ? app.state.gameState.anomalyLevel : this.state.anomalyLevel;
        
        // Calculate chance based on anomaly level (0-100)
        const anomalyChance = anomalyLevel / 200; // 0-50% chance based on level
        
        // Roll for anomaly
        if (Math.random() < anomalyChance) {
            // Apply visual anomaly effect to room view
            this.applyAnomalyEffect();
            return true;
        }
        
        return false;
    },
    
    applyAnomalyEffect() {
        // Get current room view
        const currentView = document.getElementById(`room-${this.state.currentView}-view`);
        if (!currentView) return;
        
        // Get anomaly level from app if available
        const anomalyLevel = typeof app !== 'undefined' ? app.state.gameState.anomalyLevel : this.state.anomalyLevel;
        
        // Determine effect intensity based on anomaly level
        let effectClass = 'anomaly-effect-low';
        
        if (anomalyLevel > 60) {
            effectClass = 'anomaly-effect-high';
        } else if (anomalyLevel > 30) {
            effectClass = 'anomaly-effect-medium';
        }
        
        // Apply effect class
        currentView.classList.add(effectClass);
        
        // Remove effect after a delay
        setTimeout(() => {
            currentView.classList.remove(effectClass);
        }, 5000);
    }
};

// Initialize room simulation when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    roomSimulation.init();
});
                        