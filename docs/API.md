# CelebrationHub - API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [API Endpoints](#api-endpoints)
4. [Error Handling](#error-handling)
5. [Rate Limiting](#rate-limiting)
6. [Pagination](#pagination)
7. [File Uploads](#file-uploads)
8. [WebSocket Events](#websocket-events)

## Overview

CelebrationHub provides a RESTful API built with Express.js and Node.js.

### Base URL
```
Development: http://localhost:5000/api/v1
Production:  https://api.celebrationhub.com/api/v1
```

### API Versioning
The API is versioned via the URL path (`/api/v1`). Future versions will use `/api/v2`, etc.

### Content Type
All requests and responses use JSON:
```
Content-Type: application/json
```

### Date Format
All dates use ISO 8601 format:
```
2026-05-24T10:30:00.000Z
```

### Authentication
Most endpoints require JWT authentication via the `Authorization` header:
```
Authorization: Bearer <access_token>
```

---

## Authentication

### POST /auth/register

Register a new user account.

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+919876543210",
  "countryCode": "+91",
  "email": "john.doe@example.com"  // Optional
}
```

**Response: 201 Created**
```json
{
  "success": true,
  "message": "Registration successful. OTP sent to your phone.",
  "data": {
    "userId": "60f7b3b3b3f3b3b3b3b3b3b3",
    "otpSent": true,
    "expiresIn": 300  // seconds
  }
}
```

**Errors:**
- `400` - Validation error (invalid phone, email)
- `409` - User already exists

---

### POST /auth/send-otp

Send OTP for login or verification.

**Request:**
```json
{
  "identifier": "+919876543210",  // Phone or email
  "purpose": "login"  // "login", "registration", "password_reset"
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "expiresIn": 300,  // seconds
    "attemptsRemaining": 3
  }
}
```

**Errors:**
- `404` - User not found (for login)
- `429` - Too many OTP requests

---

### POST /auth/verify-otp

Verify OTP and receive JWT tokens.

**Request:**
```json
{
  "identifier": "+919876543210",
  "code": "123456",
  "purpose": "login"
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "message": "Authentication successful",
  "data": {
    "user": {
      "_id": "60f7b3b3b3f3b3b3b3b3b3b3",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phone": "+919876543210",
      "avatar": "https://cdn.example.com/avatars/user.jpg",
      "role": "user"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 900  // 15 minutes
    }
  }
}
```

**Errors:**
- `400` - Invalid OTP
- `401` - OTP expired
- `429` - Too many attempts

---

### POST /auth/refresh-token

Refresh access token using refresh token.

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900
  }
}
```

**Errors:**
- `401` - Invalid or expired refresh token

---

### POST /auth/logout

Logout and invalidate refresh token.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Users

### GET /users/me

Get current user profile.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "_id": "60f7b3b3b3f3b3b3b3b3b3b3",
    "firstName": "John",
    "lastName": "Doe",
    "displayName": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+919876543210",
    "avatar": "https://cdn.example.com/avatars/user.jpg",
    "role": "user",
    "preferences": {
      "language": "en",
      "theme": "light",
      "notifications": {
        "email": true,
        "push": true,
        "sms": false
      }
    },
    "stats": {
      "eventsCreated": 5,
      "eventsAttended": 12
    },
    "createdAt": "2026-01-15T10:30:00.000Z"
  }
}
```

---

### PUT /users/me

Update current user profile.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "bio": "Event enthusiast",
  "dateOfBirth": "1990-05-15",
  "address": {
    "city": "Mumbai",
    "state": "Maharashtra",
    "country": "India"
  },
  "preferences": {
    "theme": "dark",
    "notifications": {
      "email": true
    }
  }
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    // Updated user object
  }
}
```

**Errors:**
- `400` - Validation error

---

### POST /users/me/avatar

Upload user avatar.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request (Form Data):**
```
avatar: <file>  // Image file (max 5MB, jpg/png)
```

**Response: 200 OK**
```json
{
  "success": true,
  "message": "Avatar uploaded successfully",
  "data": {
    "avatar": "https://cdn.example.com/avatars/user-123.jpg"
  }
}
```

**Errors:**
- `400` - Invalid file type or size

---

### GET /users/:id

Get user profile by ID (public view).

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "_id": "60f7b3b3b3f3b3b3b3b3b3b3",
    "displayName": "John Doe",
    "avatar": "https://cdn.example.com/avatars/user.jpg",
    "bio": "Event enthusiast",
    // Limited public fields based on privacy settings
  }
}
```

**Errors:**
- `404` - User not found

---

## Events

### GET /events

Get list of events (with filters).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
```
?page=1
&limit=20
&type=wedding
&status=published
&startDate=2026-05-01
&endDate=2026-06-30
&city=Mumbai
&createdBy=me  // Show only my events
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "_id": "60f7b3b3b3f3b3b3b3b3b3b3",
        "title": "John & Jane's Wedding",
        "type": "wedding",
        "startDate": "2026-06-15T10:00:00.000Z",
        "endDate": "2026-06-15T22:00:00.000Z",
        "location": {
          "name": "Grand Hotel",
          "city": "Mumbai",
          "address": "123 Marine Drive, Mumbai"
        },
        "coverImage": "https://cdn.example.com/events/event-123.jpg",
        "creator": {
          "_id": "60f7b3b3b3f3b3b3b3b3b3b3",
          "displayName": "John Doe",
          "avatar": "https://cdn.example.com/avatars/user.jpg"
        },
        "stats": {
          "totalInvited": 150,
          "totalAccepted": 120,
          "totalMedia": 45
        },
        "status": "published",
        "createdAt": "2026-05-01T10:30:00.000Z"
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 20,
      "pages": 2
    }
  }
}
```

---

### POST /events

Create a new event.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request:**
```json
{
  "title": "John & Jane's Wedding",
  "description": "Join us for our special day",
  "type": "wedding",
  "startDate": "2026-06-15T10:00:00.000Z",
  "endDate": "2026-06-15T22:00:00.000Z",
  "timezone": "Asia/Kolkata",
  "location": {
    "name": "Grand Hotel",
    "address": "123 Marine Drive, Mumbai, Maharashtra",
    "city": "Mumbai",
    "state": "Maharashtra",
    "country": "India",
    "postalCode": "400001",
    "coordinates": {
      "type": "Point",
      "coordinates": [72.8258, 18.9388]
    }
  },
  "settings": {
    "isPublic": false,
    "allowGuestInvites": true,
    "allowMediaUpload": true,
    "allowChat": true,
    "maxGuests": 200
  }
}
```

**Response: 201 Created**
```json
{
  "success": true,
  "message": "Event created successfully",
  "data": {
    "_id": "60f7b3b3b3f3b3b3b3b3b3b3",
    // Complete event object
  }
}
```

**Errors:**
- `400` - Validation error

---

### GET /events/:id

Get event details.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "_id": "60f7b3b3b3f3b3b3b3b3b3b3",
    "title": "John & Jane's Wedding",
    "description": "Join us for our special day",
    "type": "wedding",
    "startDate": "2026-06-15T10:00:00.000Z",
    "endDate": "2026-06-15T22:00:00.000Z",
    "location": {
      "name": "Grand Hotel",
      "address": "123 Marine Drive, Mumbai",
      "city": "Mumbai",
      "coordinates": {
        "type": "Point",
        "coordinates": [72.8258, 18.9388]
      }
    },
    "coverImage": "https://cdn.example.com/events/event-123.jpg",
    "creator": {
      "_id": "60f7b3b3b3f3b3b3b3b3b3b3",
      "displayName": "John Doe",
      "avatar": "https://cdn.example.com/avatars/user.jpg"
    },
    "stats": {
      "totalInvited": 150,
      "totalAccepted": 120,
      "totalDeclined": 10,
      "totalMaybe": 20,
      "totalMedia": 45,
      "totalMessages": 234
    },
    "settings": {
      "isPublic": false,
      "allowGuestInvites": true,
      "allowMediaUpload": true
    },
    "status": "published",
    "createdAt": "2026-05-01T10:30:00.000Z"
  }
}
```

**Errors:**
- `404` - Event not found
- `403` - Not authorized to view

---

### PUT /events/:id

Update event details.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request:**
```json
{
  "title": "Updated Event Title",
  "description": "Updated description",
  "startDate": "2026-06-16T10:00:00.000Z"
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "message": "Event updated successfully",
  "data": {
    // Updated event object
  }
}
```

**Errors:**
- `404` - Event not found
- `403` - Not authorized (not creator)

---

### DELETE /events/:id

Delete an event.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response: 200 OK**
```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

**Errors:**
- `404` - Event not found
- `403` - Not authorized

---

### POST /events/:id/cover-image

Upload event cover image.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request (Form Data):**
```
image: <file>  // Image file (max 10MB)
```

**Response: 200 OK**
```json
{
  "success": true,
  "message": "Cover image uploaded successfully",
  "data": {
    "coverImage": "https://cdn.example.com/events/event-123.jpg"
  }
}
```

---

### GET /events/:id/sub-events

Get sub-events for an event.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "subEvents": [
      {
        "_id": "60f7b3b3b3f3b3b3b3b3b3b3",
        "event": "60f7b3b3b3f3b3b3b3b3b3b3",
        "title": "Mehendi Ceremony",
        "description": "Traditional henna ceremony",
        "startTime": "2026-06-14T16:00:00.000Z",
        "endTime": "2026-06-14T20:00:00.000Z",
        "location": {
          "name": "Home",
          "address": "456 Park Avenue"
        },
        "image": "https://cdn.example.com/events/mehendi.jpg",
        "order": 1
      },
      {
        "_id": "60f7b3b3b3f3b3b3b3b3b3b4",
        "title": "Wedding Ceremony",
        "startTime": "2026-06-15T10:00:00.000Z",
        "endTime": "2026-06-15T14:00:00.000Z",
        "order": 2
      }
    ]
  }
}
```

---

### POST /events/:id/sub-events

Create a sub-event.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request:**
```json
{
  "title": "Mehendi Ceremony",
  "description": "Traditional henna ceremony",
  "startTime": "2026-06-14T16:00:00.000Z",
  "endTime": "2026-06-14T20:00:00.000Z",
  "location": {
    "name": "Home",
    "address": "456 Park Avenue"
  },
  "order": 1
}
```

**Response: 201 Created**
```json
{
  "success": true,
  "message": "Sub-event created successfully",
  "data": {
    // Complete sub-event object
  }
}
```

---

### GET /events/:id/media

Get media gallery for an event.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
```
?page=1
&limit=50
&type=image  // "image", "video"
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "media": [
      {
        "_id": "60f7b3b3b3f3b3b3b3b3b3b3",
        "type": "image",
        "url": "https://cdn.example.com/media/photo-123.jpg",
        "thumbnailUrl": "https://cdn.example.com/media/thumb-photo-123.jpg",
        "uploader": {
          "_id": "60f7b3b3b3f3b3b3b3b3b3b3",
          "displayName": "John Doe",
          "avatar": "https://cdn.example.com/avatars/user.jpg"
        },
        "caption": "Beautiful moment",
        "stats": {
          "views": 45,
          "likes": 12
        },
        "uploadedAt": "2026-06-15T14:30:00.000Z"
      }
    ],
    "pagination": {
      "total": 150,
      "page": 1,
      "limit": 50,
      "pages": 3
    }
  }
}
```

---

### POST /events/:id/media

Upload media to event gallery.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request (Form Data):**
```
file: <file>  // Image or video (max 100MB)
caption: "Beautiful moment"  // Optional
```

**Response: 201 Created**
```json
{
  "success": true,
  "message": "Media uploaded successfully",
  "data": {
    "_id": "60f7b3b3b3f3b3b3b3b3b3b3",
    "type": "image",
    "url": "https://cdn.example.com/media/photo-123.jpg",
    "thumbnailUrl": "https://cdn.example.com/media/thumb-photo-123.jpg"
  }
}
```

---

## Invitations

### GET /invitations

Get user's invitations.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
```
?status=pending  // "pending", "accepted", "declined", "maybe"
&type=received  // "received", "sent"
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "invitations": [
      {
        "_id": "60f7b3b3b3f3b3b3b3b3b3b3",
        "event": {
          "_id": "60f7b3b3b3f3b3b3b3b3b3b3",
          "title": "John & Jane's Wedding",
          "startDate": "2026-06-15T10:00:00.000Z",
          "coverImage": "https://cdn.example.com/events/event-123.jpg"
        },
        "inviter": {
          "_id": "60f7b3b3b3f3b3b3b3b3b3b3",
          "displayName": "John Doe"
        },
        "role": "guest",
        "rsvpStatus": "pending",
        "message": "We'd love to have you join us!",
        "sentAt": "2026-05-10T10:00:00.000Z"
      }
    ]
  }
}
```

---

### POST /invitations

Send event invitations (bulk).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request:**
```json
{
  "event": "60f7b3b3b3f3b3b3b3b3b3b3",
  "invitees": [
    {
      "userId": "60f7b3b3b3f3b3b3b3b3b3b4",  // For registered users
      "role": "guest",
      "message": "Join us for our special day!"
    },
    {
      "guestInfo": {  // For unregistered users
        "name": "Jane Smith",
        "phone": "+919876543211",
        "email": "jane@example.com"
      },
      "role": "guest",
      "allowPlusOnes": true,
      "plusOnesCount": 2
    }
  ]
}
```

**Response: 201 Created**
```json
{
  "success": true,
  "message": "Invitations sent successfully",
  "data": {
    "sent": 2,
    "failed": 0,
    "invitations": [
      // Array of created invitation objects
    ]
  }
}
```

---

### PUT /invitations/:id/rsvp

Respond to an invitation (RSVP).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request:**
```json
{
  "status": "accepted",  // "accepted", "declined", "maybe"
  "note": "Looking forward to it!",
  "plusOnesUsed": 1  // If plus ones allowed
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "message": "RSVP updated successfully",
  "data": {
    // Updated invitation object
  }
}
```

---

## Chat

### GET /chat/conversations

Get user's conversations.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "_id": "60f7b3b3b3f3b3b3b3b3b3b3",
        "type": "event",
        "isGroup": true,
        "groupName": "John & Jane's Wedding",
        "groupAvatar": "https://cdn.example.com/events/event-123.jpg",
        "participants": [
          {
            "_id": "60f7b3b3b3f3b3b3b3b3b3b3",
            "displayName": "John Doe",
            "avatar": "https://cdn.example.com/avatars/user.jpg"
          }
        ],
        "lastMessage": {
          "text": "Can't wait for the big day!",
          "sender": {
            "_id": "60f7b3b3b3f3b3b3b3b3b3b3",
            "displayName": "Jane Smith"
          },
          "sentAt": "2026-05-20T15:30:00.000Z"
        },
        "unreadCount": 5,
        "updatedAt": "2026-05-20T15:30:00.000Z"
      }
    ]
  }
}
```

---

### POST /chat/conversations

Create a new conversation.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request:**
```json
{
  "type": "direct",  // "direct", "event", "vendor"
  "participants": ["60f7b3b3b3f3b3b3b3b3b3b4"]  // User IDs
}
```

**Response: 201 Created**
```json
{
  "success": true,
  "message": "Conversation created successfully",
  "data": {
    // Conversation object
  }
}
```

---

### GET /chat/conversations/:id/messages

Get messages in a conversation.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
```
?page=1
&limit=50
&before=<messageId>  // Load older messages
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "_id": "60f7b3b3b3f3b3b3b3b3b3b3",
        "conversation": "60f7b3b3b3f3b3b3b3b3b3b3",
        "sender": {
          "_id": "60f7b3b3b3f3b3b3b3b3b3b3",
          "displayName": "John Doe",
          "avatar": "https://cdn.example.com/avatars/user.jpg"
        },
        "type": "text",
        "text": "Hey everyone!",
        "status": "read",
        "readBy": [
          {
            "user": "60f7b3b3b3f3b3b3b3b3b3b4",
            "readAt": "2026-05-20T16:00:00.000Z"
          }
        ],
        "sentAt": "2026-05-20T15:30:00.000Z"
      },
      {
        "_id": "60f7b3b3b3f3b3b3b3b3b3b4",
        "type": "image",
        "media": {
          "url": "https://cdn.example.com/media/photo.jpg",
          "thumbnailUrl": "https://cdn.example.com/media/thumb.jpg"
        },
        "sentAt": "2026-05-20T15:35:00.000Z"
      }
    ],
    "pagination": {
      "hasMore": true,
      "oldestMessageId": "60f7b3b3b3f3b3b3b3b3b3b3"
    }
  }
}
```

---

### POST /chat/messages

Send a message.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request (Text Message):**
```json
{
  "conversation": "60f7b3b3b3f3b3b3b3b3b3b3",
  "type": "text",
  "text": "Hello everyone!"
}
```

**Request (Media Message):**
```json
{
  "conversation": "60f7b3b3b3f3b3b3b3b3b3b3",
  "type": "image",
  "media": {
    "url": "https://cdn.example.com/media/photo.jpg",
    "thumbnailUrl": "https://cdn.example.com/media/thumb.jpg",
    "mimeType": "image/jpeg"
  }
}
```

**Response: 201 Created**
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    // Message object
  }
}
```

---

### PUT /chat/messages/:id/read

Mark message as read.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response: 200 OK**
```json
{
  "success": true,
  "message": "Message marked as read"
}
```

---

## Vendors

### GET /vendors

Search and list vendors.

**Query Parameters:**
```
?category=60f7b3b3b3f3b3b3b3b3b3b3
&city=Mumbai
&latitude=18.9388
&longitude=72.8258
&radius=10  // kilometers
&minRating=4
&verified=true
&page=1
&limit=20
&sort=rating  // "rating", "price", "reviews"
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "vendors": [
      {
        "_id": "60f7b3b3b3f3b3b3b3b3b3b3",
        "businessName": "Perfect Events",
        "category": {
          "_id": "60f7b3b3b3f3b3b3b3b3b3b3",
          "name": "Event Planners",
          "icon": "event"
        },
        "description": "Professional event planning services",
        "location": {
          "city": "Mumbai",
          "address": "123 Business Street"
        },
        "rating": 4.8,
        "reviewCount": 156,
        "pricing": {
          "startingPrice": 50000,
          "currency": "INR"
        },
        "portfolio": [
          "https://cdn.example.com/portfolio/1.jpg",
          "https://cdn.example.com/portfolio/2.jpg"
        ],
        "verified": true,
        "featured": true
      }
    ],
    "pagination": {
      "total": 45,
      "page": 1,
      "limit": 20,
      "pages": 3
    }
  }
}
```

---

### GET /vendors/:id

Get vendor details.

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "_id": "60f7b3b3b3f3b3b3b3b3b3b3",
    "businessName": "Perfect Events",
    "category": {
      "_id": "60f7b3b3b3f3b3b3b3b3b3b3",
      "name": "Event Planners"
    },
    "description": "Professional event planning services with 10+ years experience",
    "phone": "+919876543210",
    "email": "contact@perfectevents.com",
    "website": "https://perfectevents.com",
    "location": {
      "city": "Mumbai",
      "address": "123 Business Street",
      "coordinates": {
        "type": "Point",
        "coordinates": [72.8258, 18.9388]
      }
    },
    "serviceArea": {
      "radius": 50,
      "cities": ["Mumbai", "Navi Mumbai", "Thane"]
    },
    "rating": 4.8,
    "reviewCount": 156,
    "portfolio": [
      {
        "url": "https://cdn.example.com/portfolio/1.jpg",
        "caption": "Corporate Event 2025",
        "type": "image"
      }
    ],
    "packages": [
      {
        "name": "Basic Package",
        "description": "Essential event planning services",
        "price": 50000,
        "features": ["Venue selection", "Guest coordination"],
        "popular": false
      },
      {
        "name": "Premium Package",
        "description": "Full-service event planning",
        "price": 150000,
        "features": ["Everything in Basic", "Decoration", "Catering"],
        "popular": true
      }
    ],
    "stats": {
      "totalBookings": 287,
      "completedBookings": 275,
      "responseTime": 15  // minutes
    },
    "verified": true,
    "status": "active"
  }
}
```

---

### POST /vendors

Create vendor profile (requires user account).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request:**
```json
{
  "businessName": "Perfect Events",
  "category": "60f7b3b3b3f3b3b3b3b3b3b3",
  "description": "Professional event planning services",
  "phone": "+919876543210",
  "email": "contact@perfectevents.com",
  "location": {
    "address": "123 Business Street, Mumbai",
    "city": "Mumbai",
    "state": "Maharashtra",
    "country": "India",
    "coordinates": {
      "type": "Point",
      "coordinates": [72.8258, 18.9388]
    }
  },
  "pricing": {
    "startingPrice": 50000,
    "currency": "INR",
    "pricingModel": "package"
  }
}
```

**Response: 201 Created**
```json
{
  "success": true,
  "message": "Vendor profile created successfully",
  "data": {
    // Vendor object
  }
}
```

---

### PUT /vendors/:id

Update vendor profile.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request:**
```json
{
  "description": "Updated description",
  "pricing": {
    "startingPrice": 60000
  }
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "message": "Vendor profile updated successfully",
  "data": {
    // Updated vendor object
  }
}
```

---

### GET /vendors/:id/reviews

Get vendor reviews.

**Query Parameters:**
```
?page=1
&limit=20
&sort=recent  // "recent", "rating", "helpful"
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "_id": "60f7b3b3b3f3b3b3b3b3b3b3",
        "customer": {
          "_id": "60f7b3b3b3f3b3b3b3b3b3b3",
          "displayName": "John Doe",
          "avatar": "https://cdn.example.com/avatars/user.jpg"
        },
        "rating": 5,
        "title": "Excellent service!",
        "comment": "They made our wedding perfect. Highly recommended!",
        "ratings": {
          "quality": 5,
          "professionalism": 5,
          "valueForMoney": 4
        },
        "verified": true,
        "helpfulCount": 12,
        "response": {
          "text": "Thank you for your kind words!",
          "respondedAt": "2026-05-15T10:00:00.000Z"
        },
        "createdAt": "2026-05-14T18:30:00.000Z"
      }
    ],
    "summary": {
      "averageRating": 4.8,
      "totalReviews": 156,
      "distribution": {
        "5": 120,
        "4": 28,
        "3": 6,
        "2": 1,
        "1": 1
      }
    },
    "pagination": {
      "total": 156,
      "page": 1,
      "limit": 20,
      "pages": 8
    }
  }
}
```

---

### POST /vendors/:id/reviews

Write a vendor review.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request:**
```json
{
  "rating": 5,
  "title": "Excellent service!",
  "comment": "They made our wedding perfect. Highly recommended!",
  "ratings": {
    "quality": 5,
    "professionalism": 5,
    "valueForMoney": 4,
    "punctuality": 5,
    "communication": 5
  },
  "booking": "60f7b3b3b3f3b3b3b3b3b3b3"  // Optional
}
```

**Response: 201 Created**
```json
{
  "success": true,
  "message": "Review submitted successfully",
  "data": {
    // Review object
  }
}
```

---

## Bookings

### GET /bookings

Get user's bookings.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
```
?status=confirmed  // "pending", "confirmed", "completed", "cancelled"
&type=customer  // "customer", "vendor"
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "_id": "60f7b3b3b3f3b3b3b3b3b3b3",
        "vendor": {
          "_id": "60f7b3b3b3f3b3b3b3b3b3b3",
          "businessName": "Perfect Events"
        },
        "customer": {
          "_id": "60f7b3b3b3f3b3b3b3b3b3b3",
          "displayName": "John Doe"
        },
        "serviceDate": "2026-06-15T10:00:00.000Z",
        "package": {
          "name": "Premium Package",
          "price": 150000
        },
        "pricing": {
          "totalAmount": 150000,
          "currency": "INR"
        },
        "payment": {
          "status": "paid",
          "paidAmount": 150000
        },
        "status": "confirmed",
        "createdAt": "2026-05-10T10:00:00.000Z"
      }
    ]
  }
}
```

---

### POST /bookings

Create a vendor booking.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request:**
```json
{
  "vendor": "60f7b3b3b3f3b3b3b3b3b3b3",
  "event": "60f7b3b3b3f3b3b3b3b3b3b3",  // Optional
  "serviceDate": "2026-06-15T10:00:00.000Z",
  "serviceTime": "10:00",
  "duration": 6,  // hours
  "location": {
    "address": "123 Venue Street",
    "city": "Mumbai"
  },
  "package": {
    "name": "Premium Package",
    "price": 150000
  },
  "requirements": "We need extra decoration for 200 guests",
  "guestCount": 200
}
```

**Response: 201 Created**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    // Booking object
  }
}
```

---

### GET /bookings/:id

Get booking details.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    // Complete booking object
  }
}
```

---

### PUT /bookings/:id/confirm

Confirm a booking (vendor only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response: 200 OK**
```json
{
  "success": true,
  "message": "Booking confirmed successfully",
  "data": {
    // Updated booking object
  }
}
```

---

### PUT /bookings/:id/cancel

Cancel a booking.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request:**
```json
{
  "reason": "Event postponed due to weather"
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "message": "Booking cancelled successfully",
  "data": {
    // Updated booking object
  }
}
```

---

## Categories

### GET /categories

Get vendor categories.

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "_id": "60f7b3b3b3f3b3b3b3b3b3b3",
        "name": "Event Planners",
        "slug": "event-planners",
        "description": "Professional event planning services",
        "icon": "event",
        "image": "https://cdn.example.com/categories/event-planners.jpg",
        "vendorCount": 45,
        "featured": true
      },
      {
        "_id": "60f7b3b3b3f3b3b3b3b3b3b4",
        "name": "Photographers",
        "slug": "photographers",
        "icon": "camera",
        "vendorCount": 128
      }
    ]
  }
}
```

---

## Notifications

### GET /notifications

Get user notifications.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
```
?read=false  // Filter by read status
&limit=50
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "_id": "60f7b3b3b3f3b3b3b3b3b3b3",
        "type": "invite",
        "title": "New Event Invitation",
        "body": "John Doe invited you to 'Wedding Celebration'",
        "icon": "invitation",
        "read": false,
        "action": {
          "type": "navigate",
          "target": "EventDetails",
          "params": {
            "eventId": "60f7b3b3b3f3b3b3b3b3b3b3"
          }
        },
        "createdAt": "2026-05-20T10:00:00.000Z"
      }
    ],
    "unreadCount": 5
  }
}
```

---

### PUT /notifications/:id/read

Mark notification as read.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response: 200 OK**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

### PUT /notifications/read-all

Mark all notifications as read.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response: 200 OK**
```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

---

## Error Handling

### Error Response Format

All errors follow a consistent format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      // Additional error details (validation errors, etc.)
    }
  }
}
```

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request succeeded |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Authentication required or failed |
| 403 | Forbidden | Not authorized to access resource |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 422 | Unprocessable Entity | Validation error |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Service temporarily unavailable |

### Common Error Codes

```javascript
// Authentication Errors
AUTH_REQUIRED          // Authentication required
INVALID_TOKEN          // Invalid or expired token
INVALID_CREDENTIALS    // Invalid login credentials
OTP_EXPIRED           // OTP has expired
OTP_INVALID           // Invalid OTP code

// Authorization Errors
FORBIDDEN             // Not authorized to access
PERMISSION_DENIED     // Insufficient permissions

// Validation Errors
VALIDATION_ERROR      // Input validation failed
INVALID_FORMAT        // Invalid data format
MISSING_FIELD         // Required field missing

// Resource Errors
NOT_FOUND            // Resource not found
ALREADY_EXISTS       // Resource already exists
CONFLICT             // Resource conflict

// Rate Limiting
RATE_LIMIT_EXCEEDED  // Too many requests

// Server Errors
INTERNAL_ERROR       // Internal server error
SERVICE_UNAVAILABLE  // Service unavailable
```

### Validation Error Example

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "fields": {
        "email": "Invalid email format",
        "phone": "Phone number is required"
      }
    }
  }
}
```

---

## Rate Limiting

### Rate Limit Headers

Every response includes rate limit information:

```
X-RateLimit-Limit: 100        # Total requests allowed per window
X-RateLimit-Remaining: 95     # Requests remaining
X-RateLimit-Reset: 1650000000 # Unix timestamp when limit resets
```

### Default Limits

| Endpoint Type | Limit | Window |
|--------------|-------|--------|
| Authentication | 5 requests | 15 minutes |
| OTP Generation | 3 requests | 15 minutes |
| General API | 100 requests | 15 minutes |
| File Upload | 20 requests | 15 minutes |
| Search | 30 requests | 1 minute |

### Rate Limit Exceeded Response

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "retryAfter": 900  // seconds
  }
}
```

---

## Pagination

### Query Parameters

```
?page=1        # Page number (default: 1)
&limit=20      # Items per page (default: 20, max: 100)
```

### Response Format

```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "total": 150,      # Total items
      "page": 1,         # Current page
      "limit": 20,       # Items per page
      "pages": 8,        # Total pages
      "hasNext": true,   # Has next page
      "hasPrev": false   # Has previous page
    }
  }
}
```

---

## File Uploads

### Upload Endpoints

- `/users/me/avatar` - User avatar (max 5MB)
- `/events/:id/cover-image` - Event cover (max 10MB)
- `/events/:id/media` - Event gallery (max 100MB)
- `/chat/upload` - Chat media (max 25MB)

### Supported Formats

**Images**: jpg, jpeg, png, gif, webp  
**Videos**: mp4, mov, avi, webm  
**Documents**: pdf, doc, docx

### Upload Response

```json
{
  "success": true,
  "data": {
    "url": "https://cdn.example.com/uploads/file.jpg",
    "thumbnailUrl": "https://cdn.example.com/uploads/thumb-file.jpg",
    "size": 1024000,
    "mimeType": "image/jpeg",
    "width": 1920,
    "height": 1080
  }
}
```

---

## WebSocket Events

### Connection

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: {
    token: 'Bearer <access_token>'
  }
});
```

### Client → Server Events

```javascript
// Join event room
socket.emit('event:join', { eventId: '60f7b3b3b3f3b3b3b3b3b3b3' });

// Leave event room
socket.emit('event:leave', { eventId: '60f7b3b3b3f3b3b3b3b3b3b3' });

// Send message
socket.emit('message:send', {
  conversation: '60f7b3b3b3f3b3b3b3b3b3b3',
  type: 'text',
  text: 'Hello everyone!'
});

// Typing indicator
socket.emit('typing:start', { conversation: '60f7b3b3b3f3b3b3b3b3b3b3' });
socket.emit('typing:stop', { conversation: '60f7b3b3b3f3b3b3b3b3b3b3' });

// Mark as online
socket.emit('presence:online');
```

### Server → Client Events

```javascript
// New message received
socket.on('message:new', (data) => {
  console.log('New message:', data);
});

// Message delivered
socket.on('message:delivered', (data) => {
  console.log('Message delivered:', data);
});

// Message read
socket.on('message:read', (data) => {
  console.log('Message read:', data);
});

// Event updated
socket.on('event:updated', (data) => {
  console.log('Event updated:', data);
});

// New notification
socket.on('notification:new', (data) => {
  console.log('New notification:', data);
});

// User typing
socket.on('typing:user', (data) => {
  console.log('User typing:', data);
});

// User online/offline
socket.on('user:online', (data) => {
  console.log('User online:', data);
});

socket.on('user:offline', (data) => {
  console.log('User offline:', data);
});
```

---

**Next**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment guide
