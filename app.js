// App core functionality
const app = {
    state: {
        currentView: 'hotel-reservation',
        player: {
            name: 'Yucheng',
            avatar: 'water-grass',
            level: 1,
            traits: {
                agility: 30,
                perception: 40,
                resilience: 20
            },
            room: '3021',
            floor: 3,
            status: 'checked-in',
            specialSkill: 'perfume-designer',
            taskList: [
                { id: 'task-1', name: 'Check in to hotel', completed: true },
                { id: 'task-2', name: 'Review hotel rules', completed: false },
                { id: 'task-3', name: 'Find your room (3021)', completed: false }
            ],
            unlockedRules: ['R001', 'R003', 'R005', 'R006', 'A001', 'A005', 'A006', 'E001'],
            discoveredSecrets: [],
            violations: [],
            nightElkStatus: 'active',
            nightElkProgress: 0
        },
        hotel: {
            currentTime: new Date('2023-03-21T10:30:00'),
            currentDay: 'Tuesday',
            maintenancePeriod: true,
            elevatorOneStatus: 'operational',
            elevatorTwoStatus: 'operational',
            elevatorThreeStatus: 'operational',
            floorAccess: {
                1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true,
                8: false, // 8th floor is inaccessible
                9: true, 10: true, 11: true, 12: true, 13: true, 14: true, 15: true
            },
            areas: {
                'A': { floor: 3, access: true, size: 120 },
                'B': { floor: 5, access: true, size: 200 },
                'M': { floor: 8, access: false, size: 100 },
                'D': { floor: 15, access: true, size: 220 },
                'L': { floor: 9, access: true, size: 95 },
                'MOD': { floor: 7, access: true, size: 155 },
                'R': { floor: 12, access: true, size: 110 }
            },
            waterSchedule: {
                9: { hotWater: false, note: 'No hot water' },
                10: { hotWater: true, note: 'Hot and cold exchange' },
                14: { hotWater: true, note: 'Water supply after 10:00 pm' },
                1: { hotWater: false, note: 'No water supply (except Saturday and Sunday)' }
            },
            frontDeskStatus: 'present'
        },
        gameState: {
            loadingProgress: 0,
            daysPassed: 0,
            timeScale: 1, // 1 real second = 1 game minute
            notifications: [],
            activeProcedures: ['R001', 'R003', 'R005', 'R006', 'A001', 'A005', 'A006', 'E001'],
            currentFloor: 1,
            puzzleProgress: 0,
            pendingEvents: [],
            randomEvents: [],
            cheatCodes: [],
            gamePhase: 'introduction', // introduction, main-story, night-elk-discovery, hotel-upgrade, conclusion
            anomalyLevel: 0, // Tracks how many "strange" things are happening
            timeLoops: 0, // For narrative time loops and recursion
        }
    },
    
    init() {
        this.setupEventListeners();
        this.simulateLoading();
        this.updateTaskList();
        this.updateTimeDisplay();
        this.startTimeLoop();
    },
    
    setupEventListeners() {
        // Navigation menu
        document.querySelectorAll('.main-nav li:not(.locked)').forEach(navItem => {
            navItem.addEventListener('click', () => {
                this.changeView(navItem.dataset.view);
            });
        });
        
        // Action buttons
        document.getElementById('reveal-more-rules').addEventListener('click', () => {
            this.revealMoreRules();
        });
        
        document.getElementById('open-faucet').addEventListener('click', () => {
            this.showOrangeBubbleModal();
        });
        
        document.getElementById('register-skills').addEventListener('click', () => {
            this.registerSkills();
        });
        
        document.getElementById('apply-public-room').addEventListener('click', () => {
            this.applyForPublicRoom();
        });
        
        // Modal close buttons
        document.querySelectorAll('.close-button').forEach(button => {
            button.addEventListener('click', () => {
                const modal = button.closest('.modal');
                modal.classList.remove('show');
            });
        });
        
        // Elevator modal
        document.querySelectorAll('.floor-button:not(.disabled)').forEach(button => {
            button.addEventListener('click', () => {
                const floor = button.dataset.floor;
                this.goToFloor(floor);
            });
        });
        
        // Orange bubble modal
        document.getElementById('cancel-assistance').addEventListener('click', () => {
            document.getElementById('orange-bubble-modal').classList.remove('show');
        });
        
        // Security personnel selection
        document.querySelectorAll('.security-option').forEach(option => {
            option.addEventListener('click', () => {
                const security = option.dataset.security;
                this.selectSecurityPersonnel(security);
            });
        });
    },
    
    simulateLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        const loadingProgress = document.querySelector('.loading-progress');
        const loadingStatus = document.querySelector('.loading-status');
        const app = document.getElementById('app');
        
        const stages = [
            'Connecting to Balance Beam Branch...',
            'Downloading hotel procedures...',
            'Analyzing rule variations...',
            'Authorizing guest access...',
            'Preparing Night Elk Program...',
            'Establishing security protocols...',
            'Syncing with System Assistant...',
            'Finalizing check-in parameters...'
        ];
        
        let currentStage = 0;
        let progress = 0;
        
        const loadingInterval = setInterval(() => {
            progress += Math.random() * 3;
            
            if (progress >= 100) {
                progress = 100;
                clearInterval(loadingInterval);
                
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    app.classList.remove('hidden');
                    document.body.classList.remove('loading');
                    
                    // Show first notification after loading
                    this.showNotification({
                        type: 'info',
                        title: 'Welcome to Amman Hotel',
                        message: 'You have been granted access to the Night Elk Program worth ¥1,000,000.'
                    });
                }, 1000);
            }
            
            if (progress > (currentStage + 1) * (100 / stages.length) && currentStage < stages.length - 1) {
                currentStage++;
                loadingStatus.textContent = stages[currentStage];
            }
            
            loadingProgress.style.width = `${progress}%`;
            this.state.gameState.loadingProgress = progress;
        }, 200);
    },
    
    changeView(view) {
        // Hide all content sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Deactivate all nav items
        document.querySelectorAll('.main-nav li').forEach(navItem => {
            navItem.classList.remove('active');
        });
        
        // Show selected content section
        document.getElementById(view).classList.add('active');
        
        // Activate corresponding nav item
        document.querySelector(`.main-nav li[data-view="${view}"]`).classList.add('active');
        
        this.state.currentView = view;
        
        // Track task completion
        if (view === 'hotel-reservation' && !this.state.player.taskList[1].completed) {
            this.completeTask('task-2');
        }
    },
    
    updateTaskList() {
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = '';
        
        this.state.player.taskList.forEach(task => {
            const li = document.createElement('li');
            li.className = 'task';
            
            li.innerHTML = `
                <i class="fas ${task.completed ? 'fa-check-circle task-complete' : 'fa-circle task-incomplete'}"></i>
                <span class="task-name">${task.name}</span>
            `;
            
            taskList.appendChild(li);
        });
    },
    
    completeTask(taskId) {
        const task = this.state.player.taskList.find(t => t.id === taskId);
        if (task) {
            task.completed = true;
            this.updateTaskList();
            
            this.showNotification({
                type: 'success',
                title: 'Task Completed',
                message: `You have completed: ${task.name}`
            });
        }
    },
    
    updateTimeDisplay() {
        const timeDisplay = document.getElementById('current-time');
        const now = this.state.hotel.currentTime;
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        
        timeDisplay.textContent = `${hours}:${minutes}`;
    },
    
    startTimeLoop() {
        // Update game time every second
        setInterval(() => {
            const currentTime = this.state.hotel.currentTime;
            const newTime = new Date(currentTime.getTime() + (60000 * this.state.gameState.timeScale));
            this.state.hotel.currentTime = newTime;
            
            this.updateTimeDisplay();
            this.checkTimeBasedEvents();
        }, 1000);
    },
    
    checkTimeBasedEvents() {
        const currentTime = this.state.hotel.currentTime;
        const hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();
        
        // Check for breakfast time
        if (hours === 7 && minutes === 0) {
            this.showNotification({
                type: 'info',
                title: 'Breakfast Available',
                message: 'Breakfast is now being served until 8:30 AM.'
            });
        }
        
        // Check for cleaning time
        if (hours === 15 && minutes === 0) {
            this.showNotification({
                type: 'info',
                title: 'Cleaning Service',
                message: 'Cleaning staff are now available for garbage disposal until 16:00.'
            });
        }
        
        // Check for night time restrictions
        if (hours === 23 && minutes === 30) {
            this.showNotification({
                type: 'warning',
                title: 'Night Restrictions',
                message: 'The security door is now locked. You must swipe your card to use the elevator.'
            });
        }
        
        // Process any pending events
        this.processPendingEvents();
    },
    
    processPendingEvents() {
        // Process any events that should occur at the current time
        const currentTime = this.state.hotel.currentTime.getTime();
        const pendingEvents = this.state.gameState.pendingEvents;
        
        const eventsToProcess = pendingEvents.filter(event => event.time <= currentTime);
        
        eventsToProcess.forEach(event => {
            // Process the event
            switch (event.type) {
                case 'front-desk-disappearance':
                    this.state.hotel.frontDeskStatus = 'missing';
                    this.showNotification({
                        type: 'warning',
                        title: 'Front Desk Missing',
                        message: 'The front desk staff appears to have disappeared.'
                    });
                    break;
                
                case 'maintenance-activity':
                    this.showNotification({
                        type: 'info',
                        title: 'Maintenance Activity',
                        message: `Maintenance personnel are active in Area ${event.area}.`
                    });
                    break;
                
                case 'water-schedule-change':
                    const floor = event.floor;
                    this.showNotification({
                        type: 'warning',
                        title: 'Water Schedule Change',
                        message: `Water availability on floor ${floor} has changed. Check procedures for details.`
                    });
                    break;
                
                case 'night-elk-clue':
                    this.showNotification({
                        type: 'info',
                        title: 'Night Elk Clue',
                        message: 'You notice something unusual that might be related to the Night Elk Program.'
                    });
                    break;
                
                case 'rule-violation':
                    this.recordViolation(event.rule);
                    break;
            }
            
            // Remove processed event
            const index = pendingEvents.indexOf(event);
            if (index > -1) {
                pendingEvents.splice(index, 1);
            }
        });
    },
    
    recordViolation(rule) {
        this.state.player.violations.push({
            rule,
            time: this.state.hotel.currentTime.getTime(),
            handled: false
        });
        
        this.showNotification({
            type: 'error',
            title: 'Rule Violation',
            message: `You have violated rule #${rule}. This may affect your hotel privileges.`
        });
    },
    
    showNotification(notification) {
        const notificationArea = document.getElementById('notification-area');
        const id = Date.now();
        
        const notificationElement = document.createElement('div');
        notificationElement.className = `notification ${notification.type}`;
        notificationElement.dataset.id = id;
        
        let iconClass = 'fa-info-circle';
        switch (notification.type) {
            case 'success': iconClass = 'fa-check-circle'; break;
            case 'warning': iconClass = 'fa-exclamation-triangle'; break;
            case 'error': iconClass = 'fa-times-circle'; break;
        }
        
        notificationElement.innerHTML = `
            <div class="notification-icon">
                <i class="fas ${iconClass}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${notification.title}</div>
                <div class="notification-text">${notification.message}</div>
            </div>
        `;
        
        notificationArea.appendChild(notificationElement);
        
        // Store notification in state
        this.state.gameState.notifications.push({
            id,
            ...notification,
            time: this.state.hotel.currentTime.getTime(),
            read: false
        });
        
        // Update alert count
        this.updateAlertCount();
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notificationElement.classList.add('removing');
            
            setTimeout(() => {
                if (notificationElement.parentNode) {
                    notificationElement.parentNode.removeChild(notificationElement);
                }
            }, 300);
        }, 5000);
    },
    
    updateAlertCount() {
        const alertCount = document.getElementById('alert-count');
        const unreadCount = this.state.gameState.notifications.filter(n => !n.read).length;
        
        alertCount.textContent = unreadCount;
        alertCount.style.display = unreadCount > 0 ? 'flex' : 'none';
    },
    
    revealMoreRules() {
        // Simulate discovering new rules
        const newRules = ['R009', 'R010', 'R011', 'R012', 'R014'];
        const discoveredRule = newRules[Math.floor(Math.random() * newRules.length)];
        
        if (!this.state.player.unlockedRules.includes(discoveredRule)) {
            this.state.player.unlockedRules.push(discoveredRule);
            
            // Add the newly discovered rule to the UI
            const procedureList = document.querySelector('#hotel-reservation .procedure-list');
            
            const newRule = document.createElement('div');
            newRule.className = 'procedure-item';
            newRule.dataset.id = discoveredRule;
            
            let ruleTitle, ruleContent;
            
            switch (discoveredRule) {
                case 'R009':
                    ruleTitle = 'Floor Water Schedule - 9th Floor';
                    ruleContent = 'The 9th floor has no hot water available at any time.';
                    break;
                case 'R010':
                    ruleTitle = 'Floor Water Schedule - 10th Floor';
                    ruleContent = 'The 10th floor experiences hot and cold water exchange periodically.';
                    break;
                case 'R011':
                    ruleTitle = 'Floor Water Schedule - 14th Floor';
                    ruleContent = 'The 14th floor has water supply only after 10:00 pm.';
                    break;
                case 'R012':
                    ruleTitle = 'Floor Water Schedule - 1st Floor';
                    ruleContent = 'The 1st floor has no water supply except on Saturday and Sunday.';
                    break;
                case 'R014':
                    ruleTitle = 'Long-term Rental Policy';
                    ruleContent = 'The hotel reserves 10% of the rooms for long-term rental, which are allocated to each floor, and the system is regulated and supervised. The lease period shall not exceed 1 year, or re-signed. Long-term rental rooms give priority to the southwest area of the floor.';
                    break;
            }
            
            newRule.innerHTML = `
                <div class="procedure-header">
                    <span class="procedure-code">#${discoveredRule}</span>
                    <h3>${ruleTitle}</h3>
                </div>
                <div class="procedure-content">
                    <p>${ruleContent}</p>
                </div>
            `;
            
            procedureList.appendChild(newRule);
            
            this.showNotification({
                type: 'success',
                title: 'New Procedure Discovered',
                message: `You have discovered rule #${discoveredRule}: ${ruleTitle}`
            });
            
            // Check if this rule is relevant to the Night Elk program
            if (['R009', 'R010', 'R011'].includes(discoveredRule)) {
                this.state.gameState.puzzleProgress += 10;
                
                setTimeout(() => {
                    this.showNotification({
                        type: 'info',
                        title: 'Night Elk Clue',
                        message: 'The water schedules seem important. They might be connected to the Night Elk Program.'
                    });
                }, 3000);
            }
        } else {
            this.showNotification({
                type: 'info',
                title: 'No New Rules',
                message: 'You couldn\'t find any new rules at this time. Try exploring the hotel.'
            });
        }
    },
    
    showOrangeBubbleModal() {
        const modal = document.getElementById('orange-bubble-modal');
        modal.classList.add('show');
        
        // Start countdown
        let countdown = 180; // 3 minutes = 180 seconds
        const countdownElement = document.getElementById('response-countdown');
        countdownElement.textContent = countdown;
        
        const countdownInterval = setInterval(() => {
            countdown--;
            countdownElement.textContent = countdown;
            
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                document.querySelector('.assistant-response').innerHTML = '<p>Assistance is now available.</p>';
                document.querySelector('.security-verification').classList.remove('hidden');
            }
        }, 1000);
        
        // Clean up interval when modal is closed
        const closeButton = modal.querySelector('.close-button');
        closeButton.addEventListener('click', () => {
            clearInterval(countdownInterval);
        });
        
        document.getElementById('cancel-assistance').addEventListener('click', () => {
            clearInterval(countdownInterval);
        });
    },
    
    selectSecurityPersonnel(security) {
        document.querySelector('.security-verification').classList.add('hidden');
        document.querySelector('.assistant-response').innerHTML = '<p>Security Personnel ' + security + ' has been assigned to assist you.</p>';
        
        setTimeout(() => {
            document.getElementById('orange-bubble-modal').classList.remove('show');
            
            this.showNotification({
                type: 'success',
                title: 'Assistance Requested',
                message: `Security Personnel ${security} will arrive at your room soon.`
            });
            
            // For Night Elk plot advancement
            if (security === 'B') {
                setTimeout(() => {
                    this.showNotification({
                        type: 'info',
                        title: 'Mysterious Note',
                        message: 'Security Personnel B slipped you a note: "Not all is as it seems. Check the toilet in Area L."'
                    });
                    
                    this.state.gameState.puzzleProgress += 15;
                }, 10000);
            }
        }, 2000);
    },
    
    registerSkills() {
        // Show skill registration form (simplified for this implementation)
        this.showNotification({
            type: 'info',
            title: 'Skill Registration',
            message: 'Your skill as a perfume designer has been registered with the system.'
        });
        
        setTimeout(() => {
            this.showNotification({
                type: 'warning',
                title: 'Skill Verification',
                message: 'Your skill requires verification. Please wait for further instructions.'
            });
            
            // Add pending event for skill verification
            const verificationTime = new Date(this.state.hotel.currentTime.getTime() + (60 * 60 * 1000)); // 1 hour later
            
            this.state.gameState.pendingEvents.push({
                type: 'skill-verification',
                time: verificationTime.getTime(),
                skill: 'perfume-designer',
                verified: Math.random() > 0.5 // 50% chance of being verified
            });
        }, 5000);
    },
    
    applyForPublicRoom() {
        const areas = ['R', 'M', 'Y'];
        const randomArea = areas[Math.floor(Math.random() * areas.length)];
        
        this.showNotification({
            type: 'info',
            title: 'Public Room Application',
            message: `Your application for Area ${randomArea} is being processed.`
        });
        
        // Simulate application process
        setTimeout(() => {
            const approved = randomArea !== 'M'; // M area is on 8th floor which is generally inaccessible
            
            if (approved) {
                this.showNotification({
                    type: 'success',
                    title: 'Application Approved',
                    message: `Your application for Area ${randomArea} has been approved. You must sign the "Approval Letter of Principles for the Application of Safety Matters".`
                });
                
                // Add to player's accessible areas
                this.state.player.approvedAreas = this.state.player.approvedAreas || [];
                this.state.player.approvedAreas.push(randomArea);
                
                // For Night Elk plot advancement if they get access to the right area
                if (randomArea === 'Y') {
                    setTimeout(() => {
                        this.showNotification({
                            type: 'info',
                            title: 'Night Elk Clue',
                            message: 'You noticed a strange poster in Area Y mentioning "Night Elk". There appears to be a number: 9321.'
                        });
                        
                        this.state.gameState.puzzleProgress += 25;
                    }, 10000);
                }
            } else {
                this.showNotification({
                    type: 'error',
                    title: 'Application Denied',
                    message: `Your application for Area ${randomArea} has been denied. Area M is currently unavailable for public room applications.`
                });
            }
        }, 5000);
    },
    
    goToFloor(floor) {
        floor = parseInt(floor);
        
        const elevatorModal = document.getElementById('elevator-modal');
        const currentFloorElement = document.getElementById('current-floor');
        const elevatorMessage = document.querySelector('.elevator-message');
        
        // Update current floor display
        currentFloorElement.textContent = this.state.gameState.currentFloor;
        
        // Simulate elevator movement
        elevatorMessage.textContent = `Moving to floor ${floor}...`;
        
        // Check special cases
        let specialCase = false;
        
        // Check if floor 3 is accessible based on day of week
        if (floor === 3 && this.state.hotel.currentDay !== 'Saturday' && this.state.player.room.substring(0, 2) !== '30') {
            elevatorMessage.textContent = `Access to floor 3 is restricted to Saturdays and current guests.`;
            specialCase = true;
        }
        
        // Check if floor 8 is accessible (it shouldn't be)
        if (floor === 8) {
            elevatorMessage.textContent = `Floor 8 is not accessible.`;
            specialCase = true;
        }
        
        if (!specialCase) {
            // Simulate elevator movement with progress updates
            let progress = 0;
            const floorDifference = Math.abs(this.state.gameState.currentFloor - floor);
            const movementTime = floorDifference * 1000; // 1 second per floor
            
            const startTime = Date.now();
            const endTime = startTime + movementTime;
            
            const moveElevator = () => {
                const now = Date.now();
                progress = (now - startTime) / movementTime;
                
                if (progress >= 1) {
                    // Arrived at floor
                    this.state.gameState.currentFloor = floor;
                    currentFloorElement.textContent = floor;
                    elevatorMessage.textContent = `Arrived at floor ${floor}.`;
                    
                    // Check for floor-specific content
                    this.checkFloorSpecificContent(floor);
                    
                    // Close modal after a delay
                    setTimeout(() => {
                        elevatorModal.classList.remove('show');
                    }, 2000);
                    
                    return;
                }
                
                // Calculate current position
                const currentPosition = Math.round(this.state.gameState.currentFloor + (floor - this.state.gameState.currentFloor) * progress);
                currentFloorElement.textContent = currentPosition;
                
                requestAnimationFrame(moveElevator);
            };
            
            requestAnimationFrame(moveElevator);
        }
    },
    
    checkFloorSpecificContent(floor) {
        // Check if this floor has special content or events
        switch (floor) {
            case 3:
                // 3rd floor has Area A for public service
                if (this.state.hotel.areas.A.access) {
                    setTimeout(() => {
                        this.showNotification({
                            type: 'info',
                            title: 'Area A',
                            message: 'You are now on floor 3. Area A (120 sq m) is available for conferences and games.'
                        });
                    }, 1000);
                }
                break;
                
            case 5:
                // Emergency passage on 5th floor
                setTimeout(() => {
                    this.showNotification({
                        type: 'warning',
                        title: 'Security Notice',
                        message: 'The emergency passage and security door on this floor are automatically locked during the day.'
                    });
                }, 1000);
                break;
                
            case 9:
                // No hot water on 9th floor
                if (this.state.player.unlockedRules.includes('R009')) {
                    setTimeout(() => {
                        this.showNotification({
                            type: 'info',
                            title: 'Water Schedule',
                            message: 'Remember: There is no hot water on the 9th floor.'
                        });
                    }, 1000);
                }
                break;
        }
        
        // Check if this is the player's floor
        if (floor === parseInt(this.state.player.room.substring(0, 2))) {
            setTimeout(() => {
                this.showNotification({
                    type: 'info',
                    title: 'Your Floor',
                    message: `You have arrived at your floor. Your room is ${this.state.player.room}.`
                });
                
                // Complete task if it's pending
                const findRoomTask = this.state.player.taskList.find(t => t.id === 'task-3');
                if (findRoomTask && !findRoomTask.completed) {
                    this.completeTask('task-3');
                }
            }, 1000);
        }
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// Add this to app.js to ensure all navigation sections work properly

// Enhanced changeView function to handle all sections
app.changeView = function(view) {
    console.log(`Changing view to: ${view}`);
    
    // Hide all content sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Deactivate all nav items
    document.querySelectorAll('.main-nav li').forEach(navItem => {
        navItem.classList.remove('active');
    });
    
    // Show selected content section
    const selectedSection = document.getElementById(view);
    if (selectedSection) {
        selectedSection.classList.add('active');
    } else {
        console.error(`Content section for ${view} not found`);
    }
    
    // Activate corresponding nav item
    const navItem = document.querySelector(`.main-nav li[data-view="${view}"]`);
    if (navItem) {
        navItem.classList.add('active');
    }
    
    this.state.currentView = view;
    
    // Special handling for each section
    switch(view) {
        case 'design-process':
            this.initializeDesignProcess();
            break;
        case 'procedure-exit':
            this.initializeProcedureExit();
            break;
        case 'hotel-upgrade':
            this.initializeHotelUpgrade();
            break;
        case 'supplementary-procedure':
            this.initializeSupplementaryProcedure();
            break;
    }
};

// Add these initializer functions to app.js
app.initializeDesignProcess = function() {
    console.log("Initializing Design Process section");
    
    // Create section content if it doesn't exist
    const section = document.getElementById('design-process');
    if (!section || section.children.length === 0) {
        this.createDesignProcessContent();
    }
};

app.initializeProcedureExit = function() {
    console.log("Initializing Procedure to Leave section");
    
    // Create section content if it doesn't exist
    const section = document.getElementById('procedure-exit');
    if (!section || section.children.length === 0) {
        this.createProcedureExitContent();
    }
};

app.initializeHotelUpgrade = function() {
    console.log("Initializing Hotel Upgrade section");
    
    // Create section content if it doesn't exist
    const section = document.getElementById('hotel-upgrade');
    if (!section || section.children.length === 0) {
        this.createHotelUpgradeContent();
    }
};

app.initializeSupplementaryProcedure = function() {
    console.log("Initializing Supplementary Procedure section");
    
    // Create section content if it doesn't exist
    const section = document.getElementById('supplementary-procedure');
    if (!section || section.children.length === 0) {
        this.createSupplementaryProcedureContent();
    }
    
    // Unlock supplementary procedures based on progress
    if (this.supplementary && typeof this.supplementary.checkUnlockRequirements === 'function') {
        Object.keys(this.supplementary.procedures).forEach(procedureId => {
            if (this.supplementary.checkUnlockRequirements(procedureId)) {
                this.supplementary.unlockProcedure(procedureId);
            }
        });
    }
};

// Add these content creation functions to app.js

// Design Process content
app.createDesignProcessContent = function() {
    const section = document.getElementById('design-process');
    if (!section) return;
    
    section.innerHTML = `
        <h2>Design Process</h2>
        <div class="welcome-message">
            <p>The design process is full of the same "perfume" (perfume designer), but it may not align with the rules.</p>
        </div>
        
        <div class="design-container">
            <div class="design-stage">
                <h3>Perfume Design Process</h3>
                <p>As a perfume designer, you can experiment with different scent combinations and submit designs for approval.</p>
                
                <div class="design-interaction">
                    <div class="scent-mixer">
                        <h4>Scent Mixer</h4>
                        <div class="scent-sliders">
                            <div class="scent-component">
                                <label>Floral (Day)</label>
                                <input type="range" min="0" max="100" value="30" class="scent-slider" data-scent="floral">
                            </div>
                            <div class="scent-component">
                                <label>Woody (Night)</label>
                                <input type="range" min="0" max="100" value="50" class="scent-slider" data-scent="woody">
                            </div>
                            <div class="scent-component">
                                <label>Citrus (Bright)</label>
                                <input type="range" min="0" max="100" value="20" class="scent-slider" data-scent="citrus">
                            </div>
                            <div class="scent-component">
                                <label>Musk (Dark)</label>
                                <input type="range" min="0" max="100" value="40" class="scent-slider" data-scent="musk">
                            </div>
                        </div>
                        
                        <div class="scent-preview">
                            <h4>Scent Preview</h4>
                            <div class="scent-visualization">
                                <canvas id="scent-canvas" width="300" height="150"></canvas>
                            </div>
                        </div>
                    </div>
                    
                    <div class="perfume-actions">
                        <button id="create-perfume" class="action-button">
                            <i class="fas fa-vial"></i> Create Perfume
                        </button>
                        <button id="submit-design" class="action-button">
                            <i class="fas fa-paper-plane"></i> Submit Design
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="design-portfolio">
                <h3>Your Perfume Portfolio</h3>
                <div class="portfolio-items" id="perfume-portfolio">
                    <div class="empty-portfolio">No perfumes created yet.</div>
                </div>
            </div>
        </div>
    `;
    
    // Add styles for design process
    const style = document.createElement('style');
    style.textContent = `
        .design-container {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        
        .design-stage {
            background-color: var(--card-bg);
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
            padding: 20px;
        }
        
        .scent-sliders {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin: 20px 0;
        }
        
        .scent-component label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        
        .scent-slider {
            width: 100%;
        }
        
        .scent-preview {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: var(--border-radius);
            margin-bottom: 20px;
        }
        
        .scent-visualization {
            background-color: white;
            border-radius: var(--border-radius);
            padding: 10px;
            margin-top: 10px;
        }
        
        .perfume-actions {
            display: flex;
            gap: 10px;
        }
        
        .design-portfolio {
            background-color: var(--card-bg);
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
            padding: 20px;
        }
        
        .portfolio-items {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }
        
        .empty-portfolio {
            grid-column: 1 / -1;
            text-align: center;
            padding: 20px;
            color: var(--light-text);
            font-style: italic;
        }
        
        .perfume-item {
            background-color: #f9f9f9;
            border-radius: var(--border-radius);
            padding: 15px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
        }
        
        .perfume-bottle {
            width: 40px;
            height: 60px;
            background-color: var(--accent-color);
            border-radius: 5px 5px 20px 20px;
            position: relative;
        }
        
        .perfume-bottle::after {
            content: '';
            position: absolute;
            top: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 15px;
            height: 15px;
            background-color: #333;
            border-radius: 5px;
        }
        
        .perfume-name {
            font-weight: bold;
            font-size: 0.9rem;
        }
        
        .perfume-description {
            font-size: 0.8rem;
            text-align: center;
            color: var(--light-text);
        }
    `;
    document.head.appendChild(style);
    
    // Set up scent canvas visualization
    const canvas = document.getElementById('scent-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        this.renderScentCanvas(ctx, canvas.width, canvas.height);
        
        // Update visualization when sliders change
        document.querySelectorAll('.scent-slider').forEach(slider => {
            slider.addEventListener('input', () => {
                this.renderScentCanvas(ctx, canvas.width, canvas.height);
            });
        });
    }
    
    // Setup create perfume button
    const createButton = document.getElementById('create-perfume');
    if (createButton) {
        createButton.addEventListener('click', () => {
            this.createNewPerfume();
        });
    }
    
    // Setup submit design button
    const submitButton = document.getElementById('submit-design');
    if (submitButton) {
        submitButton.addEventListener('click', () => {
            this.submitPerfumeDesign();
        });
    }
};

// Render scent canvas based on sliders
app.renderScentCanvas = function(ctx, width, height) {
    // Get current slider values
    const floral = parseInt(document.querySelector('.scent-slider[data-scent="floral"]').value) / 100;
    const woody = parseInt(document.querySelector('.scent-slider[data-scent="woody"]').value) / 100;
    const citrus = parseInt(document.querySelector('.scent-slider[data-scent="citrus"]').value) / 100;
    const musk = parseInt(document.querySelector('.scent-slider[data-scent="musk"]').value) / 100;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background
    ctx.fillStyle = '#f9f9f9';
    ctx.fillRect(0, 0, width, height);
    
    // Define colors for each scent
    const colors = {
        floral: '#ff9eb1', // Pink
        woody: '#8b4513', // Brown
        citrus: '#ffd700', // Yellow
        musk: '#4a2f48'  // Dark purple
    };
    
    // Draw circular visualization
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) / 2 - 20;
    
    // Draw each scent as a layer
    this.drawScentLayer(ctx, centerX, centerY, maxRadius * floral, colors.floral, 0.7);
    this.drawScentLayer(ctx, centerX, centerY, maxRadius * woody, colors.woody, 0.6);
    this.drawScentLayer(ctx, centerX, centerY, maxRadius * citrus, colors.citrus, 0.5);
    this.drawScentLayer(ctx, centerX, centerY, maxRadius * musk, colors.musk, 0.4);
    
    // Draw center point
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
};

// Helper to draw scent layers
app.drawScentLayer = function(ctx, centerX, centerY, radius, color, opacity) {
    ctx.fillStyle = color;
    ctx.globalAlpha = opacity;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;
};

// Create a new perfume from current settings
app.createNewPerfume = function() {
    // Get current slider values
    const floral = parseInt(document.querySelector('.scent-slider[data-scent="floral"]').value);
    const woody = parseInt(document.querySelector('.scent-slider[data-scent="woody"]').value);
    const citrus = parseInt(document.querySelector('.scent-slider[data-scent="citrus"]').value);
    const musk = parseInt(document.querySelector('.scent-slider[data-scent="musk"]').value);
    
    // Calculate dominant notes
    const notes = [
        { name: 'floral', value: floral },
        { name: 'woody', value: woody },
        { name: 'citrus', value: citrus },
        { name: 'musk', value: musk }
    ];
    
    notes.sort((a, b) => b.value - a.value);
    const dominant = notes[0].name;
    const secondary = notes[1].name;
    
    // Generate name and description
    const nameOptions = {
        floral: ['Bloom', 'Petal', 'Garden', 'Rose'],
        woody: ['Cedar', 'Forest', 'Oak', 'Timber'],
        citrus: ['Zest', 'Citron', 'Sunny', 'Lemon'],
        musk: ['Dusk', 'Shadow', 'Velvet', 'Night']
    };
    
    const name = nameOptions[dominant][Math.floor(Math.random() * nameOptions[dominant].length)] + ' ' +
                nameOptions[secondary][Math.floor(Math.random() * nameOptions[secondary].length)];
    
    const description = `A ${dominant} forward scent with ${secondary} undertones.`;
    
    // Create perfume object
    const perfume = {
        id: Date.now(),
        name: name,
        description: description,
        composition: {
            floral: floral,
            woody: woody,
            citrus: citrus,
            musk: musk
        },
        created: new Date(),
        submitted: false
    };
    
    // Save to player's perfumes
    if (!this.state.player.perfumes) {
        this.state.player.perfumes = [];
    }
    
    this.state.player.perfumes.push(perfume);
    
    // Update portfolio display
    this.updatePerfumePortfolio();
    
    // Show notification
    this.showNotification({
        type: 'success',
        title: 'Perfume Created',
        message: `You've created a new perfume: ${name}`
    });
};

// Update the perfume portfolio display
app.updatePerfumePortfolio = function() {
    const portfolio = document.getElementById('perfume-portfolio');
    if (!portfolio) return;
    
    // Clear existing content
    portfolio.innerHTML = '';
    
    // Get player's perfumes
    const perfumes = this.state.player.perfumes || [];
    
    if (perfumes.length === 0) {
        portfolio.innerHTML = '<div class="empty-portfolio">No perfumes created yet.</div>';
        return;
    }
    
    // Add each perfume to portfolio
    perfumes.forEach(perfume => {
        const perfumeElement = document.createElement('div');
        perfumeElement.className = 'perfume-item';
        
        // Determine bottle color based on dominant note
        let bottleColor = '#e8ad51'; // Default
        const notes = ['floral', 'woody', 'citrus', 'musk'];
        let dominant = notes[0];
        let maxValue = perfume.composition[dominant];
        
        for (const note of notes) {
            if (perfume.composition[note] > maxValue) {
                dominant = note;
                maxValue = perfume.composition[note];
            }
        }
        
        // Set bottle color
        switch(dominant) {
            case 'floral': bottleColor = '#ff9eb1'; break;
            case 'woody': bottleColor = '#8b4513'; break;
            case 'citrus': bottleColor = '#ffd700'; break;
            case 'musk': bottleColor = '#4a2f48'; break;
        }
        
        perfumeElement.innerHTML = `
            <div class="perfume-bottle" style="background-color: ${bottleColor};"></div>
            <div class="perfume-name">${perfume.name}</div>
            <div class="perfume-description">${perfume.description}</div>
            <div class="perfume-status">${perfume.submitted ? 'Submitted' : 'Draft'}</div>
        `;
        
        portfolio.appendChild(perfumeElement);
    });
};

// Submit perfume design
app.submitPerfumeDesign = function() {
    // Get player's perfumes
    const perfumes = this.state.player.perfumes || [];
    
    // Check if any non-submitted perfumes
    const drafts = perfumes.filter(p => !p.submitted);
    
    if (drafts.length === 0) {
        this.showNotification({
            type: 'warning',
            title: 'No Drafts',
            message: 'You don\'t have any draft perfumes to submit.'
        });
        return;
    }
    
    // Mark all drafts as submitted
    drafts.forEach(perfume => {
        perfume.submitted = true;
    });
    
    // Update portfolio display
    this.updatePerfumePortfolio();
    
    // Show notification
    this.showNotification({
        type: 'success',
        title: 'Designs Submitted',
        message: `You've submitted ${drafts.length} perfume design${drafts.length > 1 ? 's' : ''} for approval.`
    });
    
    // Set up for Night Elk progression - if player shows dedication to perfume design
    if (perfumes.length >= 3 && perfumes.filter(p => p.submitted).length >= 2) {
        // This is a good sign of player engagement with their role
        setTimeout(() => {
            this.showNotification({
                type: 'info',
                title: 'Night Elk Note',
                message: 'You found a note among your design materials: "Your dedication to perfumery has been noted. Check Area L. -K"'
            });
            
            // Add to discovered secrets
            if (!this.state.player.discoveredSecrets.includes('perfume-night-elk-note')) {
                this.state.player.discoveredSecrets.push('perfume-night-elk-note');
                
                // Increase Night Elk puzzle progress
                this.state.gameState.puzzleProgress += 10;
            }
        }, 5000);
    }
};

// Procedure to Leave section content
app.createProcedureExitContent = function() {
    const section = document.getElementById('procedure-exit');
    if (!section) return;
    
    section.innerHTML = `
        <h2>Procedure to Leave</h2>
        <div class="welcome-message">
            <p>The time has come to consider your departure from the hotel. The procedure to leave involves several steps.</p>
        </div>
        
        <div class="exit-procedure-list">
            <div class="procedure-item">
                <div class="procedure-header">
                    <span class="procedure-code">#Ex001</span>
                    <h3>Check-out Requirements</h3>
                </div>
                <div class="procedure-content">
                    <p>All guests must follow the established check-out procedure. Please ensure you have completed all necessary tasks before departure.</p>
                    <ul>
                        <li>Return all hotel property (key cards, borrowed items)</li>
                        <li>Settle any outstanding charges</li>
                        <li>Log out of all hotel systems</li>
                    </ul>
                </div>
            </div>
            
            <div class="procedure-item">
                <div class="procedure-header">
                    <span class="procedure-code">#Ex002</span>
                    <h3>Night Restriction</h3>
                </div>
                <div class="procedure-content">
                    <p>When going out at night, the latest time to leave the door is 23:30. You must swipe your card to enter the elevator as the security door is locked. Breaking in or staying in the corridor for more than 1 hour is not permitted.</p>
                </div>
            </div>
            
            <div class="procedure-item">
                <div class="procedure-header">
                    <span class="procedure-code">#Ex003</span>
                    <h3>Construction Areas</h3>
                </div>
                <div class="procedure-content">
                    <p>The second phase has entered the construction stage. Construction areas (drawings are publicized and borrowed by the engineering department) are not allowed to be entered. Passers-by must detour via No. 6, No. 7, or 71/2 Road to reach the underground garage and service area.</p>
                </div>
            </div>
        </div>
        
        <div class="checkout-form">
            <h3>Check-out Form</h3>
            <div class="form-description">
                <p>Please complete this form to initiate the check-out process.</p>
            </div>
            
            <div class="form-fields">
                <div class="form-field">
                    <label for="checkout-name">Guest Name</label>
                    <input type="text" id="checkout-name" placeholder="Your name" value="Yucheng">
                </div>
                
                <div class="form-field">
                    <label for="checkout-room">Room Number</label>
                    <input type="text" id="checkout-room" placeholder="Room number" value="3021">
                </div>
                
                <div class="form-field">
                    <label for="checkout-date">Check-out Date</label>
                    <input type="date" id="checkout-date">
                </div>
                
                <div class="form-field">
                    <label for="checkout-reason">Reason for Departure</label>
                    <select id="checkout-reason">
                        <option value="">Please select...</option>
                        <option value="end-of-stay">End of planned stay</option>
                        <option value="business">Business elsewhere</option>
                        <option value="personal">Personal reasons</option>
                        <option value="night-elk">Night Elk Program completion</option>
                        <option value="dissatisfied">Dissatisfied with hotel</option>
                    </select>
                </div>
                
                <div class="form-field">
                    <label for="checkout-feedback">Feedback or Comments</label>
                    <textarea id="checkout-feedback" rows="4" placeholder="Please share your experience..."></textarea>
                </div>
            </div>
            
            <div class="checkout-actions">
                <button id="submit-checkout" class="action-button">
                    <i class="fas fa-sign-out-alt"></i> Submit Check-out Request
                </button>
            </div>
        </div>
    `;
    
    // Add styles for checkout form
    const style = document.createElement('style');
    style.textContent = `
        .exit-procedure-list {
            margin-bottom: 30px;
        }
        
        .checkout-form {
            background-color: var(--card-bg);
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
            padding: 20px;
        }
        
        .form-description {
            margin-bottom: 20px;
            color: var(--light-text);
        }
        
        .form-fields {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .form-field:last-child {
            grid-column: span 2;
        }
        
        .form-field label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        
        .form-field input,
        .form-field select,
        .form-field textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: var(--border-radius);
            font-family: inherit;
        }
        
        .checkout-actions {
            display: flex;
            justify-content: flex-end;
        }
    `;
    document.head.appendChild(style);
    
    // Set default date to today
    const dateInput = document.getElementById('checkout-date');
    if (dateInput) {
        const today = new Date();
        const dateString = today.toISOString().split('T')[0];
        dateInput.value = dateString;
    }
    
    // Setup submit checkout button
    const submitButton = document.getElementById('submit-checkout');
    if (submitButton) {
        submitButton.addEventListener('click', () => {
            this.submitCheckoutRequest();
        });
    }
};

// Submit checkout request
app.submitCheckoutRequest = function() {
    // Get form values
    const name = document.getElementById('checkout-name').value;
    const room = document.getElementById('checkout-room').value;
    const date = document.getElementById('checkout-date').value;
    const reason = document.getElementById('checkout-reason').value;
    const feedback = document.getElementById('checkout-feedback').value;
    
    // Validate form
    if (!name || !room || !date || !reason) {
        this.showNotification({
            type: 'error',
            title: 'Form Incomplete',
            message: 'Please fill in all required fields before submitting.'
        });
        return;
    }
    
    // Process checkout request
    this.showNotification({
        type: 'info',
        title: 'Processing Request',
        message: 'Your check-out request is being processed...'
    });
    
    // Simulate processing delay
    setTimeout(() => {
        // Check if player has completed key tasks
        let canCheckout = true;
        let message = 'Your check-out request has been approved.';
        
        // Check if player is far enough in Night Elk Program
        if (this.state.gameState.puzzleProgress < 50) {
            canCheckout = false;
            message = 'Your check-out request has been denied. The Night Elk Program requires further progress.';
        }
        
        // Check if player has unresolved violations
        if (this.state.player.violations && this.state.player.violations.filter(v => !v.handled).length > 3) {
            canCheckout = false;
            message = 'Your check-out request has been denied. You have unresolved rule violations that must be addressed.';
        }
        
        if (canCheckout) {
            this.showNotification({
                type: 'success',
                title: 'Check-out Approved',
                message: message
            });
            
            // Complete checkout task if exists
            const checkoutTask = this.state.player.taskList.find(t => t.id === 'task-checkout');
            if (checkoutTask) {
                checkoutTask.completed = true;
                this.updateTaskList();
            }
            
            // Show final confirmation modal
            setTimeout(() => {
                this.showCheckoutConfirmation();
            }, 2000);
        } else {
            this.showNotification({
                type: 'error',
                title: 'Check-out Denied',
                message: message
            });
        }
    }, 3000);
};

// Show checkout confirmation modal
app.showCheckoutConfirmation = function() {
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.id = 'checkout-confirmation-modal';
    
    modal.innerHTML = `
        <div class="modal-content confirmation-content">
            <div class="modal-header">
                <h3>Check-out Confirmation</h3>
                <span class="close-button">&times;</span>
            </div>
            <div class="confirmation-body">
                <p>You are about to check out of the Amman Hotel Chain Balance Beam Branch.</p>
                <p>Date: ${new Date().toLocaleDateString()}</p>
                <p>Your Night Elk Program participation has been recorded.</p>
                <p>Are you sure you want to proceed with check-out?</p>
            </div>
            <div class="confirmation-actions">
                <button id="cancel-checkout" class="action-button secondary-button">
                    <i class="fas fa-times"></i> Cancel
                </button>
                <button id="confirm-checkout" class="action-button">
                    <i class="fas fa-check"></i> Confirm Check-out
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add styles for confirmation
    const style = document.createElement('style');
    style.textContent = `
        .confirmation-content {
            max-width: 500px;
        }
        
        .confirmation-body {
            padding: 20px;
        }
        
        .confirmation-actions {
            padding: 15px 20px;
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            border-top: 1px solid #eee;
        }
        
        .secondary-button {
            background-color: #e0e0e0;
            color: var(--text-color);
        }
        
        .secondary-button:hover {
            background-color: #d0d0d0;
        }
    `;
    document.head.appendChild(style);
    
    // Set up close button
    modal.querySelector('.close-button').addEventListener('click', () => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    });
    
    // Set up cancel button
    modal.querySelector('#cancel-checkout').addEventListener('click', () => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    });
    
    // Set up confirm button
    modal.querySelector('#confirm-checkout').addEventListener('click', () => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
            this.finalizeCheckout();
        }, 300);
    });
};

// Finalize the checkout process
app.finalizeCheckout = function() {
    // Show loading screen for dramatic effect
    const loadingScreen = document.createElement('div');
    loadingScreen.id = 'checkout-loading';
    loadingScreen.className = 'full-screen-overlay';
    
    loadingScreen.innerHTML = `
        <div class="checkout-message">
            <h2>Checking Out...</h2>
            <p>Thank you for your stay at Amman Hotel</p>
            <div class="loading-indicator">
                <div class="loading-spinner"></div>
            </div>
        </div>
    `;
    
    document.body.appendChild(loadingScreen);
    
    // Add styles for checkout screen
    const style = document.createElement('style');
    style.textContent = `
        .full-screen-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--night-elk-color);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            color: white;
        }
        
        .checkout-message {
            text-align: center;
        }
        
        .loading-indicator {
            margin-top: 30px;
        }
        
        .loading-spinner {
            width: 50px;
            height: 50px;
            border: 5px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s ease-in-out infinite;
            margin: 0 auto;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        .conclusion-content {
            max-width: 800px;
            background-color: var(--night-elk-color);
            color: white;
        }
        
        .epilogue {
            padding: 20px;
            line-height: 1.8;
        }
    `;
    document.head.appendChild(style);
    
    // Simulate checkout process
    setTimeout(() => {
        loadingScreen.remove();
        this.showGameConclusion();
    }, 3000);
};

// Show game conclusion
app.showGameConclusion = function() {
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.id = 'conclusion-modal';
    
    modal.innerHTML = `
        <div class="modal-content conclusion-content">
            <div class="modal-header">
                <h3>Epilogue</h3>
                <span class="close-button">&times;</span>
            </div>
            <div class="epilogue">
                <p>You return to your original life and wait for your experience to ferment. Your perfume needs time to adapt to your previous experiences.</p>
                
                <p>On June 15, after submitting a piece of code, you write a resignation report and move to a remote southern city with penguins.</p>
                
                <p>The Night Elk Program has changed you in ways you're still discovering. Sometimes, you catch yourself checking the numbers 9321 whenever you see them, and the scent of scallion pancakes makes you inexplicably nostalgic.</p>
                
                <p>Was it all real? Did the 8th floor actually exist? Was Kuang Shengyou a visionary or a madman?</p>
                
                <p>You may never know for certain, but one thing is clear: your time at the Amman Hotel Chain Balance Beam Branch has left an indelible mark on your perception of reality.</p>
                
                <p class="conclusion-signature">- End of Procedure -</p>
            </div>
            <div class="conclusion-actions">
                <button id="restart-game" class="action-button">
                    <i class="fas fa-redo"></i> New Check-in
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add styles for conclusion
    const style = document.createElement('style');
    style.textContent = `
        .conclusion-signature {
            text-align: center;
            font-style: italic;
            margin-top: 20px;
            opacity: 0.8;
        }
        
        .conclusion-actions {
            padding: 15px 20px;
            display: flex;
            justify-content: center;
            border-top: 1px solid rgba(255,255,255,0.2);
        }
    `;
    document.head.appendChild(style);
    
    // Set up close button (doesn't actually close, redirects to restart)
    modal.querySelector('.close-button').addEventListener('click', () => {
        window.location.reload();
    });
    
    // Set up restart button
    modal.querySelector('#restart-game').addEventListener('click', () => {
        window.location.reload();
    });
};

// Hotel Upgrade section content
app.createHotelUpgradeContent = function() {
    const section = document.getElementById('hotel-upgrade');
    if (!section) return;
    
    section.innerHTML = `
        <h2>Hotel Upgrade</h2>
        <div class="welcome-message night-elk-content">
            <p>The hotel has been upgraded. Everything seems to have returned to its previous appearance, yet it feels completely different.</p>
            <div class="night-elk-bg"></div>
        </div>
        
        <div class="upgrade-announcement">
            <div class="announcement-header">
                <h3>System Upgrade: Version V99.0</h3>
                <span class="upgrade-badge">ACTIVE</span>
            </div>
            <div class="announcement-content">
                <p>The hotel system has been upgraded to version V99.0 with various new functions and enhancements.</p>
                <div class="upgrade-features">
                    <div class="upgrade-feature">
                        <div class="feature-icon"><i class="fas fa-bed"></i></div>
                        <div class="feature-details">
                            <h4>Community Housing</h4>
                            <p>Single/couple/luxury suites replaced with communal rooms accommodating 5-20 people.</p>
                        </div>
                    </div>
                    
                    <div class="upgrade-feature">
                        <div class="feature-icon"><i class="fas fa-map-marked-alt"></i></div>
                        <div class="feature-details">
                            <h4>Theme Service Areas</h4>
                            <p>New themed areas including Organic Business Zone, Couples Communication, and more.</p>
                        </div>
                    </div>
                    
                    <div class="upgrade-feature">
                        <div class="feature-icon"><i class="fas fa-paint-brush"></i></div>
                        <div class="feature-details">
                            <h4>Visual Identity Update</h4>
                            <p>Updated system logo and staff uniforms. Guests now categorized as "Forest Companions" with ratings.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="upgrade-options">
            <h3>Available Upgrades for Your Stay</h3>
            
            <div class="upgrade-option-list">
                <div class="upgrade-option">
                    <div class="option-header">
                        <h4>Avatar Rating Upgrade</h4>
                        <span class="option-price">Free</span>
                    </div>
                    <div class="option-description">
                        <p>Upgrade your forest companion rating from Water Grass to a higher level.</p>
                    </div>
                    <div class="option-tiers">
                        <div class="tier-option" data-tier="shrub">
                            <span class="tier-name">Shrub</span>
                            <span class="tier-requirement">Requires 3 perfume submissions</span>
                        </div>
                        <div class="tier-option" data-tier="wild-boar">
                            <span class="tier-name">Wild Boar</span>
                            <span class="tier-requirement">Requires 5 rule violations</span>
                        </div>
                        <div class="tier-option" data-tier="reindeer">
                            <span class="tier-name">Reindeer</span>
                            <span class="tier-requirement">Requires 70% Night Elk progress</span>
                        </div>
                        <div class="tier-option locked" data-tier="elk">
                            <span class="tier-name">Elk</span>
                            <span class="tier-requirement">Complete Night Elk Program</span>
                            <i class="fas fa-lock"></i>
                        </div>
                    </div>
                    <div class="option-actions">
                        <button id="apply-avatar-upgrade" class="action-button">
                            <i class="fas fa-arrow-up"></i> Apply Upgrade
                        </button>
                    </div>
                </div>
                
                <div class="upgrade-option">
                    <div class="option-header">
                        <h4>Room Reassignment</h4>
                        <span class="option-price">¥800</span>
                    </div>
                    <div class="option-description">
                        <p>Request reassignment to a different room or floor with specific features.</p>
                    </div>
                    <div class="option-selections">
                        <div class="option-selection">
                            <label for="room-floor">Preferred Floor</label>
                            <select id="room-floor">
                                <option value="">No preference</option>
                                <option value="3">3rd Floor (Area A)</option>
                                <option value="5">5th Floor (Area B)</option>
                                <option value="7">7th Floor (Area MOD)</option>
                                <option value="9">9th Floor (Area L)</option>
                                <option value="12">12th Floor (Area R)</option>
                                <option value="15">15th Floor (Area D)</option>
                            </select>
                        </div>
                        <div class="option-selection">
                            <label for="room-type">Room Type</label>
                            <select id="room-type">
                                <option value="standard">Standard Room</option>
                                <option value="community">Community Room (5 people)</option>
                                <option value="community-large">Large Community Room (10+ people)</option>
                            </select>
                        </div>
                    </div>
                    <div class="option-actions">
                        <button id="apply-room-change" class="action-button">
                            <i class="fas fa-exchange-alt"></i> Request Change
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add styles for hotel upgrade
    const style = document.createElement('style');
    style.textContent = `
        .upgrade-announcement {
            background-color: var(--card-bg);
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
            margin-bottom: 30px;
            overflow: hidden;
        }
        
        .announcement-header {
            background-color: var(--primary-color);
            color: white;
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .announcement-header h3 {
            margin: 0;
            color: white;
        }
        
        .upgrade-badge {
            background-color: var(--accent-color);
            color: var(--primary-color);
            padding: 3px 10px;
            border-radius: 10px;
            font-size: 0.8rem;
            font-weight: bold;
        }
        
        .announcement-content {
            padding: 20px;
        }
        
        .upgrade-features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        
        .upgrade-feature {
            display: flex;
            gap: 15px;
            padding: 15px;
            background-color: #f9f9f9;
            border-radius: var(--border-radius);
        }
        
        .feature-icon {
            width: 50px;
            height: 50px;
            background-color: var(--primary-color);
            color: white;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1.5rem;
        }
        
        .feature-details h4 {
            margin-top: 0;
            margin-bottom: 5px;
        }
        
        .feature-details p {
            margin: 0;
            font-size: 0.9rem;
            color: var(--light-text);
        }
        
        .upgrade-options {
            margin-top: 30px;
        }
        
        .upgrade-option-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        
        .upgrade-option {
            background-color: var(--card-bg);
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
            overflow: hidden;
        }
        
        .option-header {
            padding: 15px 20px;
            background-color: #f9f9f9;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #eee;
        }
        
        .option-header h4 {
            margin: 0;
        }
        
        .option-price {
            font-weight: bold;
            color: var(--primary-color);
        }
        
        .option-description {
            padding: 15px 20px;
            border-bottom: 1px solid #eee;
        }
        
        .option-tiers {
            padding: 15px 20px;
        }
        
        .tier-option {
            display: flex;
            justify-content: space-between;
            padding: 10px;
            border-bottom: 1px solid #f0f0f0;
            cursor: pointer;
            transition: background-color var(--transition-speed);
        }
        
        .tier-option:hover:not(.locked) {
            background-color: #f9f9f9;
        }
        
        .tier-option.locked {
            color: var(--light-text);
            cursor: not-allowed;
        }
        
        .tier-option.selected {
            background-color: rgba(58, 95, 111, 0.1);
        }
        
        .tier-name {
            font-weight: bold;
        }
        
        .tier-requirement {
            font-size: 0.8rem;
            color: var(--light-text);
        }
        
        .option-selections {
            padding: 15px 20px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }
        
        .option-selection label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        
        .option-selection select {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: var(--border-radius);
        }
        
        .option-actions {
            padding: 15px 20px;
            display: flex;
            justify-content: flex-end;
            border-top: 1px solid #eee;
        }
    `;
    document.head.appendChild(style);
    
    // Setup tier selection
    const tierOptions = document.querySelectorAll('.tier-option:not(.locked)');
    tierOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Deselect all
            tierOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Select clicked option
            option.classList.add('selected');
        });
    });
    
    // Setup avatar upgrade button
    const avatarUpgradeButton = document.getElementById('apply-avatar-upgrade');
    if (avatarUpgradeButton) {
        avatarUpgradeButton.addEventListener('click', () => {
            this.applyAvatarUpgrade();
        });
    }
    
    // Setup room change button
    const roomChangeButton = document.getElementById('apply-room-change');
    if (roomChangeButton) {
        roomChangeButton.addEventListener('click', () => {
            this.applyRoomChange();
        });
    }
    
    // Unlock appropriate tiers based on player progress
    this.updateAvailableTiers();
};

// Update available avatar tiers based on player progress
app.updateAvailableTiers = function() {
    // Shrub tier - requires 3 perfume submissions
    const shrubTier = document.querySelector('.tier-option[data-tier="shrub"]');
    if (shrubTier) {
        const perfumes = this.state.player.perfumes || [];
        const submittedPerfumes = perfumes.filter(p => p.submitted).length;
        
        if (submittedPerfumes >= 3) {
            shrubTier.classList.add('available');
            shrubTier.querySelector('.tier-requirement').textContent = 'Available (3/3 perfumes submitted)';
        } else {
            shrubTier.classList.remove('available');
            shrubTier.querySelector('.tier-requirement').textContent = `Requires 3 perfume submissions (${submittedPerfumes}/3 submitted)`;
        }
    }
    
    // Wild Boar tier - requires 5 rule violations
    const boarTier = document.querySelector('.tier-option[data-tier="wild-boar"]');
    if (boarTier) {
        const violations = this.state.player.violations ? this.state.player.violations.length : 0;
        
        if (violations >= 5) {
            boarTier.classList.add('available');
            boarTier.querySelector('.tier-requirement').textContent = 'Available (5/5 rule violations)';
        } else {
            boarTier.classList.remove('available');
            boarTier.querySelector('.tier-requirement').textContent = `Requires 5 rule violations (${violations}/5 committed)`;
        }
    }
    
    // Reindeer tier - requires 70% Night Elk progress
    const reindeerTier = document.querySelector('.tier-option[data-tier="reindeer"]');
    if (reindeerTier) {
        const progress = this.state.gameState.puzzleProgress;
        
        if (progress >= 70) {
            reindeerTier.classList.add('available');
            reindeerTier.querySelector('.tier-requirement').textContent = 'Available (Night Elk progress sufficient)';
        } else {
            reindeerTier.classList.remove('available');
            reindeerTier.querySelector('.tier-requirement').textContent = `Requires 70% Night Elk progress (${Math.floor(progress)}% complete)`;
        }
    }
    
    // Elk tier - requires completed Night Elk Program
    const elkTier = document.querySelector('.tier-option[data-tier="elk"]');
    if (elkTier) {
        const progress = this.state.gameState.puzzleProgress;
        
        if (progress >= 100) {
            elkTier.classList.remove('locked');
            elkTier.querySelector('.tier-requirement').textContent = 'Available (Night Elk Program completed)';
            elkTier.querySelector('.fa-lock').remove();
        }
    }
};

// Apply selected avatar upgrade
app.applyAvatarUpgrade = function() {
    const selectedTier = document.querySelector('.tier-option.selected');
    
    if (!selectedTier) {
        this.showNotification({
            type: 'warning',
            title: 'No Tier Selected',
            message: 'Please select an avatar tier to upgrade to.'
        });
        return;
    }
    
    const tier = selectedTier.dataset.tier;
    
    // Check if tier is available
    if (!selectedTier.classList.contains('available') && tier !== 'elk') {
        this.showNotification({
            type: 'error',
            title: 'Upgrade Unavailable',
            message: 'You do not yet meet the requirements for this avatar tier.'
        });
        return;
    }
    
    // Special handling for Elk tier
    if (tier === 'elk' && selectedTier.classList.contains('locked')) {
        this.showNotification({
            type: 'error',
            title: 'Elk Status Locked',
            message: 'You must complete the Night Elk Program to unlock Elk status.'
        });
        return;
    }
    
    // Apply upgrade
    this.state.player.avatar = tier;
    
    // Update avatar display
    const avatarImage = document.getElementById('avatar-image');
    const avatarName = document.getElementById('avatar-name');
    const levelBadge = document.getElementById('guest-level');
    
    if (avatarImage) {
        avatarImage.innerHTML = '';
        
        let iconClass;
        switch(tier) {
            case 'water-grass': iconClass = 'fa-seedling'; break;
            case 'shrub': iconClass = 'fa-leaf'; break;
            case 'wild-boar': iconClass = 'fa-horse'; break;
            case 'reindeer': iconClass = 'fa-paw'; break;
            case 'elk': iconClass = 'fa-deer'; break;
            default: iconClass = 'fa-seedling';
        }
        
        const icon = document.createElement('i');
        icon.className = `fas ${iconClass}`;
        avatarImage.appendChild(icon);
    }
    
    if (avatarName) {
        avatarName.textContent = tier.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }
    
    if (levelBadge) {
        levelBadge.textContent = tier.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }
    
    // Show notification
    this.showNotification({
        type: 'success',
        title: 'Avatar Upgraded',
        message: `Your avatar has been upgraded to ${tier.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')}!`
    });
    
    // Apply avatar-specific effects
    if (this.supplementary && typeof this.supplementary.upgradeAvatarWaterPrivileges === 'function') {
        this.supplementary.upgradeAvatarWaterPrivileges();
    }
};

// Apply room change request
app.applyRoomChange = function() {
    const floorSelect = document.getElementById('room-floor');
    const typeSelect = document.getElementById('room-type');
    
    if (!floorSelect || !typeSelect) return;
    
    const floor = floorSelect.value;
    const type = typeSelect.value;
    
    // Generate new room number
    let newRoom;
    
    if (floor) {
        // Use selected floor
        const roomNum = Math.floor(Math.random() * 25) + 1;
        newRoom = `${floor.padStart(2, '0')}${roomNum.toString().padStart(2, '0')}`;
    } else {
        // Random floor except 8
        let randomFloor;
        do {
            randomFloor = Math.floor(Math.random() * 15) + 1;
        } while (randomFloor === 8);
        
        const roomNum = Math.floor(Math.random() * 25) + 1;
        newRoom = `${randomFloor.toString().padStart(2, '0')}${roomNum.toString().padStart(2, '0')}`;
    }
    
    // Process room change
    this.showNotification({
        type: 'info',
        title: 'Processing Request',
        message: 'Your room change request is being processed...'
    });
    
    // Simulate processing delay
    setTimeout(() => {
        // Update room number
        const oldRoom = this.state.player.room;
        this.state.player.room = newRoom;
        
        // Update floor
        this.state.player.floor = parseInt(newRoom.substring(0, 2));
        
        // Update room simulator if available
        if (this.room) {
            this.room.state.roomNumber = newRoom;
        }
        
        // Show notification
        this.showNotification({
            type: 'success',
            title: 'Room Changed',
            message: `You have been moved from room ${oldRoom} to room ${newRoom}.`
        });
        
        // Add extra flavor based on new floor
        switch(parseInt(newRoom.substring(0, 2))) {
            case 3:
                setTimeout(() => {
                    this.showNotification({
                        type: 'info',
                        title: '3rd Floor',
                        message: 'You can hear conference activities from Area A nearby.'
                    });
                }, 3000);
                break;
                
            case 5:
                setTimeout(() => {
                    this.showNotification({
                        type: 'info',
                        title: '5th Floor',
                        message: 'Remember that the emergency passage and security door are locked during the day.'
                    });
                }, 3000);
                break;
                
            case 9:
                setTimeout(() => {
                    this.showNotification({
                        type: 'warning',
                        title: '9th Floor',
                        message: 'Note that there is no hot water available on this floor.'
                    });
                }, 3000);
                break;
                
            case 14:
                setTimeout(() => {
                    this.showNotification({
                        type: 'info',
                        title: '14th Floor',
                        message: 'Water is only available after 10:00 PM on this floor.'
                    });
                }, 3000);
                break;
        }
    }, 3000);
};

// Supplementary Procedure content
app.createSupplementaryProcedureContent = function() {
    const section = document.getElementById('supplementary-procedure');
    if (!section) return;
    
    section.innerHTML = `
        <h2>Supplementary Procedures</h2>
        <div class="welcome-message">
            <p>Advanced procedures unlocked through special circumstances. These quantum rules govern the deeper layers of hotel operation.</p>
            <p class="warning-text">Warning: Quantum procedures may destabilize reality. Use with caution.</p>
        </div>
        
        <div class="procedure-list" id="supplementary-procedure-list">
            <!-- Supplementary procedures will be added here -->
            <div class="empty-procedures">
                <p>No supplementary procedures have been unlocked yet.</p>
                <p class="small-text">Continue exploring the hotel and interacting with its systems to discover quantum procedures.</p>
            </div>
        </div>
        
        <div class="anomaly-status">
            <h3>Reality Status</h3>
            <div class="anomaly-meter">
                <div class="anomaly-label">Anomaly Level: <span id="anomaly-level">0</span>%</div>
                <div class="anomaly-bar">
                    <div class="anomaly-fill" style="width: 0%;"></div>
                </div>
            </div>
            <div class="anomaly-effects" id="anomaly-effects">
                <p>Hotel reality appears stable. No anomalies detected.</p>
            </div>
        </div>
    `;
    
    // Add styles for supplementary procedures
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
        
        .empty-procedures {
            padding: 30px;
            text-align: center;
            background-color: var(--card-bg);
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
        }
        
        .empty-procedures .small-text {
            font-size: 0.9rem;
            color: var(--light-text);
            margin-top: 10px;
        }
        
        .anomaly-status {
            margin-top: 30px;
            background-color: var(--card-bg);
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
            padding: 20px;
        }
        
        .anomaly-meter {
            margin: 15px 0;
        }
        
        .anomaly-label {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            font-weight: bold;
        }
        
        .anomaly-bar {
            height: 10px;
            background-color: #f0f0f0;
            border-radius: 5px;
            overflow: hidden;
        }
        
        .anomaly-fill {
            height: 100%;
            background: linear-gradient(to right, #2ecc71, #f39c12, #e74c3c);
            transition: width 0.5s ease;
        }
        
        .anomaly-effects {
            margin-top: 15px;
            font-style: italic;
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
        
        .quantum-effect {
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
    
    // Update anomaly level display
    this.updateAnomalyLevel();
    
    // Set up anomaly level update timer
    setInterval(() => {
        this.updateAnomalyLevel();
    }, 5000);
    
    // If supplementary module is available, check for unlockable procedures
    if (this.supplementary) {
        Object.keys(this.supplementary.procedures).forEach(procedureId => {
            if (this.supplementary.checkUnlockRequirements(procedureId)) {
                this.supplementary.unlockProcedure(procedureId);
                
                // Update display
                this.updateSupplementaryProcedureDisplay();
            }
        });
    } else {
        // Fake some procedures for testing without the module
        this.createTestSupplementaryProcedures();
    }
};

// Update anomaly level display
app.updateAnomalyLevel = function() {
    const anomalyLevel = document.getElementById('anomaly-level');
    const anomalyFill = document.querySelector('.anomaly-fill');
    const anomalyEffects = document.getElementById('anomaly-effects');
    
    if (!anomalyLevel || !anomalyFill || !anomalyEffects) return;
    
    // Get current anomaly level
    const level = this.state.gameState.anomalyLevel || 0;
    
    // Update display
    anomalyLevel.textContent = Math.min(100, Math.floor(level));
    anomalyFill.style.width = `${Math.min(100, level)}%`;
    
    // Update effects description
    if (level < 20) {
        anomalyEffects.innerHTML = '<p>Hotel reality appears stable. No significant anomalies detected.</p>';
    } else if (level < 40) {
        anomalyEffects.innerHTML = '<p>Minor reality fluctuations detected. Some hotel features may behave unpredictably.</p>';
    } else if (level < 60) {
        anomalyEffects.innerHTML = '<p>Moderate reality distortions present. Floor layouts and room numbers may occasionally shift.</p>';
    } else if (level < 80) {
        anomalyEffects.innerHTML = '<p>Significant reality instability detected. Time flow inconsistencies and spatial anomalies reported.</p>';
    } else {
        anomalyEffects.innerHTML = '<p>Critical reality breakdown in progress. Quantum effects are manifesting throughout the hotel structure.</p>';
    }
    
    // Add quantum visual effects to UI based on anomaly level
    if (level >= 60 && this.quantumEffects) {
        const intensity = (level - 60) / 40; // 0-1 scale for 60-100% anomaly level
        this.quantumEffects.handleQuantumEvent({
            type: 'reality-fluctuation',
            intensity: intensity,
            duration: 3000
        });
    }
};

// Update supplementary procedure display
app.updateSupplementaryProcedureDisplay = function() {
    if (!this.supplementary) return;
    
    const procedureList = document.getElementById('supplementary-procedure-list');
    if (!procedureList) return;
    
    // Get unlocked procedures
    const unlockedProcedures = this.supplementary.state.unlockedProcedures || [];
    
    // Clear empty message if procedures are available
    if (unlockedProcedures.length > 0) {
        const emptyMessage = procedureList.querySelector('.empty-procedures');
        if (emptyMessage) {
            emptyMessage.remove();
        }
    }
    
    // Add each unlocked procedure
    unlockedProcedures.forEach(procedureId => {
        // Skip if already displayed
        if (procedureList.querySelector(`.procedure-item[data-id="${procedureId}"]`)) {
            return;
        }
        
        const procedure = this.supplementary.procedures[procedureId];
        if (!procedure) return;
        
        const procedureItem = document.createElement('div');
        procedureItem.className = 'procedure-item';
        procedureItem.dataset.id = procedureId;
        
        // Prepare effects display
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
                <span class="procedure-code">#${procedureId}</span>
                <h3>${procedure.title}</h3>
                <span class="anomaly-badge">Quantum Rule</span>
            </div>
            <div class="procedure-content">
                <p>${procedure.content}</p>
                ${effectsDisplay}
                <div class="procedure-actions" style="margin-top: 15px;">
                    <button class="action-button quantum-button activate-procedure" data-id="${procedureId}">
                        <i class="fas fa-atom"></i> Activate Procedure
                    </button>
                </div>
            </div>
        `;
        
        procedureList.appendChild(procedureItem);
        
        // Add event listener to activate button
        procedureItem.querySelector('.activate-procedure').addEventListener('click', () => {
            if (this.supplementary.activateQuantumProcedure) {
                this.supplementary.activateQuantumProcedure(procedureId);
            } else {
                // Fallback if supplementary module not available
                this.activateTestProcedure(procedureId);
            }
        });
    });
};

// Create test supplementary procedures when module isn't available
app.createTestSupplementaryProcedures = function() {
    const procedureList = document.getElementById('supplementary-procedure-list');
    if (!procedureList) return;
    
    // Clear existing content
    procedureList.innerHTML = '';
    
    // Add some example procedures
    const procedures = [
        {
            id: 'a1',
            title: 'Quantum Check-In Protocol',
            content: 'Guests simultaneously occupy all rooms between their assigned floor and the 17th "void floor". Reality collapses upon first door opening (Article 8 exceptions apply). Breakfast times multiply accordingly across quantum states.',
            effects: ['quantum-room-assignment', 'multiple-breakfast-times']
        },
        {
            id: 'a2',
            title: 'Olfactory Compliance System',
            content: 'Perfume designers must calibrate scents to match floor water schedules (§R006-§R009). 9th floor "dry bouquet" interacts violently with 14th floor "night musk". Violations manifest as temporary Area M inhabitants.',
            effects: ['perfume-water-interaction', 'area-m-manifestation']
        },
        {
            id: 'a31',
            title: 'Bathtub Hyperlink System',
            content: 'Filled bathtubs function as data portals when properly configured: Yellow rubber items enable access to historical stay records, Temperature set to exactly 37.2°C connects to Article 20 maintenance channels, Adding precisely 3g of candy (Article 3) reveals fragments of Night Elk documentation. Portal stability maintained by leather item proximity (minimum 4 pieces within 2 meters).',
            effects: ['bathtub-data-access', 'night-elk-document-reveal']
        }
    ];
    
    procedures.forEach(procedure => {
        const procedureItem = document.createElement('div');
        procedureItem.className = 'procedure-item';
        procedureItem.dataset.id = procedure.id;
        
        // Prepare effects display
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
            this.activateTestProcedure(procedure.id);
        });
    });
};

// Activate test procedure when supplementary module isn't available
app.activateTestProcedure = function(procedureId) {
    this.showNotification({
        type: 'success',
        title: 'Quantum Procedure Activated',
        message: `Supplementary procedure #${procedureId} is now active. Reality is adjusting.`
    });
    
    // Add visual effects to simulate reality distortion
    document.body.classList.add('reality-distortion');
    
    setTimeout(() => {
        document.body.classList.remove('reality-distortion');
    }, 3000);
    
    // Increase anomaly level
    this.state.gameState.anomalyLevel += 10;
    this.updateAnomalyLevel();
};

// Add this to app.js to enable registration functionality

// Initialize registration form
app.setupRegistrationForm = function() {
    // Add registration button to hotel-reservation section
    const reservationSection = document.getElementById('hotel-reservation');
    if (!reservationSection) return;
    
    // Check if button already exists
    if (document.getElementById('register-guest-btn')) return;
    
    // Add registration button
    const actionDiv = reservationSection.querySelector('.procedure-actions');
    if (actionDiv) {
        const registerButton = document.createElement('button');
        registerButton.id = 'register-guest-btn';
        registerButton.className = 'action-button';
        registerButton.innerHTML = '<i class="fas fa-user-plus"></i> Register as Guest';
        
        actionDiv.appendChild(registerButton);
        
        // Add event listener
        registerButton.addEventListener('click', () => {
            this.showRegistrationForm();
        });
    }
};

// Show registration form
app.showRegistrationForm = function() {
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.id = 'registration-modal';
    
    modal.innerHTML = `
        <div class="modal-content registration-content">
            <div class="modal-header">
                <h3>Guest Registration</h3>
                <span class="close-button">&times;</span>
            </div>
            <div class="registration-form">
                <div class="form-description">
                    <p>Welcome to Amman Hotel - Balance Beam Branch. Please complete this registration form to check in.</p>
                </div>
                
                <div class="form-fields">
                    <div class="form-field">
                        <label for="guest-name">Full Name</label>
                        <input type="text" id="guest-name" placeholder="Your name" value="Yucheng">
                    </div>
                    
                    <div class="form-field">
                        <label for="guest-occupation">Occupation</label>
                        <input type="text" id="guest-occupation" placeholder="Your occupation" value="Perfume Designer">
                    </div>
                    
                    <div class="form-field">
                        <label for="guest-stay-duration">Length of Stay</label>
                        <select id="guest-stay-duration">
                            <option value="1">1 day</option>
                            <option value="2">2 days</option>
                            <option value="3" selected>3 days</option>
                            <option value="7">1 week</option>
                            <option value="14">2 weeks</option>
                            <option value="30">1 month</option>
                        </select>
                    </div>
                    
                    <div class="form-field">
                        <label for="guest-floor-preference">Floor Preference</label>
                        <select id="guest-floor-preference">
                            <option value="">No preference</option>
                            <option value="3" selected>3rd Floor (Area A)</option>
                            <option value="5">5th Floor (Area B)</option>
                            <option value="7">7th Floor (Area MOD)</option>
                            <option value="9">9th Floor (Area L)</option>
                            <option value="12">12th Floor (Area R)</option>
                            <option value="15">15th Floor (Area D)</option>
                        </select>
                    </div>
                    
                    <div class="form-field full-width">
                        <label for="guest-special-requests">Special Requests</label>
                        <textarea id="guest-special-requests" rows="3" placeholder="Any special requests or requirements?"></textarea>
                    </div>
                    
                    <div class="form-field checkbox-field full-width">
                        <input type="checkbox" id="night-elk-program" checked>
                        <label for="night-elk-program">I wish to participate in the exclusive Night Elk Program (Value: ¥1,000,000)</label>
                    </div>
                </div>
                
                <div class="legal-notice">
                    <p>By registering, you agree to comply with all hotel rules and procedures, including standard and supplementary procedures that may be disclosed during your stay.</p>
                </div>
                
                <div class="registration-actions">
                    <button id="submit-registration" class="action-button">
                        <i class="fas fa-check-circle"></i> Complete Registration
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add styles for registration form
    const style = document.createElement('style');
    style.textContent = `
        .registration-content {
            max-width: 600px;
        }
        
        .registration-form {
            padding: 20px;
        }
        
        .form-description {
            margin-bottom: 20px;
        }
        
        .form-fields {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .form-field.full-width {
            grid-column: span 2;
        }
        
        .form-field label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        
        .checkbox-field {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .checkbox-field label {
            margin-bottom: 0;
        }
        
        .checkbox-field input[type="checkbox"] {
            width: 20px;
            height: 20px;
        }
        
        .form-field input[type="text"],
        .form-field select,
        .form-field textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: var(--border-radius);
            font-family: inherit;
        }
        
        .legal-notice {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: var(--border-radius);
            font-size: 0.9rem;
            color: var(--light-text);
            margin-bottom: 20px;
        }
        
        .registration-actions {
            display: flex;
            justify-content: flex-end;
        }
    `;
    document.head.appendChild(style);
    
    // Set up close button
    modal.querySelector('.close-button').addEventListener('click', () => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    });
    
    // Set up submit button
    modal.querySelector('#submit-registration').addEventListener('click', () => {
        this.submitRegistration();
    });
};

// Submit registration
app.submitRegistration = function() {
    // Get form values
    const name = document.getElementById('guest-name').value;
    const occupation = document.getElementById('guest-occupation').value;
    const stayDuration = document.getElementById('guest-stay-duration').value;
    const floorPreference = document.getElementById('guest-floor-preference').value;
    const specialRequests = document.getElementById('guest-special-requests').value;
    const joinNightElk = document.getElementById('night-elk-program').checked;
    
    // Validate form
    if (!name || !occupation) {
        this.showNotification({
            type: 'error',
            title: 'Form Incomplete',
            message: 'Please fill in your name and occupation before submitting.'
        });
        return;
    }
    
    // Process registration
    this.showNotification({
        type: 'info',
        title: 'Processing Registration',
        message: 'Your registration is being processed...'
    });
    
    // Close modal
    const modal = document.getElementById('registration-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
    
    // Update player information
    this.state.player.name = name;
    this.state.player.specialSkill = occupation.toLowerCase().includes('perfume') ? 'perfume-designer' : occupation;
    
    // Generate room number based on preference
    let roomFloor = floorPreference || '03'; // Default to 3rd floor if no preference
    const roomNumber = Math.floor(Math.random() * 25) + 1;
    const room = `${roomFloor.padStart(2, '0')}${roomNumber.toString().padStart(2, '0')}`;
    
    this.state.player.room = room;
    
    // Update avatar display
    const guestName = document.getElementById('guest-name');
    if (guestName) {
        guestName.textContent = name;
    }
    
    // Set Night Elk status
    if (joinNightElk) {
        this.state.player.nightElkStatus = 'active';
    } else {
        this.state.player.nightElkStatus = 'inactive';
    }
    
    // Schedule completion notification
    setTimeout(() => {
        this.showRegistrationComplete(room, joinNightElk);
    }, 2000);
};

// Show registration complete confirmation
app.showRegistrationComplete = function(room, nightElkActive) {
    this.showNotification({
        type: 'success',
        title: 'Registration Complete',
        message: `Welcome to Amman Hotel! You have been assigned room ${room}.`
    });
    
    // If joining Night Elk, show additional notification
    if (nightElkActive) {
        setTimeout(() => {
            this.showNotification({
                type: 'info',
                title: 'Night Elk Program',
                message: 'You have been enrolled in the exclusive Night Elk Program worth ¥1,000,000.'
            });
            
            // Update narrative if available
            if (this.narrative && this.narrative.state) {
                this.narrative.state.plotFlags.discoveredNightElk = true;
            }
            
            // Add task
            const nightElkTask = {
                id: 'task-night-elk',
                name: 'Explore the Night Elk Program',
                completed: false
            };
            
            if (!this.state.player.taskList.some(t => t.id === 'task-night-elk')) {
                this.state.player.taskList.push(nightElkTask);
                this.updateTaskList();
            }
        }, 2000);
    }
    
    // Mark check-in complete
    const checkInTask = this.state.player.taskList.find(t => t.id === 'task-1');
    if (checkInTask && !checkInTask.completed) {
        this.completeTask('task-1');
    }
    
    // Update room simulator if available
    if (this.room) {
        this.room.state.roomNumber = room;
    }
};

// Add call to initialize registration in app.init
const originalInit = app.init;
app.init = function() {
    originalInit.call(this);
    this.setupRegistrationForm();
};