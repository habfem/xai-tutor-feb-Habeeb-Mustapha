# Orders Management Frontend

Next.js 16+ frontend for the orders management application.

## Setup

```bash
npm install
npm run dev
```

App runs at `http://localhost:3000`

---

## Mock Data

**Important:** Candidates must seed their own mock data via the backend API or in-memory storage.

---

## Required Components

Build these sections to match `implementation.jpeg`:

### 1. Header
- Logo (Prodex with orange star icon)
- Collapse sidebar toggle
- "Orders" page title
- User avatar stack with "+2" indicator
- Notification bell with red badge (24)
- Search bar with ⌘K shortcut
- User profile avatar

### 2. Sidebar
- Workspace selector dropdown (Uxerflow)
- Main section:
  - Dashboard
  - Products (with expand arrow)
  - Orders (expanded, active)
    - All Orders (highlighted/active)
    - Returns
    - Order Tracking
  - Sales
  - Customers
  - Reports
- Settings section:
  - Marketplace Sync
  - Payment Gateways
  - Settings (with expand arrow)
  - Help Center
- Dark Mode toggle at bottom
- Upgrade to Premium card:
  - Premium badge
  - "Your Premium Account will expire in 18 days"
  - "Upgrade Now" button

### 3. Statistics Cards
Four cards in a row showing:
- Total Orders This Month: 200 (blue indicator)
- Pending Orders: 20 (yellow indicator)
- Shipped Orders: 180 (green indicator)
- Refunded Orders: 10 (red indicator)

### 4. Orders Table

#### Header Section
- "All Orders" title
- Action buttons:
  - "Bulk Update Status" (icon + text)
  - "Export Orders" (icon + text)
  - "+ Add Orders" (dark button)

#### Filter Tabs
- All (active)
- Incomplete
- Overdue
- Ongoing
- Finished

#### Table Columns
| Column | Features |
|--------|----------|
| Checkbox | Individual row selection |
| Order Number | Sortable, format: #ORD1008 |
| Customer Name | Avatar + name, sortable |
| Order Date | Format: 17 Dec 2024, sortable |
| Status | Color-coded badges (Pending=yellow, Completed=green, Refunded=red) |
| Total Amount | Currency format: $10.50, sortable |
| Payment Status | Paid/Unpaid text, sortable |
| Action | Edit (pencil), Delete (trash), More (...) icons |

### 5. Bulk Operations (Primary Focus)

#### Row Selection
- Checkbox on each row
- Selected rows should be visually distinct
- Track selected order IDs in state

#### Bulk Action Bar
Floating bar appears when items are selected:
- Left side: "X Selected" count
- Action buttons:
  - Duplicate (copy icon)
  - Print (printer icon)
  - Delete (trash icon, red text)
- Close button (X icon)

#### Implementation Notes
- Use React state to track selected items
- Show/hide action bar based on selection count
- Wire up API calls for bulk operations
- Update table after bulk actions complete

### 6. Pagination
- Left: "Showing 1-9 of 240 entries"
- Right: Previous button, page numbers (1, 2, 3, ..., 12), Next button
- Current page highlighted

---

## API Integration

Backend runs at `http://localhost:8000`

### Standard CRUD
```typescript
// Fetch all orders with pagination
GET /orders?status=all&page=1&limit=10

// Fetch order statistics
GET /orders/stats

// Fetch single order
GET /orders/{id}

// Create order
POST /orders

// Update order
PUT /orders/{id}

// Delete order
DELETE /orders/{id}
```

### Bulk Operations
```typescript
// Bulk update status
PUT /orders/bulk/status
Body: { order_ids: string[], status: string }

// Bulk duplicate
POST /orders/bulk/duplicate
Body: { order_ids: string[] }

// Bulk delete
DELETE /orders/bulk
Body: { order_ids: string[] }
```

---

## Style Guidelines

- Use Tailwind CSS utilities extensively
- Match colors, spacing, and typography from the design
- Primary accent color: Orange (#F97316 or similar)
- Status badge colors:
  - Pending: Yellow/amber background
  - Completed: Green background
  - Refunded: Red background
- Dark button style for "+ Add Orders"
- Gray/neutral tones for sidebar and backgrounds
- Table row hover states
- Selected row highlight
- You can use additional UI libraries if required

---

## Component Structure Suggestion

```
components/
├── layout/
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   └── Layout.tsx
├── orders/
│   ├── StatsCards.tsx
│   ├── OrdersTable.tsx
│   ├── OrderRow.tsx
│   ├── BulkActionBar.tsx
│   ├── FilterTabs.tsx
│   └── Pagination.tsx
└── ui/
    ├── Button.tsx
    ├── Checkbox.tsx
    ├── Badge.tsx
    └── Avatar.tsx
```
