// Quantum Effects - Handles visual and environmental effects for supplementary procedures
const quantumEffects = {
    // Visual effects for quantum phenomena
    visualEffects: {
        'quantum-flicker': {
            create(element, options = {}) {
                const duration = options.duration || 3000;
                const intensity = options.intensity || 0.5;
                
                // Save original styles for restoration
                const originalStyles = {
                    opacity: element.style.opacity || '1',
                    filter: element.style.filter || 'none',
                    transform: element.style.transform || 'none'
                };
                
                // Apply flickering animation
                element.style.animation = `quantumFlicker ${intensity * 0.5 + 0.2}s infinite`;
                
                // Add keyframe animation if not already added
                if (!document.getElementById('quantum-keyframes')) {
                    const style = document.createElement('style');
                    style.id = 'quantum-keyframes';
                    style.textContent = `
                        @keyframes quantumFlicker {
                            0% { opacity: 1; transform: translateX(0); filter: hue-rotate(0deg); }
                            10% { opacity: ${1 - intensity * 0.3}; transform: translateX(-${intensity * 2}px); filter: hue-rotate(${intensity * 90}deg); }
                            20% { opacity: 1; transform: translateX(${intensity * 2}px); filter: hue-rotate(0deg); }
                            30% { opacity: ${1 - intensity * 0.5}; transform: translateX(0); filter: hue-rotate(${intensity * 180}deg); }
                            40% { opacity: 1; transform: translateX(${intensity * 1}px); filter: hue-rotate(0deg); }
                            60% { opacity: ${1 - intensity * 0.4}; transform: translateX(-${intensity * 1}px); filter: hue-rotate(${intensity * 45}deg); }
                            80% { opacity: 1; transform: translateX(0); filter: hue-rotate(0deg); }
                            100% { opacity: 1; transform: translateX(0); filter: hue-rotate(0deg); }
                        }
                    `;
                    document.head.appendChild(style);
                }
                
                // Remove effect after duration
                if (duration !== Infinity) {
                    setTimeout(() => {
                        this.remove(element, originalStyles);
                    }, duration);
                }
                
                return {
                    element,
                    originalStyles,
                    remove: () => this.remove(element, originalStyles)
                };
            },
            
            remove(element, originalStyles) {
                if (element) {
                    element.style.animation = '';
                    element.style.opacity = originalStyles.opacity;
                    element.style.filter = originalStyles.filter;
                    element.style.transform = originalStyles.transform;
                }
            }
        },
        
        'reality-glitch': {
            create(element, options = {}) {
                const duration = options.duration || 5000;
                const intensity = options.intensity || 0.5;
                
                // Save original content and styles
                const originalContent = element.innerHTML;
                const originalStyles = {
                    position: element.style.position || 'static',
                    zIndex: element.style.zIndex || 'auto',
                    overflow: element.style.overflow || 'visible'
                };
                
                // Set required styles for effect
                element.style.position = 'relative';
                element.style.zIndex = '1';
                element.style.overflow = 'hidden';
                
                // Create glitch layers
                const layers = 3;
                for (let i = 0; i < layers; i++) {
                    const layer = document.createElement('div');
                    layer.className = 'reality-glitch-layer';
                    layer.innerHTML = originalContent;
                    
                    layer.style.cssText = `
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        pointer-events: none;
                        z-index: ${i - 10};
                        opacity: ${0.3 * intensity};
                        animation: realityGlitchLayer${i} ${0.5 + i * 0.2}s infinite alternate;
                        animation-delay: ${i * 0.1}s;
                        mix-blend-mode: ${i % 2 === 0 ? 'difference' : 'exclusion'};
                    `;
                    
                    element.appendChild(layer);
                }
                
                // Add keyframe animations if not already added
                if (!document.getElementById('reality-glitch-keyframes')) {
                    const style = document.createElement('style');
                    style.id = 'reality-glitch-keyframes';
                    
                    let keyframes = '';
                    for (let i = 0; i < layers; i++) {
                        keyframes += `
                            @keyframes realityGlitchLayer${i} {
                                0% { transform: translate(0, 0); filter: hue-rotate(0deg); }
                                33% { transform: translate(${(i + 1) * intensity * 5}px, ${intensity * -3}px); filter: hue-rotate(${(i + 1) * 30}deg); }
                                66% { transform: translate(${(i + 2) * intensity * -4}px, ${intensity * 2}px); filter: hue-rotate(${(i + 2) * -20}deg); }
                                100% { transform: translate(${(i + 1.5) * intensity * 3}px, ${intensity * -1}px); filter: hue-rotate(${(i + 1.5) * 15}deg); }
                            }
                        `;
                    }
                    
                    style.textContent = keyframes;
                    document.head.appendChild(style);
                }
                
                // Create occasional text scramble effect
                const scrambleInterval = setInterval(() => {
                    if (Math.random() < intensity * 0.3) {
                        const originalText = element.innerText;
                        this.scrambleText(element, intensity);
                        
                        // Restore after brief period
                        setTimeout(() => {
                            element.innerHTML = originalContent;
                        }, 200 + Math.random() * 300);
                    }
                }, 1000 + Math.random() * 2000);
                
                // Remove effect after duration
                let cleanup;
                if (duration !== Infinity) {
                    cleanup = setTimeout(() => {
                        this.remove(element, originalContent, originalStyles);
                        clearInterval(scrambleInterval);
                    }, duration);
                }
                
                return {
                    element,
                    originalContent,
                    originalStyles,
                    cleanup,
                    scrambleInterval,
                    remove: () => {
                        this.remove(element, originalContent, originalStyles);
                        clearInterval(scrambleInterval);
                        if (cleanup) clearTimeout(cleanup);
                    }
                };
            },
            
            scrambleText(element, intensity) {
                const text = element.innerText;
                let scrambled = '';
                
                for (let i = 0; i < text.length; i++) {
                    if (Math.random() < intensity * 0.5) {
                        // Replace character with random unicode character
                        const randomChar = String.fromCharCode(0x30A0 + Math.random() * 0x50);
                        scrambled += randomChar;
                    } else {
                        scrambled += text[i];
                    }
                }
                
                element.innerText = scrambled;
            },
            
            remove(element, originalContent, originalStyles) {
                if (element) {
                    // Remove glitch layers
                    const layers = element.querySelectorAll('.reality-glitch-layer');
                    layers.forEach(layer => layer.remove());
                    
                    // Restore original content and styles
                    element.innerHTML = originalContent;
                    element.style.position = originalStyles.position;
                    element.style.zIndex = originalStyles.zIndex;
                    element.style.overflow = originalStyles.overflow;
                }
            }
        },
        
        'bubble-manifestation': {
            create(element, options = {}) {
                const duration = options.duration || 4000;
                const bubbleCount = options.count || 10;
                const color = options.color || 'var(--accent-color)';
                
                // Save original styles
                const originalStyles = {
                    position: element.style.position || 'static',
                    overflow: element.style.overflow || 'visible'
                };
                
                // Set required styles
                element.style.position = 'relative';
                element.style.overflow = 'hidden';
                
                // Create bubbles
                for (let i = 0; i < bubbleCount; i++) {
                    const bubble = document.createElement('div');
                    bubble.className = 'quantum-bubble';
                    
                    const size = 10 + Math.random() * 40;
                    const startX = Math.random() * 100;
                    const startDelay = Math.random() * 2;
                    
                    bubble.style.cssText = `
                        position: absolute;
                        bottom: -${size}px;
                        left: ${startX}%;
                        width: ${size}px;
                        height: ${size}px;
                        border-radius: 50%;
                        background-color: ${color};
                        opacity: 0.6;
                        pointer-events: none;
                        animation: bubbleRise 3s ease-in forwards;
                        animation-delay: ${startDelay}s;
                    `;
                    
                    element.appendChild(bubble);
                }
                
                // Add keyframe animation if not already added
                if (!document.getElementById('bubble-keyframes')) {
                    const style = document.createElement('style');
                    style.id = 'bubble-keyframes';
                    style.textContent = `
                        @keyframes bubbleRise {
                            0% { transform: translateY(0) translateX(0); opacity: 0.6; }
                            10% { opacity: 0.7; }
                            50% { transform: translateY(-100px) translateX(${Math.random() > 0.5 ? 20 : -20}px); opacity: 0.5; }
                            100% { transform: translateY(-${element.offsetHeight}px) translateX(${Math.random() > 0.5 ? 50 : -50}px); opacity: 0; }
                        }
                    `;
                    document.head.appendChild(style);
                }
                
                // Remove effect after duration
                if (duration !== Infinity) {
                    setTimeout(() => {
                        this.remove(element, originalStyles);
                    }, duration);
                }
                
                return {
                    element,
                    originalStyles,
                    remove: () => this.remove(element, originalStyles)
                };
            },
            
            remove(element, originalStyles) {
                if (element) {
                    // Remove bubbles
                    const bubbles = element.querySelectorAll('.quantum-bubble');
                    bubbles.forEach(bubble => bubble.remove());
                    
                    // Restore original styles
                    element.style.position = originalStyles.position;
                    element.style.overflow = originalStyles.overflow;
                }
            }
        }
    },
    
    // Environmental effects that alter the physical properties of rooms/spaces
    environmentalEffects: {
        'room-shift': {
            apply(options = {}) {
                const intensity = options.intensity || 0.5;
                const duration = options.duration || 60000; // 1 minute by default
                
                // Apply subtle shifts to room description, layout, or content
                const contentElements = document.querySelectorAll('.content-section.active .procedure-content, .welcome-message, .room-description');
                
                const contentShifts = [];
                contentElements.forEach(element => {
                    // Apply reality glitch effect to content
                    contentShifts.push(
                        this.visualEffects['reality-glitch'].create(element, {
                            duration: duration,
                            intensity: intensity * 0.3
                        })
                    );
                });
                
                // Apply subtle shifts to UI elements
                const uiElements = document.querySelectorAll('.header, .sidebar, .content-area');
                
                const uiShifts = [];
                uiElements.forEach(element => {
                    // Apply quantum flicker effect to UI
                    uiShifts.push(
                        this.visualEffects['quantum-flicker'].create(element, {
                            duration: duration,
                            intensity: intensity * 0.2
                        })
                    );
                });
                
                // Show notification about room shift
                app.showNotification({
                    type: 'warning',
                    title: 'Reality Shift',
                    message: 'The room\'s physical properties are experiencing quantum fluctuations.'
                });
                
                // Return cleanup function
                return () => {
                    contentShifts.forEach(shift => shift.remove());
                    uiShifts.forEach(shift => shift.remove());
                };
            }
        },
        
        'consensus-fluctuation': {
            apply(options = {}) {
                const intensity = options.intensity || 0.5;
                const duration = options.duration || 120000; // 2 minutes by default
                
                // Elements that may appear or disappear based on consensus
                const fluctuatingElements = [
                    { selector: '.content-section.active .procedure-item:nth-child(odd)', probability: 0.3 },
                    { selector: '.elevator-buttons .floor-button', probability: 0.2 },
                    { selector: '.sidebar .task', probability: 0.4 }
                ];
                
                const hiddenElements = [];
                const originalVisibilities = new Map();
                
                // Function to randomly hide/show elements based on consensus thresholds
                const fluctuateConsensus = () => {
                    fluctuatingElements.forEach(item => {
                        const elements = document.querySelectorAll(item.selector);
                        
                        elements.forEach(element => {
                            // Store original visibility if not already stored
                            if (!originalVisibilities.has(element)) {
                                originalVisibilities.set(element, {
                                    display: element.style.display || 'block',
                                    opacity: element.style.opacity || '1'
                                });
                            }
                            
                            // Randomly hide elements based on probability
                            if (Math.random() < item.probability * intensity) {
                                element.style.opacity = '0.3';
                                element.style.filter = 'blur(2px)';
                                hiddenElements.push(element);
                                
                                // Apply glitch effect before hiding
                                this.visualEffects['quantum-flicker'].create(element, {
                                    duration: 500,
                                    intensity: 0.8
                                });
                            } else if (hiddenElements.includes(element)) {
                                // Restore element if it was hidden
                                const original = originalVisibilities.get(element);
                                element.style.opacity = original.opacity;
                                element.style.filter = 'none';
                                
                                // Remove from hidden elements
                                const index = hiddenElements.indexOf(element);
                                if (index !== -1) hiddenElements.splice(index, 1);
                                
                                // Apply glitch effect when showing again
                                this.visualEffects['quantum-flicker'].create(element, {
                                    duration: 500,
                                    intensity: 0.8
                                });
                            }
                        });
                    });
                };
                
                // Initial fluctuation
                fluctuateConsensus();
                
                // Continue fluctuations periodically
                const interval = setInterval(fluctuateConsensus, 10000 + Math.random() * 10000);
                
                // Show notification
                app.showNotification({
                    type: 'warning',
                    title: 'Consensus Fluctuation',
                    message: 'Hotel features are phasing in and out of existence based on guest recognition.'
                });
                
                // Set up cleanup after duration
                const cleanup = setTimeout(() => {
                    clearInterval(interval);
                    
                    // Restore all elements
                    originalVisibilities.forEach((style, element) => {
                        element.style.display = style.display;
                        element.style.opacity = style.opacity;
                        element.style.filter = 'none';
                    });
                }, duration);
                
                // Return cleanup function for early termination
                return () => {
                    clearInterval(interval);
                    clearTimeout(cleanup);
                    
                    // Restore all elements
                    originalVisibilities.forEach((style, element) => {
                        element.style.display = style.display;
                        element.style.opacity = style.opacity;
                        element.style.filter = 'none';
                    });
                };
            }
        },
        
        'temporal-anomaly': {
            apply(options = {}) {
                const intensity = options.intensity || 0.5;
                const duration = options.duration || 180000; // 3 minutes by default
                
                // Manipulate time display
                const timeDisplay = document.getElementById('current-time');
                const originalUpdateTime = app.updateTimeDisplay;
                
                // Override time update method
                app.updateTimeDisplay = () => {
                    const now = app.state.hotel.currentTime;
                    
                    // Apply random time shifts based on intensity
                    const timeShift = Math.floor((Math.random() - 0.5) * intensity * 60); // +/- 30 minutes at max
                    const shiftedTime = new Date(now.getTime() + timeShift * 60000);
                    
                    const hours = shiftedTime.getHours().toString().padStart(2, '0');
                    const minutes = shiftedTime.getMinutes().toString().padStart(2, '0');
                    
                    timeDisplay.textContent = `${hours}:${minutes}`;
                    
                    // Apply visual effect to time display
                    if (Math.random() < intensity * 0.3) {
                        this.visualEffects['quantum-flicker'].create(timeDisplay, {
                            duration: 500,
                            intensity: 0.5
                        });
                    }
                };
                
                // Track original game time scale
                const originalTimeScale = app.state.gameState.timeScale;
                
                // Apply inconsistent time flow
                const adjustTimeFlow = () => {
                    // Randomly adjust time scale
                    const newScale = originalTimeScale * (1 + (Math.random() - 0.5) * intensity * 2);
                    app.state.gameState.timeScale = newScale;
                    
                    // Sometimes make time flow backwards
                    if (Math.random() < intensity * 0.2) {
                        app.state.gameState.timeScale = -originalTimeScale * Math.random() * 0.5;
                        
                        // Show notification for backwards time
                        app.showNotification({
                            type: 'error',
                            title: 'Time Reversal',
                            message: 'Time appears to be flowing backwards momentarily.'
                        });
                        
                        // Apply heavy visual effects during time reversal
                        document.querySelectorAll('.content-section.active, .sidebar').forEach(element => {
                            this.visualEffects['reality-glitch'].create(element, {
                                duration: 3000,
                                intensity: 0.8
                            });
                        });
                        
                        // Reset to normal after a short period
                        setTimeout(() => {
                            app.state.gameState.timeScale = originalTimeScale;
                        }, 3000);
                    }
                };
                
                // Adjust time flow at random intervals
                const interval = setInterval(adjustTimeFlow, 15000 + Math.random() * 15000);
                
                // Show notification
                app.showNotification({
                    type: 'warning',
                    title: 'Temporal Anomaly',
                    message: 'Time flow has become unstable. Hotel clocks may show inconsistent times.'
                });
                
                // Set up cleanup after duration
                const cleanup = setTimeout(() => {
                    clearInterval(interval);
                    app.updateTimeDisplay = originalUpdateTime;
                    app.state.gameState.timeScale = originalTimeScale;
                    app.updateTimeDisplay(); // Restore correct time display
                }, duration);
                
                // Return cleanup function
                return () => {
                    clearInterval(interval);
                    clearTimeout(cleanup);
                    app.updateTimeDisplay = originalUpdateTime;
                    app.state.gameState.timeScale = originalTimeScale;
                    app.updateTimeDisplay(); // Restore correct time display
                };
            }
        }
    },
    
    // Apply a visual effect to an element
    applyVisualEffect(effectName, element, options = {}) {
        if (this.visualEffects[effectName]) {
            return this.visualEffects[effectName].create.call(this, element, options);
        }
        return null;
    },
    
    // Apply an environmental effect to the current space
    applyEnvironmentalEffect(effectName, options = {}) {
        if (this.environmentalEffects[effectName]) {
            return this.environmentalEffects[effectName].apply.call(this, options);
        }
        return null;
    },
    
    // Handle quantum events triggered by supplementary procedures
    handleQuantumEvent(event) {
        switch (event.type) {
            case 'reality-fluctuation':
                // Apply room shift and consensus fluctuation effects
                const cleanup1 = this.applyEnvironmentalEffect('room-shift', {
                    intensity: event.intensity || 0.5,
                    duration: event.duration || 60000
                });
                
                const cleanup2 = this.applyEnvironmentalEffect('consensus-fluctuation', {
                    intensity: event.intensity || 0.5,
                    duration: event.duration || 60000
                });
                
                return () => {
                    cleanup1();
                    cleanup2();
                };
                
            case 'temporal-distortion':
                // Apply temporal anomaly effect
                return this.applyEnvironmentalEffect('temporal-anomaly', {
                    intensity: event.intensity || 0.5,
                    duration: event.duration || 180000
                });
                
            case 'quantum-manifestation':
                // Apply manifestation effects to specific elements
                const manifestationEffects = [];
                
                document.querySelectorAll('.content-section.active').forEach(element => {
                    manifestationEffects.push(
                        this.applyVisualEffect('bubble-manifestation', element, {
                            duration: event.duration || 5000,
                            count: 20,
                            color: event.color || 'var(--accent-color)'
                        })
                    );
                });
                
                return () => {
                    manifestationEffects.forEach(effect => effect.remove());
                };
        }
        
        return null;
    },
    
    // Initialize and connect to the main app
    init() {
        if (typeof app !== 'undefined') {
            app.quantumEffects = this;
            
            // Listen for quantum events from supplementary procedures
            if (app.supplementary) {
                const originalActivate = app.supplementary.activateQuantumProcedure;
                
                app.supplementary.activateQuantumProcedure = (procedureId) => {
                    const result = originalActivate.call(app.supplementary, procedureId);
                    
                    // If activation was successful, trigger quantum visual effects
                    if (result) {
                        // Determine effect type based on procedure
                        let eventType, intensity;
                        
                        switch (procedureId) {
                            case 'a1': // Quantum Check-In Protocol
                                eventType = 'quantum-manifestation';
                                intensity = 0.7;
                                break;
                                
                            case 'a50': // Reality Consensus Threshold
                                eventType = 'reality-fluctuation';
                                intensity = 0.6;
                                break;
                                
                            default:
                                eventType = 'temporal-distortion';
                                intensity = 0.4;
                        }
                        
                        // Apply quantum effect
                        this.handleQuantumEvent({
                            type: eventType,
                            intensity: intensity,
                            duration: 10000, // 10 seconds for activation effect
                            source: procedureId
                        });
                    }
                    
                    return result;
                };
            }
        }
    }
};

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    quantumEffects.init();
});