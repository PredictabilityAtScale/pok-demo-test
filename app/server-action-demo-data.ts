export const fakePullRequestBody = `Title: Add application theming and dark mode

## Summary
- add a theme provider that supports light, dark, and system modes
- persist the selected theme in localStorage so it survives reloads
- introduce semantic color tokens for surfaces, text, borders, and accents
- update the marketing pages and dashboard shell to consume theme tokens instead of hard-coded colors

## Implementation details
- create a client-side ThemeProvider using React context and prefers-color-scheme
- add a theme toggle to the top navigation with accessible pressed state labels
- move global colors in globals.css to CSS custom properties for both light and dark themes
- replace direct zinc and slate utility usage in shared components with token-backed classes
- add a short page transition to smooth theme changes without flashing the wrong theme

## Testing
- verify the stored theme wins over system preference on reload
- verify server-rendered markup hydrates without theme mismatch warnings
- verify charts, cards, dialogs, and form controls meet contrast requirements in dark mode

## Risks
- some legacy components still use direct color utilities and may look inconsistent until migrated
- screenshots in documentation will need to be refreshed after the visual update`;