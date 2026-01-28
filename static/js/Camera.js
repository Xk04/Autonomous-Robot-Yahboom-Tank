class CameraFeed {
    constructor() {
        this.serverUrl = window.location.origin;
        this.videoStreamUrl = `${this.serverUrl}/camera/video`;
        console.log(this.videoStreamUrl);
        this.isStreaming = false;
        this.cameraStatusIndicator = document.getElementById("camera-status-indicator");
        this.cameraLabel = document.getElementById("camera-label");
        this.cameraFeed = document.getElementById("camera-feed");
        this.imageFlow = document.getElementById("image-flow");
        
        this.lastFrameTime = null;
        this.watchdogTimer = null;
        
    }
    
    setupEventListeners() {
        this.cameraFeed.addEventListener('load', () => {
            this.onFrameReceived();
        });
        
        this.cameraFeed.addEventListener('error', () => {
            this.onDisconnected();
        });
    }
    
    onFrameReceived() {
        this.lastFrameTime = Date.now();
        
        if (!this.isStreaming) {
            this.onConnected();
        }
        
        this.resetWatchdog();
    }
    
    resetWatchdog() {
        if (this.watchdogTimer) {
            clearTimeout(this.watchdogTimer);
        }
        
        // Si pas de frame pendant 3 secondes = déconnectée
        this.watchdogTimer = setTimeout(() => {
            this.onDisconnected();
        }, 3000);
    }
    
    start() {
        this.setupEventListeners();
        if (!this.isStreaming) {
            this.cameraFeed.src = this.videoStreamUrl;
            this.cameraLabel.textContent = "Connection...";
            this.cameraStatusIndicator.style.background = "var(--warning-color)";
        }
    }
    
    stop() {
        if (this.isStreaming) {
            this.cameraFeed.src = "";
            this.onDisconnected();
        }
        
        if (this.watchdogTimer) {
            clearTimeout(this.watchdogTimer);
        }
    }
    
    onConnected() {
        this.isStreaming = true;
        this.cameraLabel.textContent = "Connected";
        this.cameraStatusIndicator.style.background = "var(--success-color)";
        
        document.dispatchEvent(new CustomEvent('cameraConnected'));
    }
    
    onDisconnected() {
        this.isStreaming = false;
        this.cameraLabel.textContent = "Déconnectée";
        this.cameraStatusIndicator.style.background = "var(--danger-color)";
        this.cameraFeed.content = null;
        document.dispatchEvent(new CustomEvent('cameraDisconnected'));
    }
    
    getStatus() {
        return {
            isStreaming: this.isStreaming,
            lastFrameTime: this.lastFrameTime,
            timeSinceLastFrame: this.lastFrameTime ? Date.now() - this.lastFrameTime : null
        };
    }
}
