# Email API

FastAPI backend for the email client application.

## Setup
### 1. Setup Virtual Environment

```bash
python3.13 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Run the Application

```bash
uvicorn app.main:app --reload
```

Server runs at `http://localhost:8000`

---

## API Contracts

### Email Model

```json
{
  "id": "string",
  "sender": {
    "name": "string",
    "email": "string",
    "avatar": "string (URL)"
  },
  "recipient": {
    "name": "string",
    "email": "string"
  },
  "subject": "string",
  "preview": "string",
  "body": "string",
  "date": "string (ISO 8601)",
  "is_read": "boolean",
  "is_archived": "boolean",
  "attachments": [
    {
      "filename": "string",
      "size": "string",
      "url": "string"
    }
  ]
}
```

---

### Endpoints

#### GET /emails

Fetch all emails.

**Query Parameters:**
- `filter`: `all` | `unread` | `archived` (default: `all`)

**Response:** `200 OK`
```json
[
  {
    "id": "1",
    "sender": {
      "name": "Jane Doe",
      "email": "jane.doe@business.com",
      "avatar": "/avatars/jane.jpg"
    },
    "recipient": {
      "name": "Richard Brown",
      "email": "richard@example.com"
    },
    "subject": "Proposal for Partnership🎉",
    "preview": "Hi John, Hope this email finds you well. I'm rea...",
    "body": "Hi John,\n\nhope this message finds you well! I'm reaching out to explore a potential partnership...",
    "date": "2024-12-10T09:00:00",
    "is_read": false,
    "is_archived": false,
    "attachments": [
      {
        "filename": "Proposal Partnership.pdf",
        "size": "1.5 MB",
        "url": "/files/proposal.pdf"
      }
    ]
  }
]
```

---

#### GET /emails/{id}

Fetch a single email by ID.

**Response:** `200 OK`
```json
{
  "id": "1",
  "sender": {
    "name": "Jane Doe",
    "email": "jane.doe@business.com",
    "avatar": "/avatars/jane.jpg"
  },
  "recipient": {
    "name": "Richard Brown",
    "email": "richard@example.com"
  },
  "subject": "Proposal for Partnership🎉",
  "preview": "Hi John, Hope this email finds you well. I'm rea...",
  "body": "Hi John,\n\nhope this message finds you well! I'm reaching out to explore a potential partnership between our companies. At Jane Corp, which could complement your offerings at John Organisation Corp.\n\nI've attached a proposal detailing how we envision our collaboration, including key benefits, timelines, and implementation strategies. I believe this partnership could unlock exciting opportunities for both of us!\n\nLet me know your thoughts or a convenient time to discuss this further. I'm happy to schedule a call or meeting at your earliest convenience. Looking forward to hearing from you!\n\nWarm regards,\nJane Doe",
  "date": "2024-12-10T09:00:00",
  "is_read": true,
  "is_archived": false,
  "attachments": [
    {
      "filename": "Proposal Partnership.pdf",
      "size": "1.5 MB",
      "url": "/files/proposal.pdf"
    }
  ]
}
```

**Error:** `404 Not Found` if email doesn't exist

---

#### POST /emails

Create/send a new email.

**Request Body:**
```json
{
  "recipient": {
    "name": "Jane Doe",
    "email": "jane.doe@business.com"
  },
  "subject": "Re: Proposal for Partnership",
  "body": "Hi Jane,\n\nThank you for reaching out and for sharing your proposal!..."
}
```

**Response:** `201 Created`
```json
{
  "id": "generated-id",
  "sender": {
    "name": "Richard Brown",
    "email": "richard@example.com",
    "avatar": "/avatars/richard.jpg"
  },
  "recipient": {
    "name": "Jane Doe",
    "email": "jane.doe@business.com"
  },
  "subject": "Re: Proposal for Partnership",
  "body": "Hi Jane,\n\nThank you for reaching out and for sharing your proposal!...",
  "date": "2024-12-10T10:30:00",
  "is_read": true,
  "is_archived": false,
  "attachments": []
}
```

---

#### PUT /emails/{id}

Update an existing email (mark as read, archive, etc.).

**Request Body:** (partial update allowed)
```json
{
  "is_read": true
}
```

**Response:** `200 OK`
```json
{
  "id": "1",
  "sender": {
    "name": "Jane Doe",
    "email": "jane.doe@business.com",
    "avatar": "/avatars/jane.jpg"
  },
  "recipient": {
    "name": "Richard Brown",
    "email": "richard@example.com"
  },
  "subject": "Proposal for Partnership🎉",
  "preview": "Hi John, Hope this email finds you well. I'm rea...",
  "body": "...",
  "date": "2024-12-10T09:00:00",
  "is_read": true,
  "is_archived": false,
  "attachments": []
}
```

**Error:** `404 Not Found` if email doesn't exist

---

#### DELETE /emails/{id}

Delete an email.

**Response:** `204 No Content`

**Error:** `404 Not Found` if email doesn't exist

---

## Sample Data

Seed your in-memory storage with emails matching the design:

| Sender | Subject | Date | Read |
|--------|---------|------|------|
| Michael Lee | Follow-Up: Product Demo Feedba... | 9:00 | No |
| Jane Doe | Proposal for Partnership🎉 | 10 Dec | No |
| Support Team | Contract Renewal Due 📬 | 11 Dec | Yes |
| Sarah Connor | Meeting Recap: Strategies for 2... | 11 Dec | Yes |
| Downe Johnson | Invitation: Annual Client Appreci... | 11 Dec | Yes |
| Lily Alexa | Technical Support Update | 10 Dec | Yes |
| Natasha Brown | Happy Holidays from Kozuki tea... | 10 Dec | Yes |
| Downe Johnson | Invitation: Annual Client Appreci... | 11 Dec | Yes |
