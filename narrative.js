// Narrative engine for Hotel Check-in Procedure
const narrativeEngine = {
    // Narrative state tracking
    state: {
        phase: 'introduction', // introduction, investigation, revelation, conflict, resolution
        day: 1, // In-game day counter
        timeOfDay: 'morning', // morning, afternoon, evening, night
        characterRelationships: {
            frontDesk: 0, // -100 to 100, relationship with front desk staff
            kuangShengyou: 0, // -100 to 100, relationship with hotel owner
            securityStaff: 0, // -100 to 100, relationship with security personnel
            otherGuests: 0, // -100 to 100, relationship with other hotel guests
        },
        plotFlags: {
            discoveredNightElk: false,
            metKuangShengyou: false,
            foundToiletPoster: false,
            investigatedWaterSchedule: false,
            discoveredHotelUpgrade: false,
            frontDeskDisappeared: false,
            foundRoom3305: false,
            completedNightElkProgram: false
        },
        storyChoices: [],
        discoveredClues: [],
        currentNarrativeThread: 'main', // main, subplot-A, subplot-B, etc.
        anomalyLevel: 0, // Increases as strange events occur, affecting hotel behavior
    },
    
    // Story sections and narrative beats
    storyBeats: {
        introduction: [
            {
                id: 'hotel-checkin',
                title: 'Arrival at Amman Hotel',
                content: 'You check in to the Amman Hotel Balance Beam Branch on a rainy day. The front desk persuades you to accept a free 48-hour stay and grants you access to the mysterious "Night Elk Program" worth ¥1,000,000.',
                requirements: [],
                triggers: ['start-night-elk-program'],
                choices: [
                    { text: 'Accept the offer enthusiastically', effect: { frontDesk: +10 } },
                    { text: 'Accept with suspicion', effect: { frontDesk: -5, anomalyLevel: +5 } },
                    { text: 'Try to learn more details', effect: { plotFlags: { investigativeNature: true } } }
                ]
            },
            {
                id: 'room-discovery',
                title: 'Room 3021',
                content: 'You arrive at your room (3021), located at the end of the corridor in the NA area. The window is small but offers a fresh view. You notice strange details about the glass partition on the door.',
                requirements: ['hotel-checkin'],
                triggers: ['enable-exploration'],
                choices: [
                    { text: 'Inspect the window view', effect: { discoveredClues: ['meadow-view'] } },
                    { text: 'Examine the glass partition', effect: { discoveredClues: ['strange-partition'] } },
                    { text: 'Relax in the bathtub', effect: { plotFlags: { bathRelaxation: true } } }
                ]
            }
        ],
        
        investigation: [
            {
                id: 'water-schedule-mystery',
                title: 'Strange Water Patterns',
                content: 'You notice that different floors have unusual water schedules. The 9th floor has no hot water, the 10th floor experiences hot and cold exchange, the 14th floor only has water after 10pm, and the 1st floor has no water except on weekends.',
                requirements: ['room-discovery', 'plotFlags.reviewedRules'],
                triggers: ['water-mystery-active'],
                choices: [
                    { text: 'Document the patterns', effect: { plotFlags: { investigatedWaterSchedule: true } } },
                    { text: 'Ask front desk about it', effect: { frontDesk: -10, anomalyLevel: +10 } },
                    { text: 'Ignore it as hotel eccentricity', effect: { plotFlags: { missedCriticalClue: true } } }
                ]
            },
            {
                id: 'toilet-area-l',
                title: 'Public Toilet in Area L',
                content: 'You visit the public toilet in Area L on the 9th floor. Behind one of the stall doors, you find a poster about the "Night Elk Program" with the number 9321 scrawled in the corner. Most of it has been torn off.',
                requirements: ['water-schedule-mystery', 'plotFlags.exploredHotel'],
                triggers: ['night-elk-clue-found'],
                choices: [
                    { text: 'Take a photo of the poster', effect: { discoveredClues: ['night-elk-poster'] } },
                    { text: 'Try to piece together the torn parts', effect: { plotFlags: { foundToiletPoster: true } } },
                    { text: 'Look for more clues in Area L', effect: { plotFlags: { thoroughExplorer: true } } }
                ]
            }
        ],
        
        revelation: [
            {
                id: 'front-desk-disappearance',
                title: 'Missing Front Desk',
                content: 'When you return to ask the front desk about the Night Elk Program, you discover they\'re not there. They\'ve been absent for three days. This seems suspicious given their earlier eagerness to sign you up.',
                requirements: ['toilet-area-l', 'day-3'],
                triggers: ['front-desk-missing'],
                choices: [
                    { text: 'Search the front desk area', effect: { plotFlags: { searchedFrontDesk: true } } },
                    { text: 'Ask other staff about it', effect: { securityStaff: -15 } },
                    { text: 'Leave a note for them', effect: { frontDesk: +5 } }
                ]
            },
            {
                id: 'hotel-catching-sea',
                title: 'The Hotel Transforms',
                content: 'The hotel begins to "catch the sea" - scorpions, shells, and turtles all come ashore. The corridors become crowded with guests and staff dragging luggage, and several previously restricted floors suddenly open overnight.',
                requirements: ['front-desk-disappearance', 'anomalyLevel-30'],
                triggers: ['hotel-transformation-begins'],
                choices: [
                    { text: 'Join the commotion', effect: { otherGuests: +20 } },
                    { text: 'Hide in your room', effect: { plotFlags: { isolationStrategy: true } } },
                    { text: 'Document the strange occurrences', effect: { discoveredClues: ['transformation-evidence'] } }
                ]
            }
        ],
        
        conflict: [
            {
                id: 'kuang-shengyou-meeting',
                title: 'Encounter with Kuang Shengyou',
                content: 'You finally encounter Kuang Shengyou, the person in charge. He appears on the big screen at the corner of the southeast staircase on the second floor, acknowledging the "Night Elk Project" and explaining it originated from his childhood memories.',
                requirements: ['hotel-catching-sea'],
                triggers: ['kuang-shengyou-revealed'],
                choices: [
                    { text: 'Try to speak with him directly', effect: { kuangShengyou: +15 } },
                    { text: 'Record his message', effect: { discoveredClues: ['kuang-confession'] } },
                    { text: 'Look for inconsistencies in his story', effect: { plotFlags: { skepticalOfKuang: true } } }
                ]
            },
            {
                id: 'system-restoration',
                title: 'System Restored',
                content: 'The hotel system has been restored and upgraded to version V99.0. Everything seems both familiar and completely changed. New faces become "~deers" on General Kuang\'s runway.',
                requirements: ['kuang-shengyou-meeting'],
                triggers: ['system-upgraded'],
                choices: [
                    { text: 'Investigate the new system', effect: { plotFlags: { investigatedNewSystem: true } } },
                    { text: 'Try to access restricted areas', effect: { securityStaff: -20, anomalyLevel: +15 } },
                    { text: 'Prepare to check out', effect: { plotFlags: { readyToLeave: true } } }
                ]
            }
        ],
        
        resolution: [
            {
                id: 'final-meetings',
                title: 'Final Encounters',
                content: 'During the period of May 1-10, you have three meetings with the front desk. Each lasts no more than an hour. You\'ve changed rooms twice and encountered familiar faces: Laobang, Kimsi, and Kahn.',
                requirements: ['system-restoration', 'plotFlags.readyToLeave'],
                triggers: ['narrative-concluding'],
                choices: [
                    { text: 'Confront front desk about Night Elk', effect: { frontDesk: -25, plotFlags: { confrontationEnding: true } } },
                    { text: 'Act along with their charade', effect: { frontDesk: +10, plotFlags: { complicityEnding: true } } },
                    { text: 'Try to uncover more truth', effect: { plotFlags: { truthSeekerEnding: true } } }
                ]
            },
            {
                id: 'leaving-letter',
                title: 'The Final Letter',
                content: 'On May 15, you stuff a letter through the crack of Kuang Shengyou\'s office door and wait for 30 minutes before returning to your room. Two days later, you check out and leave the hotel.',
                requirements: ['final-meetings'],
                triggers: ['story-concluded'],
                choices: [
                    { text: 'Reveal what you know in the letter', effect: { kuangShengyou: -30, plotFlags: { exposureEnding: true } } },
                    { text: 'Thank him for the experience', effect: { kuangShengyou: +20, plotFlags: { gratitudeEnding: true } } },
                    { text: 'Leave a cryptic message', effect: { plotFlags: { mysteriousEnding: true } } }
                ]
            },
            {
                id: 'epilogue',
                title: 'Return to Normal Life',
                content: 'You return to your original life and wait for your experience to ferment. Your perfume needs time to adapt to your previous experiences. On June 15, after submitting a piece of code, you write a resignation report and move to a remote southern city.',
                requirements: ['leaving-letter'],
                triggers: ['game-complete'],
                choices: [
                    { text: 'Start a new life', effect: { plotFlags: { newBeginningEnding: true } } },
                    { text: 'Continue investigating from afar', effect: { plotFlags: { ongoingMysteryEnding: true } } },
                    { text: 'Try to forget the whole experience', effect: { plotFlags: { suppressionEnding: true } } }
                ]
            }
        ]
    },
    
    // Special narrative threads that can intersect with main story
    narrativeThreads: {
        'perfume-designer': [
            {
                id: 'skill-verification',
                title: 'Perfume Designer Verification',
                content: 'The hotel system requires verification of your perfume design skills. This might be related to Article 18, Article 202 of the revised version of the afternoon supplementary clause.',
                requirements: ['plotFlags.registeredSkills'],
                triggers: ['skill-check-initiated'],
                choices: [
                    { text: 'Provide authentic portfolio', effect: { plotFlags: { skillVerified: true } } },
                    { text: 'Fake credentials', effect: { plotFlags: { skillFalsified: true } } },
                    { text: 'Refuse verification', effect: { plotFlags: { skillRejected: true } } }
                ]
            },
            {
                id: 'blacklist-warning',
                title: 'Blacklist Threat',
                content: 'The system warns that if your skills as a perfume designer are proven false, you will be blacklisted and displayed on the C position of the large screen.',
                requirements: ['skill-verification'],
                triggers: ['blacklist-warning-given'],
                choices: [
                    { text: 'Withdraw skill claim', effect: { plotFlags: { skillWithdrawn: true } } },
                    { text: 'Double down on claims', effect: { anomalyLevel: +15 } },
                    { text: 'Create a genuine perfume sample', effect: { plotFlags: { createdEvidence: true } } }
                ]
            }
        ],
        
        'bathtub-incidents': [
            {
                id: 'yellow-duck',
                title: 'The Little Yellow Duck',
                content: 'You fill your bathtub with water and place a "Little Yellow Duck" in it. This seemingly innocuous action triggers multiple system clauses and marks a violation in your record.',
                requirements: ['plotFlags.bathRelaxation'],
                triggers: ['rule-violation-15-18-202'],
                choices: [
                    { text: 'Remove the duck immediately', effect: { plotFlags: { duckRemoved: true } } },
                    { text: 'Add more items to the bath', effect: { anomalyLevel: +10, plotFlags: { bathExperiment: true } } },
                    { text: 'Report system error', effect: { securityStaff: -10 } }
                ]
            }
        ],
        
        'night-elk-mystery': [
            {
                id: 'million-reward',
                title: 'The Million Yuan Question',
                content: 'The Night Elk Program worth ¥1,000,000 remains mysterious. Does it actually exist, or is it just a way to keep you at the hotel? The clues lead in contradictory directions.',
                requirements: ['toilet-area-l', 'plotFlags.investigatedWaterSchedule'],
                triggers: ['night-elk-skepticism'],
                choices: [
                    { text: 'Believe it exists', effect: { plotFlags: { trueBeliever: true } } },
                    { text: 'Conclude it\'s a hoax', effect: { plotFlags: { rejectedProgram: true } } },
                    { text: 'Remain ambivalent', effect: { plotFlags: { pragmaticApproach: true } } }
                ]
            },
            {
                id: 'poster-discovery',
                title: 'Public Notice',
                content: 'In a public toilet, you find a poster for the "Night Elk Plan" that appears to have been publicly deployed. This contradicts the secretive nature of the program as presented to you.',
                requirements: ['million-reward'],
                triggers: ['plan-publicly-known'],
                choices: [
                    { text: 'Confront front desk with this evidence', effect: { frontDesk: -20 } },
                    { text: 'Look for other guests in the program', effect: { otherGuests: +15 } },
                    { text: 'Keep the discovery to yourself', effect: { plotFlags: { secretHoarder: true } } }
                ]
            }
        ]
    },
    
    // Special recurring anomalies that increase the strange atmosphere
    anomalies: [
        {
            id: 'floor-8-sounds',
            title: 'Sounds from the 8th Floor',
            content: 'Despite being inaccessible, you occasionally hear strange sounds coming from the 8th floor - music, conversations, and inexplicable mechanical noises.',
            minAnomalyLevel: 10,
            frequency: 'rare'
        },
        {
            id: 'rule-contradictions',
            title: 'Contradicting Rules',
            content: 'You notice that some hotel rules directly contradict others, and staff seem to selectively enforce them based on unclear criteria.',
            minAnomalyLevel: 15,
            frequency: 'common'
        },
        {
            id: 'vanishing-guests',
            title: 'Disappearing Guests',
            content: 'Guests you interact with sometimes disappear without checking out, and staff deny they were ever registered.',
            minAnomalyLevel: 25,
            frequency: 'uncommon'
        },
        {
            id: 'room-numbering',
            title: 'Shifting Room Numbers',
            content: 'Room numbers occasionally change overnight, with some guests insisting their room was always that number.',
            minAnomalyLevel: 30,
            frequency: 'rare'
        },
        {
            id: 'time-loops',
            title: 'Time Inconsistencies',
            content: 'Sometimes events seem to repeat themselves with slight variations, and your watch occasionally runs backward for brief periods.',
            minAnomalyLevel: 40,
            frequency: 'very-rare'
        }
    ],
    
    // Methods to advance and manage narrative
    advanceDay() {
        this.state.day++;
        this.checkDayBasedEvents();
        
        // Add to app's state
        if (typeof app !== 'undefined') {
            app.state.gameState.daysPassed = this.state.day;
            
            app.showNotification({
                type: 'info',
                title: 'A New Day',
                message: `Day ${this.state.day} at Amman Hotel has begun.`
            });
        }
    },
    
    checkDayBasedEvents() {
        // Trigger events based on day count
        switch (this.state.day) {
            case 2:
                this.triggerEvent('front-desk-suspicious');
                break;
                
            case 3:
                this.triggerEvent('front-desk-disappearance');
                this.state.plotFlags.frontDeskDisappeared = true;
                break;
                
            case 5:
                this.triggerEvent('hotel-changes');
                break;
                
            case 7:
                this.triggerEvent('kuang-announcement');
                this.state.plotFlags.metKuangShengyou = true;
                break;
                
            case 10:
                // Player should be preparing to leave by this point
                if (!this.state.plotFlags.readyToLeave) {
                    this.triggerEvent('departure-reminder');
                }
                break;
        }
    },
    
    triggerEvent(eventId) {
        // Implement event based on ID
        if (typeof app !== 'undefined') {
            switch (eventId) {
                case 'front-desk-suspicious':
                    app.showNotification({
                        type: 'warning',
                        title: 'Front Desk Behavior',
                        message: 'The front desk staff seem to be watching you with unusual interest.'
                    });
                    
                    // Add a pending event
                    const suspiciousTime = new Date(app.state.hotel.currentTime.getTime() + (2 * 60 * 60 * 1000)); // 2 hours later
                    app.state.gameState.pendingEvents.push({
                        type: 'front-desk-watching',
                        time: suspiciousTime.getTime()
                    });
                    break;
                    
                case 'front-desk-disappearance':
                    app.showNotification({
                        type: 'warning',
                        title: 'Front Desk Missing',
                        message: 'The front desk staff have disappeared. No one seems to know where they went.'
                    });
                    app.state.hotel.frontDeskStatus = 'missing';
                    break;
                    
                case 'hotel-changes':
                    app.showNotification({
                        type: 'info',
                        title: 'Hotel Atmosphere',
                        message: 'There\'s a tangible change in the hotel\'s atmosphere. Staff are behaving differently, and new areas seem to be opening.'
                    });
                    
                    // Unlock previously inaccessible area
                    const randomArea = Math.random() > 0.5 ? 'M' : 'R';
                    app.state.hotel.areas[randomArea].access = true;
                    
                    setTimeout(() => {
                        app.showNotification({
                            type: 'info',
                            title: 'New Access',
                            message: `Area ${randomArea} seems to be accessible now. You should investigate.`
                        });
                    }, 5000);
                    break;
                    
                case 'kuang-announcement':
                    app.showNotification({
                        type: 'info',
                        title: 'Announcement from Mr. Kuang',
                        message: 'Kuang Shengyou has appeared on screens throughout the hotel with an important announcement.'
                    });
                    
                    // Trigger modal or special event for Kuang's announcement
                    setTimeout(() => {
                        this.showKuangAnnouncement();
                    }, 3000);
                    break;
                    
                case 'departure-reminder':
                    app.showNotification({
                        type: 'warning',
                        title: 'Time to Leave',
                        message: 'You feel a growing sense that you should prepare to leave the hotel soon.'
                    });
                    
                    // Add a new task
                    const newTask = {
                        id: 'task-leave',
                        name: 'Prepare to check out of the hotel',
                        completed: false
                    };
                    
                    if (!app.state.player.taskList.some(t => t.id === 'task-leave')) {
                        app.state.player.taskList.push(newTask);
                        app.updateTaskList();
                    }
                    break;
            }
        }
    },
    
    showKuangAnnouncement() {
        // Create and display a modal for Kuang's announcement
        const modalHTML = `
            <div class="modal-content kuang-announcement">
                <div class="modal-header">
                    <h3>Broadcast Announcement</h3>
                    <span class="close-button">&times;</span>
                </div>
                <div class="announcement-content">
                    <div class="kuang-video">
                        <div class="video-placeholder">
                            <i class="fas fa-tv"></i>
                        </div>
                    </div>
                    <div class="announcement-text">
                        <p>Kuang Shengyou appears on the screen, addressing all hotel occupants:</p>
                        <p class="kuang-speech">"Esteemed guests and valued staff, I come to you with news about our future. The 'Night Elk Project' was born from my most beautiful childhood memories and the imprint of my grandmother's scallion pancakes."</p>
                        <p class="kuang-speech">"For this reason, we suggest not eating fried dough sticks, as after eating grandmother's scallion pancakes, one cannot eat fried dough sticks, including stinky tofu that destroys the feeling of first love."</p>
                        <p>The announcement continues with increasingly bizarre statements, but everyone in view of the screens nods in apparent understanding.</p>
                    </div>
                </div>
                <div class="announcement-reactions">
                    <button class="reaction-button" data-reaction="believe">Nod in Agreement</button>
                    <button class="reaction-button" data-reaction="skeptical">Remain Skeptical</button>
                    <button class="reaction-button" data-reaction="confused">Look Confused</button>
                </div>
            </div>
        `;
        
        // Create modal element
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.id = 'kuang-announcement-modal';
        modal.innerHTML = modalHTML;
        
        // Add to body
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector('.close-button').addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        });
        
        // Handle reaction buttons
        modal.querySelectorAll('.reaction-button').forEach(button => {
            button.addEventListener('click', () => {
                const reaction = button.dataset.reaction;
                
                switch (reaction) {
                    case 'believe':
                        this.state.characterRelationships.kuangShengyou += 15;
                        this.state.anomalyLevel -= 5;
                        break;
                        
                    case 'skeptical':
                        this.state.characterRelationships.kuangShengyou -= 10;
                        this.state.anomalyLevel += 10;
                        break;
                        
                    case 'confused':
                        this.state.anomalyLevel += 5;
                        break;
                }
                
                // Close modal
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.remove();
                    
                    // Show follow-up notification
                    if (typeof app !== 'undefined') {
                        app.showNotification({
                            type: 'info',
                            title: 'System Update',
                            message: 'The hotel system has been upgraded to version V99.0 with various new functions.'
                        });
                    }
                }, 300);
            });
        });
    },
    
    checkForAnomalies() {
        // Check if an anomaly should occur based on current anomaly level
        if (Math.random() * 100 < this.state.anomalyLevel) {
            // Filter anomalies by minimum level requirement
            const eligibleAnomalies = this.anomalies.filter(a => a.minAnomalyLevel <= this.state.anomalyLevel);
            
            if (eligibleAnomalies.length > 0) {
                // Further filter by frequency
                let frequencyWeighted = [];
                
                eligibleAnomalies.forEach(anomaly => {
                    let occurrences = 1;
                    switch (anomaly.frequency) {
                        case 'very-rare': occurrences = 1; break;
                        case 'rare': occurrences = 2; break;
                        case 'uncommon': occurrences = 4; break;
                        case 'common': occurrences = 8; break;
                    }
                    
                    for (let i = 0; i < occurrences; i++) {
                        frequencyWeighted.push(anomaly);
                    }
                });
                
                // Select random anomaly from weighted list
                const selectedAnomaly = frequencyWeighted[Math.floor(Math.random() * frequencyWeighted.length)];
                
                // Trigger the anomaly
                this.triggerAnomaly(selectedAnomaly);
            }
        }
    },
    
    triggerAnomaly(anomaly) {
        if (typeof app !== 'undefined') {
            app.showNotification({
                type: 'warning',
                title: anomaly.title,
                message: anomaly.content
            });
            
            // Add to discovered anomalies
            if (!this.state.discoveredAnomalies) {
                this.state.discoveredAnomalies = [];
            }
            
            if (!this.state.discoveredAnomalies.includes(anomaly.id)) {
                this.state.discoveredAnomalies.push(anomaly.id);
                
                // Increase anomaly level slightly when new anomaly is discovered
                this.state.anomalyLevel += 3;
            }
            
            // Update app's anomaly level
            app.state.gameState.anomalyLevel = this.state.anomalyLevel;
        }
    },
    
    // Initialize and hook up to main app
    init() {
        // Set up interval to check for anomalies
        setInterval(() => {
            this.checkForAnomalies();
        }, 120000); // Check every 2 minutes
        
        // Register narrative engine with main app
        if (typeof app !== 'undefined') {
            app.narrative = this;
            
            // Synchronize states
            app.state.gameState.anomalyLevel = this.state.anomalyLevel;
            app.state.gameState.gamePhase = this.state.phase;
        }
    }
};

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    narrativeEngine.init();
});