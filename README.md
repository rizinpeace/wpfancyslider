# Pixeld Fancy Slider Block Plugin

A WordPress block plugin that provides a fancy slider with images, titles, descriptions, and links. This plugin is designed to work alongside child theme implementations without conflicts.

## Features

- **Conflict-Free Design**: Automatically detects and defers to child theme fancy slider blocks
- **Unique Namespace**: Uses `pixeld/fancy-slider` block name to avoid conflicts
- **Responsive Design**: Mobile-friendly slider with touch support
- **Customizable**: Configurable autoplay, arrows, dots, and slide count
- **Accessible**: Built with accessibility best practices

## Installation

1. Upload the plugin folder to `/wp-content/plugins/`
2. Activate the plugin through the 'Plugins' menu in WordPress
3. The block will be available in the block editor under "Widgets"

## Conflict Resolution

This plugin includes intelligent conflict detection:

- **Child Theme Detection**: Automatically checks if a child theme has registered a `spectra-one-child/fancy-slider` block
- **Graceful Deactivation**: If a conflict is detected, the plugin version is disabled and an admin notice is shown
- **No Interference**: The plugin will not interfere with existing child theme implementations

## Block Details

- **Block Name**: `pixeld/fancy-slider`
- **Title**: "Pixeld Fancy Slider"
- **Category**: Widgets
- **Text Domain**: `fancy-slider-block`

## CSS Classes

All CSS classes are prefixed with `pixeld-fancy-slider-` to avoid styling conflicts:

- `.pixeld-fancy-slider-fullscreen`
- `.pixeld-fancy-slider-thumbnail`
- `.pixeld-fancy-slider-arrow`
- And many more...

## JavaScript Functions

All JavaScript functions are prefixed with `pixeld` to avoid conflicts:

- `pixeldInitFullscreenSlider()`
- `pixeldInitThumbnailCarousel()`
- `pixeld_render_fancy_slider_block()`

## Admin Notices

If the plugin detects a conflicting child theme block, it will display an informational notice:

> **Pixeld Fancy Slider Block:** The child theme already has a Fancy Slider block registered. The plugin version has been disabled to prevent conflicts.

## Development

The plugin follows WordPress coding standards and includes:

- Proper sanitization and escaping
- Unique function and class names
- Conflict detection and resolution
- Responsive design
- Accessibility features

## Version

1.0.4 - Fixed frontend navigation functionality

## Changelog

### 1.0.4
- Fixed frontend navigation arrows and dots not working
- Uncommented main slider navigation arrows in render output
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
- Added debugging console logs for troubleshooting

### 1.0.2
- Enhanced backend editor preview with beautiful visual design
- Added proper heading display in editor preview
- Improved thumbnail layout and styling
- Added slide indicator showing current slide position
- Enhanced empty state with better visual design and call-to-action
- Added responsive design for editor preview
- Improved navigation arrows with better styling
- Added hover effects and smooth transitions

### 1.0.1
- Fixed text domain loading to prevent "called incorrectly" notices
- Added proper `plugins_loaded` hook for text domain initialization
- Created languages directory and POT template file
- Improved conflict detection logic

### 1.0.0
- Initial release with conflict-free implementation

## Author

Riz - [Pixeld](https://www.pixeld.com.au)

## License

GPL-2.0+ 