# GitHub Pages Deployment Instructions

## Enable GitHub Pages

1. **Go to your GitHub repository**: Navigate to https://github.com/[your-username]/Narrative-Visualization

2. **Open Repository Settings**: Click on the "Settings" tab at the top of the repository page

3. **Find Pages Section**: Scroll down in the left sidebar and click on "Pages"

4. **Configure Source**: 
   - Under "Source", select "Deploy from a branch"
   - Choose "main" branch
   - Select "/ (root)" folder
   - Click "Save"

5. **Wait for Deployment**: GitHub will automatically build and deploy your site. This usually takes 2-5 minutes.

6. **Access Your Live Site**: Once deployed, your visualization will be available at:
   ```
   https://[your-username].github.io/Narrative-Visualization/
   ```

## Verification Steps

After deployment, verify that:
- [ ] All 5 scenes load properly
- [ ] Navigation buttons work correctly
- [ ] Annotations and styling display correctly
- [ ] Interactive controls function in Scene 5
- [ ] Data loads without errors (check browser console)

## Troubleshooting

**If the visualization doesn't load:**
- Check browser console for JavaScript errors
- Verify all data files are in the `data/` directory
- Ensure all file paths use lowercase `data/` (not `Data/`)
- Wait a few more minutes for GitHub Pages to fully propagate

**If styling looks broken:**
- Clear browser cache and refresh
- Check that all CSS files are properly linked
- Verify GitHub Pages is serving HTTPS content

## File Structure

```
Narrative-Visualization/
├── index.html          # Main HTML file
├── script.js           # D3.js visualization code
├── styles.css          # CSS styling
├── data/               # Processed JSON data files
│   ├── scene1_data.json
│   ├── scene2_data.json
│   ├── scene3_data.json
│   ├── scene4_data.json
│   └── summary.json
├── process_data.py     # Data processing script
└── README.md           # Project documentation
```

## Next Steps

1. Test the live visualization thoroughly
2. Share the URL for peer review
3. Document any additional insights or improvements
4. Consider adding more interactive features if time permits

---

*Your NBA Three-Point Revolution visualization is now live and ready to tell its compelling story!*