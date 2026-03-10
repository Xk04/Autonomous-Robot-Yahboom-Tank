class Informations {
    constructor() {
        this.map = [document.getElementById("minimap-info"), false];
        this.motors = [document.getElementById("motors-info"), false];
        this.robotConnection = [document.getElementById("connection"), false];
        this.imageFlow = [document.getElementById("image-flow"), false];
        this.detectionFlow = [document.getElementById("detection-flow"), false];
        this.proximityFlow = [document.getElementById("proximity-flow"), false];
        this.panel = [document.getElementById("panel"), false];
    }

    // GETTERS
    getState() {
        return this[1];
    }

    // SETTERS
    setState(info, newState) {
        let state = newState;
        if (state) {
            info[1] = newState;
            info[0].textContent = state;
            info[0].style.color = "var(--success-color)";
        } else {
            info[1] = newState;
            info[0].textContent = state;
            info[0].style.color = "var(--danger-color)";
        }
    }
}
