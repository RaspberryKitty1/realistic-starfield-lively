# Realistic Starfield — Lively Wallpaper (v2)

An interactive, performance-optimized HTML5 Canvas space simulation designed as a dynamic live wallpaper for **Lively Wallpaper**. Version 2 introduces real-time performance tracking, native settings customization via Lively Properties, and background audio integration.

Developed by **Raspberrykitty1**.

## 🚀 Features

* **Parallax Star Layers:** Three distinct layers of stars moving at independent depths and speeds to create an immersive 3D parallax effect.
* **Interactive Live Properties:** Seamlessly integrated with the Lively Wallpaper configuration engine to tweak density scaling and diagnostic visual elements dynamically.
* **Performance Benchmarking:** Built-in performance tracking subclass (`benchmark.js`) calculating live, average, minimum, and maximum FPS alongside render processing latency.
* **Ambient Audio Support:** Background track execution with managed fallbacks for browsers restricting automatic autoplay policies.
* **Object-Pooled Shooting Stars:** Smoothly animated shooting stars utilizing an object pool to mitigate runtime memory allocations and performance hiccups.

## 📁 Project Structure

* `index.html` — The main entry point, visual canvas layout, and background audio container.
* `script_2.js` — Core simulation logic, animation rendering loop, and particle management.
* `benchmark.js` — Independent diagnostic module housing the custom rendering benchmark tracking subclass.
* `style_2.css` — Full-bleed layout rules keeping components seamlessly aligned at absolute boundaries.
* `LivelyInfo_2.json` — Operational metadata enabling environment configuration parsing inside Lively.
* `LivelyProperties_2.json` — Formatted schema establishing interactive settings options within the application.

## 🛠️ Customizable Settings

The following user configurations are exposed directly through the Lively user interface:

* **Show Performance Overlay (Checkbox):** Instantly toggle a monospaced text diagnostic overlay rendering active frame intervals and draw engine lag.
* **Star Density (Slider):** Scales active star clusters smoothly across runtime arrays. Supports adjustments ranging from 100 to 10,000 active instances.

## 📦 How to Install in Lively Wallpaper

1. **Download the ZIP archive** containing all the version 2 project assets.
2. Open **Lively Wallpaper**.
3. Click the **Plus (+) button** (Add Wallpaper).
4. Select **Open File**.
5. Select the downloaded **ZIP archive**.
6. **Activate it** to apply the updated space environment!
7. *(Optional)* Right-click the thumbnail in your Lively collection library and select **Customize** to access density and benchmarking toggles.

## 📝 Details

* **Author:** Raspberrykitty1
* **Type:** HTML/Canvas Wallpaper (Type 1)
* **Tags:** Space
* **Version:** 2 (Configuration Profile 1.0.0.0)
