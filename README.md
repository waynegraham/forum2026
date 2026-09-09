# forum2026.diglib.org

Static site for the DLF Forum 2026, built with Eleventy 3, Tailwind CSS 4, and PostCSS.

## Requirements

- Node.js 24 or newer
- `pnpm` 10.32.1 or compatible

The repository pins the package manager in `package.json`. With Corepack:

```bash
corepack enable
corepack prepare pnpm@10.32.1 --activate
```

## Quick Start

Install dependencies:

```bash
pnpm install
```

Start Eleventy and the PostCSS watcher:

```bash
pnpm dev
```

The development server writes to `_site/` and usually serves the site at `http://localhost:8080`. The terminal output should tell you the URL to access the site.

Stop the development server with `Ctrl+C` in the terminal where `pnpm dev` is running.

## VS Code Setup

This project includes recommended VS Code extensions in `.vscode/extensions.json`. When you open the repository in VS Code, it should prompt you to install them. If it does not, open the Extensions panel and search for `@recommended`.

The recommended extensions support:

- Nunjucks syntax and formatting
- Tailwind CSS class completion
- ESLint and Prettier feedback
- Markdown linting and editing helpers
- HTML tag closing, renaming, and highlighting
- `.gitignore` support
- GitHub Actions workflow visibility

VS Code can be used for the editing and Git parts of the workflow. Use the built-in terminal for commands such as `pnpm install`, `pnpm dev`, `pnpm build`, and `pnpm test`. Use the Source Control panel to review changed files, stage changes, write commit messages, commit, and push. Use the GitHub Actions extension to check whether preview and production builds passed after pushing.

## Commands

```bash
pnpm dev
```

Run Eleventy in serve mode and watch CSS. Stop it with `Ctrl+C` from the same terminal session.

```bash
pnpm build
```

Clean `_site/`, build Eleventy with production transforms, then compile CSS.

```bash
pnpm test
```

Run a fresh production build, then execute the Node test suite in `tests/`.

```bash
pnpm lint
pnpm lint:html
```

Run JavaScript/CSS linting, and HTML/template validation. `pnpm lint` runs ESLint and Stylelint; run `pnpm lint:html` separately when checking Nunjucks/HTML templates.

```bash
pnpm format:check
pnpm format
```

Check or apply Prettier formatting.

## Project Structure

- `src/`: Eleventy source files
- `src/_data/`: global data, including `metadata.json`
- `src/_includes/`: shared partials such as navigation, footer, Open Graph, and CTAs
- `src/_layouts/`: base page layouts
- `src/posts/`: Markdown news posts
- `src/resources/`: resource landing page and resource entries
- `src/assets/`: passthrough assets copied to `_site/assets/`
- `src/static/`: passthrough assets copied to `_site/static/`
- `src/styles/site.css`: Tailwind import, theme tokens, and shared component CSS
- `tests/`: post-build checks against generated HTML
- `_site/`: generated output, not source
- `.eleventy.js`: Eleventy configuration, plugins, filters, collections, and passthrough rules

## Content Conventions

Most pages are Nunjucks templates with YAML front matter. Use `layout: base.njk` for standard pages and `layout: page.njk` for pages that need the large image-backed hero.

Navigation is driven by `eleventyNavigation` front matter and rendered from `collections.all | eleventyNavigation` in the navigation and footer includes:

```yaml
eleventyNavigation:
  key: Resources
  order: 3
```

Resource cards on `/resources/` are driven by the `resources` collection. Add a resource page under `src/resources/` with resource tags:

```yaml
tags: [resources]
eleventyNavigation:
  key: For Presenters
  parent: Resources
  order: 1
```

Utility output files and private reference pages should be omitted from collections:

```yaml
eleventyExcludeFromCollections: true
```

The styleguide is available at `/styleguide/` as a direct reference page, but is intentionally excluded from 11ty collections so it does not appear in navigation, footer links, sitemap collection loops, or resource listings.

### Adding Sponsors

Sponsors are displayed on `/sponsorship/sponsors/` and are managed through `src/_data/sponsors.json`. The page groups sponsors by the `level` field using the `sponsorsByLevel` collection in `.eleventy.js`.

Add one object per sponsor:

```json
{
  "name": "Sponsor Name",
  "level": "Gold",
  "url": "https://example.org",
  "logo": "/static/sponsor-name-logo.webp",
  "description": "A short description of the sponsor and their work.",
  "placeholder": false
}
```

Sponsor fields:

- `name`: display name for the sponsor.
- `level`: sponsorship tier. Use exactly `Platinum`, `Gold`, `Silver`, or `Bronze`.
- `url`: sponsor website URL. Sponsor names, logos, and card links point here.
- `logo`: path to the sponsor logo. Put logo files in `src/static/` and reference them as `/static/filename.ext`.
- `description`: short public description shown on the sponsor card.
- `placeholder`: optional boolean. Use `true` only for dummy records; omit it or set it to `false` for confirmed sponsors.

Logo guidance:

- Prefer sponsor-supplied SVG, PNG, or WebP files with transparent or white backgrounds.
- Use descriptive lowercase filenames such as `acme-library-logo.svg`.
- Keep logos visually balanced; the sponsor card constrains logo display, but oversized source files should still be optimized before committing.
- Remove dummy sponsor records from `src/_data/sponsors.json` when confirmed sponsors are ready to publish.

Posts live as Markdown files in `src/posts/`. The directory data file `src/posts/posts.json` applies the post layout and the `post` collection tag automatically. Individual posts should still include their display title, optional hero image, date, category tag, and draft state:

```yaml
title: 'Community Voting Now Open'
description: 'A short summary for listings and metadata.'
image: /static/community-voting.webp
date: 2026-05-12
draft: false
tags: announcements
```

Posts with `draft: true` are omitted from production builds.

### Adding A New Post

1. Draft the post in Google Docs. Use heading styles, lists, and links cleanly so the Markdown export is easier to review.
2. In Google Docs, download the draft as Markdown. This usually creates a `.zip` containing the `.md` file and any exported images.
3. Rename the Markdown file in kebab-case and place it in `src/posts/`, for example `community-voting-now-open.md`. Keep filenames lowercase and descriptive. This will become part of the URL (e.g. `/posts/community-voting-now-open/`). Best practice is to use the title of the post as the slug.
4. Review the Markdown before committing it. Remove Google Docs export artifacts, fix escaped punctuation when needed, and make sure links and buttons use the expected site syntax.
5. Add or update front matter at the top of the file:

   ```yaml
   ---
   title: Post Title
   description: Short summary for listings and metadata.
   image: /static/example-image.webp
   imageGravity: center
   date: 2026-05-13
   tags: announcements
   draft: true
   ---
   ```

6. Use `draft: true` while the post is in progress. Switch to `draft: false` only when it is ready for production.

Post tags:

- `post` is already supplied by `src/posts/posts.json`; do not add it again in individual post front matter.
- Use the post's category tag in the post file. The current default is `announcements`.
- Prefer these post category tags before adding new ones:
  - `announcements`: official site, registration, voting, deadline, and general event updates
  - `program`: schedule, session format, speaker, and program content updates
  - `fellowships`: fellowship, scholarship, and cohort opportunities
  - `sponsors`: sponsor announcements and sponsor-related updates

- If a post needs multiple category tags, use YAML array syntax, for example `tags: [announcements, program]`.

Post images:

- Put post images in `src/static/`.
- Prefer `.webp` for published images and reference them as `/static/filename.webp`.
- If starting from JPG or PNG files, add the originals to `src/static/`, then resize oversized files:

  ```bash
  ./resize_images.sh
  ```

  On Windows:

  ```powershell
  .\resize_images.ps1
  ```

- Generate WebP versions from JPG originals:

  ```bash
  ./generate_webp.sh
  ```

  On Windows:

  ```powershell
  .\generate_webp.ps1
  ```

- To regenerate existing WebP files from JPG originals, run:

  ```bash
  ./generate_webp.sh --all
  ```

  On Windows:

  ```powershell
  .\generate_webp.ps1 -All
  ```

- `resize_images.sh` and `resize_images.ps1` require ImageMagick. `generate_webp.sh` and `generate_webp.ps1` require the `cwebp` command.
- After generating a `.webp`, update the post's `image` front matter to use the WebP file.
- Keep the source JPG/PNG files in `src/static/` as repo-managed originals, even when the published post uses WebP.

Image gravity:

- Use `imageGravity` when the hero crop needs to favor a specific part of the image.
- Common values are `top`, `center`, and `bottom`.
- Use a quoted percentage for finer vertical alignment, such as `imageGravity: "65%"`.
  `0%` aligns the top, `50%` centers the image, and `100%` aligns the bottom.
- Use two quoted percentages for horizontal and vertical alignment, respectively:
  `imageGravity: "40% 65%"`.
- Percentages from `0%` to `100%`, including decimals, work in both post and page heroes.
  The visible effect depends on how much the image is cropped at the current screen size.
- Omit `imageGravity` when the default crop works.

## Styling

Shared design tokens live in `src/styles/site.css` inside the Tailwind `@theme` block. Prefer the existing color, font, radius, and shadow tokens before adding new values.

Common reusable classes include:

- `editorial-grid`
- `eyebrow`
- `section-title`
- `surface-card`
- `showcase-grid`
- `button-primary`
- `button-secondary`
- `button-ghost`
- `text-link`
- `form-field`
- `form-label`
- `callout`

The current visual direction is editorial and practical: warm surface colors, strong Manrope headings, Public Sans body text, rounded content blocks, concise CTAs, and clear section bands.

## Data And URLs

Global site metadata is in `src/_data/metadata.json`. This includes the production URL, site title, description, Google Analytics ID, and proposal URL used by the navigation and CTA buttons.

The Eleventy config sets a `pathPrefix` of `/forum2026/` when building from the `dev` branch. Other branches build with no prefix.

## Assets And Images

Files in `src/static/` are copied through to `_site/static/`, and files in `src/assets/` are copied through to `_site/assets/`. The Eleventy image transform plugin is enabled for generated image formats, but explicit static assets are still managed in `src/static/` or `src/assets/`.

Image credits:

- [Compare Fibre](https://unsplash.com/@comparefibre?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/macbook-air-displaying-woman-in-white-shirt-fRGoTJFQAHM?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
- [Jason Dent](https://unsplash.com/@jdent?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/green-and-white-abstract-painting-UNDqO_CL30s?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
- [Samantha Borges](https://unsplash.com/@samich_18?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/macbook-pro-on-brown-wooden-table-ax3lbQfdXP0?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

## Testing

The test suite reads generated files from `_site/`, so run `pnpm build` before `node --test tests/site.test.mjs` if running the test command manually. `pnpm test` already performs the build first.

Current tests check accessibility and navigation basics, including:

- skip link and focusable main landmark
- `aria-current` on active navigation entries
- proposal CTAs rendering as links or clear placeholder text
- decorative Material Symbols hidden from assistive technology

## Deployment

GitHub Actions builds and deploys the site to GitHub Pages from pushes to `main` and `dev` using Node.js 24. The deploy workflow installs dependencies with `pnpm install --frozen-lockfile`, runs `pnpm build`, uploads `_site/`, and deploys through Pages.

CI also runs on pushes and pull requests targeting `main` and `dev`. The CI workflow runs `pnpm lint`, `pnpm format:check`, `pnpm build`, and `pnpm test`; run `pnpm lint:html` locally for template validation unless the workflow is updated to include it.

### Sample Git Workflow

This repository uses two GitHub remotes:

- `dev`: `waynegraham/forum2026`, used for previewing pages, posts, and components at <https://waynegraham.github.io/forum2026/> before they are released on the main site.
- `origin`: `clirdlf/forum2026`, used for the main public site at <https://forum2026.diglib.org/>.

For routine content updates, work locally on the `dev` branch first:

```bash
git switch dev
git pull dev dev
```

In VS Code, you can do the same branch check from the branch name in the lower-left corner. Make sure it says `dev` before you start editing. Use the Source Control panel's sync/pull action if the branch needs the latest changes.

Add or edit the page, post, images, or styles locally. Before committing, run the local checks that match the size of the change:

```bash
pnpm build
pnpm test
```

Review what changed:

```bash
git status
git diff
```

In VS Code, the Source Control panel shows the same changed files. Click a file to review its diff before staging it.

Stage the files you meant to change. Replace these example paths with the files from `git status` that belong to your update:

```bash
git add README.md
git add src/posts/example-post.md
git add src/static/example-image.jpg src/static/example-image.webp
```

In VS Code, stage the same files by selecting the `+` next to each intended file in the Source Control panel.

Commit the change with a short message:

```bash
git commit -m "Add example post"
```

In VS Code, type the same short message in the Source Control message box, then choose Commit.

Push the `dev` branch to the preview remote:

```bash
git push dev dev
```

In VS Code, use the Source Control panel's push action. Confirm that the push is going to the `dev` remote and the `dev` branch.

After pushing, watch the GitHub Actions build for the `waynegraham/forum2026` repository. You can do this on GitHub or with the recommended GitHub Actions VS Code extension. When the build finishes, view the preview site at <https://waynegraham.github.io/forum2026/> and confirm the page, post, images, and links look right.

When the preview is approved and ready for the main site, merge `dev` into `main` locally:

```bash
git switch main
git pull origin main
git merge dev
```

Run the build and tests again before publishing:

```bash
pnpm build
pnpm test
```

Push `main` to the production remote:

```bash
git push origin main
```

Then watch the GitHub Actions build for the `clirdlf/forum2026` repository. When it finishes, view the main site at <https://forum2026.diglib.org/> and confirm the published output.

If Git reports conflicts during `git merge dev`, stop and resolve those files before pushing to `origin`. Do not force-push unless the project maintainer explicitly asks for it.
