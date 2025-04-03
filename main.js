// Main Application Integration for Hotel Check-in Procedure
// This file connects all the modules and ensures they work together

document.addEventListener('DOMContentLoaded', function() {
    // Global app state for Hotel Check-in Procedure
    window.hotelApp = {
        // Core modules
        app: null,          // Core application (defined in app.js)
        narrative: null,    // Narrative engine
        elevator: null,     // Elevator simulation
        room: null,         // Room simulation
        supplementary: null, // Supplementary procedures
        quantumEffects: null, // Quantum visual effects
        
        // Integration state
        ready: false,
        loadedModules: 0,
        totalModules: 5, // app, narrative, elevator, room, supplementary
        
        // Initialization
        init: function() {
            console.log('Initializing Hotel Check-in Procedure application...');
            
            // Start loading animation
            this.showLoadingAnimation();
            
            // Initialize event listeners
            this.setupEventListeners();
            
            // Check if all modules are loaded
            this.checkModulesLoaded();
        },
        
        // Loading animation
        showLoadingAnimation: function() {
            // Check if loading screen already exists
            if (document.getElementById('loading-screen')) return;
            
            // Create loading screen element
            const loadingScreen = document.createElement('div');
            loadingScreen.id = 'loading-screen';
            loadingScreen.innerHTML = `
                <div class="loading-container">
                    <div class="loading-text">
                        <p>Downloading hotel check-in procedures...</p>
                        <p class="small-text">(in fact, they are ⦁ formulaic, ⦁ also private, ⦁ scripted)</p>
                    </div>
                    <div class="loading-bar">
                        <div class="loading-progress"></div>
                    </div>
                    <div class="loading-status">Connecting to Balance Beam Branch...</div>
                </div>
            `;
            
            document.body.appendChild(loadingScreen);
            document.body.classList.add('loading');
            
            // Start loading progress animation
            this.animateLoading();
        },
        
        animateLoading: function() {
            const progressBar = document.querySelector('.loading-progress');
            const statusText = document.querySelector('.loading-status');
            
            // Loading stages
            const stages = [
                'Connecting to Balance Beam Branch...',
                'Accessing hotel database...',
                'Retrieving check-in procedures...',
                'Verifying Night Elk clearance...',
                'Processing rule variations...',
                'Configuring quantum effects...',
                'Initializing System Assistant...',
                'Finalizing room assignment...'
            ];
            
            let progress = 0;
            let stageIndex = 0;
            const updateInterval = 200; // Update every 200ms
            
            // Update progress regularly
            const progressInterval = setInterval(() => {
                // Calculate target progress based on loaded modules
                const targetProgress = (this.loadedModules / this.totalModules) * 100;
                
                // Increment progress smoothly
                if (progress < targetProgress) {
                    progress += Math.random() * 5; // Random increment for natural feel
                    
                    if (progress > targetProgress) {
                        progress = targetProgress;
                    }
                    
                    // Update progress bar
                    progressBar.style.width = `${progress}%`;
                    
                    // Update loading stage text
                    if (progress > (stageIndex + 1) * (100 / stages.length) && stageIndex < stages.length - 1) {
                        stageIndex++;
                        statusText.textContent = stages[stageIndex];
                    }
                }
                
                // When fully loaded
                if (this.ready && progress >= 100) {
                    clearInterval(progressInterval);
                    
                    // Show completion message
                    statusText.textContent = 'Check-in procedures downloaded successfully!';
                    
                    // Hide loading screen after delay
                    setTimeout(() => {
                        document.body.classList.remove('loading');
                        const loadingScreen = document.getElementById('loading-screen');
                        if (loadingScreen) {
                            loadingScreen.style.opacity = '0';
                            setTimeout(() => {
                                loadingScreen.remove();
                            }, 500);
                        }
                    }, 1000);
                }
            }, updateInterval);
        },
        
        // Module loading tracking
        moduleLoaded: function(moduleName) {
            console.log(`Module loaded: ${moduleName}`);
            this.loadedModules++;
            this.checkModulesLoaded();
        },
        
        checkModulesLoaded: function() {
            if (this.loadedModules >= this.totalModules) {
                console.log('All modules loaded!');
                this.ready = true;
                this.connectModules();
                this.startApplication();
            }
        },
        
        // Connect modules to each other
        connectModules: function() {
            console.log('Connecting modules...');
            
            // Ensure app module exists
            if (!this.app) {
                console.error('Core app module not found');
                return;
            }
            
            // Connect narrative engine to app
            if (this.narrative) {
                this.app.narrative = this.narrative;
                this.narrative.app = this.app;
                console.log('Connected narrative engine');
            }
            
            // Connect elevator simulation to app
            if (this.elevator) {
                this.app.elevator = this.elevator;
                this.elevator.app = this.app;
                console.log('Connected elevator simulation');
            }
            
            // Connect room simulation to app
            if (this.room) {
                this.app.room = this.room;
                this.room.app = this.app;
                console.log('Connected room simulation');
            }
            
            // Connect supplementary procedures to app
            if (this.supplementary) {
                this.app.supplementary = this.supplementary;
                this.supplementary.app = this.app;
                console.log('Connected supplementary procedures');
            }
            
            // Connect quantum effects to app
            if (this.quantumEffects) {
                this.app.quantumEffects = this.quantumEffects;
                this.quantumEffects.app = this.app;
                console.log('Connected quantum effects');
            }
        },
        
        // Start the application once all modules are connected
        startApplication: function() {
            console.log('Starting Hotel Check-in Procedure application...');
            
            // Show welcome notification
            setTimeout(() => {
                if (this.app && typeof this.app.showNotification === 'function') {
                    this.app.showNotification({
                        type: 'info',
                        title: 'Welcome to Amman Hotel',
                        message: 'You have checked into Room 3021. Your access to the Night Elk Program has been confirmed.'
                    });
                }
            }, 2000);
        },
        
        // Set up event listeners for cross-module interactions
        setupEventListeners: function() {
            // Listen for rule violations to impact anomaly level
            document.addEventListener('rule-violation', (event) => {
                if (this.app) {
                    const { ruleId, severity } = event.detail;
                    console.log(`Rule violation detected: ${ruleId} (Severity: ${severity})`);
                    
                    // Increase anomaly level based on severity
                    this.app.state.gameState.anomalyLevel += severity || 5;
                    
                    // Notify quantum effects system if available
                    if (this.quantumEffects) {
                        this.quantumEffects.handleQuantumEvent({
                            type: 'reality-fluctuation',
                            intensity: severity / 10 || 0.3,
                            duration: 5000,
                            source: 'rule-violation'
                        });
                    }
                }
            });
            
            // Listen for Night Elk progress
            document.addEventListener('night-elk-progress', (event) => {
                if (this.app) {
                    const { progress, clue } = event.detail;
                    console.log(`Night Elk progress: ${progress}% (Clue: ${clue})`);
                    
                    // Update puzzle progress
                    this.app.state.gameState.puzzleProgress += progress;
                    
                    // Add discovered clue if provided
                    if (clue && !this.app.state.player.discoveredSecrets.includes(clue)) {
                        this.app.state.player.discoveredSecrets.push(clue);
                    }
                }
            });
            
            // Listen for room changes to update state
            document.addEventListener('room-change', (event) => {
                if (this.app && this.room) {
                    const { roomNumber } = event.detail;
                    console.log(`Room changed to: ${roomNumber}`);
                    
                    // Update room in both app and room simulation
                    this.app.state.player.room = roomNumber;
                    this.room.state.roomNumber = roomNumber;
                    
                    // Update floor
                    this.app.state.player.floor = parseInt(roomNumber.substring(0, 2));
                }
            });
        }
    };
    
    // Start initialization
    window.hotelApp.init();
    
    // Set up listener to detect when app module is loaded
    document.addEventListener('app-module-loaded', () => {
        window.hotelApp.app = window.app;
        window.hotelApp.moduleLoaded('app');
    });
    
    // Set up listener to detect when narrative module is loaded
    document.addEventListener('narrative-module-loaded', () => {
        window.hotelApp.narrative = window.narrativeEngine;
        window.hotelApp.moduleLoaded('narrative');
    });
    
    // Set up listener to detect when elevator module is loaded
    document.addEventListener('elevator-module-loaded', () => {
        window.hotelApp.elevator = window.elevatorSimulation;
        window.hotelApp.moduleLoaded('elevator');
    });
    
    // Set up listener to detect when room module is loaded
    document.addEventListener('room-module-loaded', () => {
        window.hotelApp.room = window.roomSimulation;
        window.hotelApp.moduleLoaded('room');
    });
    
    // Set up listener to detect when supplementary module is loaded
    document.addEventListener('supplementary-module-loaded', () => {
        window.hotelApp.supplementary = window.supplementaryProcedures;
        window.hotelApp.moduleLoaded('supplementary');
    });
    
    // Set up listener to detect when quantum effects module is loaded
    document.addEventListener('quantum-effects-loaded', () => {
        window.hotelApp.quantumEffects = window.quantumEffects;
        // This is an optional module, not counted in the required modules
    });
});