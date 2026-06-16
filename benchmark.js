// benchmark.js

class BenchmarkOverlay {
    constructor(maxHistory = 300) {
        this.lastTime = performance.now();
        this.fpsHistory = [];
        this.renderTimes = [];
        this.maxHistory = maxHistory;
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

    // Helper to enforce consistent string length
    padNum(num, decimals, totalWidth) {
        return num.toFixed(decimals).padStart(totalWidth, ' ');
    }

    draw(ctx) {
        const stats = this.getStats();

        const padding = 10;
        const lineHeight = 18;

        // 1. Format numbers with fixed padding lengths
        const liveFPS = this.padNum(stats.liveFPS, 1, 5);
        const avgFPS  = this.padNum(stats.avgFPS, 1, 5);
        const minFPS  = this.padNum(stats.minFPS, 1, 5);
        const maxFPS  = this.padNum(stats.maxFPS, 1, 5);

        const liveRender = this.padNum(stats.liveRender, 2, 6);
        const avgRender  = this.padNum(stats.avgRender, 2, 6);
        const minRender  = this.padNum(stats.minRender, 2, 6);
        const maxRender  = this.padNum(stats.maxRender, 2, 6);

        // 2. Build the strings using the padded values
        const fpsText =
            `FPS: live ${liveFPS} | avg ${avgFPS} | min ${minFPS} | max ${maxFPS}`;

        const renderText =
            `Render ms: live ${liveRender} | avg ${avgRender} | min ${minRender} | max ${maxRender}`;

        // 3. Measure text AFTER formatting so the box boundaries never change
        ctx.font = "14px monospace";

        const textWidth = Math.max(
            ctx.measureText(fpsText).width,
            ctx.measureText(renderText).width
        );

        const boxWidth = textWidth + padding * 2;
        const boxHeight = lineHeight * 2 + 8;

        const x = ctx.canvas.width - boxWidth - padding;
        const y = padding;

        // background
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(x, y, boxWidth, boxHeight);

        ctx.fillStyle = "red";

        // text
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