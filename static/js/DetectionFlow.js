class DetectionFlow {
    constructor() {
        this.emptyState = document.querySelector(".detection p");
        this.history = document.getElementById('history');
        this.historyList = [];
        this.initHistory();
    }

    initHistory() {
        if (this.history.children.length > 0) {
            this.emptyState.style.display = "none";
        } else {
            this.history.style.display = "none";
        }
    }

    addDetection(detection) {
        if (!detection || !detection.classes) return;

        this.emptyState.style.display = 'none';
        this.history.style.display = '';

        const timestamp = new Date().toLocaleTimeString();
        const classesText = Array.isArray(detection.classes) ? detection.classes.join(', ') : String(detection.classes);

        const li = document.createElement('li');
        li.textContent = `${timestamp} — ${detection.num || 0} detections: [${classesText}]`;
        this.history.insertBefore(li, this.history.firstChild);
        if (this.history.children.length > 20) {
            this.history.removeChild(this.history.lastChild);
        }
    }
}