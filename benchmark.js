// benchmark.js

class BenchmarkOverlay {
    constructor(maxHistory = 300) {
        this.lastTime = performance.now();
        this.fpsHistory = [];
        this.renderTimes = [];
        this.maxHistory = maxHistory;

        // Default configurations
        this.position = "Top-Right";
        this.textColor = "red";
        this.bgColor = "rgba(0,0,0,0.5)";
    }

    update(renderTime) {
        const now = performance.now();
        const deltaTime = now - this.lastTime;

        this.fpsHistory.push(1000 / deltaTime);
        this.renderTimes.push(renderTime);

        if (this.fpsHistory.length > this.maxHistory) {
            this.fpsHistory.shift();
        }

        if (this.renderTimes.length > this.maxHistory) {
            this.renderTimes.shift();
        }

        this.lastTime = now;
    }

    getStats() {
        const avg = arr =>
            arr.length
                ? arr.reduce((a, b) => a + b, 0) / arr.length
                : 0;

        return {
            liveFPS: this.fpsHistory.at(-1) ?? 0,
            avgFPS: avg(this.fpsHistory),
            minFPS: this.fpsHistory.length ? Math.min(...this.fpsHistory) : 0,
            maxFPS: this.fpsHistory.length ? Math.max(...this.fpsHistory) : 0,

            liveRender: this.renderTimes.at(-1) ?? 0,
            avgRender: avg(this.renderTimes),
            minRender: this.renderTimes.length ? Math.min(...this.renderTimes) : 0,
            maxRender: this.renderTimes.length ? Math.max(...this.renderTimes) : 0
        };
    }

    padNum(num, decimals, totalWidth) {
        return num.toFixed(decimals).padStart(totalWidth, ' ');
    }

    draw(ctx) {
        const stats = this.getStats();

        const padding = 10;
        const lineHeight = 18;

        const liveFPS = this.padNum(stats.liveFPS, 1, 5);
        const avgFPS  = this.padNum(stats.avgFPS, 1, 5);
        const minFPS  = this.padNum(stats.minFPS, 1, 5);
        const maxFPS  = this.padNum(stats.maxFPS, 1, 5);

        const liveRender = this.padNum(stats.liveRender, 2, 6);
        const avgRender  = this.padNum(stats.avgRender, 2, 6);
        const minRender  = this.padNum(stats.minRender, 2, 6);
        const maxRender  = this.padNum(stats.maxRender, 2, 6);

        const fpsText =
            `FPS: live ${liveFPS} | avg ${avgFPS} | min ${minFPS} | max ${maxFPS}`;

        const renderText =
            `Render ms: live ${liveRender} | avg ${avgRender} | min ${minRender} | max ${maxRender}`;

        ctx.font = "14px monospace";

        const textWidth = Math.max(
            ctx.measureText(fpsText).width,
            ctx.measureText(renderText).width
        );

        const boxWidth = textWidth + padding * 2;
        const boxHeight = lineHeight * 2 + 8;

        // Dynamic Position Calculations
        let x = padding;
        let y = padding;

        if (this.position.includes("Right")) {
            x = ctx.canvas.width - boxWidth - padding;
        }
        if (this.position.includes("Bottom")) {
            y = ctx.canvas.height - boxHeight - padding;
        }

        // Draw Background if not invisible
        if (this.bgColor !== "transparent") {
            ctx.fillStyle = this.bgColor;
            ctx.fillRect(x, y, boxWidth, boxHeight);
        }

        // Draw Text using configured color
        ctx.fillStyle = this.textColor;
        ctx.fillText(fpsText, x + padding, y + lineHeight);
        ctx.fillText(renderText, x + padding, y + lineHeight * 2);
    }

    reset() {
        this.lastTime = performance.now();
        this.fpsHistory.length = 0;
        this.renderTimes.length = 0;
    }
}

window.BenchmarkOverlay = BenchmarkOverlay;