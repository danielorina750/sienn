# SIEN Group Premium Architecture Website - Vercel Fixed Version

This version fixes the Vercel deployment error:

> No Output Directory named "public" found after the Build completed.

## Why this version works

The site files are now inside the `public/` directory and `vercel.json` explicitly tells Vercel to deploy from `public`.

## Deploy on Vercel

1. Extract this ZIP.
2. Push the extracted folder to GitHub, or upload/import it into Vercel.
3. Use these Vercel settings:
   - Framework Preset: Other
   - Build Command: `npm run build`
   - Output Directory: `public`
   - Install Command: leave default
4. Deploy.

## Website structure

- `public/index.html` - homepage
- `public/styles.css` - full premium styling
- `public/main.js` - animations, filters, modals, counters
- `public/data.js` - portfolio/project content
- `public/assets/` - project images, certificates, brand assets, and PDF profile

## Included sections

- Premium cinematic architectural hero
- Animated counters and scroll reveals
- Full services and multidisciplinary team profile
- Interactive portfolio filter and project case-study modals
- Portfolio analytics and visual charts
- Strategic partner section including ELMA Irrigation
- Verified compliance/certificate wall
- Contact and downloadable profile section
