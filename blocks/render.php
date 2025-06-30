<?php
/**
 * Fancy Slider Block Render Callback
 */

// Only handle frontend rendering here - registration is in functions.php
function pixeld_render_fancy_slider_block($attributes, $content) {
    $slides = $attributes['slides'] ?? [];
    $slides_to_show = $attributes['slidesToShow'] ?? 3;
    $autoplay = $attributes['autoplay'] ?? true;
    $autoplay_speed = $attributes['autoplaySpeed'] ?? 3000;
    $arrows = $attributes['arrows'] ?? true;
    $dots = $attributes['dots'] ?? true;

    $heading = $attributes['heading'] ?? '';
    $heading_color = $attributes['headingColor'] ?? '#f0f2f2';

    $block_id = 'pixeld-fancy-slider-' . uniqid();

    // If no slides, return nothing
    if (empty($slides)) {
        return '<div class="pixeld-fancy-slider-empty">No slides added yet.</div>';
    }
    
    ob_start(); ?>
    <div class="pixeld-fancy-slider-fullscreen" id="<?php echo esc_attr($block_id); ?>">
        <?php if ($heading) : ?>
            <div class="pixeld-fancy-slider-heading-container">
                <div class="container">
                    <div class="pixeld-fancy-slider-heading"><h2><?php echo wp_kses_post($heading); ?></h2></div>
                    <div class="filler"></div>
                </div>
            </div>
        <?php endif; ?>
        <div class="pixeld-fancy-slider-bg-container">
            <?php foreach ($slides as $index => $slide) : 
                $image_url = $slide['imageUrl'] ?? '';
                $active_class = ($index === 0) ? 'active' : '';
            ?>
                <div class="pixeld-fancy-slider-bg <?php echo esc_attr($active_class); ?>" data-slide="<?php echo esc_attr($index); ?>" style="background-image: url('<?php echo esc_url($image_url); ?>')"></div>
            <?php endforeach; ?>
            <div class="pixeld-fancy-slider-bg-overlay"></div>
        </div>
        

        
        <!-- Bottom Navigation Thumbnails -->
        <div class="wp-block-uagb-container uagb-block-473ad4d1 alignfull uagb-is-root-container pixeld-fancy-slider-section">
            <div class="uagb-container-inner-blocks-wrap inner-slider-container">
                <div class="pixeld-fancy-slider-thumbnails-container">
                    <div class="pixeld-fancy-slider-thumbnails" id="<?php echo esc_attr($block_id); ?>-thumbnails">
                        <?php foreach ($slides as $index => $slide) : 
                            $image_url = $slide['imageUrl'] ?? '';
                            $title = $slide['title'] ?? '';
                            $active_class = ($index === 0) ? 'active' : '';
                            $description = $slide['description'] ?? ''; 
                            $link = $slide['link'] ?? '';

                        ?>
                            <div class="pixeld-fancy-slider-thumbnail <?php echo esc_attr($active_class); ?>" data-slide="<?php echo esc_attr($index); ?>">
                                <?php if ($title) : ?>
                                    <div class="thumbnail-title"><span class="thumbnail-title-text"><?php echo wp_kses_post($title); ?></span> <span class="thumbnail-title-arrow"><?php if ($link) : ?><a href="<?php echo esc_url($link); ?>"><img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/slider-arrow.svg" alt="Arrow Right"></a><?php endif; ?></span></div>
                                <?php endif; ?>

                                <?php if ($description) : ?>
                                    <div class="pixeld-fancy-slider-description"><?php echo wp_kses_post($description); ?></div>
                                <?php endif; ?>
                            </div>
                        <?php endforeach; ?>
                    </div>
                    
                    <?php if ($arrows) : ?>
                    <!-- Thumbnail Navigation Arrows -->
                    <div class="thumbnail-carousel-arrow thumbnail-prev" id="<?php echo esc_attr($block_id); ?>-thumbnail-prev">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
                        </svg>
                    </div>
                    <div class="thumbnail-carousel-arrow thumbnail-next" id="<?php echo esc_attr($block_id); ?>-thumbnail-next">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
                        </svg>
                    </div>
                    <?php endif; ?>
                    
                    <!-- Dots Navigation -->
                    <div class="thumbnail-carousel-dots" id="<?php echo esc_attr($block_id); ?>-thumbnail-dots">
                        <?php 
                        $total_pages = ceil(count($slides) / 4);
                        for ($i = 0; $i < $total_pages; $i++) :
                            $dot_active = ($i === 0) ? 'active' : '';
                        ?>
                            <span class="thumbnail-dot <?php echo esc_attr($dot_active); ?>" data-page="<?php echo esc_attr($i); ?>"></span>
                        <?php endfor; ?>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <style>
        #<?php echo esc_attr($block_id); ?>{
            .pixeld-fancy-slider-heading-container{
                background-image: linear-gradient(to right, <?php echo esc_attr($heading_color); ?> 40%, transparent 40%);

                .pixeld-fancy-slider-heading{                    
                    background-color:<?php echo esc_attr($heading_color); ?>;

                    &:after{
                        background-color: <?php echo esc_attr($heading_color); ?>;
                    }                    
                }
            }
        }
    </style>
    
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize slider
            pixeldInitFullscreenSlider('<?php echo esc_attr($block_id); ?>', {
                autoplay: <?php echo $autoplay ? 'true' : 'false'; ?>,
                autoplaySpeed: <?php echo (int)$autoplay_speed; ?>,
                arrows: <?php echo $arrows ? 'true' : 'false'; ?>
            });
            
            // Initialize thumbnail carousel
            pixeldInitThumbnailCarousel('<?php echo esc_attr($block_id); ?>');
        });
    </script>
    <?php
    return ob_get_clean();
}

// Register initialization function
function pixeld_fancy_slider_init_scripts() {
    ?>
    <script>
        // Initialize fullscreen slider
        function pixeldInitFullscreenSlider(sliderId, options) {
            console.log('Initializing slider:', sliderId, options);
            
            const slider = document.getElementById(sliderId);
            if (!slider) {
                console.error('Slider not found:', sliderId);
                return;
            }
            
            const backgrounds = slider.querySelectorAll('.pixeld-fancy-slider-bg');
            const contents = slider.querySelectorAll('.pixeld-fancy-slider-content');
            const thumbnails = slider.querySelectorAll('.pixeld-fancy-slider-thumbnail');
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
        }

        // Initialize thumbnail carousel
        function pixeldInitThumbnailCarousel(sliderId) {
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
            const thumbnails = container.querySelectorAll('.pixeld-fancy-slider-thumbnail');
            
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
        }
    </script>
    <?php
}
add_action('wp_footer', 'pixeld_fancy_slider_init_scripts'); 
