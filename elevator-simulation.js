// Elevator Simulation - Handles the elevator system with special rules
const elevatorSimulation = {
    state: {
        currentFloor: 1,
        targetFloor: null,
        status: 'idle', // idle, moving, arriving, doors-open, doors-closing
        doorStatus: 'closed', // closed, opening, open, closing
        floorAccess: {}, // copied from app.state.hotel.floorAccess
        remapActive: false,
        floorMapping: {}, // active floor remappings from original to target
        anomalyLevel: 0,
        pendingEvents: []
    },
    
    // Initialize elevator simulation
    init() {
        // Set up UI elements and event handlers
        const elevatorButton = document.createElement('div');
        elevatorButton.className = 'elevator-button';
        elevatorButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .elevator-button {
                position: fixed;
                bottom: 20px;
                left: 20px;
                width: 50px;
                height: 50px;
                background-color: var(--primary-color);
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
            
            .elevator-button:hover {
                background-color: var(--secondary-color);
                transform: scale(1.1);
            }
            
            .elevator-button i {
                font-size: 1.2rem;
            }
            
            .elevator-direction {
                position: absolute;
                top: -5px;
                right: -5px;
                width: 20px;
                height: 20px;
                background-color: var(--accent-color);
                color: white;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 0.7rem;
            }
        `;
        document.head.appendChild(style);
        
        // Add elevator button to body
        document.body.appendChild(elevatorButton);
        
        // Show elevator modal on click
        elevatorButton.addEventListener('click', () => {
            this.showElevatorModal();
        });
        
        // Sync floor access with app state
        this.syncFloorAccess();
        
        // Connect to app
        if (typeof app !== 'undefined') {
            app.elevator = this;
            
            // Override app.goToFloor to use elevator simulation
            const originalGoToFloor = app.goToFloor;
            app.goToFloor = (floor) => {
                this.goToFloor(parseInt(floor));
                
                // Support the original implementation for backend state updates
                originalGoToFloor.call(app, floor);
            };
        }
    },
    
    syncFloorAccess() {
        // Copy floor access rules from app state
        if (typeof app !== 'undefined' && app.state.hotel.floorAccess) {
            this.state.floorAccess = {...app.state.hotel.floorAccess};
        } else {
            // Default floor access if app state not available
            this.state.floorAccess = {
                1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true,
                8: false, // 8th floor is inaccessible
                9: true, 10: true, 11: true, 12: true, 13: true, 14: true, 15: true
            };
        }
        
        // Update UI if elevator modal is open
        this.updateElevatorUI();
    },
    
    updateElevatorUI() {
        const modal = document.getElementById('elevator-modal');
        if (!modal) return;
        
        // Update floor buttons based on access rules
        document.querySelectorAll('.floor-button').forEach(button => {
            const floor = parseInt(button.dataset.floor);
            
            // Skip the current floor
            if (floor === this.state.currentFloor) {
                button.classList.add('active');
                button.classList.remove('disabled');
                return;
            }
            
            // Handle floor access
            if (this.canAccessFloor(floor)) {
                button.classList.remove('disabled');
                
                // Remove any petition requirements
                if (button.classList.contains('petition-required')) {
                    button.classList.remove('petition-required');
                    
                    // Remove petition text if it exists
                    const petitionText = button.parentElement.querySelector('.petition-text');
                    if (petitionText) petitionText.remove();
                    
                    // Reset click handler
                    const newButton = button.cloneNode(true);
                    button.parentNode.replaceChild(newButton, button);
                    
                    newButton.addEventListener('click', () => {
                        this.goToFloor(floor);
                    });
                }
            } else {
                button.classList.add('disabled');
                button.classList.remove('active');
                
                // Check if floor 8 needs petition feature
                if (floor === 8 && typeof app !== 'undefined' && app.state.player.avatar === 'elk' && app.supplementary && typeof app.supplementary.addElevatorPetitionButton === 'function') {
                    app.supplementary.addElevatorPetitionButton();
                }
            }
        });
        
        // Update current floor indicator
        const currentFloorElement = document.getElementById('current-floor');
        if (currentFloorElement) {
            currentFloorElement.textContent = this.state.currentFloor;
        }
        
        // Update elevator message
        const elevatorMessage = document.querySelector('.elevator-message');
        if (elevatorMessage) {
            switch (this.state.status) {
                case 'idle':
                    elevatorMessage.textContent = 'Select a floor.';
                    break;
                case 'moving':
                    elevatorMessage.textContent = `Moving to floor ${this.state.targetFloor}...`;
                    break;
                case 'arriving':
                    elevatorMessage.textContent = `Arriving at floor ${this.state.targetFloor}.`;
                    break;
                case 'doors-open':
                    elevatorMessage.textContent = `Doors open at floor ${this.state.currentFloor}.`;
                    break;
                case 'doors-closing':
                    elevatorMessage.textContent = `Doors closing.`;
                    break;
            }
        }
    },
    
    showElevatorModal() {
        // Check if modal already exists
        let elevatorModal = document.getElementById('elevator-modal');
        
        if (!elevatorModal) {
            // Create modal if it doesn't exist
            elevatorModal = document.createElement('div');
            elevatorModal.className = 'modal';
            elevatorModal.id = 'elevator-modal';
            
            elevatorModal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Elevator Control Panel</h3>
                        <span class="close-button">&times;</span>
                    </div>
                    <div class="elevator-interface">
                        <div class="elevator-buttons">
                            <div class="floor-display">
                                <div class="current-floor-number">${this.state.currentFloor}</div>
                                <div class="direction-indicator">
                                    <div class="direction-up"><i class="fas fa-chevron-up"></i></div>
                                    <div class="direction-down"><i class="fas fa-chevron-down"></i></div>
                                </div>
                            </div>
                            <div class="floor-button-container">
                                <button class="floor-button" data-floor="15">15</button>
                                <button class="floor-button" data-floor="14">14</button>
                                <button class="floor-button" data-floor="13">13</button>
                                <button class="floor-button" data-floor="12">12</button>
                                <button class="floor-button" data-floor="11">11</button>
                                <button class="floor-button" data-floor="10">10</button>
                                <button class="floor-button" data-floor="9">9</button>
                                <button class="floor-button disabled" data-floor="8">8</button>
                                <button class="floor-button" data-floor="7">7</button>
                                <button class="floor-button" data-floor="6">6</button>
                                <button class="floor-button" data-floor="5">5</button>
                                <button class="floor-button" data-floor="4">4</button>
                                <button class="floor-button" data-floor="3">3</button>
                                <button class="floor-button" data-floor="2">2</button>
                                <button class="floor-button" data-floor="1">1</button>
                            </div>
                            <div class="elevator-controls">
                                <button class="open-door-button">
                                    <i class="fas fa-door-open"></i>
                                </button>
                                <button class="close-door-button">
                                    <i class="fas fa-door-closed"></i>
                                </button>
                                <button class="emergency-button">
                                    <i class="fas fa-exclamation-triangle"></i>
                                </button>
                            </div>
                        </div>
                        <div class="elevator-animation">
                            <div class="elevator-doors">
                                <div class="door left-door"></div>
                                <div class="door right-door"></div>
                            </div>
                            <div class="elevator-interior"></div>
                        </div>
                    </div>
                    <div class="elevator-status">
                        <p>Current Floor: <span id="current-floor">${this.state.currentFloor}</span></p>
                        <p class="elevator-message">Select a floor.</p>
                        ${this.state.remapActive ? '<p class="remap-notice">⚠️ Elevator Remapping Active</p>' : ''}
                    </div>
                </div>
            `;
            
            document.body.appendChild(elevatorModal);
            
            // Add additional styles
            const style = document.createElement('style');
            style.textContent = `
                .elevator-interface {
                    display: flex;
                    gap: 20px;
                    padding: 20px;
                }
                
                .floor-display {
                    background-color: #000;
                    color: #f00;
                    font-family: "Digital-7", monospace;
                    padding: 10px;
                    border-radius: 5px;
                    margin-bottom: 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .current-floor-number {
                    font-size: 2rem;
                    font-weight: bold;
                }
                
                .direction-indicator {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }
                
                .direction-up, .direction-down {
                    opacity: 0.3;
                }
                
                .direction-up.active, .direction-down.active {
                    opacity: 1;
                }
                
                .elevator-animation {
                    width: 150px;
                    height: 200px;
                    position: relative;
                    background-color: #f0f0f0;
                    border-radius: var(--border-radius);
                    overflow: hidden;
                }
                
                .elevator-doors {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 10;
                }
                
                .door {
                    position: absolute;
                    top: 0;
                    height: 100%;
                    width: 50%;
                    background-color: var(--primary-color);
                    transition: transform 1.5s ease;
                }
                
                .left-door {
                    left: 0;
                    transform-origin: left;
                }
                
                .right-door {
                    right: 0;
                    transform-origin: right;
                }
                
                .doors-closed .left-door {
                    transform: translateX(0);
                }
                
                .doors-closed .right-door {
                    transform: translateX(0);
                }
                
                .doors-open .left-door {
                    transform: translateX(-100%);
                }
                
                .doors-open .right-door {
                    transform: translateX(100%);
                }
                
                .elevator-interior {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: #d0d0d0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-weight: bold;
                }
                
                .remap-notice {
                    color: var(--warning-color);
                    font-weight: bold;
                    margin-top: 10px;
                }
                
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
                
                .elevator-shaking {
                    animation: shake 0.5s ease-in-out;
                }
            `;
            document.head.appendChild(style);
            
            // Set up close button
            elevatorModal.querySelector('.close-button').addEventListener('click', () => {
                elevatorModal.classList.remove('show');
            });
            
            // Set up floor buttons
            const floorButtons = elevatorModal.querySelectorAll('.floor-button');
            floorButtons.forEach(button => {
                const floor = parseInt(button.dataset.floor);
                
                // Don't allow clicks on disabled floors
                if (!button.classList.contains('disabled')) {
                    button.addEventListener('click', () => {
                        this.goToFloor(floor);
                    });
                }
            });
            
            // Set up door control buttons
            elevatorModal.querySelector('.open-door-button').addEventListener('click', () => {
                this.openDoors();
            });
            
            elevatorModal.querySelector('.close-door-button').addEventListener('click', () => {
                this.closeDoors();
            });
            
            // Set up emergency button
            elevatorModal.querySelector('.emergency-button').addEventListener('click', () => {
                this.triggerEmergency();
            });
            
            // Set door state
            this.updateDoorState();
        }
        
        // Show modal
        elevatorModal.classList.add('show');
        
        // Update floor access and UI
        this.syncFloorAccess();
    },
    
    updateDoorState() {
        const elevatorAnimation = document.querySelector('.elevator-animation');
        if (!elevatorAnimation) return;
        
        // Update door classes based on state
        elevatorAnimation.classList.remove('doors-open', 'doors-closed');
        
        if (this.state.doorStatus === 'open' || this.state.doorStatus === 'opening') {
            elevatorAnimation.classList.add('doors-open');
        } else {
            elevatorAnimation.classList.add('doors-closed');
        }
    },
    
    openDoors() {
        if (this.state.status === 'moving' || this.state.status === 'arriving') {
            // Can't open doors while moving
            if (typeof app !== 'undefined') {
                app.showNotification({
                    type: 'warning',
                    title: 'Elevator Safety',
                    message: 'Cannot open doors while elevator is in motion.'
                });
            }
            return;
        }
        
        this.state.doorStatus = 'opening';
        this.updateDoorState();
        
        // After animation delay, set to fully open
        setTimeout(() => {
            this.state.doorStatus = 'open';
            this.state.status = 'doors-open';
            this.updateElevatorUI();
            
            // Check if this is floor 8 (special handling)
            if (this.state.currentFloor === 8) {
                this.arriveAtFloor8();
            }
        }, 1500);
    },
    
    closeDoors() {
        if (this.state.doorStatus !== 'open') return;
        
        this.state.doorStatus = 'closing';
        this.state.status = 'doors-closing';
        this.updateElevatorUI();
        
        // After animation delay, set to fully closed
        setTimeout(() => {
            this.state.doorStatus = 'closed';
            this.state.status = 'idle';
            this.updateDoorState();
            this.updateElevatorUI();
        }, 1500);
    },
    
    goToFloor(floor) {
        floor = parseInt(floor);
        
        // Check if floor is accessible
        if (!this.canAccessFloor(floor)) {
            if (typeof app !== 'undefined') {
                app.showNotification({
                    type: 'error',
                    title: 'Access Denied',
                    message: `Floor ${floor} is not accessible.`
                });
            }
            return false;
        }
        
        // Check if already at the target floor
        if (floor === this.state.currentFloor) {
            if (typeof app !== 'undefined') {
                app.showNotification({
                    type: 'info',
                    title: 'Already There',
                    message: `You are already at floor ${floor}.`
                });
            }
            return false;
        }
        
        // Close doors before moving
        if (this.state.doorStatus === 'open') {
            this.closeDoors();
            
            // Wait for doors to close before continuing
            setTimeout(() => {
                this.startElevatorMovement(floor);
            }, 1500);
        } else {
            this.startElevatorMovement(floor);
        }
        
        return true;
    },
    
    startElevatorMovement(floor) {
        // Handle floor remapping if active
        let actualTargetFloor = floor;
        if (this.state.remapActive && this.state.floorMapping[floor]) {
            actualTargetFloor = this.state.floorMapping[floor];
            
            if (typeof app !== 'undefined') {
                app.showNotification({
                    type: 'info',
                    title: 'Floor Remapping',
                    message: `Elevator remap active. Floor ${floor} is redirected to floor ${actualTargetFloor}.`
                });
            }
        }
        
        // Update elevator state
        this.state.targetFloor = actualTargetFloor;
        this.state.status = 'moving';
        
        // Update direction indicator
        const directionUp = document.querySelector('.direction-up');
        const directionDown = document.querySelector('.direction-down');
        
        if (directionUp && directionDown) {
            directionUp.classList.remove('active');
            directionDown.classList.remove('active');
            
            if (actualTargetFloor > this.state.currentFloor) {
                directionUp.classList.add('active');
            } else {
                directionDown.classList.add('active');
            }
        }
        
        // Update UI
        this.updateElevatorUI();
        
        // Calculate travel time (roughly 2 seconds per floor)
        const floorDifference = Math.abs(actualTargetFloor - this.state.currentFloor);
        const travelTime = floorDifference * 1000; // 1 second per floor
        
        // Simulate elevator movement with intermediate floor updates
        let currentPosition = this.state.currentFloor;
        const direction = actualTargetFloor > this.state.currentFloor ? 1 : -1;
        const updateInterval = 500; // 0.5 seconds per intermediate update
        
        const floorUpdater = setInterval(() => {
            currentPosition += direction;
            
            // Update current floor display
            const currentFloorElement = document.getElementById('current-floor');
            const floorDisplay = document.querySelector('.current-floor-number');
            
            if (currentFloorElement) {
                currentFloorElement.textContent = currentPosition;
            }
            
            if (floorDisplay) {
                floorDisplay.textContent = currentPosition;
            }
            
            // If we've reached a floor, check for special events
            if (Number.isInteger(currentPosition)) {
                // Check for elevator anomalies
                this.checkForAnomalies(currentPosition);
            }
            
            // If we've reached the target, stop the updater
            if (currentPosition === actualTargetFloor) {
                clearInterval(floorUpdater);
                this.arriveAtFloor(actualTargetFloor);
            }
        }, 1000); // 1 second per floor
        
        // Slight movement effect
        this.simulateElevatorMovement(travelTime);
    },
    
    simulateElevatorMovement(duration) {
        // Add subtle shake/movement effect to elevator
        const elevatorAnimation = document.querySelector('.elevator-animation');
        if (!elevatorAnimation) return;
        
        // Add subtle movement class
        elevatorAnimation.classList.add('elevator-moving');
        
        // Add slight shake at start and end
        elevatorAnimation.classList.add('elevator-shaking');
        setTimeout(() => {
            elevatorAnimation.classList.remove('elevator-shaking');
        }, 500);
        
        // Add shake again before arriving
        setTimeout(() => {
            elevatorAnimation.classList.add('elevator-shaking');
            
            setTimeout(() => {
                elevatorAnimation.classList.remove('elevator-shaking');
                elevatorAnimation.classList.remove('elevator-moving');
            }, 500);
        }, duration - 500);
    },
    
    arriveAtFloor(floor) {
        // Update state
        this.state.currentFloor = floor;
        this.state.status = 'arriving';
        
        // Reset direction indicators
        const directionUp = document.querySelector('.direction-up');
        const directionDown = document.querySelector('.direction-down');
        
        if (directionUp && directionDown) {
            directionUp.classList.remove('active');
            directionDown.classList.remove('active');
        }
        
        // Update active button
        document.querySelectorAll('.floor-button').forEach(button => {
            button.classList.remove('active');
            
            if (parseInt(button.dataset.floor) === floor) {
                button.classList.add('active');
            }
        });
        
        // Update UI
        this.updateElevatorUI();
        
        // Automatically open doors after a brief delay
        setTimeout(() => {
            this.openDoors();
        }, 1000);
        
        // Update app state if available
        if (typeof app !== 'undefined') {
            app.state.gameState.currentFloor = floor;
            app.state.player.floor = floor;
            
            // Check for special floor content
            if (typeof app.checkFloorSpecificContent === 'function') {
                app.checkFloorSpecificContent(floor);
            }
        }
        
        // Check for special handling for specific floors
        switch (floor) {
            case 8:
                // Special handling for floor 8 will be done in openDoors
                break;
                
            case 13:
                // 13th floor might have spooky effects
                setTimeout(() => {
                    if (typeof app !== 'undefined') {
                        app.showNotification({
                            type: 'warning',
                            title: 'Floor 13',
                            message: 'The lights flicker momentarily. You feel a strange chill.'
                        });
                        
                        // Possible quantum effect if available
                        if (app.quantumEffects) {
                            app.quantumEffects.applyVisualEffect('quantum-flicker', document.querySelector('.elevator-animation'), {
                                duration: 3000,
                                intensity: 0.7
                            });
                        }
                    }
                }, 2000);
                break;
        }
    },
    
    arriveAtFloor8() {
        // Special handling for the mysterious 8th floor
        if (typeof app !== 'undefined') {
            app.showNotification({
                type: 'info',
                title: 'Floor 8',
                message: 'You have arrived at the normally inaccessible 8th floor. This area feels... different.'
            });
            
            // Apply quantum effects if available
            if (app.quantumEffects) {
                // Apply to entire elevator modal
                app.quantumEffects.applyVisualEffect('reality-glitch', document.querySelector('.modal-content'), {
                    duration: 5000,
                    intensity: 0.6
                });
            }
            
            // Add Floor 8 exploration task
            const floor8Task = {
                id: 'task-floor8',
                name: 'Explore the mysterious 8th floor',
                completed: false
            };
            
            if (!app.state.player.taskList.some(t => t.id === 'task-floor8')) {
                app.state.player.taskList.push(floor8Task);
                app.updateTaskList();
            }
            
            // Schedule a Night Elk clue discovery when exploring this floor
            setTimeout(() => {
                app.showNotification({
                    type: 'info',
                    title: 'Night Elk Clue',
                    message: 'You notice strange markings on the wall that spell out "9321" - the same number you\'ve seen elsewhere.'
                });
                
                // Add to discovered secrets
                if (!app.state.player.discoveredSecrets.includes('floor8-markings')) {
                    app.state.player.discoveredSecrets.push('floor8-markings');
                }
                
                // Increase puzzle progress
                app.state.gameState.puzzleProgress += 15;
            }, 10000);
        }
    },
    
    triggerEmergency() {
        // Trigger emergency stop with visual and audio effects
        const elevatorAnimation = document.querySelector('.elevator-animation');
        if (!elevatorAnimation) return;
        
        // Add emergency class
        elevatorAnimation.classList.add('elevator-emergency');
        
        // Heavy shake effect
        elevatorAnimation.classList.add('elevator-shaking');
        
        // Notification
        if (typeof app !== 'undefined') {
            app.showNotification({
                type: 'error',
                title: 'Emergency Stop',
                message: 'Emergency button activated. Elevator has stopped.'
            });
            
            // Apply quantum effects if available
            if (app.quantumEffects) {
                app.quantumEffects.handleQuantumEvent({
                    type: 'temporal-distortion',
                    intensity: 0.7,
                    duration: 8000
                });
            }
        }
        
        // Update state
        this.state.status = 'emergency';
        this.updateElevatorUI();
        
        // In emergency, there's a chance to discover a hidden area
        if (Math.random() < 0.3) {
            setTimeout(() => {
                this.discoverHiddenFloor();
            }, 3000);
        } else {
            // Otherwise, just return to normal after a delay
            setTimeout(() => {
                elevatorAnimation.classList.remove('elevator-shaking');
                elevatorAnimation.classList.remove('elevator-emergency');
                
                this.state.status = 'idle';
                this.updateElevatorUI();
                
                if (typeof app !== 'undefined') {
                    app.showNotification({
                        type: 'info',
                        title: 'System Reset',
                        message: 'Elevator emergency systems have reset. Operation returning to normal.'
                    });
                }
            }, 5000);
        }
    },
    
    discoverHiddenFloor() {
        // Chance to discover hidden floor through emergency
        if (typeof app !== 'undefined') {
            app.showNotification({
                type: 'warning',
                title: 'Anomalous Movement',
                message: 'The elevator is moving on its own! Something unexpected is happening.'
            });
            
            // Simulate movement to a hidden floor
            setTimeout(() => {
                // Either floor 8 or 17 (void floor)
                const hiddenFloor = Math.random() < 0.5 ? 8 : 17;
                
                // Update current floor display
                const currentFloorElement = document.getElementById('current-floor');
                const floorDisplay = document.querySelector('.current-floor-number');
                
                if (currentFloorElement) {
                    currentFloorElement.textContent = hiddenFloor;
                }
                
                if (floorDisplay) {
                    floorDisplay.textContent = hiddenFloor;
                }
                
                // Update state
                this.state.currentFloor = hiddenFloor;
                
                if (typeof app !== 'undefined') {
                    app.state.gameState.currentFloor = hiddenFloor;
                    app.state.player.floor = hiddenFloor;
                    
                    app.showNotification({
                        type: 'info',
                        title: `Hidden Floor ${hiddenFloor}`,
                        message: `The elevator has taken you to floor ${hiddenFloor}, which should not be accessible. This may be significant.`
                    });
                    
                    // Add task for this discovery
                    const hiddenFloorTask = {
                        id: `task-floor${hiddenFloor}`,
                        name: `Explore hidden floor ${hiddenFloor}`,
                        completed: false
                    };
                    
                    if (!app.state.player.taskList.some(t => t.id === `task-floor${hiddenFloor}`)) {
                        app.state.player.taskList.push(hiddenFloorTask);
                        app.updateTaskList();
                    }
                    
                    // Apply quantum effects if available
                    if (app.quantumEffects) {
                        app.quantumEffects.handleQuantumEvent({
                            type: 'reality-fluctuation',
                            intensity: 0.8,
                            duration: 10000
                        });
                    }
                    
                    // For floor 17 specifically (void floor)
                    if (hiddenFloor === 17) {
                        setTimeout(() => {
                            app.showNotification({
                                type: 'warning',
                                title: 'Void Floor',
                                message: 'This floor shouldn\'t exist. The blueprints show only 15 floors, yet here you are on the 17th floor.'
                            });
                            
                            // Add Night Elk connection
                            setTimeout(() => {
                                app.showNotification({
                                    type: 'info',
                                    title: 'Night Elk Connection',
                                    message: 'You notice a Night Elk symbol etched into the elevator control panel. The plot thickens.'
                                });
                                
                                // Add to discovered secrets
                                if (!app.state.player.discoveredSecrets.includes('void-floor')) {
                                    app.state.player.discoveredSecrets.push('void-floor');
                                }
                                
                                // Major puzzle progress
                                app.state.gameState.puzzleProgress += 25;
                            }, 8000);
                        }, 5000);
                    }
                }
                
                // Return to normal after discovery
                setTimeout(() => {
                    const elevatorAnimation = document.querySelector('.elevator-animation');
                    if (elevatorAnimation) {
                        elevatorAnimation.classList.remove('elevator-shaking');
                        elevatorAnimation.classList.remove('elevator-emergency');
                    }
                    
                    this.state.status = 'idle';
                    this.updateElevatorUI();
                    
                    // Open doors to this hidden floor
                    this.openDoors();
                }, 3000);
            }, 5000);
        }
    },
    
    checkForAnomalies(floor) {
        // Check for random elevator anomalies during movement
        if (!this.state.anomalyLevel) {
            this.state.anomalyLevel = typeof app !== 'undefined' ? app.state.gameState.anomalyLevel : 0;
        }
        
        // Chance of anomaly based on anomaly level and certain floors
        let anomalyChance = this.state.anomalyLevel / 200; // 0-50% based on 0-100 anomaly level
        
        // Increase chance on certain floors
        if (floor === 8 || floor === 13 || floor === 17) {
            anomalyChance += 0.2; // +20% on special floors
        }
        
        // Roll for anomaly
        if (Math.random() < anomalyChance) {
            this.triggerElevatorAnomaly(floor);
        }
    },
    
    triggerElevatorAnomaly(floor) {
        // Different types of elevator anomalies
        const anomalyTypes = [
            'floor-flicker',
            'brief-stop',
            'temporal-shift',
            'phantom-passenger'
        ];
        
        // Select anomaly type, weighted by anomaly level
        let selectedAnomaly;
        if (this.state.anomalyLevel > 40) {
            // Higher anomaly levels can trigger more severe anomalies
            selectedAnomaly = anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)];
        } else {
            // Lower levels stick to milder anomalies
            selectedAnomaly = anomalyTypes[Math.floor(Math.random() * 2)]; // Just the first two
        }
        
        switch (selectedAnomaly) {
            case 'floor-flicker':
                // Floor display briefly shows wrong number
                const floorDisplay = document.querySelector('.current-floor-number');
                const currentFloorElement = document.getElementById('current-floor');
                
                if (floorDisplay && currentFloorElement) {
                    // Store original text
                    const originalFloorText = floorDisplay.textContent;
                    const originalElementText = currentFloorElement.textContent;
                    
                    // Show glitched floor number
                    const glitchOptions = [
                        '?', '8', '∞', 'NE', (floor + 10).toString(), '‽'
                    ];
                    const glitchText = glitchOptions[Math.floor(Math.random() * glitchOptions.length)];
                    
                    floorDisplay.textContent = glitchText;
                    currentFloorElement.textContent = glitchText;
                    
                    // Apply visual effect if available
                    if (typeof app !== 'undefined' && app.quantumEffects) {
                        app.quantumEffects.applyVisualEffect('quantum-flicker', floorDisplay, {
                            duration: 1000,
                            intensity: 0.8
                        });
                    }
                    
                    // Restore after brief delay
                    setTimeout(() => {
                        floorDisplay.textContent = originalFloorText;
                        currentFloorElement.textContent = originalElementText;
                    }, 800);
                }
                break;
                
            case 'brief-stop':
                // Elevator briefly stops between floors with a shake
                const elevatorAnimation = document.querySelector('.elevator-animation');
                if (elevatorAnimation) {
                    // Add shake effect
                    elevatorAnimation.classList.add('elevator-shaking');
                    
                    // Show notification
                    if (typeof app !== 'undefined') {
                        app.showNotification({
                            type: 'warning',
                            title: 'Elevator Malfunction',
                            message: 'The elevator shudders and briefly stops between floors.'
                        });
                    }
                    
                    // Remove shake after delay
                    setTimeout(() => {
                        elevatorAnimation.classList.remove('elevator-shaking');
                    }, 1000);
                }
                break;
                
            case 'temporal-shift':
                // Time briefly runs backwards or jumps forward
                if (typeof app !== 'undefined') {
                    app.showNotification({
                        type: 'error',
                        title: 'Temporal Anomaly',
                        message: 'The elevator seems caught in a time loop. Your watch is running backwards.'
                    });
                    
                    // Apply quantum effect
                    if (app.quantumEffects) {
                        app.quantumEffects.applyEnvironmentalEffect('temporal-anomaly', {
                            intensity: 0.6,
                            duration: 10000
                        });
                    }
                    
                    // Brief time reversal
                    const originalTimeScale = app.state.gameState.timeScale;
                    app.state.gameState.timeScale = -originalTimeScale;
                    
                    // Restore after delay
                    setTimeout(() => {
                        app.state.gameState.timeScale = originalTimeScale;
                    }, 5000);
                }
                break;
                
            case 'phantom-passenger':
                // Briefly show another passenger in the elevator
                const elevatorInterior = document.querySelector('.elevator-interior');
                if (elevatorInterior) {
                    // Create phantom figure
                    const phantom = document.createElement('div');
                    phantom.className = 'phantom-passenger';
                    phantom.innerHTML = '<i class="fas fa-user"></i>';
                    
                    phantom.style.cssText = `
                        position: absolute;
                        ${Math.random() > 0.5 ? 'left: 20px;' : 'right: 20px;'}
                        bottom: 20px;
                        opacity: 0.5;
                        color: #fff;
                        font-size: 2rem;
                    `;
                    
                    elevatorInterior.appendChild(phantom);
                    
                    // Apply effect if available
                    if (typeof app !== 'undefined' && app.quantumEffects) {
                        app.quantumEffects.applyVisualEffect('quantum-flicker', phantom, {
                            duration: 4000,
                            intensity: 0.9
                        });
                    }
                    
                    // Show notification
                    if (typeof app !== 'undefined') {
                        app.showNotification({
                            type: 'warning',
                            title: 'Phantom Passenger',
                            message: 'You briefly see another figure in the elevator, then it vanishes.'
                        });
                        
                        // Add to discovered secrets
                        if (!app.state.player.discoveredSecrets.includes('phantom-passenger')) {
                            app.state.player.discoveredSecrets.push('phantom-passenger');
                        }
                    }
                    
                    // Remove after delay
                    setTimeout(() => {
                        phantom.remove();
                    }, 4000);
                }
                break;
        }
    },
    
    // Check if a floor is accessible
    canAccessFloor(floor) {
        // Special case for current floor - always accessible
        if (floor === this.state.currentFloor) return true;
        
        // Check floor access rules
        return !!this.state.floorAccess[floor];
    },
    
    // Apply floor remapping (for Leatherman Gambit)
    applyRemapping(mapping) {
        this.state.remapActive = true;
        this.state.floorMapping = mapping;
        
        // Update UI to show remap status
        const elevatorStatus = document.querySelector('.elevator-status');
        if (elevatorStatus && !elevatorStatus.querySelector('.remap-notice')) {
            const remapNotice = document.createElement('p');
            remapNotice.
            remapNotice.className = 'remap-notice';
            remapNotice.innerHTML = '⚠️ Elevator Remapping Active';
            elevatorStatus.appendChild(remapNotice);
        }
        
        // Schedule reset after 1 hour
        const resetTime = new Date();
        resetTime.setHours(resetTime.getHours() + 1);
        
        this.state.pendingEvents.push({
            type: 'remap-reset',
            time: resetTime.getTime()
        });
        
        // Notify about remapping
        if (typeof app !== 'undefined') {
            app.showNotification({
                type: 'warning',
                title: 'Elevator Remapped',
                message: 'The elevator destinations have been remapped. This will last for 1 hour.'
            });
        }
        
        return true;
    },
    
    // Reset floor remapping
    resetRemapping() {
        this.state.remapActive = false;
        this.state.floorMapping = {};
        
        // Update UI to remove remap notice
        const remapNotice = document.querySelector('.remap-notice');
        if (remapNotice) {
            remapNotice.remove();
        }
        
        // Notify about reset
        if (typeof app !== 'undefined') {
            app.showNotification({
                type: 'info',
                title: 'Elevator Restored',
                message: 'The elevator remapping has expired. Normal floor destinations restored.'
            });
        }
    },
    
    // Process pending events
    processPendingEvents() {
        const now = new Date().getTime();
        const pendingEvents = this.state.pendingEvents;
        
        // Find events that should be processed
        const eventsToProcess = pendingEvents.filter(event => event.time <= now);
        
        // Process each event
        eventsToProcess.forEach(event => {
            switch(event.type) {
                case 'remap-reset':
                    this.resetRemapping();
                    break;
                    
                case 'anomaly':
                    this.triggerElevatorAnomaly(this.state.currentFloor);
                    break;
                    
                case 'maintenance':
                    // Handle elevator maintenance
                    if (typeof app !== 'undefined') {
                        app.showNotification({
                            type: 'warning',
                            title: 'Elevator Maintenance',
                            message: 'Elevator maintenance is scheduled soon. Expect limited access to certain floors.'
                        });
                    }
                    break;
            }
        });
        
        // Remove processed events
        this.state.pendingEvents = pendingEvents.filter(event => !eventsToProcess.includes(event));
    },
    
    // Schedule random anomalies based on current anomaly level
    scheduleRandomAnomalies() {
        // Clear existing scheduled anomalies
        this.state.pendingEvents = this.state.pendingEvents.filter(event => event.type !== 'anomaly');
        
        // Get current anomaly level
        const anomalyLevel = typeof app !== 'undefined' ? app.state.gameState.anomalyLevel : this.state.anomalyLevel;
        
        // Skip if anomaly level is too low
        if (anomalyLevel < 10) return;
        
        // Calculate number of anomalies to schedule (1-5 based on level)
        const anomalyCount = Math.max(1, Math.floor(anomalyLevel / 20));
        
        // Schedule anomalies at random times in the next 3 hours
        for (let i = 0; i < anomalyCount; i++) {
            const delay = Math.random() * 10800000; // Random time in the next 3 hours (3 * 60 * 60 * 1000)
            const anomalyTime = new Date().getTime() + delay;
            
            this.state.pendingEvents.push({
                type: 'anomaly',
                time: anomalyTime
            });
        }
    },
    
    // Update method to be called regularly
    update() {
        // Process any pending events
        this.processPendingEvents();
        
        // Check if we need to schedule more anomalies
        if (this.state.pendingEvents.filter(event => event.type === 'anomaly').length === 0) {
            this.scheduleRandomAnomalies();
        }
        
        // Update anomaly level from app state
        if (typeof app !== 'undefined') {
            this.state.anomalyLevel = app.state.gameState.anomalyLevel;
        }
    }
};

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    elevatorSimulation.init();
    
    // Set up regular updates
    setInterval(() => {
        elevatorSimulation.update();
    }, 30000); // Check every 30 seconds
});