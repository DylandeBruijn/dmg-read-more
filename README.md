# DMG Read More

A WordPress plugin that provides a Gutenberg block for adding stylized post links and includes a WP-CLI command for searching posts by block name.

## Features

**Post Link Block**
A Gutenberg block built with native WordPress React tools that allows editors to insert stylized post links. The block includes:
- Search functionality in the InspectorControls for finding published posts
- Pagination support for browsing search results
- Ability to search by specific post ID
- Recent posts displayed by default
- Live preview updates when selecting a different post

**WP-CLI Search Command**
A performance-optimized search command for finding posts that contain specific Gutenberg blocks. The command:
- Accepts optional `--date-before` and `--date-after` arguments (defaults to last 30 days)
- Executes efficient WP_Query
- Outputs matching Post IDs to STDOUT
- Provides informative error messages

## Installation

1. Clone or download this repository into your WordPress plugins directory:
   ```bash
   cd wp-content/plugins
   git clone https://github.com/DylandeBruijn/dmg-read-more.git
   ```

2. Install dependencies:
   ```bash
   cd dmg-read-more
   npm install
   composer install
   ```

3. Build the plugin:
   ```bash
   npm run build
   ```

4. Activate the plugin through the WordPress admin panel or with WP-CLI:
   ```bash
   wp plugin activate dmg-read-more
   ```

## Using the Post Link Block

1. Open any post or page in the block editor
2. Add a new block and search for "Post Link"
3. In the block's sidebar settings (InspectorControls), you'll see:
   - A search field to find posts by title or ID
   - Paginated results for easy browsing
   - Recent posts shown by default
4. Select a post from the results
5. The block displays as: "Read More: [Post Title]" with a link to the post
6. The output uses a paragraph element with the `dmg-read-more` CSS class
7. Selecting a different post immediately updates the displayed link

## WP-CLI Commands

The plugin adds a `dmg-read-more search` command for finding posts that contain specific block types.

### Basic Usage

Find posts containing a specific block:
```bash
wp dmg-read-more search dmg-read-more/post-link
```

### Options

- `--post_type=<type>` - Limit search to a specific post type (default: post)
- `--date-after=<date>` - Search posts published after this date in YYYY-MM-DD format (default: 30 days ago)
- `--date-before=<date>` - Search posts published before this date in YYYY-MM-DD format (default: today)
- `--limit=<number>` - Maximum number of results to return, use 0 for unlimited (default: 100)

### Examples

Find posts with the post-link block from a specific date range:
```bash
wp dmg-read-more search dmg-read-more/post-link --date-after=2024-01-01 --date-before=2024-12-31
```

Find pages containing core paragraph blocks:
```bash
wp dmg-read-more search paragraph --post_type=page
```

Get all posts with a block, no limit:
```bash
wp dmg-read-more search dmg-read-more/post-link --limit=0
```

## Development

### Build Scripts

- `npm run start` - Start development mode with watch
- `npm run build` - Build production files
- `npm run lint` - Run all linters (JavaScript, PHP, CSS)
- `npm run format` - Auto-fix formatting issues

### Code Standards

The plugin follows WordPress coding standards. Run linters before committing:

```bash
npm run lint:js    # JavaScript linting
npm run lint:php   # PHP linting
npm run lint:css   # CSS linting
```

## Author

Dylan de Bruijn
[GitHub](https://github.com/DylandeBruijn)
