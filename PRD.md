# Hardware Cost Comparison Tool

A comprehensive tool for comparing the total cost of ownership (TCO) of compute hardware across Azure, AWS, and On-Premises infrastructure over a 3-year period.

**Experience Qualities**:
1. **Analytical** - Clear, data-driven interface that presents complex cost calculations in an understandable format
2. **Professional** - Business-focused design that instills confidence in enterprise decision-making
3. **Efficient** - Streamlined input process with instant calculations and comparisons

**Complexity Level**: Light Application (multiple features with basic state)
- Multiple cost calculation engines with real-time updates, form validation, and detailed breakdowns

## Essential Features

### Hardware Specification Input
- **Functionality**: Form to specify CPU cores, RAM (GB), and storage (GB) requirements
- **Purpose**: Capture user's compute requirements for accurate cost comparison
- **Trigger**: User enters the application
- **Progression**: Select CPU cores → Enter RAM amount → Specify storage → View calculations
- **Success criteria**: All inputs validated and calculations update in real-time

### Azure Cost Calculation
- **Functionality**: Calculate 3-year Azure VM costs based on specifications
- **Purpose**: Provide accurate cloud pricing for comparison
- **Trigger**: Hardware specs are entered
- **Progression**: Map specs to Azure VM sizes → Calculate monthly costs → Apply 3-year total
- **Success criteria**: Displays realistic Azure pricing with VM size recommendations

### AWS Cost Calculation
- **Functionality**: Calculate 3-year AWS EC2 costs based on specifications
- **Purpose**: Provide accurate cloud pricing for comparison
- **Trigger**: Hardware specs are entered
- **Progression**: Map specs to EC2 instance types → Calculate monthly costs → Apply 3-year total
- **Success criteria**: Displays realistic AWS pricing with instance type recommendations

### On-Premises Cost Calculation
- **Functionality**: Calculate hardware, power, and cooling costs using bargain hardware prices
- **Purpose**: Provide realistic on-prem alternative including operational costs
- **Trigger**: Hardware specs are entered
- **Progression**: Match to R730/R740 configurations → Add SSD pricing → Calculate power/cooling → Sum 3-year total
- **Success criteria**: Accurate hardware pricing with power consumption calculations

### Cost Comparison Visualization
- **Functionality**: Side-by-side cost breakdown with visual charts
- **Purpose**: Enable quick decision-making through clear cost comparison
- **Trigger**: All calculations complete
- **Progression**: Display totals → Show cost breakdowns → Highlight best value
- **Success criteria**: Clear winner identification with detailed cost breakdown

## Edge Case Handling
- **Minimum Requirements**: Prevent unrealistic configurations (e.g., 0 CPU, excessive RAM)
- **Maximum Specifications**: Cap inputs at reasonable enterprise limits
- **Invalid Combinations**: Guide users toward realistic hardware combinations
- **Network Errors**: Graceful handling if external pricing data is unavailable
- **Calculation Errors**: Fallback to estimated values with clear disclaimers

## Design Direction
The design should feel authoritative and analytical, like a professional business intelligence tool - clean, data-focused interface with clear hierarchies that guide users through complex cost comparisons without overwhelming them.

## Color Selection
Triadic color scheme using professional blues, greens, and oranges to represent different platforms while maintaining business credibility.

- **Primary Color**: Deep Business Blue (oklch(0.4 0.15 230)) - Professional, trustworthy, represents Azure
- **Secondary Colors**: Forest Green (oklch(0.45 0.12 150)) for AWS, Warm Orange (oklch(0.6 0.15 40)) for On-Prem
- **Accent Color**: Bright Cyan (oklch(0.7 0.15 200)) for highlighting best value and CTAs
- **Foreground/Background Pairings**: 
  - Background (White oklch(1 0 0)): Dark text (oklch(0.2 0 0)) - Ratio 16:1 ✓
  - Primary (Deep Blue oklch(0.4 0.15 230)): White text (oklch(1 0 0)) - Ratio 8.2:1 ✓
  - Secondary (Forest Green oklch(0.45 0.12 150)): White text (oklch(1 0 0)) - Ratio 7.1:1 ✓
  - Accent (Bright Cyan oklch(0.7 0.15 200)): Dark text (oklch(0.2 0 0)) - Ratio 12.8:1 ✓

## Font Selection
Clean, technical typography that conveys precision and reliability - Inter for its excellent readability in data-heavy interfaces and strong number rendering.

- **Typographic Hierarchy**:
  - H1 (Page Title): Inter Bold/32px/tight letter spacing
  - H2 (Section Headers): Inter Semibold/24px/normal letter spacing
  - H3 (Cost Totals): Inter Medium/20px/normal letter spacing
  - Body (Form Labels): Inter Regular/16px/normal letter spacing
  - Data (Prices): Inter Medium/18px/tabular numbers

## Animations
Subtle, professional animations that emphasize data relationships and state changes without distracting from analysis tasks.

- **Purposeful Meaning**: Smooth transitions between calculation states reinforce cause-and-effect relationships
- **Hierarchy of Movement**: Cost updates and comparisons deserve primary animation focus, form interactions secondary

## Component Selection
- **Components**: Cards for cost breakdowns, Forms for input, Tables for detailed comparisons, Progress indicators for calculations, Badges for platform identification
- **Customizations**: Custom chart components for cost visualization, specialized input components for hardware specs
- **States**: Form validation states, loading states during calculations, success states for completed comparisons
- **Icon Selection**: Server icons for hardware, Cloud icons for platforms, Calculator for costs, TrendingUp for comparisons
- **Spacing**: Consistent 4-unit (16px) spacing for major sections, 2-unit (8px) for related elements
- **Mobile**: Stacked card layout with collapsible sections, simplified input flow with progressive disclosure