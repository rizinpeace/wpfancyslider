// Frontend functionality for Fancy Slider block
document.addEventListener('DOMContentLoaded', function() {
    // All slider initialization is handled by the functions injected in the render.php
    // This file is just a marker that indicates the block's scripts are loaded
    
    // Add keyboard navigation support for sliders with focus
    document.addEventListener('keydown', function(e) {
        const activeElement = document.activeElement;
        if (!activeElement || !activeElement.closest) return;
        
        const sliderContainer = activeElement.closest('.pixeld-fancy-slider-container');
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
    const sliders = document.querySelectorAll('.pixeld-fancy-slider-container');
    sliders.forEach(slider => {
        slider.setAttribute('tabindex', '0');
        slider.setAttribute('aria-roledescription', 'carousel');
        
        const slides = slider.querySelectorAll('.pixeld-fancy-slider-slide');
        slides.forEach((slide, index) => {
            slide.setAttribute('aria-roledescription', 'slide');
            slide.setAttribute('aria-label', 'Slide ' + (index + 1));
        });
        
        const prevArrow = slider.querySelector('.pixeld-fancy-slider-prev');
        if (prevArrow) {
            prevArrow.setAttribute('aria-label', 'Previous slide');
            prevArrow.setAttribute('role', 'button');
            prevArrow.setAttribute('tabindex', '0');
        }
        
        const nextArrow = slider.querySelector('.pixeld-fancy-slider-next');
        if (nextArrow) {
            nextArrow.setAttribute('aria-label', 'Next slide');
            nextArrow.setAttribute('role', 'button');
            nextArrow.setAttribute('tabindex', '0');
        }
    });
}); 
