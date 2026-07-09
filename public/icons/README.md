# App icons

Brand-matched PWA icons: void black `#050505` canvas, champagne gold
`LVB` monogram in Cormorant Garamond, hairline gold frame. Generated
placeholders — replace with final brand marks at the same paths and
sizes whenever they're ready; no code changes needed.

| File | Size | Used for |
| --- | --- | --- |
| `icon-192.png` | 192×192 | Android home screen / manifest |
| `icon-512.png` | 512×512 | Android splash + install prompt |
| `maskable-icon-512.png` | 512×512 | Android adaptive icons (`purpose: maskable`) — keep the mark inside the central 60% safe zone; edges may be cropped to a circle |
| `apple-touch-icon.png` | 180×180 | iOS Add to Home Screen |

Referenced from `/public/manifest.webmanifest` and the `icons` metadata
in `app/layout.jsx`.
