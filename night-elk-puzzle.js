// Night Elk Puzzle - Special puzzle mechanics for the Night Elk Program
const nightElkPuzzle = {
    state: {
        cluesFound: [],
        puzzleProgress: 0, // 0-100
        solutionAttempts: 0,
        doorCode: '9321',
        hasRevealedTruth: false,
        currentPhase: 'discovery', // discovery, investigation, revelation, completion
    },
    
    // Clue definitions with locations and discovery methods
    clues: {
        'bed-note': {
            location: 'Under the pillow on your bed',
            content: 'A small piece of paper with the number "9321" written on it',
            discoveryMethod: 'Interacting with the bed',
            progress: 10
        },
        'toilet-numbers': {
            location: 'Inside the toilet tank lid in your bathroom',
            content: 'The numbers "9321" etched on the underside with a crude elk drawing',
            discoveryMethod: 'Examining the toilet carefully',
            progress: 15
        },
        'toilet-area-l': {
            location: 'Notepad on desk',
            content: 'Faint impressions on paper saying "Check toilet in Area L" and "9321"',
            discoveryMethod: 'Examining the notepad on the desk',
            progress: 15
        },
        'night-elk-poster': {
            location: 'Public bathroom in Area L on 9th floor',
            content: 'A torn poster with "NIGHT ELK" and "CODE: 9321" visible',
            discoveryMethod: 'Checking the public bathroom on the 9th floor',
            progress: 25
        },
        'front-desk-note': {
            location: 'Left by front desk staff',
            content: 'Note saying "The Night Elk waits in Area L. 9321 is the key."',
            discoveryMethod: 'Looking through peephole at the right time',
            progress: 20
        },
        'elevator-anomaly': {
            location: 'Elevator during malfunction',
            content: 'Message in elevator system: "Elk emerges at floor 8-17 intersection. Password: 9321."',
            discoveryMethod: 'Experiencing elevator anomaly with Leatherman Gambit',
            progress: 20
        },
        'floor8-markings': {
            location: '8th floor corridor',
            content: 'Strange markings spelling out "9321"',
            discoveryMethod: 'Visiting the normally inaccessible 8th floor',
            progress: 15
        },
        'void-floor': {
            location: 'Floor 17 (void floor)',
            content: 'Night Elk symbol etched into elevator control panel',
            discoveryMethod: 'Reaching the non-existent 17th floor during elevator emergency',
            progress: 25
        },
        'night-elk-access': {
            location: 'Bathtub data terminal',
            content: 'Full Night Elk Program files accessed with password 9321',
            discoveryMethod: 'Using password 9321 to access Night Elk files via bathtub hyperlink',
            progress: 30
        },
        'night-elk-truth': {
            location: 'Bathtub data terminal',
            content: 'Revelation that you are Subject YC-3021 in a psychological experiment',
            discoveryMethod: 'Accessing Night Elk files and reading project overview',
            progress: 30,
            completesPhase: 'investigation'
        },
    },
    
    // Initialize the puzzle
    init() {
        console.log('Initializing Night Elk puzzle...');
        
        if (typeof app !== 'undefined') {
            // Connect to app
            app.nightElkPuzzle = this;
            
            // Sync initial state
            this.state.puzzleProgress = app.state.gameState.puzzleProgress || 0;
            this.state.cluesFound = app.state.player.discoveredSecrets || [];
        }
        
        // Set up event listeners for clue discovery
        document.addEventListener('clue-discovered', (event) => {
            this.recordClueDiscovery(event.detail.clueId);
        });
        
        // Check for existing clues
        this.checkExistingClues();
    },
    
    // Check for clues discovered before puzzle initialization
    checkExistingClues() {
        if (typeof app !== 'undefined' && app.state.player.discoveredSecrets) {
            app.state.player.discoveredSecrets.forEach(clueId => {
                if (this.clues[clueId] && !this.state.cluesFound.includes(clueId)) {
                    this.recordClueDiscovery(clueId, false); // false = don't update app state, avoid duplication
                }
            });
        }
    },
    
    // Record the discovery of a clue
    recordClueDiscovery(clueId, updateAppState = true) {
        if (!this.clues[clueId]) return;
        
        console.log(`Night Elk clue discovered: ${clueId}`);
        
        // Add to found clues if not already there
        if (!this.state.cluesFound.includes(clueId)) {
            this.state.cluesFound.push(clueId);
            
            // Update progress
            this.state.puzzleProgress += this.clues[clueId].progress;
            
            // Check for phase completion
            if (this.clues[clueId].completesPhase) {
                this.advancePhase(this.clues[clueId].completesPhase);
            }
            
            // Update app state if requested
            if (updateAppState && typeof app !== 'undefined') {
                // Update discovered secrets
                if (!app.state.player.discoveredSecrets.includes(clueId)) {
                    app.state.player.discoveredSecrets.push(clueId);
                }
                
                // Update puzzle progress
                app.state.gameState.puzzleProgress = this.state.puzzleProgress;
                
                // Show notification about the discovery
                app.showNotification({
                    type: 'info',
                    title: 'Night Elk Clue',
                    message: `You found a clue: ${this.clues[clueId].content}`
                });
            }
            
            // Check for puzzle advancement
            this.checkPuzzleAdvancement();
        }
    },
    
    // Check if puzzle should advance based on progress
    checkPuzzleAdvancement() {
        // Update phase based on progress
        if (this.state.puzzleProgress >= 90 && this.state.currentPhase === 'investigation') {
            this.advancePhase('revelation');
        } else if (this.state.puzzleProgress >= 50 && this.state.currentPhase === 'discovery') {
            this.advancePhase('investigation');
        }
        
        // Check for game progression based on Night Elk progress
        if (typeof app !== 'undefined') {
            if (this.state.puzzleProgress >= 75 && app.state.gameState.gamePhase === 'introduction') {
                // Advance to main story phase
                app.state.gameState.gamePhase = 'night-elk-discovery';
                
                // Trigger special event - front desk disappearance
                setTimeout(() => {
                    app.state.hotel.frontDeskStatus = 'missing';
                    
                    app.showNotification({
                        type: 'warning',
                        title: 'Strange Occurrence',
                        message: 'You notice the front desk staff have mysteriously disappeared.'
                    });
                    
                    if (app.narrative && app.narrative.state) {
                        app.narrative.state.plotFlags.frontDeskDisappeared = true;
                    }
                }, 5000);
            }
            
            if (this.state.puzzleProgress >= 100) {
                this.completePuzzle();
            }
        }
    },
    
    // Advance puzzle phase
    advancePhase(newPhaseOrNextPhase) {
        const phases = ['discovery', 'investigation', 'revelation', 'completion'];
        
        let newPhase;
        if (phases.includes(newPhaseOrNextPhase)) {
            // Direct phase specification
            newPhase = newPhaseOrNextPhase;
        } else {
            // Use as completion marker for current phase, advance to next
            const currentIndex = phases.indexOf(this.state.currentPhase);
            if (currentIndex < phases.length - 1) {
                newPhase = phases[currentIndex + 1];
            } else {
                return; // Already at final phase
            }
        }
        
        console.log(`Night Elk puzzle advancing from ${this.state.currentPhase} to ${newPhase}`);
        this.state.currentPhase = newPhase;
        
        // Trigger phase-specific events
        if (typeof app !== 'undefined') {
            switch(newPhase) {
                case 'investigation':
                    app.showNotification({
                        type: 'info',
                        title: 'Night Elk Progress',
                        message: 'You\'ve found enough clues to start investigating the Night Elk Program more deeply.'
                    });
                    break;
                    
                case 'revelation':
                    app.showNotification({
                        type: 'warning',
                        title: 'Night Elk Revelation',
                        message: 'The truth about the Night Elk Program is becoming clear. Find the final pieces of the puzzle.'
                    });
                    
                    // Increase anomaly level as the truth is revealed
                    app.state.gameState.anomalyLevel += 15;
                    break;
                    
                case 'completion':
                    this.completePuzzle();
                    break;
            }
        }
    },
    
    // Complete the Night Elk puzzle
    completePuzzle() {
        if (this.state.hasRevealedTruth) return; // Already completed
        
        console.log('Night Elk puzzle completed!');
        this.state.hasRevealedTruth = true;
        this.state.currentPhase = 'completion';
        
        // Trigger completion events
        if (typeof app !== 'undefined') {
            // Update game phase
            app.state.gameState.gamePhase = 'hotel-upgrade';
            
            // Show completion notification
            app.showNotification({
                type: 'success',
                title: 'Night Elk Program Completed',
                message: 'You\'ve uncovered the truth about the Night Elk Program and your role as Subject YC-3021.'
            });
            
            // Schedule the Hotel "catching the sea" event
            setTimeout(() => {
                this.triggerHotelTransformation();
            }, 10000);
            
            // Add completion task
            const completionTask = {
                id: 'task-night-elk-complete',
                name: 'Decide how to respond to the Night Elk revelation',
                completed: false
            };
            
            if (!app.state.player.taskList.some(t => t.id === 'task-night-elk-complete')) {
                app.state.player.taskList.push(completionTask);
                app.updateTaskList();
            }
        }
    },
    
    // Trigger the dramatic "hotel catching the sea" transformation
    triggerHotelTransformation() {
        if (typeof app !== 'undefined') {
            app.showNotification({
                type: 'warning',
                title: 'Hotel Transformation',
                message: 'The hotel begins to "catch the sea" - something extraordinary is happening throughout the building.'
            });
            
            // Create transformation modal
            const transformationModal = document.createElement('div');
            transformationModal.className = 'modal show';
            transformationModal.id = 'transformation-modal';
            
            transformationModal.innerHTML = `
                <div class="modal-content transformation-content">
                    <div class="modal-header">
                        <h3>Hotel Transformation</h3>
                        <span class="close-button">&times;</span>
                    </div>
                    <div class="transformation-scene">
                        <div class="scene-text">
                            <p>The hotel begins to "catch the sea" - scorpions, shells, and turtles all come ashore. The corridors become crowded with guests and staff dragging luggage, and several previously restricted floors suddenly open overnight.</p>
                            <p>You feel the building shifting around you, as if reality itself is being rewritten.</p>
                        </div>
                        <div class="transformation-animation">
                            <div class="sea-creature scorpion"></div>
                            <div class="sea-creature shell"></div>
                            <div class="sea-creature turtle"></div>
                            <div class="guest-figure"></div>
                            <div class="guest-figure"></div>
                            <div class="staff-figure"></div>
                        </div>
                    </div>
                    <div class="transformation-actions">
                        <button id="acknowledge-transformation" class="action-button">
                            <i class="fas fa-eye"></i> Witness the Change
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(transformationModal);
            
            // Add specialized CSS
            const style = document.createElement('style');
            style.textContent = `
                .transformation-content {
                    max-width: 800px;
                }
                
                .transformation-scene {
                    padding: 20px;
                    background-color: #f0f0f0;
                    border-radius: var(--border-radius);
                    position: relative;
                    overflow: hidden;
                    min-height: 300px;
                }
                
                .scene-text {
                    position: relative;
                    z-index: 2;
                    text-shadow: 0 0 5px white;
                }
                
                .transformation-animation {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 1;
                }
                
                .sea-creature {
                    position: absolute;
                    opacity: 0;
                    animation: float-in 10s linear forwards;
                }
                
                .scorpion {
                    width: 30px;
                    height: 30px;
                    background-color: #5d4037;
                    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
                    bottom: 20%;
                    left: -30px;
                    animation-delay: 1s;
                }
                
                .shell {
                    width: 40px;
                    height: 25px;
                    background-color: #8d6e63;
                    border-radius: 50% 50% 0 0;
                    bottom: 30%;
                    left: -40px;
                    animation-delay: 3s;
                }
                
                .turtle {
                    width: 50px;
                    height: 30px;
                    background-color: #4caf50;
                    border-radius: 50%;
                    bottom: 50%;
                    left: -50px;
                    animation-delay: 5s;
                }
                
                .guest-figure, .staff-figure {
                    width: 20px;
                    height: 40px;
                    background-color: rgba(0, 0, 0, 0.5);
                    border-radius: 5px 5px 0 0;
                    opacity: 0;
                    animation: walk-across 15s linear forwards;
                }
                
                .guest-figure:nth-of-type(1) {
                    bottom: 20%;
                    left: -20px;
                    animation-delay: 2s;
                }
                
                .guest-figure:nth-of-type(2) {
                    bottom: 30%;
                    left: -20px;
                    animation-delay: 4s;
                }
                
                .staff-figure {
                    bottom: 40%;
                    left: -20px;
                    animation-delay: 6s;
                    background-color: rgba(58, 95, 111, 0.7);
                }
                
                @keyframes float-in {
                    0% { left: -50px; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { left: 100%; opacity: 0; }
                }
                
                @keyframes walk-across {
                    0% { left: -20px; opacity: 0; }
                    10% { opacity: 0.7; }
                    90% { opacity: 0.7; }
                    100% { left: 100%; opacity: 0; }
                }
                
                .transformation-actions {
                    margin-top: 20px;
                    display: flex;
                    justify-content: center;
                }
            `;
            document.head.appendChild(style);
            
            // Set up close button
            transformationModal.querySelector('.close-button').addEventListener('click', () => {
                transformationModal.classList.remove('show');
                setTimeout(() => {
                    transformationModal.remove();
                }, 300);
            });
            
            // Set up acknowledge button
            transformationModal.querySelector('#acknowledge-transformation').addEventListener('click', () => {
                transformationModal.classList.remove('show');
                setTimeout(() => {
                    transformationModal.remove();
                    
                    // After transformation, show Kuang Shengyou announcement
                    this.showKuangAnnouncement();
                }, 300);
            });
            
            // Apply quantum effects to the whole app to signify the transformation
            if (app.quantumEffects) {
                app.quantumEffects.handleQuantumEvent({
                    type: 'reality-fluctuation',
                    intensity: 0.8,
                    duration: 20000
                });
            }
            
            // Update hotel state
            app.state.hotel.floorAccess[8] = true; // 8th floor now accessible
            
            // Add floor 17 (void floor)
            app.state.hotel.floorAccess[17] = true;
            
            // Update narrative state
            if (app.narrative && app.narrative.state) {
                app.narrative.state.plotFlags.hotelTransformed = true;
            }
        }
    },
    
    // Show Kuang Shengyou announcement
    showKuangAnnouncement() {
        if (typeof app !== 'undefined') {
            app.showNotification({
                type: 'info',
                title: 'Announcement',
                message: 'Kuang Shengyou appears on screens throughout the hotel with an important announcement.'
            });
            
            // Create announcement modal
            const announcementModal = document.createElement('div');
            announcementModal.className = 'modal show';
            announcementModal.id = 'kuang-announcement-modal';
            
            announcementModal.innerHTML = `
                <div class="modal-content announcement-content">
                    <div class="modal-header">
                        <h3>Broadcast Announcement</h3>
                        <span class="close-button">&times;</span>
                    </div>
                    <div class="announcement-screen">
                        <div class="kuang-figure"></div>
                        <div class="announcement-text">
                            <p class="announcement-introduction">A message from Kuang Shengyou, Hotel Manager:</p>
                            <div class="announcement-message">
                                <p>"Esteemed guests and valued staff, I come to you with news about our future. The 'Night Elk Project' was born from my most beautiful childhood memories and the imprint of my grandmother's scallion pancakes."</p>
                                <p>"For this reason, we suggest not eating fried dough sticks, as after eating grandmother's scallion pancakes, one cannot eat fried dough sticks, including stinky tofu that destroys the feeling of first love."</p>
                                <p>"It is with great pleasure that I announce the hotel system has been upgraded to version V99.0 with various new functions."</p>
                            </div>
                        </div>
                    </div>
                    <div class="your-reaction">
                        <p>How do you respond to this unusual announcement?</p>
                        <div class="reaction-buttons">
                            <button class="reaction-button" data-reaction="believe">
                                <i class="fas fa-check-circle"></i>
                                <span>Nod in Agreement</span>
                            </button>
                            <button class="reaction-button" data-reaction="skeptical">
                                <i class="fas fa-question-circle"></i>
                                <span>Remain Skeptical</span>
                            </button>
                            <button class="reaction-button" data-reaction="confused">
                                <i class="fas fa-dizzy"></i>
                                <span>Look Confused</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(announcementModal);
            
            // Add specialized CSS
            const style = document.createElement('style');
            style.textContent = `
                .announcement-content {
                    max-width: 800px;
                }
                
                .announcement-screen {
                    background-color: #000;
                    color: #fff;
                    padding: 20px;
                    border-radius: var(--border-radius);
                    position: relative;
                    margin-bottom: 20px;
                    min-height: 200px;
                    display: flex;
                    align-items: center;
                }
                
                .kuang-figure {
                    width: 80px;
                    height: 150px;
                    background-color: rgba(255, 255, 255, 0.1);
                    border-radius: 10px 10px 0 0;
                    margin-right: 20px;
                    position: relative;
                }
                
                .announcement-introduction {
                    color: #aaa;
                    margin-bottom: 10px;
                    font-style: italic;
                }
                
                .announcement-message {
                    line-height: 1.6;
                }
                
                .announcement-message p {
                    margin-bottom: 15px;
                }
                
                .your-reaction {
                    background-color: #f0f0f0;
                    padding: 15px;
                    border-radius: var(--border-radius);
                }
                
                .reaction-buttons {
                    display: flex;
                    gap: 10px;
                    margin-top: 15px;
                    justify-content: center;
                }
                
                .reaction-button {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 5px;
                    padding: 10px 15px;
                    background-color: white;
                    border: 1px solid #ddd;
                    border-radius: var(--border-radius);
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .reaction-button:hover {
                    background-color: #f9f9f9;
                    transform: translateY(-3px);
                }
                
                .reaction-button i {
                    font-size: 1.5rem;
                    color: var(--primary-color);
                }
            `;
            document.head.appendChild(style);
            
            // Set up close button
            announcementModal.querySelector('.close-button').addEventListener('click', () => {
                announcementModal.classList.remove('show');
                setTimeout(() => {
                    announcementModal.remove();
                }, 300);
            });
            
            // Set up reaction buttons
            announcementModal.querySelectorAll('.reaction-button').forEach(button => {
                button.addEventListener('click', () => {
                    const reaction = button.dataset.reaction;
                    
                    // Process reaction
                    if (app.narrative && app.narrative.state) {
                        switch(reaction) {
                            case 'believe':
                                app.narrative.state.characterRelationships.kuangShengyou += 15;
                                app.state.gameState.anomalyLevel -= 5;
                                break;
                                
                            case 'skeptical':
                                app.narrative.state.characterRelationships.kuangShengyou -= 10;
                                app.state.gameState.anomalyLevel += 10;
                                break;
                                
                            case 'confused':
                                app.state.gameState.anomalyLevel += 5;
                                break;
                        }
                    }
                    
                    // Close modal
                    announcementModal.classList.remove('show');
                    setTimeout(() => {
                        announcementModal.remove();
                        
                        // Show follow-up notification
                        app.showNotification({
                            type: 'info',
                            title: 'System Update',
                            message: 'The hotel system has been upgraded to version V99.0 with various new functions.'
                        });
                        
                        // Complete the Night Elk task
                        const nightElkTask = app.state.player.taskList.find(t => t.id === 'task-night-elk-complete');
                        if (nightElkTask) {
                            nightElkTask.completed = true;
                            app.updateTaskList();
                        }
                        
                        // Add new task for checkout
                        const checkoutTask = {
                            id: 'task-checkout',
                            name: 'Prepare to check out of the hotel',
                            completed: false
                        };
                        
                        if (!app.state.player.taskList.some(t => t.id === 'task-checkout')) {
                            app.state.player.taskList.push(checkoutTask);
                            app.updateTaskList();
                        }
                    }, 300);
                });
            });
            
            // Update narrative state
            if (app.narrative && app.narrative.state) {
                app.narrative.state.plotFlags.metKuangShengyou = true;
            }
        }
    },
    
    // Try to solve the Night Elk puzzle with a specific code
    tryDoorCode(code) {
        this.state.solutionAttempts++;
        
        if (code === this.state.doorCode) {
            console.log('Correct Night Elk door code entered!');
            
            if (typeof app !== 'undefined') {
                app.showNotification({
                    type: 'success',
                    title: 'Code Accepted',
                    message: 'The code 9321 appears to be correct! Something is happening...'
                });
                
                // Progress puzzle significantly
                this.state.puzzleProgress += 25;
                app.state.gameState.puzzleProgress = this.state.puzzleProgress;
                
                // Check for puzzle advancement
                this.checkPuzzleAdvancement();
            }
            
            return true;
        } else {
            console.log('Incorrect Night Elk door code entered.');
            
            if (typeof app !== 'undefined') {
                app.showNotification({
                    type: 'error',
                    title: 'Code Rejected',
                    message: 'The code seems to be incorrect. Try looking for more clues.'
                });
            }
            
            return false;
        }
    },
    
    // Get summary of found Night Elk clues
    getCluesSummary() {
        const foundClues = this.state.cluesFound.map(clueId => this.clues[clueId]);
        
        return {
            totalClues: Object.keys(this.clues).length,
            foundCount: foundClues.length,
            clueDetails: foundClues,
            progress: this.state.puzzleProgress,
            phase: this.state.currentPhase,
            isComplete: this.state.hasRevealedTruth
        };
    }
};

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    nightElkPuzzle.init();
});