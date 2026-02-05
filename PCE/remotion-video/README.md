# 🎥 PCE Promotional Video Generator

This project allows you to generate a promotional video for the PCE affiliation platform using **Remotion** and **TailwindCSS**.

## 🛠️ Setup

1.  Navigate to this folder:
    ```bash
    cd remotion-video
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```
    *Note: This will install Remotion, React, and TailwindCSS.*

## 🚀 Preview

To preview the video in your browser:

```bash
npm start
```

This will open the Remotion Player at `http://localhost:3000`.

## 🎬 Render Video

To export the video as an MP4 file:

```bash
npm run render
```

The output file `out.mp4` will be created in this directory.

## 🎨 Customization

-   **Scenes:** Edit components in `src/scenes.tsx`.
-   **Sequence/Timing:** Edit `src/Root.tsx`.
-   **Styles:** Tailwind classes are used throughout. Configuration in `tailwind.config.js`.
