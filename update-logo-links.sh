#!/bin/bash

# This script updates all HTML files to:
# 1. Replace kemri-logo.png with kemrilogo.png
# 2. Make the logo image clickable, linking to the main KEMRI website

# Update meta tags in all HTML files
find . -name "*.html" -type f -exec sed -i 's|assets/images/kemri-logo.png|assets/images/kemrilogo.png|g' {} \;

# Update header logo in all HTML files to include the link
find . -name "*.html" -type f -exec sed -i 's|<img src="assets/images/kemri-logo.png" alt="KEMRI Logo" class="logo">|<a href="https://www.kemri.org/" target="_blank" rel="noopener noreferrer"><img src="assets/images/kemrilogo.png" alt="KEMRI Logo" class="logo"></a>|g' {} \;

# Update footer logo in all HTML files to include the link
find . -name "*.html" -type f -exec sed -i 's|<div class="footer-logo">\s*<img src="assets/images/kemri-logo.png" alt="KEMRI Logo" class="logo">|<div class="footer-logo"><a href="https://www.kemri.org/" target="_blank" rel="noopener noreferrer"><img src="assets/images/kemrilogo.png" alt="KEMRI Logo" class="logo"></a>|g' {} \;

echo "All HTML files have been updated to make the KEMRI logo clickable and link to the main KEMRI website." 