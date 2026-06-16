```markdown
# Realistic Starfield — Lively Wallpaper (v3)

An interactive, performance-optimized HTML5 Canvas space simulation designed as a dynamic live wallpaper for **Lively Wallpaper**. Version 3 builds upon previous iterations by introducing comprehensive visualization and cosmetic customizations for the performance benchmark overlay.

Developed by **Raspberrykitty1**.

## 🚀 Features

* **Parallax Star Layers:** Three distinct layers of stars moving at independent depths and speeds to create an immersive 3D parallax effect.
* **Advanced Live UI Properties:** Fully integrated with Lively Wallpaper's configuration engine, giving you deep control over both simulation density and diagnostic overlay cosmetics.
* **Customizable Performance Benchmarking:** Built-in performance tracking (`benchmark_2.js`) calculating live, average, minimum, and maximum FPS alongside render processing latency. 
* **Ambient Audio Support:** Background track execution with managed fallbacks for environments restricting automatic autoplay policies. The background music is a compressed, audio-only extraction of the track from [this video](https://youtu.be/gCWaRhNUvfc).
* **Object-Pooled Shooting Stars:** Smoothly animated shooting stars utilizing an object pool to mitigate runtime memory allocations and performance hiccups.

## 📁 Project Structure

* `index.html` — The main entry point, visual canvas layout, and background audio container.
* `script_3.js` — Core simulation logic, animation rendering loop, and particle management.
* `benchmark_2.js` — Diagnostics module housing the `BenchmarkOverlay` class, updated to dynamically calculate multi-corner bounds and theme colors.
* `style_3.css` — Full-bleed layout rules keeping components seamlessly aligned at absolute boundaries.
* `bg-music.mp3` *(or similar audio extension)* — The compressed background audio file used for ambient space tracking.
* `LivelyInfo_3.json` — Operational metadata enabling environment configuration parsing inside Lively.
* `LivelyProperties_3.json` — Enhanced settings schema handling new interactive dropdown menus.

## 🛠️ Customizable Settings

The following user configurations can be adjusted in real time through the Lively user interface:

* **Show Performance Overlay (Checkbox):** Toggle the monospaced text diagnostic overlay on or off.
* **Overlay Position (Dropdown):** Snap the performance overlay box to any corner of your screen (**Top-Right**, **Top-Left**, **Bottom-Right**, or **Bottom-Left**).
* **Overlay Text Color (Dropdown):** Match your desktop aesthetic with multiple diagnostic text colors (**Red**, **Lime Green**, **Cyan**, **White**, or **Yellow**).
* **Overlay Background (Dropdown):** Adjust the visibility style of the benchmark background box (**Semi-Transparent**, **Opaque Black**, or **Invisible**).
* **Star Density (Slider):** Scales active star clusters smoothly across runtime arrays. Supports adjustments ranging from 100 to 10,000 active instances.

## 📦 How to Install in Lively Wallpaper

1. **Download the ZIP archive** containing all the version 3 project assets.
2. Open **Lively Wallpaper**.
3. Click the **Plus (+) button** (Add Wallpaper).
4. Select **Open File**.
5. Select the downloaded **ZIP archive**.
6. **Activate it** to apply the updated space environment!
7. Right-click the thumbnail in your Lively collection library and select **Customize** to access density and benchmarking toggles.

## 📝 Details

* **Author:** Raspberrykitty1
* **Type:** HTML/Canvas Wallpaper (Type 1)
* **Tags:** Space
* **Audio Track Source:** [YouTube Video Link](https://youtu.be/gCWaRhNUvfc) (Downloaded & compressed)
* **Version:** 3

```
