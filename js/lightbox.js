/**
 * LIGHTBOX.JS - Full-screen image viewer for popup ad images
 *
 * Clicking an ad image in a marker popup opens it in a full-screen
 * overlay at high resolution. Click the image to toggle zoom (natural
 * size, scroll to pan). Click the backdrop, the X button, or press
 * Escape to close.
 *
 * Exposes a single global: openLightbox(src, alt)
 */

(function() {
    let overlay = null;
    let scroller = null;
    let imgEl = null;

    /**
     * Build the overlay DOM once, on first use.
     * Uses createElement (no innerHTML) for CSP safety.
     */
    function buildOverlay() {
        overlay = document.createElement('div');
        overlay.className = 'lightbox-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', 'Advertisement viewer');

        scroller = document.createElement('div');
        scroller.className = 'lightbox-scroller';

        imgEl = document.createElement('img');
        imgEl.className = 'lightbox-img';
        imgEl.addEventListener('click', function(e) {
            e.stopPropagation();
            overlay.classList.toggle('zoomed');
        });

        scroller.appendChild(imgEl);
        overlay.appendChild(scroller);

        const closeBtn = document.createElement('button');
        closeBtn.className = 'lightbox-close';
        closeBtn.setAttribute('aria-label', 'Close');
        closeBtn.textContent = '×';
        closeBtn.addEventListener('click', closeLightbox);
        overlay.appendChild(closeBtn);

        // Click on the dark backdrop (not the image) closes
        scroller.addEventListener('click', function(e) {
            if (e.target === scroller) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && overlay.classList.contains('open')) {
                closeLightbox();
            }
        });

        document.body.appendChild(overlay);
    }

    function closeLightbox() {
        if (!overlay) return;
        overlay.classList.remove('open');
        overlay.classList.remove('zoomed');
        imgEl.removeAttribute('src');
    }

    /**
     * Open the lightbox showing the given image.
     *
     * @param {string} src - Image URL
     * @param {string} alt - Alt text (business name)
     */
    function openLightbox(src, alt) {
        if (!overlay) {
            buildOverlay();
        }
        imgEl.src = src;
        imgEl.alt = alt || '';
        overlay.classList.remove('zoomed');
        overlay.classList.add('open');
        scroller.scrollTop = 0;
        scroller.scrollLeft = 0;
    }

    // Expose globally (used by markers.js popup handlers)
    window.openLightbox = openLightbox;
})();
