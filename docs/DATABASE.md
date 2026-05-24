# CelebrationHub - Database Schema Documentation

## Table of Contents
1. [Overview](#overview)
2. [Collections](#collections)
3. [Schema Definitions](#schema-definitions)
4. [Relationships](#relationships)
5. [Indexes](#indexes)
6. [Data Validation](#data-validation)
7. [Migration Strategy](#migration-strategy)

## Overview

CelebrationHub uses **MongoDB 6+** as the primary database with **Mongoose ODM** for schema modeling and validation.

### Database Design Principles
- **Denormalization**: Embedding frequently accessed data
- **Reference-based**: Large or frequently changing data
- **Compound indexes**: For common query patterns
- **TTL indexes**: Auto-cleanup for temporary data
- **Aggregation pipelines**: Complex queries and analytics

### Collections Summary
```
users              # User profiles and authentication
events             # Main events (weddings, parties, etc.)
sub_events         # Sub-events within main events
invitations        # Event invitations and RSVP
messages           # Chat messages
conversations      # Chat conversation metadata
vendors            # Service provider profiles
vendor_categories  # Vendor category definitions
bookings           # Vendor bookings
reviews            # Vendor reviews and ratings
media              # Media file metadata
notifications      # User notifications
otp_codes          # OTP verification codes (TTL)
refresh_tokens     # JWT refresh tokens
```

---

## Collections

### 1. users

User accounts for both regular users and vendors.

```javascript
{
  _id: ObjectId,
  
  // Basic Info
  firstName: String,        // Required
  lastName: String,
  displayName: String,      // Auto-generated from firstName + lastName
  email: String,            // Unique, sparse (optional for initial registration)
  phone: String,            // Unique, required
  countryCode: String,      // e.g., "+91", "+1"
  
  // Authentication
  emailVerified: Boolean,   // Default: false
  phoneVerified: Boolean,   // Default: false
  
  // Profile
  avatar: String,           // URL to profile picture
  bio: String,              // Max 500 characters
  dateOfBirth: Date,
  gender: String,           // "male", "female", "other", "prefer_not_to_say"
  
  // Address
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
    coordinates: {
      type: "Point",
      coordinates: [Number, Number]  // [longitude, latitude]
    }
  },
  
  // User Type
  role: String,             // "user", "vendor", "admin"
  accountType: String,      // "personal", "business"
  
  // Vendor-specific fields (only if role = "vendor")
  businessProfile: {
    businessName: String,
    businessType: String,   // "individual", "company"
    category: ObjectId,     // Reference to vendor_categories
    subCategories: [ObjectId],
    description: String,    // Max 2000 characters
    portfolio: [String],    // Array of image URLs
    verified: Boolean,      // Verified by admin
    rating: Number,         // Calculated average (0-5)
    reviewCount: Number,    // Total reviews
    serviceArea: {
      radius: Number,       // in kilometers
      cities: [String]
    },
    workingHours: [{
      day: String,          // "monday", "tuesday", etc.
      openTime: String,     // "09:00"
      closeTime: String,    // "18:00"
      closed: Boolean
    }],
    pricing: {
      startingPrice: Number,
      currency: String,     // "INR", "USD"
      pricingModel: String  // "fixed", "hourly", "package"
    },
    socialLinks: {
      website: String,
      facebook: String,
      instagram: String,
      twitter: String
    },
    documents: [{
      type: String,         // "license", "certificate", "insurance"
      url: String,
      verified: Boolean
    }]
  },
  
  // Settings
  preferences: {
    language: String,       // Default: "en"
    theme: String,          // "light", "dark", "system"
    notifications: {
      email: Boolean,       // Default: true
      push: Boolean,        // Default: true
      sms: Boolean          // Default: false
    },
    privacy: {
      showPhone: Boolean,   // Default: false
      showEmail: Boolean,   // Default: false
      profileVisibility: String  // "public", "private"
    }
  },
  
  // Push Notification Tokens
  fcmTokens: [String],      // Firebase Cloud Messaging tokens
  
  // Stats
  stats: {
    eventsCreated: Number,
    eventsAttended: Number,
    bookingsReceived: Number,
    bookingsMade: Number
  },
  
  // Timestamps
  lastLoginAt: Date,
  createdAt: Date,
  updatedAt: Date,
  
  // Soft Delete
  isActive: Boolean,        // Default: true
  deletedAt: Date
}
```

**Indexes:**
```javascript
db.users.createIndex({ email: 1 }, { unique: true, sparse: true })
db.users.createIndex({ phone: 1 }, { unique: true })
db.users.createIndex({ role: 1, isActive: 1 })
db.users.createIndex({ "businessProfile.category": 1, "businessProfile.verified": 1 })
db.users.createIndex({ "address.coordinates": "2dsphere" })
db.users.createIndex({ createdAt: -1 })
```

---

### 2. events

Main event records.

```javascript
{
  _id: ObjectId,
  
  // Basic Info
  title: String,            // Required, max 200 characters
  description: String,      // Max 2000 characters
  type: String,             // "wedding", "birthday", "engagement", "housewarming", etc.
  
  // Creator
  creator: ObjectId,        // Reference to users, required
  
  // Date & Time
  startDate: Date,          // Required
  endDate: Date,            // Required
  timezone: String,         // e.g., "Asia/Kolkata"
  
  // Location
  location: {
    name: String,           // Venue name
    address: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
    coordinates: {
      type: "Point",
      coordinates: [Number, Number]
    },
    placeId: String,        // Google Places ID
    mapUrl: String          // Google Maps URL
  },
  
  // Visual
  coverImage: String,       // URL
  theme: {
    primaryColor: String,   // Hex color
    secondaryColor: String,
    fontFamily: String
  },
  
  // Settings
  settings: {
    isPublic: Boolean,      // Default: false
    allowGuestInvites: Boolean,  // Default: false
    allowMediaUpload: Boolean,   // Default: true
    allowChat: Boolean,     // Default: true
    allowRSVP: Boolean,     // Default: true
    maxGuests: Number,      // 0 = unlimited
    requireApproval: Boolean  // For guest invites
  },
  
  // Stats
  stats: {
    totalInvited: Number,
    totalAccepted: Number,
    totalDeclined: Number,
    totalMaybe: Number,
    totalMedia: Number,
    totalMessages: Number,
    totalSubEvents: Number
  },
  
  // Status
  status: String,           // "draft", "published", "ongoing", "completed", "cancelled"
  
  // Custom Fields
  customFields: [{
    label: String,
    value: String,
    type: String            // "text", "url", "date"
  }],
  
  // Timestamps
  publishedAt: Date,
  createdAt: Date,
  updatedAt: Date,
  
  // Soft Delete
  isActive: Boolean,
  deletedAt: Date
}
```

**Indexes:**
```javascript
db.events.createIndex({ creator: 1, createdAt: -1 })
db.events.createIndex({ status: 1, startDate: 1 })
db.events.createIndex({ type: 1, status: 1 })
db.events.createIndex({ "location.coordinates": "2dsphere" })
db.events.createIndex({ startDate: 1, endDate: 1 })
db.events.createIndex({ createdAt: -1 })
```

---

### 3. sub_events

Sub-events within main events (e.g., Mehendi, Haldi for weddings).

```javascript
{
  _id: ObjectId,
  
  // Parent Event
  event: ObjectId,          // Reference to events, required
  
  // Basic Info
  title: String,            // Required, e.g., "Mehendi Ceremony"
  description: String,
  
  // Date & Time
  startTime: Date,          // Required
  endTime: Date,            // Required
  
  // Location (can be different from main event)
  location: {
    name: String,
    address: String,
    coordinates: {
      type: "Point",
      coordinates: [Number, Number]
    }
  },
  
  // Visual
  image: String,            // URL
  
  // Order
  order: Number,            // For timeline sorting
  
  // Attendees
  specificInvitees: [ObjectId],  // If only specific people invited
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date,
  
  // Soft Delete
  isActive: Boolean,
  deletedAt: Date
}
```

**Indexes:**
```javascript
db.sub_events.createIndex({ event: 1, order: 1 })
db.sub_events.createIndex({ event: 1, startTime: 1 })
db.sub_events.createIndex({ createdAt: -1 })
```

---

### 4. invitations

Event invitations and RSVP tracking.

```javascript
{
  _id: ObjectId,
  
  // References
  event: ObjectId,          // Reference to events, required
  inviter: ObjectId,        // Reference to users (who sent invite)
  invitee: ObjectId,        // Reference to users (who receives invite)
  
  // Invitation Details
  role: String,             // "guest", "co-host", "organizer"
  message: String,          // Personal message from inviter
  
  // Contact Info (if invitee not registered yet)
  guestInfo: {
    name: String,
    email: String,
    phone: String,
    plusOnes: Number        // Number of additional guests
  },
  
  // RSVP
  rsvpStatus: String,       // "pending", "accepted", "declined", "maybe"
  rsvpAt: Date,             // When they responded
  rsvpNote: String,         // Guest's note with RSVP
  
  // Attendance
  checkedIn: Boolean,       // Default: false
  checkedInAt: Date,
  
  // Plus Ones
  allowPlusOnes: Boolean,
  plusOnesCount: Number,    // How many plus ones allowed
  plusOnesUsed: Number,     // How many actually coming
  
  // Access
  accessCode: String,       // Unique 6-character code for access
  linkAccessed: Boolean,
  linkAccessedAt: Date,
  
  // Notification
  sentAt: Date,
  reminderSentAt: Date,
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date,
  
  // Soft Delete
  isActive: Boolean,
  deletedAt: Date
}
```

**Indexes:**
```javascript
db.invitations.createIndex({ event: 1, invitee: 1 }, { unique: true })
db.invitations.createIndex({ event: 1, rsvpStatus: 1 })
db.invitations.createIndex({ invitee: 1, createdAt: -1 })
db.invitations.createIndex({ accessCode: 1 }, { unique: true })
db.invitations.createIndex({ event: 1, role: 1 })
```

---

### 5. conversations

Chat conversation metadata.

```javascript
{
  _id: ObjectId,
  
  // Type
  type: String,             // "event", "direct", "vendor"
  
  // Participants
  participants: [ObjectId], // Reference to users
  
  // Related Entity
  event: ObjectId,          // If type = "event"
  vendor: ObjectId,         // If type = "vendor"
  
  // Group Chat (for events)
  isGroup: Boolean,
  groupName: String,
  groupAvatar: String,
  
  // Last Message
  lastMessage: {
    text: String,
    sender: ObjectId,
    sentAt: Date
  },
  
  // Unread Counts (per user)
  unreadCounts: [{
    user: ObjectId,
    count: Number
  }],
  
  // Settings
  settings: {
    mutedBy: [ObjectId],    // Users who muted this conversation
    pinnedBy: [ObjectId]    // Users who pinned this
  },
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date,
  
  // Soft Delete
  isActive: Boolean,
  deletedAt: Date
}
```

**Indexes:**
```javascript
db.conversations.createIndex({ participants: 1 })
db.conversations.createIndex({ event: 1 }, { sparse: true })
db.conversations.createIndex({ vendor: 1 }, { sparse: true })
db.conversations.createIndex({ type: 1, updatedAt: -1 })
```

---

### 6. messages

Chat messages.

```javascript
{
  _id: ObjectId,
  
  // References
  conversation: ObjectId,   // Reference to conversations, required
  sender: ObjectId,         // Reference to users, required
  
  // Content
  type: String,             // "text", "image", "video", "audio", "file", "location"
  text: String,             // Message text (for type = "text")
  
  // Media (for non-text messages)
  media: {
    url: String,
    thumbnailUrl: String,
    mimeType: String,
    size: Number,           // in bytes
    duration: Number,       // for audio/video in seconds
    width: Number,          // for images/videos
    height: Number
  },
  
  // Location (for type = "location")
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  
  // Reply/Forward
  replyTo: ObjectId,        // Reference to another message
  forwarded: Boolean,
  
  // Status
  status: String,           // "sent", "delivered", "read", "failed"
  
  // Read Receipts
  readBy: [{
    user: ObjectId,
    readAt: Date
  }],
  
  // Reactions
  reactions: [{
    user: ObjectId,
    emoji: String,          // "👍", "❤️", etc.
    createdAt: Date
  }],
  
  // Timestamps
  sentAt: Date,
  deliveredAt: Date,
  createdAt: Date,
  updatedAt: Date,
  
  // Soft Delete
  isDeleted: Boolean,
  deletedAt: Date,
  deletedBy: ObjectId
}
```

**Indexes:**
```javascript
db.messages.createIndex({ conversation: 1, createdAt: -1 })
db.messages.createIndex({ conversation: 1, sender: 1 })
db.messages.createIndex({ sender: 1, createdAt: -1 })
db.messages.createIndex({ status: 1 })
```

---

### 7. vendors

Vendor/service provider profiles (denormalized from users for query performance).

```javascript
{
  _id: ObjectId,
  
  // Reference
  user: ObjectId,           // Reference to users, required
  
  // Business Info
  businessName: String,     // Required
  category: ObjectId,       // Reference to vendor_categories
  subCategories: [ObjectId],
  description: String,
  
  // Contact
  phone: String,
  email: String,
  website: String,
  
  // Location
  location: {
    address: String,
    city: String,
    state: String,
    country: String,
    coordinates: {
      type: "Point",
      coordinates: [Number, Number]
    }
  },
  
  // Service Area
  serviceArea: {
    radius: Number,         // km
    cities: [String]
  },
  
  // Portfolio
  portfolio: [{
    url: String,
    caption: String,
    type: String            // "image", "video"
  }],
  
  // Pricing
  pricing: {
    startingPrice: Number,
    maxPrice: Number,
    currency: String,
    pricingModel: String
  },
  
  // Packages
  packages: [{
    name: String,
    description: String,
    price: Number,
    features: [String],
    popular: Boolean
  }],
  
  // Ratings
  rating: Number,           // Calculated average
  reviewCount: Number,
  
  // Availability
  availability: [{
    date: Date,
    available: Boolean,
    slots: [{
      startTime: String,
    endTime: String,
      booked: Boolean
    }]
  }],
  
  // Stats
  stats: {
    totalBookings: Number,
    completedBookings: Number,
    cancelledBookings: Number,
    responseTime: Number,   // Average in minutes
    profileViews: Number
  },
  
  // Status
  verified: Boolean,
  featured: Boolean,
  status: String,           // "active", "inactive", "suspended"
  
  // Timestamps
  verifiedAt: Date,
  createdAt: Date,
  updatedAt: Date,
  
  // Soft Delete
  isActive: Boolean,
  deletedAt: Date
}
```

**Indexes:**
```javascript
db.vendors.createIndex({ user: 1 }, { unique: true })
db.vendors.createIndex({ category: 1, rating: -1 })
db.vendors.createIndex({ "location.coordinates": "2dsphere" })
db.vendors.createIndex({ verified: 1, status: 1, rating: -1 })
db.vendors.createIndex({ "location.city": 1, category: 1 })
db.vendors.createIndex({ featured: 1, rating: -1 })
```

---

### 8. vendor_categories

Vendor service categories.

```javascript
{
  _id: ObjectId,
  
  // Category Info
  name: String,             // Required, unique
  slug: String,             // URL-friendly
  description: String,
  icon: String,             // Icon name or URL
  image: String,            // Category image URL
  
  // Hierarchy
  parent: ObjectId,         // Reference to self for subcategories
  order: Number,            // Display order
  
  // Metadata
  isActive: Boolean,
  featured: Boolean,
  
  // Stats
  vendorCount: Number,      // Total vendors in this category
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
db.vendor_categories.createIndex({ slug: 1 }, { unique: true })
db.vendor_categories.createIndex({ parent: 1, order: 1 })
db.vendor_categories.createIndex({ isActive: 1, featured: 1 })
```

---

### 9. bookings

Vendor bookings.

```javascript
{
  _id: ObjectId,
  
  // References
  vendor: ObjectId,         // Reference to vendors, required
  customer: ObjectId,       // Reference to users, required
  event: ObjectId,          // Reference to events (optional)
  
  // Booking Details
  serviceDate: Date,        // Required
  serviceTime: String,      // "09:00"
  duration: Number,         // Duration in hours
  location: {
    address: String,
    city: String,
    coordinates: {
      type: "Point",
      coordinates: [Number, Number]
    }
  },
  
  // Package/Service
  package: {
    name: String,
    description: String,
    price: Number,
    currency: String
  },
  
  // Custom Requirements
  requirements: String,     // Customer's special requests
  guestCount: Number,
  
  // Pricing
  pricing: {
    basePrice: Number,
    additionalCharges: [{
      description: String,
      amount: Number
    }],
    discount: Number,
    tax: Number,
    totalAmount: Number,
    currency: String
  },
  
  // Payment
  payment: {
    status: String,         // "pending", "paid", "failed", "refunded"
    method: String,         // "online", "cash", "card"
    paidAmount: Number,
    advanceAmount: Number,
    pendingAmount: Number,
    transactionId: String,
    paidAt: Date,
    refundedAt: Date
  },
  
  // Status
  status: String,           // "pending", "confirmed", "in_progress", "completed", "cancelled"
  
  // Confirmation
  confirmedAt: Date,
  confirmedBy: ObjectId,    // Vendor who confirmed
  
  // Completion
  completedAt: Date,
  
  // Cancellation
  cancelledAt: Date,
  cancelledBy: ObjectId,    // Who cancelled (vendor or customer)
  cancellationReason: String,
  
  // Communication
  notes: [{
    user: ObjectId,
    text: String,
    createdAt: Date
  }],
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
db.bookings.createIndex({ vendor: 1, serviceDate: -1 })
db.bookings.createIndex({ customer: 1, createdAt: -1 })
db.bookings.createIndex({ event: 1 }, { sparse: true })
db.bookings.createIndex({ status: 1, serviceDate: 1 })
db.bookings.createIndex({ "payment.status": 1 })
```

---

### 10. reviews

Vendor reviews and ratings.

```javascript
{
  _id: ObjectId,
  
  // References
  vendor: ObjectId,         // Reference to vendors, required
  customer: ObjectId,       // Reference to users, required
  booking: ObjectId,        // Reference to bookings (optional)
  
  // Rating
  rating: Number,           // 1-5, required
  
  // Review
  title: String,
  comment: String,          // Max 1000 characters
  
  // Detailed Ratings
  ratings: {
    quality: Number,        // 1-5
    professionalism: Number,
    valueForMoney: Number,
    punctuality: Number,
    communication: Number
  },
  
  // Media
  images: [String],         // Photo URLs
  
  // Response
  response: {
    text: String,
    respondedBy: ObjectId,  // Vendor user
    respondedAt: Date
  },
  
  // Verification
  verified: Boolean,        // Booking verified
  
  // Helpful
  helpfulCount: Number,     // How many found it helpful
  helpfulBy: [ObjectId],    // Users who marked helpful
  
  // Status
  status: String,           // "published", "hidden", "flagged"
  
  // Moderation
  flaggedBy: [ObjectId],
  flagReason: String,
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
db.reviews.createIndex({ vendor: 1, createdAt: -1 })
db.reviews.createIndex({ customer: 1, createdAt: -1 })
db.reviews.createIndex({ booking: 1 }, { unique: true, sparse: true })
db.reviews.createIndex({ vendor: 1, rating: -1 })
db.reviews.createIndex({ status: 1 })
```

---

### 11. media

Media file metadata and storage references.

```javascript
{
  _id: ObjectId,
  
  // Owner
  uploader: ObjectId,       // Reference to users, required
  
  // Related Entity
  entityType: String,       // "event", "vendor", "user", "message"
  entityId: ObjectId,
  
  // File Info
  type: String,             // "image", "video", "audio", "document"
  mimeType: String,         // "image/jpeg", "video/mp4"
  fileName: String,
  originalName: String,
  
  // Storage
  url: String,              // Full URL
  thumbnailUrl: String,     // Thumbnail for videos/images
  storageKey: String,       // S3/MinIO key
  bucket: String,           // Storage bucket name
  
  // Metadata
  size: Number,             // Bytes
  width: Number,            // For images/videos
  height: Number,
  duration: Number,         // For videos/audio (seconds)
  
  // Processing
  processed: Boolean,
  processingStatus: String, // "pending", "processing", "completed", "failed"
  
  // Caption
  caption: String,
  tags: [String],
  
  // Stats
  stats: {
    views: Number,
    downloads: Number,
    likes: Number
  },
  
  // Visibility
  isPublic: Boolean,
  allowDownload: Boolean,
  
  // Timestamps
  uploadedAt: Date,
  createdAt: Date,
  updatedAt: Date,
  
  // Soft Delete
  isDeleted: Boolean,
  deletedAt: Date
}
```

**Indexes:**
```javascript
db.media.createIndex({ uploader: 1, createdAt: -1 })
db.media.createIndex({ entityType: 1, entityId: 1 })
db.media.createIndex({ type: 1, createdAt: -1 })
db.media.createIndex({ storageKey: 1 }, { unique: true })
```

---

### 12. notifications

User notifications.

```javascript
{
  _id: ObjectId,
  
  // Recipient
  user: ObjectId,           // Reference to users, required
  
  // Notification Type
  type: String,             // "invite", "rsvp", "message", "booking", "review", "system"
  
  // Content
  title: String,            // Required
  body: String,             // Required
  icon: String,             // Icon URL or name
  image: String,            // Optional image
  
  // Related Entity
  entityType: String,       // "event", "booking", "message", "review"
  entityId: ObjectId,
  
  // Action
  action: {
    type: String,           // "navigate", "url"
    target: String,         // Screen name or URL
    params: Object          // Navigation params
  },
  
  // Status
  read: Boolean,            // Default: false
  readAt: Date,
  
  // Delivery
  channels: {
    push: Boolean,
    email: Boolean,
    sms: Boolean
  },
  sentVia: [String],        // ["push", "email"]
  deliveredAt: Date,
  
  // Timestamps
  createdAt: Date,
  expiresAt: Date           // Auto-delete after 30 days
}
```

**Indexes:**
```javascript
db.notifications.createIndex({ user: 1, createdAt: -1 })
db.notifications.createIndex({ user: 1, read: 1 })
db.notifications.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })  // TTL
```

---

### 13. otp_codes

OTP verification codes (TTL collection).

```javascript
{
  _id: ObjectId,
  
  // Contact
  identifier: String,       // Phone or email
  identifierType: String,   // "phone", "email"
  
  // OTP
  code: String,             // 6-digit code
  hashedCode: String,       // Bcrypt hash for verification
  
  // Purpose
  purpose: String,          // "login", "registration", "password_reset"
  
  // Attempts
  attempts: Number,         // Verification attempts
  maxAttempts: Number,      // Default: 3
  
  // Status
  verified: Boolean,
  verifiedAt: Date,
  
  // Timestamps
  createdAt: Date,
  expiresAt: Date           // 5 minutes from creation
}
```

**Indexes:**
```javascript
db.otp_codes.createIndex({ identifier: 1, purpose: 1 })
db.otp_codes.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })  // TTL
```

---

### 14. refresh_tokens

JWT refresh tokens for session management.

```javascript
{
  _id: ObjectId,
  
  // User
  user: ObjectId,           // Reference to users, required
  
  // Token
  token: String,            // Hashed refresh token
  tokenVersion: Number,     // For token invalidation
  
  // Device Info
  deviceInfo: {
    userAgent: String,
    platform: String,       // "web", "android", "ios"
    ipAddress: String,
    deviceId: String
  },
  
  // Status
  isActive: Boolean,
  revokedAt: Date,
  revokedReason: String,    // "logout", "security", "expired"
  
  // Timestamps
  createdAt: Date,
  expiresAt: Date,          // 7 days from creation
  lastUsedAt: Date
}
```

**Indexes:**
```javascript
db.refresh_tokens.createIndex({ user: 1, isActive: 1 })
db.refresh_tokens.createIndex({ token: 1 }, { unique: true })
db.refresh_tokens.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })  // TTL
```

---

## Relationships

### Entity Relationship Diagram

```
┌─────────┐
│  Users  │◄────────────┐
└────┬────┘             │
     │                  │
     │ creates          │ creator
     │                  │
     ▼                  │
┌─────────┐        ┌────┴─────┐
│ Events  │───────►│Sub Events│
└────┬────┘        └──────────┘
     │
     │ related to
     │
     ▼
┌─────────────┐
│ Invitations │
└──────┬──────┘
       │
       │ invitee
       │
       ▼
  ┌─────────┐
  │  Users  │
  └────┬────┘
       │
       │ participates in
       │
       ▼
┌──────────────┐      ┌──────────┐
│Conversations │◄─────┤ Messages │
└──────────────┘      └──────────┘
       │
       │ between
       │
       ▼
  ┌─────────┐       ┌─────────┐
  │ Vendors │◄──────┤Bookings │
  └────┬────┘       └─────────┘
       │                 │
       │                 │ books
       │                 │
       ▼                 ▼
  ┌─────────┐       ┌─────────┐
  │ Reviews │       │  Users  │
  └─────────┘       └─────────┘
```

### Key Relationships

1. **User → Event** (One-to-Many)
   - A user creates multiple events
   - `events.creator` → `users._id`

2. **Event → SubEvent** (One-to-Many)
   - An event has multiple sub-events
   - `sub_events.event` → `events._id`

3. **Event → Invitation** (One-to-Many)
   - An event has multiple invitations
   - `invitations.event` → `events._id`

4. **User → Invitation** (One-to-Many)
   - A user receives multiple invitations
   - `invitations.invitee` → `users._id`

5. **Event → Conversation** (One-to-One)
   - Each event has one group conversation
   - `conversations.event` → `events._id`

6. **Conversation → Message** (One-to-Many)
   - A conversation has multiple messages
   - `messages.conversation` → `conversations._id`

7. **User → Vendor** (One-to-One)
   - A vendor user has one vendor profile
   - `vendors.user` → `users._id`

8. **Vendor → Booking** (One-to-Many)
   - A vendor has multiple bookings
   - `bookings.vendor` → `vendors._id`

9. **Vendor → Review** (One-to-Many)
   - A vendor has multiple reviews
   - `reviews.vendor` → `vendors._id`

10. **User → Media** (One-to-Many)
    - A user uploads multiple media files
    - `media.uploader` → `users._id`

---

## Indexes

### Compound Indexes

```javascript
// Users
db.users.createIndex({ role: 1, "businessProfile.verified": 1, "businessProfile.rating": -1 })

// Events
db.events.createIndex({ creator: 1, status: 1, startDate: -1 })
db.events.createIndex({ type: 1, status: 1, "location.city": 1 })

// Invitations
db.invitations.createIndex({ event: 1, rsvpStatus: 1, createdAt: -1 })

// Messages
db.messages.createIndex({ conversation: 1, status: 1, createdAt: -1 })

// Vendors
db.vendors.createIndex({ category: 1, "location.city": 1, rating: -1 })
db.vendors.createIndex({ verified: 1, featured: 1, rating: -1 })

// Bookings
db.bookings.createIndex({ vendor: 1, status: 1, serviceDate: -1 })
db.bookings.createIndex({ customer: 1, status: 1, createdAt: -1 })
```

### Geospatial Indexes

```javascript
// For location-based queries
db.users.createIndex({ "address.coordinates": "2dsphere" })
db.events.createIndex({ "location.coordinates": "2dsphere" })
db.vendors.createIndex({ "location.coordinates": "2dsphere" })
```

### Text Indexes

```javascript
// For full-text search
db.events.createIndex({ 
  title: "text", 
  description: "text" 
}, { 
  weights: { title: 10, description: 5 }
})

db.vendors.createIndex({ 
  businessName: "text", 
  description: "text" 
}, { 
  weights: { businessName: 10, description: 5 }
})
```

### TTL Indexes

```javascript
// Auto-delete expired documents
db.otp_codes.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
db.refresh_tokens.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
db.notifications.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
```

---

## Data Validation

### Mongoose Schema Validation

Example for the User model:

```javascript
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    minlength: [2, 'First name must be at least 2 characters'],
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  
  email: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: 'Please provide a valid email address'
    }
  },
  
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    validate: {
      validator: function(v) {
        return /^\+?[1-9]\d{9,14}$/.test(v);
      },
      message: 'Please provide a valid phone number'
    }
  },
  
  role: {
    type: String,
    enum: {
      values: ['user', 'vendor', 'admin'],
      message: '{VALUE} is not a valid role'
    },
    default: 'user'
  },
  
  'businessProfile.rating': {
    type: Number,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5'],
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
userSchema.index({ email: 1 }, { unique: true, sparse: true });
userSchema.index({ phone: 1 }, { unique: true });
userSchema.index({ role: 1, isActive: 1 });

// Virtual fields
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Middleware
userSchema.pre('save', function(next) {
  if (this.isModified('firstName') || this.isModified('lastName')) {
    this.displayName = `${this.firstName} ${this.lastName}`;
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
```

---

## Migration Strategy

### Version Control

Use a migration system to track schema changes:

```javascript
// migrations/001_initial_schema.js
module.exports = {
  up: async (db) => {
    await db.createCollection('users');
    await db.collection('users').createIndex({ email: 1 }, { unique: true, sparse: true });
    await db.collection('users').createIndex({ phone: 1 }, { unique: true });
  },
  
  down: async (db) => {
    await db.collection('users').drop();
  }
};
```

### Running Migrations

```bash
# Install migrate-mongo
npm install -g migrate-mongo

# Initialize
migrate-mongo init

# Create migration
migrate-mongo create migration-name

# Run migrations
migrate-mongo up

# Rollback
migrate-mongo down
```

### Data Seeding

```javascript
// seeds/categories.js
const categories = [
  { name: 'Wedding Halls', slug: 'wedding-halls', icon: 'venue' },
  { name: 'Decorators', slug: 'decorators', icon: 'decoration' },
  { name: 'Caterers', slug: 'caterers', icon: 'food' },
  { name: 'Photographers', slug: 'photographers', icon: 'camera' }
];

module.exports = async function seedCategories(db) {
  await db.collection('vendor_categories').insertMany(categories);
};
```

---

## Query Examples

### Find Events Near Location

```javascript
db.events.find({
  "location.coordinates": {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: [longitude, latitude]
      },
      $maxDistance: 5000  // 5km
    }
  },
  status: "published"
});
```

### Get User's Upcoming Events

```javascript
db.invitations.aggregate([
  {
    $match: {
      invitee: ObjectId(userId),
      rsvpStatus: { $in: ["accepted", "maybe"] }
    }
  },
  {
    $lookup: {
      from: "events",
      localField: "event",
      foreignField: "_id",
      as: "eventDetails"
    }
  },
  {
    $unwind: "$eventDetails"
  },
  {
    $match: {
      "eventDetails.startDate": { $gte: new Date() }
    }
  },
  {
    $sort: { "eventDetails.startDate": 1 }
  }
]);
```

### Calculate Vendor Rating

```javascript
db.reviews.aggregate([
  {
    $match: {
      vendor: ObjectId(vendorId),
      status: "published"
    }
  },
  {
    $group: {
      _id: "$vendor",
      averageRating: { $avg: "$rating" },
      totalReviews: { $sum: 1 }
    }
  }
]);
```

### Get Top-Rated Vendors by Category

```javascript
db.vendors.find({
  category: ObjectId(categoryId),
  verified: true,
  status: "active"
})
.sort({ rating: -1, reviewCount: -1 })
.limit(10);
```

---

**Next**: See [API.md](./API.md) for REST API documentation
