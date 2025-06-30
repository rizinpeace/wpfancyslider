/**
 * WordPress dependencies
 */
(function(wp) {
    var __ = wp.i18n.__;
    var registerBlockType = wp.blocks.registerBlockType;
    var useBlockProps = wp.blockEditor.useBlockProps;
    var MediaUpload = wp.blockEditor.MediaUpload;
    var RichText = wp.blockEditor.RichText;
    var InspectorControls = wp.blockEditor.InspectorControls;
    var Button = wp.components.Button;
    var PanelBody = wp.components.PanelBody;
    var RangeControl = wp.components.RangeControl;
    var ToggleControl = wp.components.ToggleControl;
    var TextControl = wp.components.TextControl;
    var TextareaControl = wp.components.TextareaControl;
    var Panel = wp.components.Panel;
    var PanelRow = wp.components.PanelRow;
    var Icon = wp.components.Icon;
    var element = wp.element;
    var useState = element.useState;
    var Fragment = element.Fragment;
    var ColorPalette = wp.blockEditor.ColorPalette;
    var PanelColorSettings = wp.blockEditor.PanelColorSettings;

    /**
     * Register the Fancy Slider block
     */
    registerBlockType('wpfancyslider/fancy-slider', {
        title: __('Fancy Slider', 'fancy-slider-block'),
        icon: 'slides',
        category: 'widgets',

        edit: function(props) {
            var attributes = props.attributes;
            var setAttributes = props.setAttributes;
            var blockProps = useBlockProps();

            // Set up state for active slide in editor
            var [activeSlide, setActiveSlide] = useState(0);
            
            // Ensure activeSlide stays within bounds when slides change
            wp.element.useEffect(function() {
                if (attributes.slides.length > 0 && activeSlide >= attributes.slides.length) {
                    setActiveSlide(attributes.slides.length - 1);
                } else if (attributes.slides.length === 0) {
                    setActiveSlide(0);
                }
            }, [attributes.slides.length, activeSlide]);
            
            // Helper function to safely set active slide
            function safeSetActiveSlide(index) {
                console.log('safeSetActiveSlide called with index:', index, 'current activeSlide:', activeSlide, 'slides length:', attributes.slides.length);
                
                if (attributes.slides.length === 0) {
                    console.log('No slides available, setting to 0');
                    setActiveSlide(0);
                    return;
                }
                
                var safeIndex = Math.max(0, Math.min(index, attributes.slides.length - 1));
                console.log('Calculated safe index:', safeIndex);
                setActiveSlide(safeIndex);
            }

            // Helper function to get current slide count
            function getSlideCount() {
                return attributes.slides.length;
            }

            // Helper function to update a slide
            function updateSlide(index, property, value) {
                var slides = [...attributes.slides];
                
                if (!slides[index]) {
                    slides[index] = {};
                }
                
                slides[index][property] = value;
                setAttributes({ slides: slides });
            }

            // Helper function to add a new slide
            function addSlide() {
                var slides = [...attributes.slides];
                slides.push({
                    title: '',
                    description: '',
                    imageUrl: '',
                    link: '',
                    linkText: 'Learn More'
                });
                
                setAttributes({ slides: slides });
                // Set active slide to the new slide
                safeSetActiveSlide(slides.length - 1);
            }

            // Helper function to remove a slide
            function removeSlide(index) {
                var slides = [...attributes.slides];
                slides.splice(index, 1);
                setAttributes({ slides: slides });
                
                // Adjust active slide if needed
                if (activeSlide >= slides.length) {
                    safeSetActiveSlide(Math.max(0, slides.length - 1));
                }
            }

            // Helper function to move slide up
            function moveSlideUp(index) {
                if (index === 0) return;
                
                var slides = [...attributes.slides];
                var temp = slides[index];
                slides[index] = slides[index - 1];
                slides[index - 1] = temp;
                
                setAttributes({ slides: slides });
                safeSetActiveSlide(index - 1);
            }

            // Helper function to move slide down
            function moveSlideDown(index) {
                if (index === attributes.slides.length - 1) return;
                
                var slides = [...attributes.slides];
                var temp = slides[index];
                slides[index] = slides[index + 1];
                slides[index + 1] = temp;
                
                setAttributes({ slides: slides });
                safeSetActiveSlide(index + 1);
            }

            // Helper function to render slide editor
            function renderSlideEditor() {
                if (attributes.slides.length === 0 || attributes.slides[activeSlide] === undefined) {
                    return null;
                }

                return [
                    // Slide Image
                    wp.element.createElement(
                        'div',
                        { className: 'slide-panel-image', key: 'image' },
                        wp.element.createElement(MediaUpload, {
                            onSelect: function(media) {
                                updateSlide(activeSlide, 'imageUrl', media.url);
                            },
                            allowedTypes: ['image'],
                            value: attributes.slides[activeSlide].imageUrl,
                            render: function(obj) {
                                return wp.element.createElement(
                                    Button,
                                    {
                                        onClick: obj.open,
                                        className: attributes.slides[activeSlide].imageUrl ? 'image-button' : 'button button-large'
                                    },
                                    !attributes.slides[activeSlide].imageUrl ?
                                        __('Upload Image', 'fancy-slider-block') :
                                        wp.element.createElement('img', {
                                            src: attributes.slides[activeSlide].imageUrl,
                                            alt: ''
                                        })
                                );
                            }
                        })
                    ),

                    // Slide Content
                    wp.element.createElement(TextControl, {
                        label: __('Title', 'fancy-slider-block'),
                        value: attributes.slides[activeSlide].title,
                        onChange: function(value) {
                            updateSlide(activeSlide, 'title', value);
                        },
                        placeholder: __('Enter title', 'fancy-slider-block')
                    }),
                    wp.element.createElement(TextareaControl, {
                        label: __('Description', 'fancy-slider-block'),
                        value: attributes.slides[activeSlide].description,
                        onChange: function(value) {
                            updateSlide(activeSlide, 'description', value);
                        },
                        placeholder: __('Enter description', 'fancy-slider-block')
                    }),
                    wp.element.createElement(TextControl, {
                        label: __('Link URL', 'fancy-slider-block'),
                        value: attributes.slides[activeSlide].link,
                        onChange: function(value) {
                            updateSlide(activeSlide, 'link', value);
                        },
                        placeholder: 'https://'
                    }),
                    wp.element.createElement(TextControl, {
                        label: __('Link Text', 'fancy-slider-block'),
                        value: attributes.slides[activeSlide].linkText,
                        onChange: function(value) {
                            updateSlide(activeSlide, 'linkText', value);
                        },
                        placeholder: __('Learn More', 'fancy-slider-block')
                    })
                ];
            }

            return wp.element.createElement(
                Fragment,
                null,
                [
                    // Inspector Controls
                    wp.element.createElement(
                        InspectorControls,
                        { key: 'settings' },
                        [
                            // Slider Settings Panel
                            wp.element.createElement(
                                PanelBody,
                                { title: __('Slider Settings', 'fancy-slider-block'), initialOpen: false },
                                [
                                    wp.element.createElement(TextControl, {
                                        label: __('Heading', 'fancy-slider-block'),
                                        value: attributes.heading,
                                        onChange: function(value) {
                                            setAttributes({ heading: value });
                                        }
                                    }),

                                    wp.element.createElement('div', { style: { marginBottom: '15px' } }, [
                                        wp.element.createElement('label', { 
                                            style: { 
                                                display: 'block', 
                                                marginBottom: '8px', 
                                                fontSize: '11px',
                                                fontWeight: '500',
                                                textTransform: 'uppercase',
                                                color: '#1e1e1e'
                                            } 
                                        }, __('Background Color', 'fancy-slider-block')),
                                        wp.element.createElement(ColorPalette, {
                                            value: attributes.headingColor,
                                            onChange: function(value) {
                                                setAttributes({ headingColor: value || '#f0f2f2' });
                                            }
                                        })
                                    ]),
                                    wp.element.createElement(RangeControl, {
                                        label: __('Slides to Show', 'fancy-slider-block'),
                                        value: attributes.slidesToShow,
                                        onChange: function(value) {
                                            setAttributes({ slidesToShow: value });
                                        },
                                        min: 1,
                                        max: 4
                                    }),
                                    wp.element.createElement(ToggleControl, {
                                        label: __('Autoplay', 'fancy-slider-block'),
                                        checked: attributes.autoplay,
                                        onChange: function(value) {
                                            setAttributes({ autoplay: value });
                                        }
                                    }),
                                    attributes.autoplay && wp.element.createElement(RangeControl, {
                                        label: __('Autoplay Speed (ms)', 'fancy-slider-block'),
                                        value: attributes.autoplaySpeed,
                                        onChange: function(value) {
                                            setAttributes({ autoplaySpeed: value });
                                        },
                                        min: 1000,
                                        max: 10000,
                                        step: 500
                                    }),
                                    wp.element.createElement(ToggleControl, {
                                        label: __('Show Arrows', 'fancy-slider-block'),
                                        checked: attributes.arrows,
                                        onChange: function(value) {
                                            setAttributes({ arrows: value });
                                        }
                                    }),
                                    wp.element.createElement(ToggleControl, {
                                        label: __('Show Dots', 'fancy-slider-block'),
                                        checked: attributes.dots,
                                        onChange: function(value) {
                                            setAttributes({ dots: value });
                                        }
                                    })
                                ]
                            ),
                            
                            // Slides Manager Panel
                            wp.element.createElement(
                                PanelBody,
                                { 
                                    title: __('Slides Manager', 'fancy-slider-block') + ' (' + getSlideCount() + ')', 
                                    initialOpen: true 
                                },
                                [
                                    // Slides Tabs
                                    wp.element.createElement(
                                        'div',
                                        { className: 'slide-tabs-container' },
                                        [
                                            wp.element.createElement(
                                                'div',
                                                { className: 'slide-tabs' },
                                                attributes.slides.map(function(slide, index) {
                                                    return wp.element.createElement(
                                                        'button',
                                                        {
                                                            key: 'slide-tab-' + index,
                                                            className: 'slide-tab ' + (activeSlide === index ? 'active' : ''),
                                                            onClick: function() {
                                                                safeSetActiveSlide(index);
                                                            }
                                                        },
                                                        (index + 1).toString()
                                                    );
                                                })
                                            ),
                                            wp.element.createElement(
                                                Button,
                                                {
                                                    isSecondary: true,
                                                    className: 'add-slide-button',
                                                    onClick: addSlide
                                                },
                                                '+'
                                            )
                                        ]
                                    ),
                                    
                                    // Slide Navigation
                                    attributes.slides.length > 0 && wp.element.createElement(
                                        'div',
                                        { className: 'slide-navigation' },
                                        [
                                            wp.element.createElement(
                                                'div',
                                                { className: 'slide-nav-title' },
                                                __('Slide', 'fancy-slider-block') + ' ' + (activeSlide + 1) + ' ' + __('of', 'fancy-slider-block') + ' ' + attributes.slides.length
                                            ),
                                            wp.element.createElement(
                                                'div',
                                                { className: 'slide-nav-actions' },
                                                [
                                                    activeSlide > 0 && wp.element.createElement(
                                                        Button,
                                                        {
                                                            isSmall: true,
                                                            icon: 'arrow-up-alt2',
                                                            onClick: function() {
                                                                moveSlideUp(activeSlide);
                                                            }
                                                        }
                                                    ),
                                                    activeSlide < attributes.slides.length - 1 && wp.element.createElement(
                                                        Button,
                                                        {
                                                            isSmall: true,
                                                            icon: 'arrow-down-alt2',
                                                            onClick: function() {
                                                                moveSlideDown(activeSlide);
                                                            }
                                                        }
                                                    ),
                                                    wp.element.createElement(
                                                        Button,
                                                        {
                                                            isSmall: true,
                                                            isDestructive: true,
                                                            icon: 'trash',
                                                            onClick: function() {
                                                                if (confirm(__('Are you sure you want to delete this slide?', 'fancy-slider-block'))) {
                                                                    removeSlide(activeSlide);
                                                                }
                                                            }
                                                        }
                                                    )
                                                ]
                                            )
                                        ]
                                    ),
                                    
                                    // Slide Editor
                                    attributes.slides.length > 0 && wp.element.createElement(
                                        'div',
                                        { className: 'slide-editor' },
                                        renderSlideEditor()
                                    ),
                                    
                                    // No slides message
                                    attributes.slides.length === 0 && wp.element.createElement(
                                        'div',
                                        { className: 'no-slides-message' },
                                        [
                                            wp.element.createElement(
                                                'p',
                                                null,
                                                __('No slides added yet.', 'fancy-slider-block')
                                            ),
                                            wp.element.createElement(
                                                Button,
                                                {
                                                    isPrimary: true,
                                                    onClick: addSlide
                                                },
                                                __('Add First Slide', 'fancy-slider-block')
                                            )
                                        ]
                                    )
                                ]
                            )
                        ]
                    ),

                    // Block Preview in Editor - Enhanced to match frontend design
                    wp.element.createElement(
                        'div',
                        blockProps,
                        attributes.slides.length > 0 
                            ? wp.element.createElement(
                                'div',
                                { className: 'editor-fancy-slider-fullscreen' },
                                [
                                    // Heading section
                                    attributes.heading && wp.element.createElement(
                                        'div',
                                        { 
                                            className: 'editor-fancy-slider-heading-container',
                                            style: {
                                                backgroundImage: `linear-gradient(to right, ${attributes.headingColor || '#f0f2f2'} 40%, transparent 40%)`
                                            }
                                        },
                                        wp.element.createElement(
                                            'div',
                                            { className: 'editor-container' },
                                            [
                                                wp.element.createElement(
                                                    'div',
                                                    { 
                                                        className: 'editor-fancy-slider-heading',
                                                        style: {
                                                            backgroundColor: attributes.headingColor || '#f0f2f2'
                                                        }
                                                    },
                                                    wp.element.createElement('h2', null, attributes.heading)
                                                ),
                                                //wp.element.createElement('div', { className: 'editor-filler' })
                                            ]
                                        )
                                    ),
                                    
                                    // Background image with multiple slides preview
                                    wp.element.createElement(
                                        'div',
                                        { className: 'editor-fancy-slider-bg-container' },
                                        [
                                            // Show current active slide background
                                            (attributes.slides.length > 0 && 
                                             activeSlide < attributes.slides.length && 
                                             attributes.slides[activeSlide] && 
                                             attributes.slides[activeSlide].imageUrl) && wp.element.createElement(
                                                'div',
                                                { 
                                                    className: 'editor-fancy-slider-bg active',
                                                    style: { 
                                                        backgroundImage: `url(${attributes.slides[activeSlide].imageUrl})`,
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center'
                                                    }
                                                }
                                            ),
                                            
                                            // Background overlay
                                            wp.element.createElement('div', { className: 'editor-fancy-slider-bg-overlay' }),
                                            
                                            // Slide indicator
                                            wp.element.createElement(
                                                'div',
                                                { className: 'editor-slide-indicator' },
                                                `Slide ${activeSlide + 1} of ${attributes.slides.length}`
                                            )
                                        ]
                                    ),
                                    
                                    // Thumbnails navigation section - match frontend structure
                                    wp.element.createElement(
                                        'div',
                                        { className: 'wp-block-uagb-container uagb-block-473ad4d1 alignfull uagb-is-root-container editor-fancy-slider-section' },
                                        wp.element.createElement(
                                            'div',
                                            { className: 'uagb-container-inner-blocks-wrap inner-slider-container' },
                                            wp.element.createElement(
                                                'div',
                                                { className: 'editor-fancy-slider-thumbnails-container' },
                                                [
                                                    wp.element.createElement(
                                                        'div',
                                                        { className: 'editor-fancy-slider-thumbnails' },
                                                        attributes.slides.map(function(slide, index) {
                                                            // Create a closure to capture the correct index
                                                            var createThumbnailClickHandler = function(slideIndex) {
                                                                return function(e) {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    safeSetActiveSlide(slideIndex);
                                                                };
                                                            };
                                                            
                                                            return wp.element.createElement(
                                                                'div',
                                                                {
                                                                    key: 'thumbnail-' + index,
                                                                    className: 'editor-fancy-slider-thumbnail ' + (activeSlide === index ? 'active' : ''),
                                                                    onClick: createThumbnailClickHandler(index),
                                                                    style: {
                                                                        cursor: 'pointer',
                                                                        transition: 'all 0.3s ease'
                                                                    }
                                                                },
                                                                [
                                                                    slide.title && wp.element.createElement(
                                                                        'div',
                                                                        { className: 'editor-thumbnail-title' },
                                                                        [
                                                                            wp.element.createElement(
                                                                                'span',
                                                                                { className: 'editor-thumbnail-title-text' },
                                                                                slide.title
                                                                            ),
                                                                            slide.link && wp.element.createElement(
                                                                                'span',
                                                                                { className: 'editor-thumbnail-title-arrow' },
                                                                                '→'
                                                                            )
                                                                        ]
                                                                    ),
                                                                    slide.description && wp.element.createElement(
                                                                        'div',
                                                                        { className: 'editor-fancy-slider-description' },
                                                                        slide.description.length > 80 
                                                                            ? slide.description.substring(0, 80) + '...' 
                                                                            : slide.description
                                                                    )
                                                                ]
                                                            );
                                                        })
                                                    ),
                                                    
                                                    // Navigation arrows for thumbnails
                                                    attributes.arrows && attributes.slides.length > 4 && [
                                                        wp.element.createElement(
                                                            'div',
                                                            { 
                                                                key: 'thumb-prev',
                                                                className: 'editor-thumbnail-carousel-arrow editor-thumbnail-prev'
                                                            },
                                                            wp.element.createElement(
                                                                'svg',
                                                                { 
                                                                    xmlns: 'http://www.w3.org/2000/svg', 
                                                                    viewBox: '0 0 24 24', 
                                                                    width: '24', 
                                                                    height: '24' 
                                                                },
                                                                wp.element.createElement('path', { d: 'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z' })
                                                            )
                                                        ),
                                                        wp.element.createElement(
                                                            'div',
                                                            { 
                                                                key: 'thumb-next',
                                                                className: 'editor-thumbnail-carousel-arrow editor-thumbnail-next'
                                                            },
                                                            wp.element.createElement(
                                                                'svg',
                                                                { 
                                                                    xmlns: 'http://www.w3.org/2000/svg', 
                                                                    viewBox: '0 0 24 24', 
                                                                    width: '24', 
                                                                    height: '24' 
                                                                },
                                                                wp.element.createElement('path', { d: 'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z' })
                                                            )
                                                        )
                                                    ]
                                                ]
                                            )
                                        )
                                    ),
                                    
                                    // Main navigation arrows
                                    attributes.arrows && [
                                        wp.element.createElement(
                                            'div',
                                            { 
                                                key: 'main-prev',
                                                className: 'editor-fancy-slider-arrow editor-fancy-slider-prev',
                                                onClick: function(e) {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    console.log('Previous arrow clicked, current activeSlide:', activeSlide, 'total slides:', attributes.slides.length);
                                                    var newIndex = activeSlide > 0 ? activeSlide - 1 : attributes.slides.length - 1;
                                                    console.log('Setting new index to:', newIndex);
                                                    safeSetActiveSlide(newIndex);
                                                },
                                                style: { cursor: 'pointer' }
                                            },
                                            wp.element.createElement(
                                                'svg',
                                                { 
                                                    xmlns: 'http://www.w3.org/2000/svg', 
                                                    viewBox: '0 0 24 24', 
                                                    width: '24', 
                                                    height: '24' 
                                                },
                                                wp.element.createElement('path', { d: 'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z' })
                                            )
                                        ),
                                        wp.element.createElement(
                                            'div',
                                            { 
                                                key: 'main-next',
                                                className: 'editor-fancy-slider-arrow editor-fancy-slider-next',
                                                onClick: function(e) {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    console.log('Next arrow clicked, current activeSlide:', activeSlide, 'total slides:', attributes.slides.length);
                                                    var newIndex = activeSlide < attributes.slides.length - 1 ? activeSlide + 1 : 0;
                                                    console.log('Setting new index to:', newIndex);
                                                    safeSetActiveSlide(newIndex);
                                                },
                                                style: { cursor: 'pointer' }
                                            },
                                            wp.element.createElement(
                                                'svg',
                                                { 
                                                    xmlns: 'http://www.w3.org/2000/svg', 
                                                    viewBox: '0 0 24 24', 
                                                    width: '24', 
                                                    height: '24' 
                                                },
                                                wp.element.createElement('path', { d: 'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z' })
                                            )
                                        )
                                    ]
                                ]
                            )
                            : wp.element.createElement(
                                'div',
                                { className: 'fancy-slider-empty-preview' },
                                [
                                    wp.element.createElement(
                                        'div',
                                        { className: 'empty-preview-icon' },
                                        '🖼️'
                                    ),
                                    wp.element.createElement(
                                        'h3',
                                        null,
                                        __('Fancy Slider', 'fancy-slider-block')
                                    ),
                                    wp.element.createElement(
                                        'p',
                                        null,
                                        __('Add slides using the Slides Manager in the sidebar →', 'fancy-slider-block')
                                    ),
                                    wp.element.createElement(
                                        Button,
                                        {
                                            isPrimary: true,
                                            onClick: addSlide,
                                            style: { marginTop: '10px' }
                                        },
                                        __('Add First Slide', 'fancy-slider-block')
                                    )
                                ]
                            )
                    )
                ]
            );
        },

        save: function() {
            return null; // Using PHP render callback
        }
    });
})(window.wp); 
