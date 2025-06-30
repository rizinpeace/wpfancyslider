// Frontend functionality for Fancy Slider block
document.addEventListener('DOMContentLoaded', function() {
    // All slider initialization is handled by the functions injected in the render.php
    // This file is just a marker that indicates the block's scripts are loaded
    
    // Add keyboard navigation support for sliders with focus
    document.addEventListener('keydown', function(e) {
        const activeElement = document.activeElement;
        if (!activeElement || !activeElement.closest) return;
        
        const sliderContainer = activeElement.closest('.fancy-slider-container');
        if (!sliderContainer) return;
        
        const id = sliderContainer.id;
        
        if (e.key === 'ArrowLeft') {
            const prevButton = document.getElementById(id + '-prev');
            if (prevButton) {
                prevButton.click();
                e.preventDefault();
            }
        } else if (e.key === 'ArrowRight') {
            const nextButton = document.getElementById(id + '-next');
            if (nextButton) {
                nextButton.click();
                e.preventDefault();
            }
        }
    });
    
    // Add accessibility attributes to all sliders
    const sliders = document.querySelectorAll('.fancy-slider-container');
    sliders.forEach(slider => {
        slider.setAttribute('tabindex', '0');
        slider.setAttribute('aria-roledescription', 'carousel');
        
        const slides = slider.querySelectorAll('.fancy-slider-slide');
        slides.forEach((slide, index) => {
            slide.setAttribute('aria-roledescription', 'slide');
            slide.setAttribute('aria-label', 'Slide ' + (index + 1));
        });
        
        const prevArrow = slider.querySelector('.fancy-slider-prev');
        if (prevArrow) {
            prevArrow.setAttribute('aria-label', 'Previous slide');
            prevArrow.setAttribute('role', 'button');
            prevArrow.setAttribute('tabindex', '0');
        }
        
        const nextArrow = slider.querySelector('.fancy-slider-next');
        if (nextArrow) {
            nextArrow.setAttribute('aria-label', 'Next slide');
            nextArrow.setAttribute('role', 'button');
            nextArrow.setAttribute('tabindex', '0');
        }
    });
}); 

// Make slider initialization functions globally available
window.initFullscreenSlider = function(sliderId, options) {
    console.log('Initializing slider:', sliderId, options);
    const slider = document.getElementById(sliderId);
    if (!slider) {
        console.error('Slider not found:', sliderId);
        return;
    }
    const backgrounds = slider.querySelectorAll('.fancy-slider-bg');
    const contents = slider.querySelectorAll('.fancy-slider-content');
    const thumbnails = slider.querySelectorAll('.fancy-slider-thumbnail');
    const totalSlides = backgrounds.length;
    console.log('Found elements:', {
        backgrounds: backgrounds.length,
        contents: contents.length,
        thumbnails: thumbnails.length,
        totalSlides: totalSlides
    });
    if (totalSlides === 0) {
        console.warn('No slides found for slider:', sliderId);
        return;
    }
    let currentIndex = 0;
    let interval;
    // Set up navigation
    thumbnails.forEach((thumbnail, index) => {
        console.log('Adding click listener to thumbnail', index);
        thumbnail.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Thumbnail clicked:', index);
            goToSlide(index);
        });
    });
    // Set up arrow navigation if enabled
    if (options.arrows) {
        const prevArrow = slider.querySelector(`#${sliderId}-prev`);
        const nextArrow = slider.querySelector(`#${sliderId}-next`);
        if (prevArrow) {
            console.log('Adding click listener to prev arrow');
            prevArrow.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Prev arrow clicked');
                goToSlide(currentIndex - 1);
            });
        }
        if (nextArrow) {
            console.log('Adding click listener to next arrow');
            nextArrow.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Next arrow clicked');
                goToSlide(currentIndex + 1);
            });
        }
    }
    // Function to go to specific slide
    function goToSlide(index) {
        console.log('Going to slide:', index, 'from current:', currentIndex);
        // Handle wrapping
        if (index < 0) {
            index = totalSlides - 1;
        } else if (index >= totalSlides) {
            index = 0;
        }
        // Update active classes
        backgrounds.forEach((bg, i) => {
            bg.classList.toggle('active', i === index);
            bg.classList.toggle('previous', i === currentIndex);
        });
        contents.forEach((content, i) => {
            content.classList.toggle('active', i === index);
            content.classList.toggle('previous', i === currentIndex);
        });
        thumbnails.forEach((thumbnail, i) => {
            thumbnail.classList.toggle('active', i === index);
        });
        currentIndex = index;
        // Reset autoplay if enabled
        if (options.autoplay) {
            clearInterval(interval);
            startAutoplay();
        }
        // Update thumbnail carousel to ensure the active thumbnail is visible
        // Calculate which page the active thumbnail is on (0-based)
        const itemsPerPage = 4;
        const targetPage = Math.floor(index / itemsPerPage);
        // Call the thumbnail carousel page update function
        if (typeof window.updateThumbnailCarouselPage === 'function') {
            window.updateThumbnailCarouselPage(sliderId, targetPage);
        }
    }
    // Set up autoplay
    function startAutoplay() {
        if (options.autoplay) {
            interval = setInterval(() => {
                goToSlide(currentIndex + 1);
            }, options.autoplaySpeed);
        }
    }
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            goToSlide(currentIndex - 1);
            e.preventDefault();
        } else if (e.key === 'ArrowRight') {
            goToSlide(currentIndex + 1);
            e.preventDefault();
        }
    });
    // Start autoplay
    startAutoplay();
    // Pause autoplay on hover
    slider.addEventListener('mouseenter', () => {
        if (options.autoplay) {
            clearInterval(interval);
        }
    });
    slider.addEventListener('mouseleave', () => {
        if (options.autoplay) {
            startAutoplay();
        }
    });
};

window.initThumbnailCarousel = function(sliderId) {
    console.log('Initializing thumbnail carousel:', sliderId);
    const container = document.getElementById(`${sliderId}-thumbnails`);
    if (!container) {
        console.error('Thumbnail container not found:', `${sliderId}-thumbnails`);
        return;
    }
    const prevButton = document.getElementById(`${sliderId}-thumbnail-prev`);
    const nextButton = document.getElementById(`${sliderId}-thumbnail-next`);
    const dotsContainer = document.getElementById(`${sliderId}-thumbnail-dots`);
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.thumbnail-dot') : [];
    const thumbnails = container.querySelectorAll('.fancy-slider-thumbnail');
    const totalThumbnails = thumbnails.length;
    const itemsPerPage = 4; // Show 4 items per page
    const totalPages = Math.ceil(totalThumbnails / itemsPerPage);
    console.log('Thumbnail carousel elements:', {
        container: !!container,
        prevButton: !!prevButton,
        nextButton: !!nextButton,
        dotsContainer: !!dotsContainer,
        dots: dots.length,
        thumbnails: totalThumbnails,
        totalPages: totalPages
    });
    let currentPage = 0;
    // Stop if there are no thumbnails or they all fit on one page
    if (totalThumbnails <= itemsPerPage) {
        // Hide navigation if not needed
        if (prevButton) prevButton.style.display = 'none';
        if (nextButton) nextButton.style.display = 'none';
        if (dotsContainer) dotsContainer.style.display = 'none';
        return;
    }
    // Set each thumbnail to be exactly 25% wide (4 per page)
    thumbnails.forEach(thumbnail => {
        thumbnail.style.flex = `0 0 calc(100% / ${itemsPerPage})`;
        thumbnail.style.maxWidth = `calc(100% / ${itemsPerPage})`;
    });
    // Previous button click handler
    if (prevButton) {
        prevButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Thumbnail prev clicked, current page:', currentPage);
            if (currentPage > 0) {
                currentPage--;
                updateCarousel();
            }
        });
    }
    // Next button click handler
    if (nextButton) {
        nextButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Thumbnail next clicked, current page:', currentPage);
            if (currentPage < totalPages - 1) {
                currentPage++;
                updateCarousel();
            }
        });
    }
    // Dot navigation handlers
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Thumbnail dot clicked, page:', index);
            currentPage = index;
            updateCarousel();
        });
    });
    // Function to update carousel position
    function updateCarousel() {
        // Calculate the translate percentage based on current page
        // Use negative translateX to move content left
        container.style.transform = `translateX(-${currentPage * 100}%)`;
        // Update active dot
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentPage);
        });
        // Update button states
        if (prevButton) {
            prevButton.style.opacity = currentPage === 0 ? '0.5' : '1';
            prevButton.style.pointerEvents = currentPage === 0 ? 'none' : 'auto';
        }
        if (nextButton) {
            nextButton.style.opacity = currentPage === totalPages - 1 ? '0.5' : '1';
            nextButton.style.pointerEvents = currentPage === totalPages - 1 ? 'none' : 'auto';
        }
        console.log(`Carousel moved to page ${currentPage + 1}/${totalPages}, translateX: -${currentPage * 100}%`);
    }
    // Make this function accessible to the main slider
    window.updateThumbnailCarouselPage = function(id, pageIndex) {
        if (id !== sliderId) return;
        // Make sure page index is valid
        pageIndex = Math.max(0, Math.min(pageIndex, totalPages - 1));
        currentPage = pageIndex;
        updateCarousel();
    };
    // Initialize carousel
    updateCarousel();
}; 
