# 🎬 ChatyPlayer

**ChatyPlayer** is a lightweight, modular HTML5 video player built with **TypeScript**.  
It focuses on clean architecture, safe defaults, responsive UI, and a modern playback experience across desktop and mobile.

Designed for real-world applications, ChatyPlayer emphasizes **stability, performance, and extensibility**.

---

## ✨ Features

### 🎥 Core Playback

- Play / pause  
- Timeline seeking  
- Volume and mute controls  
- Playback speed control  
- Autoplay, loop, and preload support  

---

### 📺 Player Modes

- Fullscreen  
- Theatre mode  
- Picture-in-Picture (PiP)  
- Scroll-activated mini player  

---

### 📊 Quality & Sources

- Multiple quality sources  
- Auto quality mode  
- Manual quality switching  
- Playback state preserved during source changes  

---

### 💬 Subtitles & Chapters

- WebVTT subtitle support  
- Multi-language subtitle tracks  
- Custom subtitle rendering  
- Chapter segments on timeline  
- Chapter-aware tooltip preview  

---

### 🧠 Smart Playback

- Resume from last position  
- Timestamp sharing (`?t=` / `#t=`)  
- Typed state and event system  
- Mobile-friendly timeline preview  

---

### 🎮 Interaction

- Keyboard shortcuts  
- Touch gestures  
- Double-tap seeking  
- Swipe volume control  
- Responsive settings panel  

---

### 📱 Mobile Experience

- Settings and subtitle panels stay within viewport  
- Touch-friendly timeline scrubbing  
- Improved thumbnail preview behavior  
- Optimized mini-player interaction  

---

### 🔐 Safety & Stability

- URL sanitization  
- Safe storage wrapper  
- Defensive config parsing  
- Lifecycle-based cleanup  
- Fully typed internal state and events  

---

## 🧱 Architecture

ChatyPlayer follows a **modular, layered architecture** for scalability and maintainability:

```
src
├── api
│ └── publicAPI
├── core
│ ├── config
│ ├── events
│ ├── lifecycle
│ ├── Player
│ └── state
├── features
│ ├── chapters
│ ├── featureRegistry
│ ├── fullscreen
│ ├── gestures
│ ├── keyboard
│ ├── pip
│ ├── quality
│ ├── resume
│ ├── speed
│ ├── subtitles
│ ├── theater
│ └── timestamp
├── ui
│ ├── controls
│ ├── icons
│ ├── miniPlayer
│ ├── settings
│ ├── thumbnail
│ ├── timeline
│ └── tooltip
├── styles
│ ├── animations.css
│ ├── chatyplayer.css
│ ├── controls.css
│ ├── player.css
│ ├── settings.css
│ ├── theme-dark.css
│ ├── theme-light.css
│ └── timeline.css
└── utils
├── formats
├── storage
└── time
```

This structure keeps the player **maintainable, scalable, and extensible**.

---

This structure ensures clear separation of concerns and long-term maintainability.

---

## 📦 Basic Usage

### HTML

```html
<div
  id="player"
  data-mp4="/videos/video-720.mp4"
  data-poster="/videos/poster.jpg"
  data-autoplay="false"
  data-loop="false"
></div>
```

---

### JavaScript / TypeScript

```ts
import { create } from "chatyplayer";

const container = document.getElementById("player");

if (container) {
  const player = create(container);
  player.play();
}
```

---

# ⚙️ Configuration

Example configuration:

```ts
<div
  Basic Example
  id="player"
  data-mp4="/videos/video-720.mp4"
  data-poster="/videos/poster.jpg"
  data-autoplay="false"
  data-loop="false"
  data-muted="false"
  data-preload="metadata"
></div>
Multiple Quality Sources
<div
  id="player"
  data-sources='[
    { "src": "/videos/video-720.mp4", "label": "720p", "type": "video/mp4" },
    { "src": "/videos/video-1080.mp4", "label": "1080p", "type": "video/mp4" }
  ]'
></div>
Subtitles
<div
  id="player"
  data-mp4="/videos/video.mp4"
  data-subtitles='[
    { "src": "/subs/en.vtt", "label": "English", "srclang": "en", "default": true },
    { "src": "/subs/fr.vtt", "label": "French", "srclang": "fr" }
  ]'
></div>
Chapters
<div
  id="player"
  data-mp4="/videos/video.mp4"
  data-chapters='[
    { "time": 0, "title": "Opening Scene" },
    { "time": 45, "title": "Story Begins" },
    { "time": 120, "title": "Conflict" }
  ]'
></div>
Thumbnail Sprite
<div
  id="player"
  data-mp4="/videos/video.mp4"
  data-thumbnails="/thumbs/sprite.jpg"
  data-thumb-width="160"
  data-thumb-height="90"
  data-thumb-columns="5"
  data-thumb-rows="5"
  data-thumb-interval="10"
></div>

```

---

# 🎛 Public API

ChatyPlayer exposes a safe public API.

```ts
player.play();
player.pause();
player.toggle();
player.seek(30);

player.setVolume(0.5);
player.setSpeed(1.5);

player.toggleFullscreen();
player.toggleTheatre();

player.getState();
player.getVideo();
player.getContainer();

Feature-specific APIs may also be available depending on configuration:

- Quality controls
- Subtitle controls
- Timestamp helpers
- PiP controls
```

---

# 📡 Events

You can subscribe to player events.

```ts
player.api.on("play", () => {
  console.log("Video started");
});

player.api.on("speedchange", (speed) => {
  console.log("Speed changed:", speed);
});


```

Available events include:

* `ready`
* `play`
* `pause`
* `ended`
* `timeupdate`
* `fullscreenchange`
* `pipchange`
* `subtitlechange`

---

# ⌨ Keyboard Shortcuts

| Key         | Action        |
| ----------- | ------------- |
| Space / K   | Play / Pause  |
| J           | Seek backward |
| L           | Seek forward  |
| Arrow Left  | Seek backward |
| Arrow Right | Seek forward  |
| Arrow Up    | Volume up     |
| Arrow Down  | Volume down   |
| M           | Mute          |
| F           | Fullscreen    |

---

# 🧑‍💻 Development

Clone the repository:

```bash
git clone https://github.com/chatyshop/chatyplayer.git
```

Install dependencies:

```bash
npm install
```

Run development build:

```bash
npm run dev
```

Build production:

```bash
npm run build
```

---

# 🤝 Contributing

Contributions are welcome.

If you find a bug or want to improve the player:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

---

# 📄 License

MIT License

---

# ⭐ Support

If you find ChatyPlayer useful, please consider **starring the repository** on GitHub.

---
