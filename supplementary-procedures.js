// Supplementary procedures and quantum rule system
const supplementaryProcedures = {
    // Collection of all supplementary procedures
    procedures: {
        'a1': {
            id: 'a1',
            title: 'Quantum Check-In Protocol',
            content: 'Guests simultaneously occupy all rooms between their assigned floor and the 17th "void floor". Reality collapses upon first door opening (Article 8 exceptions apply). Breakfast times multiply accordingly across quantum states.',
            category: 'supplementary',
            unlockRequirements: ['anomalyLevel-25', 'discoveredClues-quantum-behavior'],
            effects: ['quantum-room-assignment', 'multiple-breakfast-times']
        },
        'a2': {
            id: 'a2',
            title: 'Olfactory Compliance System',
            content: 'Perfume designers must calibrate scents to match floor water schedules (§R006-§R009). 9th floor "dry bouquet" interacts violently with 14th floor "night musk". Violations manifest as temporary Area M inhabitants.',
            category: 'supplementary',
            unlockRequirements: ['specialSkill-perfume-designer', 'investigatedWaterSchedule'],
            effects: ['perfume-water-interaction', 'area-m-manifestation']
        },
        'a3': {
            id: 'a3',
            title: 'Paradox Procurement',
            content: 'Front desk trades Night Elk clues for: 3+ kg public trash (Article 11 violation), unused elevator codes from Version V3.0, leather items submerged in bathtubs (Clause 15 triggers). Payment appears as fried dough stick coupons (Article 4 contraband).',
            category: 'supplementary',
            unlockRequirements: ['night-elk-program-active', 'rule-violations-3'],
            effects: ['trash-trading', 'bathtub-leather-detection', 'contraband-coupons']
        },
        'a5': {
            id: 'a5',
            title: 'Maintenance Epistemology',
            content: 'Rainy season workers (Article 20) double as procedural auditors. Their orange helmets (Clause 38) absorb rule violations, converting infractions into: 22% new piping routes, 78% Kuang Shengyou fan fiction. All deposits visible through 8th floor security glass.',
            category: 'supplementary',
            unlockRequirements: ['plotFlags.investigatedWaterSchedule', 'maintenancePeriod-active'],
            effects: ['violation-conversion', 'kuang-fan-fiction-generation']
        },
        'a6': {
            id: 'a6',
            title: 'Avatar Hydration Cycle',
            content: 'Guest ratings (Clause 38) determine water privileges: Shrubs: 9th floor restrictions apply, Reindeer: Access 14th floor night supply, Elk: Can petition to alter Article 21 elevator routes. Upgrades require trading "Mary Lulu" song fragments.',
            category: 'supplementary',
            unlockRequirements: ['avatar-water-grass', 'anomalyLevel-20'],
            effects: ['avatar-water-privileges', 'song-fragment-collection']
        },
        'a7': {
            id: 'a7',
            title: 'Consequence Tiling',
            content: 'Every 5th rule violation manifests physical changes: Southwest corridor tiles rearrange using long-term tenant data, Public restrooms gain/lose stalls per parking lot occupancy, Candy stocks (Article 3) convert to deer repellent during maintenance.',
            category: 'supplementary',
            unlockRequirements: ['rule-violations-5', 'plotFlags.exploredHotel'],
            effects: ['corridor-tile-rearrangement', 'bathroom-stall-fluctuation']
        },
        'a8': {
            id: 'a8',
            title: 'Check-Out Amnesia Tax',
            content: 'Guests retaining >47% check-in memories trigger: Mandatory participation in Version V99.0 testing, 10% body weight in "unregulated area" souvenirs, Permanent 8th floor shadow duplicate.',
            category: 'supplementary',
            unlockRequirements: ['gamePhase-hotel-upgrade', 'anomalyLevel-30'],
            effects: ['memory-retention-tracking', 'shadow-duplicate-creation']
        },
        'a9': {
            id: 'a9',
            title: 'Culinary Paradox Engine',
            content: 'The "Yucheng Special" (Article 35) combines: Forbidden breakfast items (Article 4), Bathtub marinades (Clause 15), 3kg+ public waste (Article 11). Consumption swaps guest/staff roles for 1 lunar cycle.',
            category: 'supplementary',
            unlockRequirements: ['plotFlags.bathRelaxation', 'discoveredSecrets-yucheng-special'],
            effects: ['role-swapping-meal', 'bathtub-cuisine']
        },
        'a10': {
            id: 'a10',
            title: 'Ephemeral Department',
            content: 'Recruits (Article 26) exist as: Graphic designers: Rebrand corridor tiles nightly, Marketing: Sell imaginary parking spaces, Engineers: Maintain fictional 17th floor. Wages paid in Night Elk debt obligations.',
            category: 'supplementary',
            unlockRequirements: ['unlockedRules-E007', 'night-elk-program-active'],
            effects: ['corridor-rebranding', 'parking-hallucinations']
        },
        'a11': {
            id: 'a11',
            title: 'Leatherman Gambit',
            content: 'Guests wearing >4 leather items (Clause 15) can: Remap elevator routes using candy patterns, Temporarily disable water rules via bathtub semaphore, Challenge Kuang Shengyou to scallion pancake duels.',
            category: 'supplementary',
            unlockRequirements: ['plotFlags.bathExperiment', 'plotFlags.metKuangShengyou'],
            effects: ['elevator-remapping', 'pancake-dueling']
        },
        'a31': {
            id: 'a31',
            title: 'Bathtub Hyperlink System',
            content: 'Filled bathtubs function as data portals when properly configured: Yellow rubber items enable access to historical stay records, Temperature set to exactly 37.2°C connects to Article 20 maintenance channels, Adding precisely 3g of candy (Article 3) reveals fragments of Night Elk documentation. Portal stability maintained by leather item proximity (minimum 4 pieces within 2 meters).',
            category: 'supplementary',
            unlockRequirements: ['plotFlags.bathRelaxation', 'night-elk-program-active'],
            effects: ['bathtub-data-access', 'night-elk-document-reveal']
        },
        'a50': {
            id: 'a50',
            title: 'Reality Consensus Threshold',
            content: 'Hotel features phase in/out of existence based on collective acknowledgment: Areas require 30% guest recognition to maintain stable manifestation, Floor 8 achieves partial materialization when exactly 7 guests seek access simultaneously, Night Elk plan solidifies when mentioned in 1,000,000 distinct conversations. Tracking metrics displayed as cryptic numerical sequences in public restroom graffiti.',
            category: 'supplementary',
            unlockRequirements: ['anomalyLevel-40', 'discoveredClues-reality-fluctuation'],
            effects: ['floor-8-materialization', 'guest-consensus-tracking']
        }
    },
    
    // State tracking for supplementary procedures
    state: {
        unlockedProcedures: [],
        activeProcedures: [],
        appliedEffects: {},
        paradoxEvents: [],
        quantumState: 'collapsed',
        bathtubConfigurations: [],
        wordsToPerfume: {},
        temporalAnomalies: 0,
        leatherItemsEquipped: 0,
        songFragments: 0,
        memoriesRetained: 0.85, // 85% of check-in memories retained by default
        lastViolationCount: 0,
    },
    
    // Check if a player has met requirements to unlock a procedure
    checkUnlockRequirements(procedureId) {
        const procedure = this.procedures[procedureId];
        if (!procedure) return false;
        
        // Already unlocked
        if (this.state.unlockedProcedures.includes(procedureId)) {
            return true;
        }
        
        let allRequirementsMet = true;
        
        procedure.unlockRequirements.forEach(requirement => {
            // Parse requirement string
            const [type, value] = requirement.split('-');
            
            switch (type) {
                case 'anomalyLevel':
                    if (app.state.gameState.anomalyLevel < parseInt(value)) {
                        allRequirementsMet = false;
                    }
                    break;
                    
                case 'discoveredClues':
                    if (!app.narrative.state.discoveredClues.includes(value)) {
                        allRequirementsMet = false;
                    }
                    break;
                    
                case 'specialSkill':
                    if (app.state.player.specialSkill !== value) {
                        allRequirementsMet = false;
                    }
                    break;
                    
                case 'investigatedWaterSchedule':
                    if (!app.narrative.state.plotFlags.investigatedWaterSchedule) {
                        allRequirementsMet = false;
                    }
                    break;
                    
                case 'night-elk-program-active':
                    if (app.state.player.nightElkStatus !== 'active') {
                        allRequirementsMet = false;
                    }
                    break;
                    
                case 'rule-violations':
                    if (app.state.player.violations.length < parseInt(value)) {
                        allRequirementsMet = false;
                    }
                    break;
                    
                case 'gamePhase':
                    if (app.state.gameState.gamePhase !== value) {
                        allRequirementsMet = false;
                    }
                    break;
                    
                case 'avatar-water-grass':
                    if (app.state.player.avatar !== 'water-grass') {
                        allRequirementsMet = false;
                    }
                    break;
                    
                case 'maintenancePeriod-active':
                    if (!app.state.hotel.maintenancePeriod) {
                        allRequirementsMet = false;
                    }
                    break;
                    
                case 'plotFlags':
                    if (!app.narrative.state.plotFlags[value]) {
                        allRequirementsMet = false;
                    }
                    break;
                    
                case 'unlockedRules':
                    if (!app.state.player.unlockedRules.includes(value)) {
                        allRequirementsMet = false;
                    }
                    break;
                    
                case 'discoveredSecrets':
                    if (!app.state.player.discoveredSecrets.includes(value)) {
                        allRequirementsMet = false;
                    }
                    break;
            }
        });
        
        return allRequirementsMet;
    },
    
    // Unlock a supplementary procedure and notify player
    unlockProcedure(procedureId) {
        const procedure = this.procedures[procedureId];
        if (!procedure) return false;
        
        // Already unlocked
        if (this.state.unlockedProcedures.includes(procedureId)) {
            return false;
        }
        
        // Add to unlocked procedures
        this.state.unlockedProcedures.push(procedureId);
        
        // Notify player
        app.showNotification({
            type: 'info',
            title: 'New Supplementary Procedure',
            message: `You have discovered supplementary procedure #${procedureId}: ${procedure.title}`
        });
        
        // Add to UI
        this.addProcedureToUI(procedure);
        
        return true;
    },
    
    // Add procedure to UI in the supplementary procedures section
    addProcedureToUI(procedure) {
        // Check if supplementary section is unlocked yet
        const supplementaryNav = document.querySelector('.main-nav li[data-view="supplementary-procedure"]');
        if (supplementaryNav.classList.contains('locked')) {
            supplementaryNav.classList.remove('locked');
            supplementaryNav.querySelector('.lock-icon').remove();
            
            // Create supplementary content section if it doesn't exist
            let supplementarySection = document.getElementById('supplementary-procedure');
            if (!supplementarySection) {
                supplementarySection = document.createElement('div');
                supplementarySection.id = 'supplementary-procedure';
                supplementarySection.className = 'content-section';
                
                supplementarySection.innerHTML = `
                    <h2>Supplementary Procedures</h2>
                    <div class="welcome-message">
                        <p>Advanced procedures unlocked through special circumstances. These quantum rules govern the deeper layers of hotel operation.</p>
                        <p class="warning-text">Warning: Quantum procedures may destabilize reality. Use with caution.</p>
                    </div>
                    <div class="procedure-list" id="supplementary-procedure-list">
                        <!-- Supplementary procedures will be added here -->
                    </div>
                `;
                
                document.querySelector('.content-area').appendChild(supplementarySection);
                
                // Add special styles for supplementary procedures
                const style = document.createElement('style');
                style.textContent = `
                    #supplementary-procedure .welcome-message {
                        background-color: rgba(44, 62, 80, 0.1);
                        border-left: 4px solid #2c3e50;
                    }
                    #supplementary-procedure .warning-text {
                        color: #e74c3c;
                        font-style: italic;
                        margin-top: 10px;
                    }
                    #supplementary-procedure .procedure-item {
                        border-left-color: #2c3e50;
                        position: relative;
                        overflow: hidden;
                    }
                    #supplementary-procedure .procedure-item::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(45deg, transparent 50%, rgba(44, 62, 80, 0.05) 50%);
                        z-index: 0;
                    }
                    #supplementary-procedure .procedure-code {
                        background-color: #2c3e50;
                    }
                    #supplementary-procedure .quantum-effect {
                        margin-top: 10px;
                        font-size: 0.9rem;
                        color: #2c3e50;
                        font-style: italic;
                    }
                    .quantum-button {
                        background-color: #2c3e50;
                    }
                    .quantum-button:hover {
                        background-color: #34495e;
                    }
                    .anomaly-badge {
                        display: inline-block;
                        padding: 2px 8px;
                        border-radius: 10px;
                        font-size: 0.8rem;
                        margin-left: 10px;
                        background-color: rgba(231, 76, 60, 0.2);
                        color: #e74c3c;
                    }
                `;
                document.head.appendChild(style);
            }
        }
        
        // Add the procedure to the list
        const procedureList = document.getElementById('supplementary-procedure-list');
        
        const procedureItem = document.createElement('div');
        procedureItem.className = 'procedure-item';
        procedureItem.dataset.id = procedure.id;
        
        let effectsDisplay = '';
        if (procedure.effects && procedure.effects.length > 0) {
            effectsDisplay = `
                <div class="quantum-effect">
                    <strong>Effects:</strong> ${procedure.effects.join(', ')}
                </div>
            `;
        }
        
        procedureItem.innerHTML = `
            <div class="procedure-header">
                <span class="procedure-code">#${procedure.id}</span>
                <h3>${procedure.title}</h3>
                <span class="anomaly-badge">Quantum Rule</span>
            </div>
            <div class="procedure-content">
                <p>${procedure.content}</p>
                ${effectsDisplay}
                <div class="procedure-actions" style="margin-top: 15px;">
                    <button class="action-button quantum-button activate-procedure" data-id="${procedure.id}">
                        <i class="fas fa-atom"></i> Activate Procedure
                    </button>
                </div>
            </div>
        `;
        
        procedureList.appendChild(procedureItem);
        
        // Add event listener to activate button
        procedureItem.querySelector('.activate-procedure').addEventListener('click', () => {
            this.activateQuantumProcedure(procedure.id);
        });
    },
    
    // Activate a quantum procedure with special effects
    activateQuantumProcedure(procedureId) {
        const procedure = this.procedures[procedureId];
        if (!procedure) return false;
        
        // Check if already active
        if (this.state.activeProcedures.includes(procedureId)) {
            app.showNotification({
                type: 'warning',
                title: 'Procedure Already Active',
                message: `Supplementary procedure #${procedureId} is already active.`
            });
            return false;
        }
        
        // Add to active procedures
        this.state.activeProcedures.push(procedureId);
        
        // Notify player
        app.showNotification({
            type: 'success',
            title: 'Quantum Procedure Activated',
            message: `Supplementary procedure #${procedureId} is now active. Reality is adjusting.`
        });
        
        // Apply effects based on procedure
        this.applyProcedureEffects(procedureId);
        
        // Increase anomaly level
        app.state.gameState.anomalyLevel += 5;
        
        return true;
    },
    
    // Apply specific effects for each procedure
    applyProcedureEffects(procedureId) {
        switch (procedureId) {
            case 'a1': // Quantum Check-In Protocol
                this.state.quantumState = 'superposition';
                this.createQuantumRoomStates();
                break;
                
            case 'a2': // Olfactory Compliance System
                if (app.state.player.specialSkill === 'perfume-designer') {
                    this.initiatePerfumeCalibration();
                }
                break;
                
            case 'a6': // Avatar Hydration Cycle
                this.upgradeAvatarWaterPrivileges();
                break;
                
            case 'a7': // Consequence Tiling
                this.initiateTileRearrangement();
                break;
                
            case 'a11': // Leatherman Gambit
                this.enableLeathermanGambit();
                break;
                
            case 'a31': // Bathtub Hyperlink System
                this.setupBathtubHyperlink();
                break;
                
            case 'a50': // Reality Consensus Threshold
                this.beginRealityConsensusTracking();
                break;
        }
        
        // Record effect application
        this.state.appliedEffects[procedureId] = {
            time: app.state.hotel.currentTime.getTime(),
            intensity: Math.random() * 0.5 + 0.5, // Random intensity between 0.5 and 1.0
            anomalyLevel: app.state.gameState.anomalyLevel
        };
    },
    
    // Implementation of quantum procedure effects
    
    createQuantumRoomStates() {
        const playerRoom = app.state.player.room;
        const playerFloor = parseInt(playerRoom.substring(0, 2));
        
        // Create superposition of rooms from player's floor to 17th
        let quantumRooms = [];
        for (let floor = playerFloor; floor <= 17; floor++) {
            // Skip 8th floor unless special conditions are met
            if (floor === 8 && !this.state.appliedEffects['a50']) {
                continue;
            }
            
            const roomNumber = `${floor.toString().padStart(2, '0')}${playerRoom.substring(2)}`;
            quantumRooms.push(roomNumber);
        }
        
        // Store quantum rooms in state
        this.state.quantumRooms = quantumRooms;
        
        // Schedule a quantum collapse at some point
        const collapseTime = new Date(app.state.hotel.currentTime.getTime() + (Math.random() * 6 + 2) * 60 * 60 * 1000); // 2-8 hours later
        
        app.state.gameState.pendingEvents.push({
            type: 'quantum-collapse',
            time: collapseTime.getTime(),
            rooms: quantumRooms
        });
        
        // Show notification about quantum state
        setTimeout(() => {
            app.showNotification({
                type: 'info',
                title: 'Quantum Superposition',
                message: `You now simultaneously exist in rooms ${quantumRooms.join(', ')}. Reality will collapse upon next door opening.`
            });
        }, 3000);
    },
    
    collapseQuantumState(observedRoom) {
        if (this.state.quantumState !== 'superposition') return;
        
        this.state.quantumState = 'collapsed';
        
        // Determine which room becomes reality
        let collapsedRoom;
        
        if (observedRoom) {
            // If a specific room was observed, collapse to that one
            collapsedRoom = observedRoom;
        } else {
            // Otherwise randomly select from quantum rooms
            const quantumRooms = this.state.quantumRooms || [];
            if (quantumRooms.length > 0) {
                collapsedRoom = quantumRooms[Math.floor(Math.random() * quantumRooms.length)];
            } else {
                collapsedRoom = app.state.player.room;
            }
        }
        
        // Update player's room
        const oldRoom = app.state.player.room;
        app.state.player.room = collapsedRoom;
        
        // Update player's floor
        app.state.player.floor = parseInt(collapsedRoom.substring(0, 2));
        
        // Notify player
        app.showNotification({
            type: 'warning',
            title: 'Quantum Collapse',
            message: `Reality has collapsed. Your room has shifted from ${oldRoom} to ${collapsedRoom}.`
        });
        
        // Check if we collapsed into a special floor (like 8 or 17)
        if (app.state.player.floor === 8) {
            setTimeout(() => {
                app.showNotification({
                    type: 'error',
                    title: 'Anomalous Floor',
                    message: 'You have collapsed into a room on the 8th floor. This floor should not exist. Exercise caution.'
                });
                
                // Increase anomaly level significantly
                app.state.gameState.anomalyLevel += 15;
            }, 5000);
        } else if (app.state.player.floor === 17) {
            setTimeout(() => {
                app.showNotification({
                    type: 'info',
                    title: 'Void Floor',
                    message: 'You have collapsed into the 17th "void floor". This area exists beyond the hotel\'s official boundaries.'
                });
                
                // Add a "void floor" task
                const voidTask = {
                    id: 'task-void',
                    name: 'Explore the 17th void floor',
                    completed: false
                };
                
                if (!app.state.player.taskList.some(t => t.id === 'task-void')) {
                    app.state.player.taskList.push(voidTask);
                    app.updateTaskList();
                }
            }, 5000);
        }
    },
    
    initiatePerfumeCalibration() {
        // Start perfume design minigame/interaction
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.id = 'perfume-modal';
        
        modal.innerHTML = `
            <div class="modal-content perfume-content">
                <div class="modal-header">
                    <h3>Olfactory Compliance System</h3>
                    <span class="close-button">&times;</span>
                </div>
                <div class="perfume-design">
                    <p>As a perfume designer, you must calibrate your scent to match floor water schedules.</p>
                    <div class="floor-scent-map">
                        <div class="floor-scent" data-floor="9">
                            <span class="floor-number">9</span>
                            <span class="scent-name">Dry Bouquet</span>
                            <div class="scent-intensity-control">
                                <input type="range" min="0" max="100" value="50" class="scent-slider" data-floor="9">
                            </div>
                        </div>
                        <div class="floor-scent" data-floor="10">
                            <span class="floor-number">10</span>
                            <span class="scent-name">Alternating Current</span>
                            <div class="scent-intensity-control">
                                <input type="range" min="0" max="100" value="50" class="scent-slider" data-floor="10">
                            </div>
                        </div>
                        <div class="floor-scent" data-floor="14">
                            <span class="floor-number">14</span>
                            <span class="scent-name">Night Musk</span>
                            <div class="scent-intensity-control">
                                <input type="range" min="0" max="100" value="50" class="scent-slider" data-floor="14">
                            </div>
                        </div>
                        <div class="floor-scent" data-floor="1">
                            <span class="floor-number">1</span>
                            <span class="scent-name">Weekend Bloom</span>
                            <div class="scent-intensity-control">
                                <input type="range" min="0" max="100" value="50" class="scent-slider" data-floor="1">
                            </div>
                        </div>
                    </div>
                    <div class="perfume-blend-result">
                        <h4>Blend Analysis</h4>
                        <div class="blend-status">Adjust scent components to match floor water schedules</div>
                        <div class="blend-visualization">
                            <canvas id="blend-canvas" width="300" height="150"></canvas>
                        </div>
                    </div>
                </div>
                <div class="perfume-actions">
                    <button id="blend-perfume" class="action-button quantum-button">
                        <i class="fas fa-vial"></i> Blend Perfume
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add specialized CSS for perfume design
        const style = document.createElement('style');
        style.textContent = `
            .perfume-content {
                max-width: 600px;
            }
            .floor-scent-map {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 15px;
                margin: 20px 0;
            }
            .floor-scent {
                background-color: #f9f9f9;
                padding: 15px;
                border-radius: var(--border-radius);
                border-left: 4px solid var(--primary-color);
                position: relative;
            }
            .floor-number {
                position: absolute;
                top: 10px;
                right: 10px;
                background-color: var(--primary-color);
                color: white;
                width: 25px;
                height: 25px;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                font-weight: bold;
                font-size: 0.9rem;
            }
            .scent-name {
                font-weight: bold;
                display: block;
                margin-bottom: 10px;
            }
            .perfume-blend-result {
                background-color: #f0f0f0;
                padding: 15px;
                border-radius: var(--border-radius);
                margin-top: 20px;
            }
            .blend-status {
                margin: 10px 0;
                font-style: italic;
            }
            .blend-visualization {
                background-color: white;
                border-radius: var(--border-radius);
                padding: 10px;
                margin-top: 10px;
            }
        `;
        document.head.appendChild(style);
        
        // Set up close button
        modal.querySelector('.close-button').addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        });
        
        // Set up blend button and sliders
        const blendCanvas = document.getElementById('blend-canvas');
        const ctx = blendCanvas.getContext('2d');
        
        // Initial canvas render
        this.renderBlendCanvas(ctx, blendCanvas.width, blendCanvas.height);
        
        // Update canvas on slider changes
        document.querySelectorAll('.scent-slider').forEach(slider => {
            slider.addEventListener('input', () => {
                this.renderBlendCanvas(ctx, blendCanvas.width, blendCanvas.height);
            });
        });
        
        // Blend perfume button
        document.getElementById('blend-perfume').addEventListener('click', () => {
            const blend = this.calculatePerfumeBlend();
            
            // Check if blend matches water schedule
            const matchQuality = this.evaluateBlendMatch(blend);
            
            if (matchQuality > 0.8) {
                // Success
                app.showNotification({
                    type: 'success',
                    title: 'Perfect Blend',
                    message: 'Your perfume perfectly matches the floor water schedules. Olfactory compliance achieved.'
                });
                
                // Award avatar upgrade or special item
                if (app.state.player.avatar === 'water-grass') {
                    setTimeout(() => {
                        this.upgradePlayerAvatar('shrub');
                    }, 2000);
                }
                
                // Close modal
                modal.classList.remove('show');
                setTimeout(() => modal.remove(), 300);
            } else if (matchQuality > 0.5) {
                // Partial success
                document.querySelector('.blend-status').textContent = 'Blend is close, but needs refinement. Try adjusting the components.';
                document.querySelector('.blend-status').style.color = 'var(--warning-color)';
            } else {
                // Failure
                document.querySelector('.blend-status').textContent = 'This blend would violate olfactory compliance. Significant adjustment needed.';
                document.querySelector('.blend-status').style.color = 'var(--danger-color)';
                
                // Risk of manifesting in Area M
                if (Math.random() < 0.3) {
                    setTimeout(() => {
                        app.showNotification({
                            type: 'error',
                            title: 'Olfactory Violation',
                            message: 'Your non-compliant perfume has triggered a reaction. You\'ve temporarily manifested in Area M.'
                        });
                        
                        // Implement temporary teleportation to Area M (visualization only)
                        this.temporarilyManifestInAreaM();
                    }, 3000);
                }
            }
        });
    },
    
    renderBlendCanvas(ctx, width, height) {
        // Get current slider values
        const sliders = {};
        document.querySelectorAll('.scent-slider').forEach(slider => {
            sliders[slider.dataset.floor] = parseInt(slider.value) / 100;
        });
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Background
        ctx.fillStyle = '#f9f9f9';
        ctx.fillRect(0, 0, width, height);
        
        // Draw scent waves for each floor
        const colors = {
            '9': '#3498db', // Blue for dry bouquet
            '10': '#9b59b6', // Purple for alternating current
            '14': '#2c3e50', // Dark blue for night musk
            '1': '#27ae60' // Green for weekend bloom
        };
        
        // Draw base lines
        ctx.strokeStyle = '#e0e0e0';
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
        
        for (const [floor, intensity] of Object.entries(sliders)) {
            ctx.strokeStyle = colors[floor];
            ctx.lineWidth = 2;
            
            // Draw wave pattern
            ctx.beginPath();
            const amplitude = intensity * (height / 2 - 10);
            const frequency = (parseInt(floor) % 5) + 2; // Different frequency per floor
            const phaseShift = parseInt(floor) * 10; // Different phase per floor
            
            for (let x = 0; x < width; x++) {
                const y = height / 2 + Math.sin((x + phaseShift) / 20 * frequency) * amplitude;
                
                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            ctx.stroke();
        }
    },
    
    calculatePerfumeBlend() {
        // Get current slider values
        const blend = {};
        document.querySelectorAll('.scent-slider').forEach(slider => {
            blend[slider.dataset.floor] = parseInt(slider.value) / 100;
        });
        return blend;
    },
    
    evaluateBlendMatch(blend) {
        // Ideal values would match the water schedules
        const ideal = {
            '9': 0.1, // No hot water = low intensity
            '10': 0.5, // Alternating = medium intensity
            '14': 0.9, // Night only = high intensity
            '1': 0.3 // Weekends only = low-medium intensity
        };
        
        // Calculate match quality (0-1 scale)
        let totalDifference = 0;
        for (const floor in ideal) {
            const difference = Math.abs(blend[floor] - ideal[floor]);
            totalDifference += difference;
        }
        
        // Average difference, inverted so 1 is perfect match and 0 is complete mismatch
        return 1 - (totalDifference / Object.keys(ideal).length);
    },
    
    temporarilyManifestInAreaM() {
        // Create a view of Area M without actually moving the player
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.id = 'area-m-manifestation';
        
        modal.innerHTML = `
            <div class="modal-content area-manifestation">
                <div class="modal-header">
                    <h3>Temporary Manifestation in Area M</h3>
                    <span class="close-button">&times;</span>
                </div>
                <div class="area-view">
                    <div class="area-banner">
                        <span class="area-label">Area M</span>
                        <span class="floor-label">Floor 8</span>
                    </div>
                    <div class="manifestation-effect"></div>
                    <div class="area-description">
                        <p>You have temporarily manifested in Area M due to olfactory non-compliance. This area should be inaccessible, yet here you are.</p>
                        <p>The space is dimly lit and seems to be used for small gatherings. You notice several other flickering manifestations of guests who must have also violated olfactory protocols.</p>
                        <p>You can't physically interact with anything, but you can observe. This manifestation will end shortly.</p>
                    </div>
                    <div class="observed-details">
                        <h4>Observable Details</h4>
                        <ul>
                            <li>A bulletin board with a partial Night Elk poster</li>
                            <li>Maintenance charts showing water flow diagrams</li>
                            <li>Security staff meeting schedule (next: ${this.formatGameTime(app.state.hotel.currentTime, 3)})</li>
                            <li>Several flickering silhouettes of other guests</li>
                        </ul>
                    </div>
                </div>
                <div class="area-actions">
                    <button id="take-note" class="action-button quantum-button">
                        <i class="fas fa-clipboard"></i> Take Mental Note
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add specialized CSS
        const style = document.createElement('style');
        style.textContent = `
            .area-manifestation {
                max-width: 700px;
            }
            .area-banner {
                display: flex;
                justify-content: space-between;
                background-color: var(--night-elk-color);
                color: white;
                padding: 10px 15px;
                border-radius: var(--border-radius) var(--border-radius) 0 0;
                margin: -20px -20px 0 -20px;
            }
            .area-label {
                font-weight: bold;
                font-size: 1.2rem;
            }
            .floor-label {
                font-size: 0.9rem;
                background-color: rgba(255, 255, 255, 0.2);
                padding: 3px 8px;
                border-radius: 10px;
            }
            .manifestation-effect {
                height: 200px;
                background: linear-gradient(135deg, #3a5f6f 0%, #2c3e50 100%);
                position: relative;
                overflow: hidden;
                margin-bottom: 20px;
            }
            .manifestation-effect::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect x="0" y="0" width="100" height="100" fill="none" stroke="white" stroke-width="1" stroke-opacity="0.1"/></svg>');
                opacity: 0.3;
            }
            .manifestation-effect::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0) 70%);
                animation: pulse 3s infinite;
            }
            @keyframes pulse {
                0% { opacity: 0.2; }
                50% { opacity: 0.5; }
                100% { opacity: 0.2; }
            }
            .observed-details {
                background-color: #f0f0f0;
                padding: 15px;
                border-radius: var(--border-radius);
                margin-top: 20px;
            }
            .observed-details h4 {
                margin-top: 0;
                color: var(--primary-color);
            }
            .observed-details ul {
                margin-bottom: 0;
            }
        `;
        document.head.appendChild(style);
        
        // Create silhouettes in the manifestation effect
        const manifestationEffect = modal.querySelector('.manifestation-effect');
        for (let i = 0; i < 5; i++) {
            const silhouette = document.createElement('div');
            silhouette.className = 'guest-silhouette';
            silhouette.style.cssText = `
                position: absolute;
                width: 30px;
                height: 70px;
                background-color: rgba(255, 255, 255, 0.1);
                border-radius: 10px 10px 0 0;
                bottom: 20px;
                left: ${20 + i * 18}%;
                opacity: 0.7;
                animation: flicker 4s infinite ${i * 0.7}s;
            `;
            manifestationEffect.appendChild(silhouette);
        }
        
        // Silhouette flicker animation
        const flickerAnimation = document.createElement('style');
        flickerAnimation.textContent = `
            @keyframes flicker {
                0% { opacity: 0.7; }
                25% { opacity: 0.3; }
                50% { opacity: 0.8; }
                75% { opacity: 0.2; }
                100% { opacity: 0.7; }
            }
        `;
        document.head.appendChild(flickerAnimation);
        
        // Set up button actions
        modal.querySelector('#take-note').addEventListener('click', () => {
            // Add a clue to the player's discovered secrets
            const clue = 'area-m-manifestation';
            if (!app.state.player.discoveredSecrets.includes(clue)) {
                app.state.player.discoveredSecrets.push(clue);
                
                app.showNotification({
                    type: 'success',
                    title: 'Clue Recorded',
                    message: 'You\'ve made mental notes about Area M\'s anomalous properties.'
                });
                
                // Advance Night Elk puzzle progress
                app.state.gameState.puzzleProgress += 12;
            }
        });
        
        // Auto-close after 30 seconds
        setTimeout(() => {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
            
            app.showNotification({
                type: 'info',
                title: 'Manifestation Ended',
                message: 'You\'ve returned to your physical location. The manifestation in Area M has ended.'
            });
        }, 30000);
        
        // Set up close button
        modal.querySelector('.close-button').addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        });
    },
    
    upgradeAvatarWaterPrivileges() {
        // Implement avatar water privilege upgrades
        const avatar = app.state.player.avatar;
        
        if (avatar === 'water-grass') {
            app.showNotification({
                type: 'info',
                title: 'Avatar Hydration Cycle',
                message: 'Your water-grass avatar applies 9th floor water restrictions. No hot water available.'
            });
            
            // Apply 9th floor water restrictions to player room
            const playerFloor = parseInt(app.state.player.room.substring(0, 2));
            app.state.hotel.waterSchedule[playerFloor] = { hotWater: false, note: 'Water-grass restrictions: No hot water' };
            
            // Add song fragment collection task
            setTimeout(() => {
                app.showNotification({
                    type: 'info',
                    title: 'Song Fragment',
                    message: 'You need to collect "Mary Lulu" song fragments to upgrade your avatar and water privileges.'
                });
                
                const songTask = {
                    id: 'task-song',
                    name: 'Collect "Mary Lulu" song fragments',
                    completed: false
                };
                
                if (!app.state.player.taskList.some(t => t.id === 'task-song')) {
                    app.state.player.taskList.push(songTask);
                    app.updateTaskList();
                }
            }, 5000);
        } else if (avatar === 'shrub') {
            app.showNotification({
                type: 'info',
                title: 'Avatar Hydration Cycle',
                message: 'Your shrub avatar grants access to 14th floor water supply. Water available only after 10:00 PM.'
            });
            
            // Apply 14th floor water schedule
            const playerFloor = parseInt(app.state.player.room.substring(0, 2));
            app.state.hotel.waterSchedule[playerFloor] = { 
                hasWater: (time) => time.getHours() >= 22,
                note: 'Shrub privilege: Water available after 10:00 PM'
            };
        } else if (avatar === 'reindeer' || avatar === 'elk') {
            app.showNotification({
                type: 'success',
                title: 'Avatar Hydration Cycle',
                message: 'Your advanced avatar grants full control over water schedule and can petition to alter elevator routes.'
            });
            
            // Grant full water access
            const playerFloor = parseInt(app.state.player.room.substring(0, 2));
            app.state.hotel.waterSchedule[playerFloor] = { hotWater: true, note: 'Elk privilege: Unrestricted water access' };
            
            // Allow floor 8 access
            if (avatar === 'elk') {
                setTimeout(() => {
                    app.showNotification({
                        type: 'info',
                        title: 'Elevator Access',
                        message: 'Your Elk avatar status allows you to petition for access to the 8th floor.'
                    });
                    
                    // Add UI element to petition for 8th floor access
                    this.addElevatorPetitionButton();
                }, 5000);
            }
        }
    },
    
    addElevatorPetitionButton() {
        // Add petition button to elevator modal
        const elevatorModal = document.getElementById('elevator-modal');
        if (!elevatorModal) return;
        
        const floor8Button = elevatorModal.querySelector('.floor-button[data-floor="8"]');
        
        if (floor8Button && floor8Button.classList.contains('disabled')) {
            floor8Button.classList.remove('disabled');
            floor8Button.classList.add('petition-required');
            
            // Add petition text
            const petitionText = document.createElement('div');
            petitionText.className = 'petition-text';
            petitionText.textContent = 'Petition Required';
            petitionText.style.cssText = `
                font-size: 0.7rem;
                color: var(--warning-color);
                text-align: center;
                position: absolute;
                bottom: -20px;
                left: 0
                font-size: 0.7rem;
                color: var(--warning-color);
                text-align: center;
                position: absolute;
                bottom: -20px;
                left: 0;
                width: 100%;
            `;
            
            const buttonContainer = floor8Button.closest('.floor-button-container');
            if (buttonContainer) {
                buttonContainer.style.position = 'relative';
                buttonContainer.appendChild(petitionText);
            }
            
            // Add click event to show petition dialog
            floor8Button.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent default floor selection
                this.showFloor8Petition();
            });
        }
    },
    
    showFloor8Petition() {
        // Create petition dialog
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.id = 'floor8-petition-modal';
        
        modal.innerHTML = `
            <div class="modal-content petition-content">
                <div class="modal-header">
                    <h3>Petition for 8th Floor Access</h3>
                    <span class="close-button">&times;</span>
                </div>
                <div class="petition-form">
                    <p>As an Elk-rated guest, you may petition for special access to the 8th floor. Please provide justification for your request.</p>
                    
                    <div class="form-group">
                        <label for="petition-reason">Reason for Access</label>
                        <select id="petition-reason" class="form-control">
                            <option value="">Select a reason...</option>
                            <option value="night-elk">Night Elk Program research</option>
                            <option value="area-m">Need to visit Area M</option>
                            <option value="maintenance">Maintenance inspection</option>
                            <option value="personal">Personal reasons</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="petition-details">Additional Details</label>
                        <textarea id="petition-details" class="form-control" rows="4" placeholder="Provide specific details about your need to access the 8th floor..."></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="song-fragments">Verify Song Fragments</label>
                        <div class="song-fragment-container">
                            <div class="song-fragment ${this.state.songFragments >= 1 ? 'collected' : ''}">
                                <i class="fas fa-music"></i>
                                <span class="fragment-label">Fragment 1</span>
                            </div>
                            <div class="song-fragment ${this.state.songFragments >= 2 ? 'collected' : ''}">
                                <i class="fas fa-music"></i>
                                <span class="fragment-label">Fragment 2</span>
                            </div>
                            <div class="song-fragment ${this.state.songFragments >= 3 ? 'collected' : ''}">
                                <i class="fas fa-music"></i>
                                <span class="fragment-label">Fragment 3</span>
                            </div>
                        </div>
                        <div class="song-status">
                            You have collected ${this.state.songFragments}/3 "Mary Lulu" song fragments.
                            ${this.state.songFragments < 3 ? 'You need all 3 fragments to petition for 8th floor access.' : ''}
                        </div>
                    </div>
                </div>
                <div class="petition-actions">
                    <button id="submit-petition" class="action-button quantum-button" ${this.state.songFragments < 3 ? 'disabled' : ''}>
                        <i class="fas fa-file-signature"></i> Submit Petition
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add specialized CSS
        const style = document.createElement('style');
        style.textContent = `
            .petition-content {
                max-width: 600px;
            }
            .petition-form {
                padding: 20px 0;
            }
            .form-group {
                margin-bottom: 20px;
            }
            .form-group label {
                display: block;
                font-weight: bold;
                margin-bottom: 8px;
                color: var(--primary-color);
            }
            .form-control {
                width: 100%;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: var(--border-radius);
                font-family: inherit;
                font-size: 1rem;
            }
            .form-control:focus {
                outline: none;
                border-color: var(--primary-color);
                box-shadow: 0 0 0 2px rgba(58, 95, 111, 0.1);
            }
            .song-fragment-container {
                display: flex;
                gap: 15px;
                margin-bottom: 10px;
            }
            .song-fragment {
                width: 80px;
                height: 80px;
                background-color: #f0f0f0;
                border-radius: var(--border-radius);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 5px;
                opacity: 0.5;
            }
            .song-fragment.collected {
                background-color: var(--accent-color);
                color: white;
                opacity: 1;
            }
            .song-fragment i {
                font-size: 1.5rem;
            }
            .fragment-label {
                font-size: 0.8rem;
            }
            .song-status {
                font-size: 0.9rem;
                font-style: italic;
                color: var(--light-text);
            }
            .petition-actions {
                display: flex;
                justify-content: flex-end;
            }
            .action-button[disabled] {
                opacity: 0.5;
                cursor: not-allowed;
            }
        `;
        document.head.appendChild(style);
        
        // Set up close button
        modal.querySelector('.close-button').addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        });
        
        // Submit petition
        const submitButton = document.getElementById('submit-petition');
        if (submitButton) {
            submitButton.addEventListener('click', () => {
                const reason = document.getElementById('petition-reason').value;
                const details = document.getElementById('petition-details').value;
                
                if (!reason) {
                    app.showNotification({
                        type: 'warning',
                        title: 'Incomplete Petition',
                        message: 'Please select a reason for your access request.'
                    });
                    return;
                }
                
                if (this.state.songFragments < 3) {
                    app.showNotification({
                        type: 'error',
                        title: 'Insufficient Song Fragments',
                        message: 'You need all 3 "Mary Lulu" song fragments to petition for 8th floor access.'
                    });
                    return;
                }
                
                // Process petition
                const success = Math.random() < 0.8; // 80% chance of success with all fragments
                
                if (success) {
                    app.showNotification({
                        type: 'success',
                        title: 'Petition Approved',
                        message: 'Your petition for 8th floor access has been approved. You may now access the 8th floor.'
                    });
                    
                    // Update floor access
                    app.state.hotel.floorAccess[8] = true;
                    
                    // Update elevator UI
                    const floor8Button = document.querySelector('.floor-button[data-floor="8"]');
                    if (floor8Button) {
                        floor8Button.classList.remove('disabled');
                        floor8Button.classList.remove('petition-required');
                        
                        // Remove petition text
                        const petitionText = document.querySelector('.petition-text');
                        if (petitionText) petitionText.remove();
                        
                        // Reset click handler
                        const newButton = floor8Button.cloneNode(true);
                        floor8Button.parentNode.replaceChild(newButton, floor8Button);
                        
                        newButton.addEventListener('click', () => {
                            app.goToFloor(8);
                        });
                    }
                    
                    // Complete song fragment task
                    const songTask = app.state.player.taskList.find(t => t.id === 'task-song');
                    if (songTask && !songTask.completed) {
                        app.completeTask('task-song');
                    }
                    
                    // Add 8th floor exploration task
                    const floor8Task = {
                        id: 'task-floor8',
                        name: 'Explore the mysterious 8th floor',
                        completed: false
                    };
                    
                    if (!app.state.player.taskList.some(t => t.id === 'task-floor8')) {
                        app.state.player.taskList.push(floor8Task);
                        app.updateTaskList();
                    }
                } else {
                    app.showNotification({
                        type: 'error',
                        title: 'Petition Denied',
                        message: 'Your petition for 8th floor access has been denied. The system provided no reason for the rejection.'
                    });
                }
                
                // Close modal
                modal.classList.remove('show');
                setTimeout(() => modal.remove(), 300);
            });
        }
    },
    
    initiateTileRearrangement() {
        // Track rule violations to trigger tile rearrangement effects
        this.state.lastViolationCount = app.state.player.violations.length;
        
        // Set up interval to check for 5th violations
        const tileInterval = setInterval(() => {
            const currentViolations = app.state.player.violations.length;
            
            // Check if we've hit a multiple of 5
            if (currentViolations >= 5 && currentViolations % 5 === 0 && currentViolations !== this.state.lastViolationCount) {
                this.state.lastViolationCount = currentViolations;
                this.triggerTileRearrangement();
            }
        }, 10000); // Check every 10 seconds
        
        // Store interval ID for cleanup
        this.state.tileInterval = tileInterval;
        
        app.showNotification({
            type: 'info',
            title: 'Consequence Tiling',
            message: 'The hotel will now physically respond to rule violations. Every 5th violation will cause structural changes.'
        });
    },
    
    triggerTileRearrangement() {
        // Determine which effect to trigger
        const effects = [
            'corridor-tiles',
            'bathroom-stalls',
            'candy-conversion'
        ];
        
        const effect = effects[Math.floor(Math.random() * effects.length)];
        
        switch (effect) {
            case 'corridor-tiles':
                app.showNotification({
                    type: 'warning',
                    title: 'Tile Rearrangement',
                    message: 'The tiles in the southwest corridor have rearranged themselves based on long-term tenant data.'
                });
                
                // Add visualization effect next time player changes floors
                this.state.pendingEffects = this.state.pendingEffects || [];
                this.state.pendingEffects.push({
                    type: 'corridor-tiles',
                    time: app.state.hotel.currentTime.getTime()
                });
                break;
                
            case 'bathroom-stalls':
                const stalls = Math.random() < 0.5 ? 'gained' : 'lost';
                const count = Math.floor(Math.random() * 3) + 1;
                
                app.showNotification({
                    type: 'warning',
                    title: 'Bathroom Modification',
                    message: `Public restrooms have ${stalls} ${count} stalls based on current parking lot occupancy.`
                });
                
                // Add a cryptic message that appears when player next uses bathroom
                this.state.pendingEffects = this.state.pendingEffects || [];
                this.state.pendingEffects.push({
                    type: 'bathroom-message',
                    time: app.state.hotel.currentTime.getTime(),
                    message: `The changing stalls whisper: "${this.generateCrypticMessage()}"`
                });
                break;
                
            case 'candy-conversion':
                app.showNotification({
                    type: 'warning',
                    title: 'Candy Conversion',
                    message: 'Front desk candy stocks have converted to deer repellent during the maintenance period.'
                });
                
                // Add special interaction next time player visits front desk
                this.state.pendingEffects = this.state.pendingEffects || [];
                this.state.pendingEffects.push({
                    type: 'deer-repellent',
                    time: app.state.hotel.currentTime.getTime()
                });
                break;
        }
        
        // Increase anomaly level
        app.state.gameState.anomalyLevel += 5;
    },
    
    generateCrypticMessage() {
        const messages = [
            "Night Elk awaits those who count floors backwards",
            "Room 3305 contains the inverse of your arrival",
            "The 8th floor exists only on Tuesdays after rainfall",
            "When water flows upward, listen for Mary Lulu",
            "Kuang counts the pancakes, but never the guests",
            "The front desk remembers what you've forgotten"
        ];
        
        return messages[Math.floor(Math.random() * messages.length)];
    },
    
    enableLeathermanGambit() {
        app.showNotification({
            type: 'info',
            title: 'Leatherman Gambit',
            message: 'You can now use leather items to manipulate hotel systems. Wearing 4+ leather items unlocks special abilities.'
        });
        
        // Add leather items to inventory if player doesn't have them
        if (!app.state.player.inventory) {
            app.state.player.inventory = [];
        }
        
        const leatherItems = [
            { id: 'leather-boots', name: 'Leather Boots', type: 'apparel', equipped: false },
            { id: 'leather-pants', name: 'Leather Pants', type: 'apparel', equipped: false },
            { id: 'leather-belt', name: 'Leather Belt', type: 'apparel', equipped: false },
            { id: 'leather-hat', name: 'Leather Hat', type: 'apparel', equipped: false },
            { id: 'leather-socks', name: 'Leather Socks', type: 'apparel', equipped: false }
        ];
        
        // Add any missing leather items
        leatherItems.forEach(item => {
            if (!app.state.player.inventory.some(i => i.id === item.id)) {
                app.state.player.inventory.push(item);
            }
        });
        
        // Add UI for managing leather items
        this.addLeatherItemsUI();
    },
    
    addLeatherItemsUI() {
        // Check if we already have the inventory section
        let inventorySection = document.querySelector('.inventory-section');
        
        if (!inventorySection) {
            // Create inventory section in sidebar
            inventorySection = document.createElement('div');
            inventorySection.className = 'inventory-section';
            
            inventorySection.innerHTML = `
                <h3>Inventory</h3>
                <div class="inventory-items" id="inventory-items">
                    <!-- Item slots will be added here -->
                </div>
                <div class="inventory-status">
                    <div class="leather-count">Leather Items: <span id="leather-count">0</span>/5</div>
                    <div class="abilities-status" id="abilities-status">No special abilities</div>
                </div>
            `;
            
            // Add it to the sidebar
            const sidebar = document.querySelector('.sidebar');
            
            if (sidebar) {
                // Insert before the task log
                const taskLog = document.querySelector('.task-log');
                if (taskLog) {
                    sidebar.insertBefore(inventorySection, taskLog);
                } else {
                    sidebar.appendChild(inventorySection);
                }
            }
            
            // Add styling
            const style = document.createElement('style');
            style.textContent = `
                .inventory-section {
                    padding: 20px;
                    border-bottom: 1px solid #ddd;
                }
                .inventory-section h3 {
                    margin-bottom: 10px;
                    color: var(--primary-color);
                    font-size: 1rem;
                }
                .inventory-items {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 10px;
                    margin-bottom: 15px;
                }
                .item-slot {
                    background-color: #f9f9f9;
                    border-radius: var(--border-radius);
                    padding: 10px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .item-slot:hover {
                    background-color: #f0f0f0;
                }
                .item-slot.equipped {
                    background-color: var(--accent-color);
                    color: white;
                }
                .item-icon {
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--primary-color);
                }
                .item-slot.equipped .item-icon {
                    color: white;
                }
                .item-name {
                    font-size: 0.9rem;
                }
                .inventory-status {
                    font-size: 0.9rem;
                }
                .leather-count {
                    margin-bottom: 5px;
                    font-weight: bold;
                }
                .abilities-status {
                    font-style: italic;
                    color: var(--light-text);
                }
            `;
            document.head.appendChild(style);
        }
        
        // Populate inventory items
        this.updateInventoryUI();
    },
    
    updateInventoryUI() {
        const inventoryItems = document.getElementById('inventory-items');
        if (!inventoryItems) return;
        
        // Clear existing items
        inventoryItems.innerHTML = '';
        
        // Only show leather items
        const leatherItems = app.state.player.inventory.filter(item => 
            item.id.includes('leather')
        );
        
        // Create item slots
        leatherItems.forEach(item => {
            const itemSlot = document.createElement('div');
            itemSlot.className = `item-slot ${item.equipped ? 'equipped' : ''}`;
            itemSlot.dataset.id = item.id;
            
            itemSlot.innerHTML = `
                <div class="item-icon">
                    <i class="fas fa-${this.getItemIcon(item.id)}"></i>
                </div>
                <div class="item-name">${item.name}</div>
            `;
            
            // Toggle equip status on click
            itemSlot.addEventListener('click', () => {
                this.toggleItemEquipped(item.id);
            });
            
            inventoryItems.appendChild(itemSlot);
        });
        
        // Update leather count
        const equippedCount = leatherItems.filter(item => item.equipped).length;
        this.state.leatherItemsEquipped = equippedCount;
        
        const leatherCount = document.getElementById('leather-count');
        if (leatherCount) {
            leatherCount.textContent = equippedCount;
        }
        
        // Update abilities status
        const abilitiesStatus = document.getElementById('abilities-status');
        if (abilitiesStatus) {
            if (equippedCount >= 4) {
                abilitiesStatus.textContent = 'Leatherman Gambit active!';
                abilitiesStatus.style.color = 'var(--success-color)';
                
                // Enable special abilities
                this.enableLeathermanAbilities();
            } else {
                abilitiesStatus.textContent = `Need ${4 - equippedCount} more leather items`;
                abilitiesStatus.style.color = 'var(--light-text)';
                
                // Disable special abilities
                this.disableLeathermanAbilities();
            }
        }
    },
    
    getItemIcon(itemId) {
        switch(itemId) {
            case 'leather-boots': return 'boot';
            case 'leather-pants': return 'walking';
            case 'leather-belt': return 'ellipsis-h';
            case 'leather-hat': return 'hat-cowboy';
            case 'leather-socks': return 'socks';
            default: return 'tshirt';
        }
    },
    
    toggleItemEquipped(itemId) {
        // Find item in inventory
        const item = app.state.player.inventory.find(i => i.id === itemId);
        if (item) {
            item.equipped = !item.equipped;
            
            // Update UI
            this.updateInventoryUI();
        }
    },
    
    enableLeathermanAbilities() {
        // Add special abilities when 4+ leather items are equipped
        
        // 1. Elevator Remapping
        this.addElevatorRemapButton();
        
        // 2. Bathtub Hyperlink interface - connects with a31
        if (this.state.unlockedProcedures.includes('a31')) {
            this.setupBathtubHyperlink();
        }
        
        // 3. Pancake Duel with Kuang
        if (app.narrative.state.plotFlags.metKuangShengyou) {
            this.addPancakeDuelButton();
        }
    },
    
    disableLeathermanAbilities() {
        // Remove special ability buttons when leather count drops below 4
        
        // Remove elevator remap button
        const remapButton = document.getElementById('remap-elevator-btn');
        if (remapButton) remapButton.remove();
        
        // Remove pancake duel button
        const duelButton = document.getElementById('pancake-duel-btn');
        if (duelButton) duelButton.remove();
    },
    
    addElevatorRemapButton() {
        // Add remap button to elevator modal
        const elevatorModal = document.getElementById('elevator-modal');
        if (!elevatorModal) return;
        
        // Check if button already exists
        if (document.getElementById('remap-elevator-btn')) return;
        
        const controlsDiv = elevatorModal.querySelector('.elevator-controls');
        if (controlsDiv) {
            const remapButton = document.createElement('button');
            remapButton.id = 'remap-elevator-btn';
            remapButton.className = 'remap-elevator-button';
            remapButton.innerHTML = '<i class="fas fa-random"></i>';
            remapButton.title = 'Remap Elevator (Leatherman Gambit)';
            
            remapButton.style.cssText = `
                background-color: var(--tertiary-color);
                color: white;
            `;
            
            remapButton.addEventListener('click', () => {
                this.showElevatorRemapInterface();
            });
            
            controlsDiv.appendChild(remapButton);
        }
    },
    
    showElevatorRemapInterface() {
        // Create remap interface
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.id = 'elevator-remap-modal';
        
        modal.innerHTML = `
            <div class="modal-content remap-content">
                <div class="modal-header">
                    <h3>Elevator Remapping</h3>
                    <span class="close-button">&times;</span>
                </div>
                <div class="remap-interface">
                    <p>As a Leatherman, you can temporarily remap elevator destinations using candy patterns.</p>
                    
                    <div class="candy-pattern">
                        <h4>Select Candy Pattern</h4>
                        <div class="candy-options">
                            <div class="candy" data-pattern="linear">
                                <div class="candy-icon" style="background-color: #e74c3c;"></div>
                                <span>Linear</span>
                            </div>
                            <div class="candy" data-pattern="alternate">
                                <div class="candy-icon" style="background-color: #3498db;"></div>
                                <span>Alternate</span>
                            </div>
                            <div class="candy" data-pattern="reverse">
                                <div class="candy-icon" style="background-color: #2ecc71;"></div>
                                <span>Reverse</span>
                            </div>
                            <div class="candy" data-pattern="random">
                                <div class="candy-icon" style="background-color: #9b59b6;"></div>
                                <span>Random</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="floor-mapping">
                        <h4>Destination Mapping</h4>
                        <div class="mapping-diagram">
                            <div class="mapping-item">
                                <div class="mapping-source">1</div>
                                <div class="mapping-arrow">→</div>
                                <div class="mapping-destination" id="map-dest-1">1</div>
                            </div>
                            <div class="mapping-item">
                                <div class="mapping-source">2</div>
                                <div class="mapping-arrow">→</div>
                                <div class="mapping-destination" id="map-dest-2">2</div>
                            </div>
                            <div class="mapping-item">
                                <div class="mapping-source">3</div>
                                <div class="mapping-arrow">→</div>
                                <div class="mapping-destination" id="map-dest-3">3</div>
                            </div>
                            <!-- More mappings would be added here -->
                        </div>
                    </div>
                    
                    <div class="remap-warning">
                        <i class="fas fa-exclamation-triangle"></i>
                        <span>Warning: Remapping will last for 1 hour. Use with caution.</span>
                    </div>
                </div>
                <div class="remap-actions">
                    <button id="apply-remap" class="action-button quantum-button">
                        <i class="fas fa-random"></i> Apply Remapping
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add specialized CSS
        const style = document.createElement('style');
        style.textContent = `
            .remap-content {
                max-width: 600px;
            }
            .candy-options {
                display: flex;
                gap: 15px;
                margin: 15px 0;
            }
            .candy {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 5px;
                cursor: pointer;
                transition: all 0.2s ease;
                padding: 10px;
                border-radius: var(--border-radius);
            }
            .candy:hover {
                background-color: #f0f0f0;
            }
            .candy.selected {
                background-color: #f0f0f0;
                font-weight: bold;
            }
            .candy-icon {
                width: 30px;
                height: 30px;
                border-radius: 50%;
            }
            .mapping-diagram {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 10px;
                margin: 15px 0;
            }
            .mapping-item {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
            }
            .mapping-source, .mapping-destination {
                background-color: #f0f0f0;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
            }
            .mapping-destination {
                background-color: var(--accent-color);
                color: white;
            }
            .remap-warning {
                background-color: rgba(231, 76, 60, 0.1);
                color: var(--danger-color);
                padding: 10px;
                border-radius: var(--border-radius);
                display: flex;
                align-items: center;
                gap: 10px;
                margin-top: 20px;
            }
        `;
        document.head.appendChild(style);
        
        // Set up close button
        modal.querySelector('.close-button').addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        });
        
        // Set up candy selection
        let selectedPattern = null;
        
        document.querySelectorAll('.candy').forEach(candy => {
            candy.addEventListener('click', () => {
                // Deselect all candies
                document.querySelectorAll('.candy').forEach(c => c.classList.remove('selected'));
                
                // Select this candy
                candy.classList.add('selected');
                selectedPattern = candy.dataset.pattern;
                
                // Update mapping
                this.updateFloorMapping(selectedPattern);
            });
        });
        
        // Apply remapping button
        document.getElementById('apply-remap').addEventListener('click', () => {
            if (!selectedPattern) {
                app.showNotification({
                    type: 'warning',
                    title: 'No Pattern Selected',
                    message: 'Please select a candy pattern for the remapping.'
                });
                return;
            }
            
            // Apply remapping
            this.applyElevatorRemap(selectedPattern);
            
            // Close modal
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        });
    },
    
    updateFloorMapping(pattern) {
        // This would update the mapping diagram based on selected pattern
        const floorCount = 15;
        
        // Generate new mapping based on pattern
        let mapping = {};
        
        switch(pattern) {
            case 'linear':
                // 1→1, 2→2, etc. (normal)
                for (let i = 1; i <= floorCount; i++) {
                    mapping[i] = i;
                }
                break;
                
            case 'alternate':
                // Odd floors go to even floors and vice versa
                for (let i = 1; i <= floorCount; i++) {
                    if (i % 2 === 1) { // Odd
                        mapping[i] = i + 1 > floorCount ? i : i + 1;
                    } else { // Even
                        mapping[i] = i - 1;
                    }
                }
                break;
                
            case 'reverse':
                // Completely reversed (1→15, 2→14, etc.)
                for (let i = 1; i <= floorCount; i++) {
                    mapping[i] = floorCount - i + 1;
                }
                break;
                
            case 'random':
                // Random mapping (ensuring no floor maps to itself)
                let floors = Array.from({length: floorCount}, (_, i) => i + 1);
                for (let i = 1; i <= floorCount; i++) {
                    let availableFloors = floors.filter(f => f !== i);
                    let randomIndex = Math.floor(Math.random() * availableFloors.length);
                    mapping[i] = availableFloors[randomIndex];
                    
                    // Remove the selected floor to prevent duplicates
                    floors = floors.filter(f => f !== mapping[i]);
                }
                break;
        }
        
        // Update UI
        for (let i = 1; i <= floorCount; i++) {
            const destElement = document.getElementById(`map-dest-${i}`);
            if (destElement) {
                destElement.textContent = mapping[i];
            }
        }
        
        // Store mapping for use when applied
        this.state.elevatorMapping = mapping;
    },
    
    applyElevatorRemap(pattern) {
        // Apply the elevator remapping
        app.showNotification({
            type: 'success',
            title: 'Elevator Remapped',
            message: `Elevator destinations have been remapped using the ${pattern} candy pattern. This will last for 1 hour.`
        });
        
        // Store original floor access
        this.state.originalFloorAccess = {...app.state.hotel.floorAccess};
        
        // Apply mapping to elevator behavior
        if (pattern === 'alternate' && !app.state.hotel.floorAccess[8]) {
            // Special case: Alternate pattern might give access to 8th floor
            if (Math.random() < 0.3) {
                app.state.hotel.floorAccess[8] = true;
                
                setTimeout(() => {
                    app.showNotification({
                        type: 'info',
                        title: 'Anomalous Access',
                        message: 'The alternating pattern has temporarily allowed access to the 8th floor.'
                    });
                }, 5000);
            }
        }
        
        // Schedule reset
        const resetTime = new Date(app.state.hotel.currentTime.getTime() + 60 * 60 * 1000); // 1 hour later
        
        app.state.gameState.pendingEvents.push({
            type: 'elevator-remap-reset',
            time: resetTime.getTime(),
            pattern: pattern
        });
        
        // Handle random pattern specifically
        if (pattern === 'random') {
            // 20% chance to reveal a Night Elk clue through elevator malfunction
            if (Math.random() < 0.2) {
                setTimeout(() => {
                    this.triggerElevatorAnomaly();
                }, 15000); // 15 seconds later
            }
        }
    },
    
    triggerElevatorAnomaly() {
        app.showNotification({
            type: 'warning',
            title: 'Elevator Anomaly',
            message: 'The elevator is experiencing a malfunction. You feel it moving in an unexpected way.'
        });
        
        // Create elevator glitch effect
        const elevatorModal = document.createElement('div');
        elevatorModal.className = 'modal show';
        elevatorModal.id = 'elevator-anomaly-modal';
        
        elevatorModal.innerHTML = `
            <div class="modal-content elevator-anomaly">
                <div class="glitch-screen">
                    <div class="glitch-text">FLOOR ?</div>
                    <div class="glitch-effect"></div>
                </div>
                <div class="anomaly-message">
                    <p>The elevator is moving outside normal parameters.</p>
                    <p>Detecting quantum fluctuations consistent with Night Elk activity.</p>
                    <p>Emergency protocol activated.</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(elevatorModal);
        
        // Add special styling
        const style = document.createElement('style');
        style.textContent = `
            .elevator-anomaly {
                max-width: 400px;
                background-color: black;
                color: #33ff33;
                font-family: monospace;
                border: none;
                box-shadow: 0 0 20px rgba(51, 255, 51, 0.5);
            }
            .glitch-screen {
                height: 200px;
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
                overflow: hidden;
            }
            .glitch-text {
                font-size: 4rem;
                font-weight: bold;
                position: relative;
                animation: textGlitch 0.5s infinite;
            }
            @keyframes textGlitch {
                0% { transform: translateX(0); filter: hue-rotate(0deg); }
                10% { transform: translateX(-2px); filter: hue-rotate(90deg); }
                20% { transform: translateX(2px); filter: hue-rotate(180deg); }
                30% { transform: translateX(0); filter: hue-rotate(270deg); }
                40% { transform: translateX(2px); filter: hue-rotate(0deg); }
                50% { transform: translateX(-2px); filter: hue-rotate(90deg); }
                60% { transform: translateX(0); filter: hue-rotate(180deg); }
                70% { transform: translateX(-2px); filter: hue-rotate(270deg); }
                80% { transform: translateX(2px); filter: hue-rotate(0deg); }
                90% { transform: translateX(0); filter: hue-rotate(90deg); }
                100% { transform: translateX(0); filter: hue-rotate(0deg); }
            }
            .glitch-effect {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(transparent 0%, rgba(51, 255, 51, 0.2) 50%, transparent 100%);
                background-size: 100% 4px;
                animation: scanlines 0.5s linear infinite;
            }
            @keyframes scanlines {
                0% { transform: translateY(0); }
                100% { transform: translateY(4px); }
            }
            .anomaly-message {
                padding: 20px;
                line-height: 1.5;
            }
            .anomaly-message p {
                margin-bottom: 10px;
                animation: typewriter 1s steps(40, end);
            }
            @keyframes typewriter {
                from { width: 0; opacity: 0; }
                to { width: 100%; opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        // Change floor display randomly
        const floorDisplay = elevatorModal.querySelector('.glitch-text');
        let floorChangeInterval;
        
        if (floorDisplay) {
            floorChangeInterval = setInterval(() => {
                // Generate random "floor"
                const options = ['8', '17', '??', '∞', '8↑', '∇', '8⁄17', 'NE'];
                floorDisplay.textContent = `FLOOR ${options[Math.floor(Math.random() * options.length)]}`;
            }, 500);
        }
        
        // Close modal after delay and add Night Elk clue
        setTimeout(() => {
            clearInterval(floorChangeInterval);
            elevatorModal.classList.remove('show');
            
            setTimeout(() => {
                elevatorModal.remove();
                
                // Add Night Elk clue
                app.showNotification({
                    type: 'info',
                    title: 'Night Elk Clue',
                    message: 'You found a message in the elevator system: "Elk emerges at floor 8-17 intersection. Password: 9321."'
                });
                
                // Add clue to player's discovered secrets
                if (!app.state.player.discoveredSecrets.includes('elevator-anomaly')) {
                    app.state.player.discoveredSecrets.push('elevator-anomaly');
                    app.state.gameState.puzzleProgress += 20;
                }
            }, 300);
        }, 8000);
    },
    
    addPancakeDuelButton() {
        // Add button to challenge Kuang to a pancake duel
        // This could be added to a specific area of the UI, like the actions menu
        // For simplicity, we'll add it to the avatar section for now
        
        // Check if button already exists
        if (document.getElementById('pancake-duel-btn')) return;
        
        const avatarSection = document.querySelector('.avatar-section');
        if (avatarSection) {
            const duelButton = document.createElement('button');
            duelButton.id = 'pancake-duel-btn';
            duelButton.className = 'action-button quantum-button';
            duelButton.style.marginTop = '10px';
            duelButton.innerHTML = '<i class="fas fa-utensils"></i> Challenge to Pancake Duel';
            
            duelButton.addEventListener('click', () => {
                this.initiatePancakeDuel();
            });
            
            avatarSection.appendChild(duelButton);
        }
    },
    
    initiatePancakeDuel() {
        app.showNotification({
            type: 'info',
            title: 'Pancake Duel',
            message: 'You are challenging Kuang Shengyou to a scallion pancake duel!'
        });
        
        // Create duel interface
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.id = 'pancake-duel-modal';
        
        modal.innerHTML = `
            <div class="modal-content duel-content">
                <div class="modal-header">
                    <h3>Scallion Pancake Duel</h3>
                    <span class="close-button">&times;</span>
                </div>
                <div class="duel-interface">
                    <div class="duel-participants">
                        <div class="duel-participant player">
                            <div class="participant-avatar">
                                <i class="fas fa-user"></i>
                            </div>
                            <div class="participant-name">You</div>
                            <div class="pancake-stack" id="player-stack">
                                <div class="pancake"></div>
                            </div>
                        </div>
                        <div class="duel-vs">VS</div>
                        <div class="duel-participant kuang">
                            <div class="participant-avatar">
                                <i class="fas fa-user-tie"></i>
                            </div>
                            <div class="participant-name">Kuang Shengyou</div>
                            <div class="pancake-stack" id="kuang-stack">
                                <div class="pancake"></div>
                            </div>
                        </div>
                    </div>
                    <div class="duel-instructions">
                        <p>The first to stack 5 perfect pancakes wins.</p>
                        <p>Each round, choose your pancake-making strategy carefully.</p>
                    </div>
                    <div class="duel-actions">
                        <button class="duel-action" data-action="precise">
                            <i class="fas fa-ruler"></i>
                            <span>Precise Measurement</span>
                        </button>
                        <button class="duel-action" data-action="quick">
                            <i class="fas fa-bolt"></i>
                            <span>Quick Flip</span>
                        </button>
                        <button class="duel-action" data-action="creative">
                            <i class="fas fa-palette"></i>
                            <span>Creative Flourish</span>
                        </button>
                    </div>
                    <div class="duel-status" id="duel-status">
                        Choose your pancake-making strategy to begin.
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add specialized CSS
        const style = document.createElement('style');
        style.textContent = `
            .duel-content {
                max-width: 700px;
            }
            .duel-participants {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 20px;
            }
            .duel-participant {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10px;
                flex: 1;
            }
            .participant-avatar {
                width: 60px;
                height: 60px;
                background-color: var(--primary-color);
                color: white;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 1.5rem;
            }
            .duel-participant.kuang .participant-avatar {
                background-color: var(--tertiary-color);
            }
            .participant-name {
                font-weight: bold;
            }
            .duel-vs {
                font-size: 1.5rem;
                font-weight: bold;
                color: var(--primary-color);
            }
            .pancake-stack {
                height: 120px;
                width: 120px;
                display: flex;
                flex-direction: column-reverse;
                align-items: center;
                justify-content: flex-end;
                position: relative;
            }
            .pancake {
                width: 100px;
                height: 20px;
                background-color: #f1c40f;
                border-radius: 50%;
                margin-bottom: 2px;
                position: relative;
            }
            .pancake::before {
                content: "";
                position: absolute;
                top: 5px;
                left: 20px;
                width: 60px;
                height: 10px;
                background-color: rgba(0, 0, 0, 0.1);
                border-radius: 5px;
            }
            .pancake.perfect {
                background-color: #f39c12;
                box-shadow: 0 0 10px #f39c12;
            }
            .pancake.burnt {
                background-color: #7f8c8d;
            }
            .pancake.undercooked {
                background-color: #f9e79f;
            }
            .duel-instructions {
                background-color: #f0f0f0;
                padding: 15px;
                border-radius: var(--border-radius);
                margin-bottom: 20px;
                text-align: center;
            }
            .duel-actions {
                display: flex;
                justify-content: space-between;
                gap: 15px;
                margin-bottom: 20px;
            }
            .duel-action {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10px;
                padding: 15px;
                background-color: #f9f9f9;
                border: none;
                border-radius: var(--border-radius);
                cursor: pointer;
                transition: all 0.2s ease;
            }
            .duel-action:hover {
                background-color: #f0f0f0;
                transform: translateY(-2px);
            }
            .duel-action i {
                font-size: 1.5rem;
                color: var(--primary-color);
            }
            .duel-status {
                text-align: center;
                font-style: italic;
                margin-top: 20px;
                min-height: 40px;
            }
        `;
        document.head.appendChild(style);
        
        // Set up game state
        const duelState = {
            playerPancakes: 1,
            kuangPancakes: 1,
            round: 1,
            playerChoice: null,
            gameOver: false
        };
        
        // Set up strategy buttons
        document.querySelectorAll('.duel-action').forEach(button => {
            button.addEventListener('click', () => {
                if (duelState.gameOver) return;
                
                const action = button.dataset.action;
                playRound(action);
            });
        });
        
        // Game logic
        const playRound = (playerAction) => {
            // Disable buttons during round
            document.querySelectorAll('.duel-action').forEach(btn => {
                btn.disabled = true;
                btn.style.opacity = 0.5;
                btn.style.cursor = 'not-allowed';
            });
            
            // Update status
            document.getElementById('duel-status').textContent = `You chose ${playerAction}. Kuang is making his pancake...`;
            
            // Kuang's strategy - weighted random
            const strategies = ['precise', 'quick', 'creative'];
            let kuangStrategy;
            
            // Kuang favors precise but adapts to player's choice
            if (duelState.round > 2) {
                // After round 2, Kuang starts to counter player's previous choices
                if (duelState.playerChoice === 'precise') {
                    // More likely to choose creative to counter precision
                    kuangStrategy = Math.random() < 0.6 ? 'creative' : (Math.random() < 0.5 ? 'precise' : 'quick');
                } else if (duelState.playerChoice === 'quick') {
                    // More likely to choose precise to counter quick
                    kuangStrategy = Math.random() < 0.6 ? 'precise' : (Math.random() < 0.5 ? 'creative' : 'quick');
                } else {
                    // More likely to choose quick to counter creative
                    kuangStrategy = Math.random() < 0.6 ? 'quick' : (Math.random() < 0.5 ? 'precise' : 'creative');
                }
            } else {
                // In early rounds, Kuang favors precision
                kuangStrategy = Math.random() < 0.5 ? 'precise' : strategies[Math.floor(Math.random() * strategies.length)];
            }
            
            // Store player's choice for next round
            duelState.playerChoice = playerAction;
            
            // Determine outcomes
            let playerOutcome, kuangOutcome;
            
            // Determine player outcome
            if (playerAction === 'precise') {
                playerOutcome = Math.random() < 0.7 ? 'perfect' : (Math.random() < 0.5 ? 'undercooked' : 'burnt');
            } else if (playerAction === 'quick') {
                playerOutcome = Math.random() < 0.5 ? 'perfect' : (Math.random() < 0.7 ? 'undercooked' : 'burnt');
            } else { // creative
                playerOutcome = Math.random() < 0.6 ? 'perfect' : (Math.random() < 0.3 ? 'undercooked' : 'burnt');
            }
            
            // Determine Kuang's outcome
            if (kuangStrategy === 'precise') {
                kuangOutcome = Math.random() < 0.8 ? 'perfect' : (Math.random() < 0.5 ? 'undercooked' : 'burnt');
            } else if (kuangStrategy === 'quick') {
                kuangOutcome = Math.random() < 0.6 ? 'perfect' : (Math.random() < 0.7 ? 'undercooked' : 'burnt');
            } else { // creative
                kuangOutcome = Math.random() < 0.7 ? 'perfect' : (Math.random() < 0.3 ? 'undercooked' : 'burnt');
            }
            
            // Simulate pancake creation delay
            setTimeout(() => {
                // Add pancakes with appropriate classes
                const playerStack = document.getElementById('player-stack');
                const kuangStack = document.getElementById('kuang-stack');
                
                if (playerOutcome === 'perfect') {
                    const newPancake = document.createElement('div');
                    newPancake.className = 'pancake perfect';
                    playerStack.appendChild(newPancake);
                    duelState.playerPancakes++;
                }
                
                if (kuangOutcome === 'perfect') {
                    const newPancake = document.createElement('div');
                    newPancake.className = 'pancake perfect';
                    kuangStack.appendChild(newPancake);
                    duelState.kuangPancakes++;
                }
                
                // Update status
                document.getElementById('duel-status').innerHTML = `
                    Round ${duelState.round} results:<br>
                    You (${playerAction}): ${playerOutcome}<br>
                    Kuang (${kuangStrategy}): ${kuangOutcome}
                `;
                
                // Check win condition
                if (duelState.playerPancakes >= 5 || duelState.kuangPancakes >= 5) {
                    duelState.gameOver = true;
                    
                    setTimeout(() => {
                        if (duelState.playerPancakes >= 5 && duelState.kuangPancakes >= 5) {
                            // Tie
                            document.getElementById('duel-status').innerHTML = `
                                <strong>It's a tie!</strong><br>
                                Kuang nods respectfully. "Your pancake skills match your perfume design talents."
                            `;
                            
                            // Tie outcome - small Night Elk hint
                            setTimeout(() => {
                                app.showNotification({
                                    type: 'info',
                                    title: 'Night Elk Clue',
                                    message: 'Kuang whispers: "The Night Elk isn\'t what you think it is. Look closer at the numbers."'
                                });
                            }, 3000);
                        } else if (duelState.playerPancakes >= 5) {
                            // Player wins
                            document.getElementById('duel-status').innerHTML = `
                                <strong>You win the duel!</strong><br>
                                Kuang seems impressed. "Perhaps you are worthy of the Night Elk after all."
                            `;
                            
                            // Win outcome - significant Night Elk advancement
                            setTimeout(() => {
                                app.showNotification({
                                    type: 'success',
                                    title: 'Night Elk Advancement',
                                    message: 'Kuang gives you a key card labeled "NE-8". It seems to grant access to something important.'
                                });
                                
                                // Add key card to inventory
                                const keyCard = {
                                    id: 'ne-key-card',
                                    name: 'Night Elk Access Card',
                                    type: 'key',
                                    description: 'Grants access to Night Elk facilities. Marked "NE-8".'
                                };
                                
                                app.state.player.inventory.push(keyCard);
                                
                                // Add Night Elk progress
                                app.state.gameState.puzzleProgress += 30;
                            }, 3000);
                        } else {
                            // Kuang wins
                            document.getElementById('duel-status').innerHTML = `
                                <strong>Kuang wins the duel!</strong><br>
                                He smiles slightly. "Not bad, but you still have much to learn. Practice more."
                            `;
                            
                            // Loss outcome - small hint
                            setTimeout(() => {
                                app.showNotification({
                                    type: 'info',
                                    title: 'Consolation Prize',
                                    message: 'Kuang hands you a slip of paper with "Check service corridor near room 3305" written on it.'
                                });
                                
                                // Add task
                                const corridorTask = {
                                    id: 'task-corridor',
                                    name: 'Check service corridor near room 3305',
                                    completed: false
                                };
                                
                                if (!app.state.player.taskList.some(t => t.id === 'task-corridor')) {
                                    app.state.player.taskList.push(corridorTask);
                                    app.updateTaskList();
                                }
                            }, 3000);
                        }
                    }, 1000);
                } else {
                    // Next round
                    duelState.round++;
                    
                    // Re-enable buttons after delay
                    setTimeout(() => {
                        document.querySelectorAll('.duel-action').forEach(btn => {
                            btn.disabled = false;
                            btn.style.opacity = 1;
                            btn.style.cursor = 'pointer';
                        });
                    }, 1000);
                }
            }, 2000);
        };
        
        // Set up close button
        modal.querySelector('.close-button').addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        });
    },
    
    setupBathtubHyperlink() {
        // This would be implemented when player interacts with bathtub
        app.showNotification({
            type: 'info',
            title: 'Bathtub Hyperlink System',
            message: 'Your leather items have activated the bathtub hyperlink system. Fill the tub to access hotel data networks.'
        });
        
        // Add bathtub interaction task
        const bathtubTask = {
            id: 'task-bathtub',
            name: 'Configure bathtub for data access',
            completed: false
        };
        
        if (!app.state.player.taskList.some(t => t.id === 'task-bathtub')) {
            app.state.player.taskList.push(bathtubTask);
            app.updateTaskList();
        }
    },
    
    beginRealityConsensusTracking() {
        app.showNotification({
            type: 'info',
            title: 'Reality Consensus Threshold',
            message: 'You can now observe how hotel features phase in and out of existence based on collective acknowledgment.'
        });
        
        // Start consensus tracking
        this.state.consensusTrackingActive = true;
        
        // Schedule first consensus event
        const firstEventTime = new Date(app.state.hotel.currentTime.getTime() + (30 * 60 * 1000)); // 30 minutes later
        
        app.state.gameState.pendingEvents.push({
            type: 'consensus-shift',
            time: firstEventTime.getTime()
        });
    },
    
    // Utility Methods
    formatGameTime(date, hoursToAdd = 0) {
        // Format time, optionally adding hours
        const newDate = new Date(date.getTime() + (hoursToAdd * 60 * 60 * 1000));
        
        const hours = newDate.getHours().toString().padStart(2, '0');
        const minutes = newDate.getMinutes().toString().padStart(2, '0');
        
        return `${hours}:${minutes}`;
    },
    
    upgradePlayerAvatar(newAvatar) {
        app.state.player.avatar = newAvatar;
        
        // Update avatar display
        const avatarImage = document.getElementById('avatar-image');
        const avatarName = document.getElementById('avatar-name');
        const levelBadge = document.getElementById('guest-level');
        
        if (avatarImage) {
            avatarImage.innerHTML = '';
            
            let iconClass;
            switch(newAvatar) {
                case 'water-grass': iconClass = 'fa-seedling'; break;
                case 'shrub': iconClass = 'fa-leaf'; break;
                case 'wild-boar': iconClass = 'fa-horse'; break;
                case 'reindeer': iconClass = 'fa-paw'; break;
                case 'antelope': iconClass = 'fa-dog'; break;
                case 'elk': iconClass = 'fa-deer'; break;
                default: iconClass = 'fa-seedling';
            }
            
            const icon = document.createElement('i');
            icon.className = `fas ${iconClass}`;
            avatarImage.appendChild(icon);
        }
        
        if (avatarName) {
            avatarName.textContent = newAvatar.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
        }
        
        if (levelBadge) {
            levelBadge.textContent = newAvatar.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
        }
        
        app.showNotification({
            type: 'success',
            title: 'Avatar Upgraded',
            message: `Your avatar has been upgraded to ${newAvatar.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')}!`
        });
        
        // Handle avatar-specific effects
        if (newAvatar === 'shrub') {
            this.upgradeAvatarWaterPrivileges();
        }
    },
    
    // Initialize and connect to main app
    init() {
        // Check for conditions to unlock initial supplementary procedures
        if (typeof app !== 'undefined') {
            // Periodically check for unlockable procedures
            setInterval(() => {
                Object.keys(this.procedures).forEach(procedureId => {
                    if (this.checkUnlockRequirements(procedureId)) {
                        this.unlockProcedure(procedureId);
                    }
                });
            }, 30000); // Check every 30 seconds
            
            // Register with main app
            app.supplementary = this;
        }
    }
};

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    supplementaryProcedures.init();
});