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