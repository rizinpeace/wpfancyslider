# Fancy Slider Block Plugin

A WordPress block plugin that creates a sophisticated fullscreen slider with background images, thumbnail navigation, and customizable content. This plugin provides a modern, responsive slider experience with both editor and frontend functionality.

## Features

- **Fullscreen Background Slider**: Creates immersive fullscreen slides with background images
- **Thumbnail Navigation**: Interactive thumbnail carousel with pagination dots
- **Rich Content Support**: Each slide can have title, description, and custom links
- **Responsive Design**: Mobile-friendly with touch support and adaptive layouts
- **Customizable Settings**: Configurable autoplay, navigation arrows, dots, and slide count
- **Editor Preview**: Real-time preview in the WordPress block editor
- **Accessibility**: Built with ARIA attributes and keyboard navigation support
- **Conflict-Free**: Uses unique namespace to avoid conflicts with other plugins

## Project Structure

```
wpfancyslider/
├── fancy-slider-block.php          # Main plugin file with registration
├── blocks/
│   ├── block.json                  # Block configuration and attributes
│   ├── index.js                    # Block editor JavaScript (686 lines)
│   ├── render.php                  # Frontend rendering logic (411 lines)
│   ├── script.js                   # Frontend JavaScript functionality
│   └── style.css                   # Complete styling (1529 lines)
├── languages/
│   └── fancy-slider-block.pot      # Translation template
└── README.md                       # This file
```

## Installation

1. Upload the `wpfancyslider` folder to `/wp-content/plugins/`
2. Activate the plugin through the 'Plugins' menu in WordPress
3. The "Fancy Slider" block will be available in the block editor under "Widgets"

## Block Configuration

### Block Details
- **Block Name**: `fancy-slider`
- **Title**: "Fancy Slider"
- **Category**: Widgets
- **Text Domain**: `fancy-slider-block`
- **Supports**: Wide and full alignment

### Attributes
The block supports the following configurable attributes:

- **heading** (string): Main heading text
- **headingColor** (string): Heading background color (default: #f0f2f2)
- **slides** (array): Array of slide objects with:
  - `title`: Slide title
  - `description`: Slide description
  - `imageUrl`: Background image URL
  - `link`: Custom link URL
  - `linkText`: Link text (default: "Learn More")
- **slidesToShow** (number): Number of thumbnails to display (default: 3)
- **autoplay** (boolean): Enable autoplay (default: true)
- **autoplaySpeed** (number): Autoplay interval in milliseconds (default: 10000)
- **arrows** (boolean): Show navigation arrows (default: true)
- **dots** (boolean): Show pagination dots (default: true)

## Technical Implementation

### Frontend Rendering (`render.php`)
- Generates unique block IDs for multiple instances
- Creates fullscreen background container with overlay
- Implements thumbnail carousel with pagination
- Injects JavaScript initialization functions
- Handles responsive design and accessibility

### Editor Interface (`index.js`)
- Comprehensive slide management system
- Visual slide tabs for easy navigation
- Rich media upload integration
- Real-time preview with background images
- Slide reordering and deletion capabilities

### Styling (`style.css`)
- Complete responsive design system
- Editor-specific styles for preview
- Frontend styles with hover effects
- Mobile-first approach with breakpoints
- Custom scrollbar styling for thumbnails

### JavaScript Functionality (`script.js`)
- Keyboard navigation support
- Accessibility attribute management
- Event handling for multiple slider instances

## CSS Classes

All CSS classes are prefixed with `fancy-slider-` to avoid styling conflicts:

### Main Container
- `.fancy-slider-fullscreen` - Main slider container
- `.fancy-slider-bg-container` - Background image container
- `.fancy-slider-bg` - Individual background slides
- `.fancy-slider-bg-overlay` - Background overlay

### Content Elements
- `.fancy-slider-heading-container` - Heading section
- `.fancy-slider-content` - Slide content
- `.fancy-slider-title` - Slide titles
- `.fancy-slider-description` - Slide descriptions

### Navigation
- `.fancy-slider-thumbnails-container` - Thumbnail navigation
- `.fancy-slider-thumbnail` - Individual thumbnails
- `.fancy-slider-arrow` - Navigation arrows
- `.thumbnail-carousel-dots` - Pagination dots

## JavaScript Functions

All JavaScript functions are now generic (no prefix):

- `initFullscreenSlider(sliderId, options)` - Initialize main slider
- `initThumbnailCarousel(sliderId)` - Initialize thumbnail navigation
- `render_fancy_slider_block(attributes, content)` - PHP render callback

## Responsive Breakpoints

The plugin includes comprehensive responsive design:

- **Desktop**: 1200px+ - Full layout with all features
- **Tablet**: 992px-1199px - Adjusted spacing and typography
- **Mobile Large**: 768px-991px - Simplified layout
- **Mobile**: 576px-767px - Stacked layout
- **Mobile Small**: <576px - Minimal layout

## Accessibility Features

- ARIA attributes for screen readers
- Keyboard navigation support (arrow keys)
- Focus management
- Semantic HTML structure
- High contrast support

## Development

### Requirements
- WordPress 5.0+
- PHP 7.4+
- Modern browser support

### Coding Standards
- WordPress coding standards compliance
- Proper sanitization and escaping
- Unique function and class names
- Comprehensive error handling

## Version History

### 1.0.4
- Fixed frontend navigation functionality
- Uncommented main slider navigation arrows
- Fixed undefined `$link` variable in thumbnail loop
- Added proper null checks for navigation elements
- Enhanced debugging with comprehensive console logging
- Improved event handling with preventDefault and stopPropagation

### 1.0.3
- Fixed navigation arrows not working in editor preview
- Added proper closure handling for click events
- Implemented safe slide navigation with bounds checking
- Added useEffect to manage activeSlide state consistency
- Enhanced error handling for out-of-bounds slide access

### 1.0.2
- Enhanced backend editor preview with beautiful visual design
- Added proper heading display in editor preview
- Improved thumbnail layout and styling
- Added slide indicator showing current slide position
- Enhanced empty state with better visual design

### 1.0.1
- Fixed text domain loading to prevent "called incorrectly" notices
- Added proper `plugins_loaded` hook for text domain initialization
- Created languages directory and POT template file

### 1.0.0
- Initial release with fullscreen slider functionality

## Author

Riz

## License

GPL-2.0+ 