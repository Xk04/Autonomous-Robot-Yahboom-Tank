// Gestion de la minimap avec canvas
class Minimap {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.scale = 30; // Pixels par mètre
        this.obstacles = [];
    }
    
    // Dessiner la minimap
    draw() {
        // Effacer le canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Dessiner la grille
        this.drawGrid();
        
        // Dessiner les obstacles
        this.drawObstacles();
        
        // Dessiner le robot au centre
        this.drawRobot();
        return true;
    }
    
    // Dessiner la grille de fond
    drawGrid() {
        this.ctx.strokeStyle = '#334155';
        this.ctx.lineWidth = 1;
        
        const gridSize = 1 * this.scale; // Grille de 1m
        
        for (let x = 0; x < this.canvas.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y < this.canvas.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
        
        // Axes centraux plus épais
        this.ctx.strokeStyle = '#475569';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, 0);
        this.ctx.lineTo(this.centerX, this.canvas.height);
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.centerY);
        this.ctx.lineTo(this.canvas.width, this.centerY);
        this.ctx.stroke();
    }
    
    // Dessiner le robot
    drawRobot() {
        this.ctx.fillStyle = '#2563eb';
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, 15, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Direction du robot (flèche)
        this.ctx.strokeStyle = '#f1f5f9';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, this.centerY);
        this.ctx.lineTo(this.centerX, this.centerY - 20);
        this.ctx.stroke();
    }
    
    // Dessiner les obstacles détectés
    drawObstacles() {
        this.obstacles.forEach(obstacle => {
            const x = this.centerX + (obstacle.x * this.scale);
            const y = this.centerY - (obstacle.y * this.scale); // Inverser Y
            
            // Calculer l'opacité en fonction de la distance
            const distance = Math.sqrt(obstacle.x ** 2 + obstacle.y ** 2);
            const opacity = Math.max(0.3, 1 - (distance / 5));
            
            this.ctx.fillStyle = `rgba(239, 68, 68, ${opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 8, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Ligne vers l'obstacle
            this.ctx.strokeStyle = `rgba(239, 68, 68, ${opacity * 0.5})`;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX, this.centerY);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        });
    }
    
    // Mettre à jour les obstacles
    // Format attendu: [{x: float, y: float, distance: float}, ...]
    updateObstacles(obstaclesData) {
        this.obstacles = obstaclesData || [];
        this.draw();
    }
    
    // Convertir des données de capteur polaires en cartésiennes
    // Format entrée: [{angle: degrees, distance: meters}, ...]
    polarToCartesian(sensorData) {
        return sensorData.map(point => {
            const angleRad = (point.angle * Math.PI) / 180;
            return {
                x: point.distance * Math.sin(angleRad),
                y: point.distance * Math.cos(angleRad),
                distance: point.distance
            };
        });
    }
}

// Instance globale
let minimap = null;
