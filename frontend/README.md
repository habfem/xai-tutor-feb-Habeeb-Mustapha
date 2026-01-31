# Email Client Frontend

Next.js 16+ frontend for the email client application.

## Setup

```bash
npm install
npm run dev
```

App runs at `http://localhost:3000`

---

## Required Components

Build these sections to match `implementation.jpeg`:

### 1. Header
- Logo (with orange star icon)
- Collapse sidebar toggle
- Search bar with ⌘K shortcut
- Page title ("Emails")
- "Search Email" input and "+ New Message" button

### 2. Sidebar
- Main nav: Dashboard, Notifications, Tasks, Calendar, Widgets
- Marketing section: Product, Emails (active), Integration, Contacts
- Favorite section with colored indicators:
  - Opportunity Stages (red square)
  - Key Metrics (green square)
  - Product Plan (orange square)
- Footer: Settings, Help & Center
- User profile with storage usage bar

### 3. Email List Panel
- Filter tabs: All Mails, Unread, Archive
- Email list with:
  - Sender avatar and name
  - Subject line (emoji support)
  - Preview text (truncated)
  - Timestamp
  - Unread indicator (blue dot)
  - Hover actions (archive, forward, more)
- Pagination info (e.g., "1-20 of 2,312")

### 4. Email Detail View
Header section:
- Sender avatar, name, email
- Recipient ("To: Richard Brown")
- Date and time
- Action icons (mark read, archive, forward, more)

Body section:
- Subject with emoji
- Full email content
- Attachment card with:
  - File icon
  - Filename and size
  - Download link

### 5. Reply Composer
- "To:" recipient dropdown
- Expand/close buttons
- Email body textarea
- "Send Now" button (dark with icon)
- Schedule send button
- Toolbar: attachment, emoji, template, more options

---

## API Integration

Backend runs at `http://localhost:8000`

```typescript
// Fetch all emails
GET /emails

// Fetch single email
GET /emails/{id}

// Send/create email
POST /emails

// Update email (mark read, archive)
PUT /emails/{id}

// Delete email
DELETE /emails/{id}
```

---

## Style Guidelines

- Use Tailwind CSS utilities extensively
- Match colors, spacing, and typography from the design
- Primary accent color: Orange (#F97316 or similar)
- Dark button style for "+ New Message" and "Send Now"
- Gray/neutral tones for sidebar and backgrounds
- You can use additional UI libraries if required
