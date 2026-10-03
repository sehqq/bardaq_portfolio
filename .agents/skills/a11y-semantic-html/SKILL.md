name	a11y-semantic-html
description	Use this skill when the user asks about semantic HTML structure, heading hierarchy, landmark regions, div soup, divitis, "which HTML element should I use", "semantic markup", "HTML accessibility", "ARIA landmarks", "page structure", "section vs div", "article vs section", "when to use aside", or is writing HTML templates, page layouts, or component markup that requires accessible structural decisions. Also use when reviewing HTML for screen reader compatibility or document outline correctness.
Semantic HTML for Accessibility
Skill type: Reference. This is teaching/pattern content — it explains which element to use when and why. It is not a scanner. For static review of existing markup, use /a11y-review. For runtime verification, use the a11y-testing skill to set up real axe.

Semantic HTML is the foundation of accessible web content. The right element provides built-in roles, keyboard behavior, and accessibility tree information that ARIA cannot fully replicate.

Core principle: Always use the most semantically specific native HTML element available. ARIA is a supplement for custom widgets — not a replacement for correct HTML.

Document Outline and Headings
The Heading Rule: One <h1>, Sequential Order, No Skips
Headings create a machine-readable outline that screen reader users navigate by jumping between levels.

<!-- CORRECT: Sequential, logical hierarchy -->
<h1>Guide to Accessible Design</h1>
  <h2>Color and Contrast</h2>
    <h3>Text Contrast Requirements</h3>
    <h3>UI Component Contrast</h3>
  <h2>Keyboard Navigation</h2>
    <h3>Focus Management</h3>

<!-- WRONG: Skipped level — screen reader users think they missed content -->
<h1>Guide to Accessible Design</h1>
  <h3>Color and Contrast</h3>  <!-- ❌ jumped from h1 to h3 -->
Rules:

One <h1> per page — the primary descriptor of the page's topic
Never skip heading levels downward (h1 → h3 skips h2)
You CAN jump back up (h3 → h2 when starting a new section)
Never use headings for visual size. Use CSS font-size. Heading level = document structure, not visual hierarchy.
Heading Level vs. Visual Appearance (Tailwind/React pattern)
// WRONG: Using h4 because you want small text
<h4 className="text-sm font-medium text-gray-500">Card Label</h4>

// CORRECT: Use the right level, control size with CSS
<h3 className="text-sm font-medium text-gray-500">Card Label</h3>

// CORRECT: If it's not actually a heading, use a <p> or <span>
<p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Card Label</p>
Landmark Regions
HTML5 landmark elements map directly to ARIA landmark roles. Screen reader users navigate between landmarks to skip to the content they want.

Element	Implicit ARIA Role	Use For
<header>	banner	Site header, logo, primary navigation
<nav>	navigation	Navigation menus, breadcrumbs
<main>	main	The page's unique, primary content
<footer>	contentinfo	Site footer, copyright, secondary nav
<aside>	complementary	Sidebars, related content, pull quotes
<section>	region (only with a label)	Thematic groupings with a heading
<article>	article	Self-contained, repeatable content units
Landmark Rules
Every page must have exactly one <main>:

<!-- CORRECT: One main, clearly the primary content -->
<body>
  <header>...</header>
  <nav aria-label="Primary">...</nav>
  <main id="main-content">
    <h1>Page Title</h1>
    <!-- unique page content here -->
  </main>
  <footer>...</footer>
</body>
Multiple landmarks of the same type require unique labels:

<!-- WRONG: Two nav elements — screen reader can't tell them apart -->
<nav>Primary menu</nav>
<nav>Footer menu</nav>

<!-- CORRECT: Labeled uniquely -->
<nav aria-label="Primary">...</nav>
<nav aria-label="Footer">...</nav>
<section> only creates a landmark region if it has a label:

<!-- Creates no landmark (section without label) -->
<section>...</section>

<!-- Creates a named region landmark -->
<section aria-labelledby="trending-heading">
  <h2 id="trending-heading">Trending Articles</h2>
  ...
</section>
Semantic Elements vs. Generic Divs
The "Right Element" Decision Tree
Before reaching for <div>, ask:

Is this a navigation menu? → <nav>
Is this the primary page content? → <main>
Is this a standalone, shareable content unit (blog post, product card, comment)? → <article>
Is this a thematic section with its own heading? → <section aria-labelledby="...">
Is this sidebar or complementary content? → <aside>
Is this a list of items? → <ul> / <ol> + <li>
Is this a button that triggers an action? → <button> (never <div onClick>)
Is this a link to another page/URL? → <a href="https://github.com/radesjardins/rad-claude-skills/blob/7bf17fffac6e015b2b70d9cb5a58be9fd1b9720b/plugins/rad-a11y/skills/a11y-semantic-html/..."> (never <div onClick>)
Is this a data table? → <table> + <thead> + <tbody> + <th scope> + <td>
Is this purely a layout container? → <div> is appropriate
Div-as-Button Anti-Pattern
<!-- WRONG: Zero keyboard accessibility, no announced role -->
<div class="btn" onclick="submitForm()">Submit</div>

<!-- CORRECT: Native button — keyboard focusable, Enter/Space activatable -->
<button type="button" onclick="submitForm()">Submit</button>
If you absolutely must use a non-button element as a button:

<div
  role="button"
  tabindex="0"
  onclick="submitForm()"
  onkeydown="if(e.key==='Enter'||e.key===' ')submitForm()">
  Submit
</div>
This requires: role="button", tabindex="0", AND keyboard event handlers. All three. Native <button> is always better.

Lists and List Items
<!-- WRONG: Visual list with no semantic meaning -->
<div class="nav-links">
  <div>Home</div>
  <div>About</div>
  <div>Contact</div>
</div>

<!-- CORRECT: Screen readers announce "list, 3 items" -->
<ul>
  <li><a href="/">Home</a></li>
  <li><a href="/about">About</a></li>
  <li><a href="/contact">Contact</a></li>
</ul>
Tailwind note: Applying list-none to a <ul> removes list semantics in some screen readers (VoiceOver on Safari). If list semantics matter, add role="list" explicitly:

<ul class="list-none space-y-2" role="list">...</ul>
Interactive Elements
Buttons vs. Links
Element	Use When	Keyboard
<button>	Performs an action (submit, toggle, open modal)	Tab to focus, Enter or Space to activate
<a href>	Navigates to a URL	Tab to focus, Enter to activate
<!-- CORRECT -->
<button type="button" onclick="openModal()">Open Settings</button>
<a href="/settings">Go to Settings</a>

<!-- WRONG: Link used as a button (no href, or href="#") -->
<a href="#" onclick="openModal()">Open Settings</a>
<!-- ❌ Pressing Space on this scrolls the page instead of activating -->
Form Inputs
Every interactive form control needs an associated label:

<!-- Method 1: Explicit association (preferred) -->
<label for="email">Email Address</label>
<input type="email" id="email" name="email">

<!-- Method 2: Wrapping label -->
<label>
  Email Address
  <input type="email" name="email">
</label>

<!-- WRONG: Input without any label -->
<input type="email" placeholder="Enter your email">
<!-- ❌ Placeholder disappears on typing; fails WCAG 3.3.2 -->
Tables
Use <table> for tabular data only — never for layout. Data tables need proper header markup:

<table>
  <caption>Monthly Sales by Region</caption>
  <thead>
    <tr>
      <th scope="col">Month</th>
      <th scope="col">North</th>
      <th scope="col">South</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">January</th>
      <td>$10,000</td>
      <td>$8,500</td>
    </tr>
  </tbody>
</table>
<caption>: describes the table (equivalent to alt text for images)
scope="col" on column headers
scope="row" on row headers
For complex tables: use id + headers attribute
React-Specific: Fragments Prevent Semantic Breaks
// WRONG: Wrapper div breaks ul > li structure
function NavItem({ href, label }) {
  return (
    <div>  {/* ❌ <ul> → <div> → <li> is invalid HTML */}
      <li><a href={href}>{label}</a></li>
    </div>
  );
}

// CORRECT: Fragment preserves ul > li
function NavItem({ href, label }) {
  return (
    <>
      <li><a href={href}>{label}</a></li>
    </>
  );
}
<section> vs. <article> vs. <div>
Element	Use When
<article>	Content could be syndicated standalone (blog posts, news articles, comments, product cards, tweets)
<section>	Thematic grouping within the page that deserves its own heading
<div>	No semantic meaning needed — purely structural/layout
<!-- Blog page structure -->
<main>
  <h1>Our Blog</h1>

  <section aria-labelledby="featured-heading">
    <h2 id="featured-heading">Featured Posts</h2>
    <article>
      <h3><a href="/post-1">Post Title</a></h3>
      <p>Post excerpt...</p>
    </article>
  </section>

  <section aria-labelledby="recent-heading">
    <h2 id="recent-heading">Recent Posts</h2>
    <!-- more articles -->
  </section>
</main>