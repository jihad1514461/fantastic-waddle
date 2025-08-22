This folder stores **uploaded assets** from the admin panel.

Examples:
- Race images (PNG/JPG)
- Class images
- Item icons
- Spell/Skill icons
- Monster/Villain portraits
- Shop UI images
- Audio files (battle music, sound effects)

USAGE RULES:
- Filenames should be lowercase with underscores, no spaces
- Store in subfolders by type if desired (e.g., /uploads/races, /uploads/classes)
- Max recommended image size: 512x512 px
- Max recommended audio length: <30 sec for effects
- Only accepted formats: PNG/JPG for images, MP3/WAV for audio

These files are served statically at:
  GET /uploads/<filename>
