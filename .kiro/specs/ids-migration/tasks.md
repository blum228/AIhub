# Implementation Plan

- [x] 1. Create global typography styles
  - [x] 1.1 Create `src/styles/typography.css` with base element styles
    - Define styles for h1-h6 using IDS font-size and font-weight tokens
    - Define styles for p with proper line-height and margin
    - Define styles for ul, ol, li with proper spacing
    - _Requirements: 6.2, 6.3, 6.4_
  - [ ] 1.2 Write property test for typography token compliance
    - **Property 2: Typography Token Compliance**
    - **Validates: Requirements 3.1, 3.2, 3.3**

- [x] 2. Create global link styles
  - [x] 2.1 Create `src/styles/links.css` with link styling rules
    - Define body text link styles with `--ids__link` color and underline
    - Define `.ids__nav-link` class for navigation links
    - Define hover states for both link types
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 6.1_
  - [ ] 2.2 Write property test for link styling compliance
    - **Property 5: Link Styling Compliance**
    - **Validates: Requirements 1.1, 1.3, 1.5**

- [x] 3. Update SiteLayout to include new stylesheets
  - [x] 3.1 Import `typography.css` and `links.css` in SiteLayout.astro
    - Add imports after existing style imports
    - Ensure correct load order: reset → tokens → colors → typography → links
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 4. Checkpoint - Ensure all tests pass
  - Build passes successfully

- [x] 5. Migrate Header component
  - [x] 5.1 Update Header.astro link classes
    - Add `ids__nav-link` class to navigation links
    - Remove redundant link styling from component styles
    - _Requirements: 1.3, 1.4_

- [x] 6. Migrate Footer component
  - [x] 6.1 Update Footer.astro link classes
    - Add `ids__nav-link` class to navigation links
    - Remove redundant link styling from component styles
    - _Requirements: 1.3, 1.4_

- [x] 7. Migrate Breadcrumbs component
  - [x] 7.1 Refactor Breadcrumbs.astro to use IDS conventions
    - Replace `aigh__` prefix with `ids__` in class names
    - Add `ids__nav-link` class to breadcrumb links
    - Replace any hardcoded spacing with IDS tokens
    - _Requirements: 1.3, 7.1, 7.2, 2.1_
  - [ ] 7.2 Write property test for naming convention compliance
    - **Property 6: Naming Convention Compliance**
    - **Validates: Requirements 7.1, 7.2**

- [x] 8. Migrate CTAButton component
  - [x] 8.1 Refactor CTAButton.astro to use IDS conventions
    - Replace `aigh__` prefix with `ids__` in class names
    - Verify all spacing uses IDS tokens
    - _Requirements: 1.5, 7.1, 7.2_

- [x] 9. Migrate VerdictBox component
  - [x] 9.1 Refactor VerdictBox.astro to use IDS tokens
    - Replace `aigh__` prefix with `ids__` in class names
    - Replace hardcoded spacing (`0.5em`, `0.8em`) with `--ids__space-s`, `--ids__space-m`
    - Replace hardcoded font sizes (`1.1em`, `1.05em`, `0.9em`) with IDS tokens
    - Replace hardcoded radius (`0.5em`) with `--ids__radius-s`
    - _Requirements: 2.1, 3.1, 4.1, 7.1, 7.2_
  - [ ] 9.2 Write property test for spacing token compliance
    - **Property 1: Spacing Token Compliance**
    - **Validates: Requirements 2.1, 2.2, 2.3**

- [x] 10. Migrate ProsConsList component
  - [x] 10.1 Refactor ProsConsList.astro to use IDS tokens
    - Replace `aigh__` prefix with `ids__` in class names
    - Replace hardcoded spacing with IDS tokens
    - Replace hardcoded font sizes with IDS tokens
    - Replace hardcoded radius (`0.5em`) with `--ids__radius-s`
    - Replace `rgb(0, 140, 70)` with `var(--ids__success)`
    - _Requirements: 2.1, 3.1, 4.1, 5.4, 7.1, 7.2_
  - [ ] 10.2 Write property test for color token compliance
    - **Property 4: Color Token Compliance**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5**

- [x] 11. Migrate ModelHero component
  - [x] 11.1 Refactor ModelHero.astro to use IDS tokens
    - Replace `aigh__` prefix with `ids__` in class names
    - Replace hardcoded spacing (`0.5em`, `1em`) with IDS tokens
    - Replace hardcoded font sizes (`2.2em`, `1.8em`, `1.1em`) with IDS tokens
    - Replace hardcoded radius (`1em`) with `--ids__radius-m`
    - _Requirements: 2.1, 3.1, 4.1, 7.1, 7.2_
  - [ ] 11.2 Write property test for radius token compliance
    - **Property 3: Radius Token Compliance**
    - **Validates: Requirements 4.1, 4.2**

- [x] 12. Migrate ModelCardSemantic component
  - [x] 12.1 Refactor ModelCardSemantic.astro to use IDS tokens
    - Replace hardcoded shadow `rgba(0, 0, 0, 0.1)` with IDS shadow token
    - Replace `rgb(0, 140, 70)` with `var(--ids__success)`
    - _Requirements: 5.4_

- [x] 13. Checkpoint - Ensure all tests pass
  - Build passes successfully

- [x] 14. Update tokens.css documentation
  - [x] 14.1 Add comments to tokens.css explaining token usage
    - Add comments for spacing tokens with pixel equivalents
    - Add comments for color tokens with semantic meaning
    - Add comments for typography tokens with use cases
    - _Requirements: 8.1, 8.2, 8.3_

- [x] 15. Final Checkpoint - Ensure all tests pass
  - Build passes successfully
