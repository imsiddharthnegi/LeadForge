# LeadForge Design System

## CSS Variables Reference

### Sizing
- `--radius-card`: 8px (cards, containers)
- `--radius-input`: 6px (input fields, selects)
- `--radius-badge`: 4px (badges, tags, small elements)

### Shadows
- `--shadow-sm`: 0 1px 3px rgba(0,0,0,0.3) - subtle shadows
- `--shadow-md`: 0 4px 16px rgba(0,0,0,0.4) - elevated elements
- `--shadow-glow`: 0 0 24px rgba(0,210,200,0.08) - accent glow

### Borders
- `--border-light`: 1px solid rgba(255,255,255,0.07) - use with var()

### Surfaces (use for backgrounds)
- `--surface-1`: #0f1117 (page background)
- `--surface-2`: #161b27 (card backgrounds)
- `--surface-3`: #1e2535 (input backgrounds)

### Colors
- `--color-accent`: #00d4c8 (teal primary)
- `--color-text-primary`: #f0f4f8 (headings, primary text)
- `--color-text-secondary`: #8892a4 (secondary text)
- `--color-text-muted`: #4a5568 (muted/tertiary text)

## Usage Examples

### Cards
```jsx
<div className="rounded-card bg-surface-2 border-system shadow-ds-md p-4">
  Card content
</div>
```

### Inputs
```jsx
<input 
  className="rounded-input bg-surface-3 border-system text-primary"
  placeholder="Enter text..."
/>
```

### Badges
```jsx
<span className="rounded-badge bg-surface-2 text-secondary text-xs px-2 py-1">
  Badge
</span>
```

### Utility Classes
- `.surface-1`, `.surface-2`, `.surface-3` - background colors
- `.text-primary`, `.text-secondary`, `.text-muted-ds` - text colors
- `.border-system` - consistent border style
- `.shadow-ds-sm`, `.shadow-ds-md`, `.shadow-ds-glow` - shadow effects
- `.rounded-card`, `.rounded-input`, `.rounded-badge` - radius presets

## Existing HSL Variables (Maintained)
The app continues to use HSL variables for advanced gradient and accent work:
- `--accent-cyan`, `--accent-violet`, `--accent-amber`, `--accent-green`, `--accent-red`
- `--text-primary`, `--text-secondary`, `--text-muted` (HSL versions)
- Use these for colors that need transparency: `hsl(var(--accent-cyan) / 0.5)`

## Conversion Guide
When refactoring components:
1. Replace hardcoded `#161b27` with `bg-surface-2`
2. Replace hardcoded `#1e2535` with `bg-surface-3`
3. Replace `bg-white/[0.02]` with `bg-surface-2`
4. Replace `border border-white/[0.07]` with `border-system`
5. Keep HSL accent variables for colored accents and gradients
