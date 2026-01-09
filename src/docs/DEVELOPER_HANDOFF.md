# Wasilah CMS - Developer Handoff Documentation

## 📋 Table of Contents

1. [API Contracts](#api-contracts)
2. [Field Definitions](#field-definitions)
3. [Data Schemas](#data-schemas)
4. [Component Props Specifications](#component-props-specifications)
5. [Integration Guide](#integration-guide)
6. [Validation Rules](#validation-rules)
7. [Error Handling](#error-handling)

---

## 🔌 API Contracts

### Base URL
```
Production: https://api.wasilah.pk/v1
Staging: https://staging-api.wasilah.pk/v1
Development: http://localhost:3000/api/v1
```

### Authentication
All CMS endpoints require authentication via Bearer token:
```
Authorization: Bearer <access_token>
```

---

### 1. Content Management Endpoints

#### **GET /content**
Retrieve paginated list of content items

**Query Parameters:**
```typescript
{
  type?: 'testimonial' | 'case-study' | 'resource';
  status?: 'draft' | 'published' | 'scheduled';
  author?: string;
  search?: string;
  tags?: string[];  // comma-separated
  page?: number;     // default: 1
  limit?: number;    // default: 10, max: 100
  sort?: 'created_at' | 'updated_at' | 'title';
  order?: 'asc' | 'desc';
  from_date?: string; // ISO 8601
  to_date?: string;   // ISO 8601
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "cnt_abc123xyz",
        "type": "case-study",
        "title": "Education Initiative - Sindh Rural Schools",
        "subtitle": "Bringing quality education to 500+ students",
        "slug": "education-initiative-sindh-rural-schools",
        "status": "published",
        "author": {
          "id": "usr_456def",
          "name": "Ali Khan",
          "email": "ali@wasilah.pk",
          "avatar": "https://cdn.wasilah.pk/avatars/ali.jpg"
        },
        "featured_image": {
          "url": "https://cdn.wasilah.pk/images/case-study-1.jpg",
          "alt": "Students in classroom",
          "width": 1920,
          "height": 1080
        },
        "excerpt": "Short description for listings...",
        "body": "<p>Full HTML content...</p>",
        "meta_description": "SEO description for search engines",
        "tags": ["Education", "SDG4", "Sindh"],
        "sdg_goals": [4, 10],
        "published_at": "2024-01-07T10:30:00Z",
        "scheduled_at": null,
        "created_at": "2024-01-05T14:20:00Z",
        "updated_at": "2024-01-07T10:30:00Z",
        "version": 3
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_items": 48,
      "items_per_page": 10,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

---

#### **GET /content/:id**
Retrieve single content item by ID

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "cnt_abc123xyz",
    "type": "case-study",
    "title": "Education Initiative - Sindh Rural Schools",
    "subtitle": "Bringing quality education to 500+ students",
    "slug": "education-initiative-sindh-rural-schools",
    "status": "published",
    "author": {
      "id": "usr_456def",
      "name": "Ali Khan",
      "email": "ali@wasilah.pk",
      "avatar": "https://cdn.wasilah.pk/avatars/ali.jpg"
    },
    "featured_image": {
      "url": "https://cdn.wasilah.pk/images/case-study-1.jpg",
      "alt": "Students in classroom",
      "width": 1920,
      "height": 1080,
      "thumbnail_url": "https://cdn.wasilah.pk/images/case-study-1-thumb.jpg"
    },
    "excerpt": "Short description for listings...",
    "body": "<p>Full HTML content...</p>",
    "meta_description": "SEO description for search engines",
    "meta_keywords": ["education", "csr", "pakistan"],
    "tags": ["Education", "SDG4", "Sindh"],
    "sdg_goals": [4, 10],
    "related_content": ["cnt_xyz789", "cnt_def456"],
    "published_at": "2024-01-07T10:30:00Z",
    "scheduled_at": null,
    "created_at": "2024-01-05T14:20:00Z",
    "updated_at": "2024-01-07T10:30:00Z",
    "version": 3,
    "view_count": 1247,
    "share_count": 34
  }
}
```

---

#### **POST /content**
Create new content item

**Request Body:**
```json
{
  "type": "case-study",
  "title": "Education Initiative - Sindh Rural Schools",
  "subtitle": "Bringing quality education to 500+ students",
  "slug": "education-initiative-sindh-rural-schools", // optional, auto-generated if empty
  "status": "draft",
  "featured_image": {
    "media_id": "med_abc123",
    "alt": "Students in classroom"
  },
  "excerpt": "Short description for listings...",
  "body": "<p>Full HTML content...</p>",
  "meta_description": "SEO description for search engines",
  "meta_keywords": ["education", "csr", "pakistan"],
  "tags": ["Education", "SDG4", "Sindh"],
  "sdg_goals": [4, 10],
  "scheduled_at": null // ISO 8601 for scheduled publish
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "cnt_abc123xyz",
    "type": "case-study",
    "title": "Education Initiative - Sindh Rural Schools",
    "slug": "education-initiative-sindh-rural-schools",
    "status": "draft",
    "created_at": "2024-01-07T15:45:00Z",
    "updated_at": "2024-01-07T15:45:00Z",
    "version": 1
  },
  "message": "Content created successfully"
}
```

---

#### **PUT /content/:id**
Update existing content item

**Request Body:** (same as POST, all fields optional)
```json
{
  "title": "Updated Title",
  "body": "<p>Updated content...</p>",
  "status": "published"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "cnt_abc123xyz",
    "title": "Updated Title",
    "status": "published",
    "updated_at": "2024-01-07T16:00:00Z",
    "version": 4
  },
  "message": "Content updated successfully"
}
```

---

#### **DELETE /content/:id**
Soft delete content item

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "cnt_abc123xyz",
    "deleted_at": "2024-01-07T16:15:00Z"
  },
  "message": "Content deleted successfully"
}
```

---

#### **POST /content/:id/publish**
Publish content item

**Request Body:**
```json
{
  "audit_note": "Reviewed and approved for publication",
  "scheduled_at": null // or ISO 8601 for scheduled publish
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "cnt_abc123xyz",
    "status": "published",
    "published_at": "2024-01-07T16:20:00Z",
    "version": 5
  },
  "message": "Content published successfully"
}
```

---

#### **POST /content/:id/duplicate**
Duplicate existing content item

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "cnt_newid456",
    "title": "Education Initiative - Sindh Rural Schools (Copy)",
    "status": "draft",
    "created_at": "2024-01-07T16:25:00Z"
  },
  "message": "Content duplicated successfully"
}
```

---

### 2. Testimonial Endpoints

#### **GET /testimonials**
Retrieve all testimonials for homepage block

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "testimonials": [
      {
        "id": "test_abc123",
        "quote": "Wasilah transformed how we approach corporate social responsibility.",
        "author_name": "Sarah Ahmed",
        "author_role": "CSR Director",
        "author_company": "TechCorp Pakistan",
        "author_photo": "https://cdn.wasilah.pk/testimonials/sarah.jpg",
        "is_visible": true,
        "order": 1,
        "created_at": "2024-01-05T10:00:00Z",
        "updated_at": "2024-01-06T14:30:00Z"
      }
    ],
    "total": 8
  }
}
```

---

#### **PUT /testimonials/reorder**
Update testimonial display order

**Request Body:**
```json
{
  "order": [
    { "id": "test_abc123", "order": 1 },
    { "id": "test_def456", "order": 2 },
    { "id": "test_ghi789", "order": 3 }
  ]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Testimonial order updated successfully"
}
```

---

#### **POST /testimonials**
Create new testimonial

**Request Body:**
```json
{
  "quote": "Wasilah transformed how we approach CSR.",
  "author_name": "Sarah Ahmed",
  "author_role": "CSR Director",
  "author_company": "TechCorp Pakistan",
  "author_photo_media_id": "med_xyz789",
  "is_visible": true
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "test_newid123",
    "quote": "Wasilah transformed how we approach CSR.",
    "author_name": "Sarah Ahmed",
    "order": 9,
    "created_at": "2024-01-07T16:30:00Z"
  },
  "message": "Testimonial created successfully"
}
```

---

#### **PUT /testimonials/:id**
Update testimonial

**Request Body:** (all fields optional)
```json
{
  "quote": "Updated quote text",
  "is_visible": false
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "test_abc123",
    "updated_at": "2024-01-07T16:35:00Z"
  },
  "message": "Testimonial updated successfully"
}
```

---

#### **DELETE /testimonials/:id**
Delete testimonial

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Testimonial deleted successfully"
}
```

---

### 3. Media Library Endpoints

#### **GET /media**
Retrieve media library items

**Query Parameters:**
```typescript
{
  search?: string;
  format?: 'jpg' | 'png' | 'webp' | 'gif' | 'svg';
  min_size?: number;  // in bytes
  max_size?: number;  // in bytes
  uploaded_by?: string; // user ID
  from_date?: string;
  to_date?: string;
  page?: number;
  limit?: number;
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "med_abc123",
        "filename": "school-students.jpg",
        "original_filename": "DSC_0012.jpg",
        "url": "https://cdn.wasilah.pk/media/school-students.jpg",
        "thumbnail_url": "https://cdn.wasilah.pk/media/thumbs/school-students.jpg",
        "format": "jpg",
        "mime_type": "image/jpeg",
        "size": 2457600,
        "width": 1920,
        "height": 1080,
        "alt_text": "Students in rural school classroom",
        "caption": "Education initiative in Sindh province",
        "uploaded_by": {
          "id": "usr_456def",
          "name": "Ali Khan"
        },
        "usage_count": 3,
        "used_in": [
          {
            "content_id": "cnt_abc123",
            "content_title": "Education Initiative",
            "content_type": "case-study"
          }
        ],
        "created_at": "2024-01-05T09:30:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 12,
      "total_items": 115,
      "items_per_page": 10
    },
    "storage": {
      "used_bytes": 524288000,
      "limit_bytes": 10737418240,
      "percentage_used": 4.88
    }
  }
}
```

---

#### **POST /media/upload**
Upload new media file

**Request:** `multipart/form-data`
```
file: <binary>
alt_text: "Description of image"
caption: "Optional caption"
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "med_newid789",
    "filename": "school-students.jpg",
    "url": "https://cdn.wasilah.pk/media/school-students.jpg",
    "thumbnail_url": "https://cdn.wasilah.pk/media/thumbs/school-students.jpg",
    "format": "jpg",
    "size": 2457600,
    "width": 1920,
    "height": 1080,
    "created_at": "2024-01-07T16:40:00Z"
  },
  "message": "Media uploaded successfully"
}
```

---

#### **PUT /media/:id**
Update media metadata

**Request Body:**
```json
{
  "alt_text": "Updated alt text",
  "caption": "Updated caption"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Media updated successfully"
}
```

---

#### **DELETE /media/:id**
Delete media file

**Query Parameters:**
```typescript
{
  force?: boolean  // true = hard delete, false = soft delete (default)
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Media deleted successfully"
}
```

**Response (409 Conflict):** If media is in use
```json
{
  "success": false,
  "error": {
    "code": "MEDIA_IN_USE",
    "message": "Cannot delete media that is currently in use",
    "details": {
      "usage_count": 3,
      "used_in": [
        {
          "content_id": "cnt_abc123",
          "content_title": "Education Initiative"
        }
      ]
    }
  }
}
```

---

### 4. Version History Endpoints

#### **GET /content/:id/versions**
Retrieve version history for content

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "versions": [
      {
        "version": 5,
        "author": {
          "id": "usr_456def",
          "name": "Ali Khan",
          "avatar": "https://cdn.wasilah.pk/avatars/ali.jpg"
        },
        "action": "published",
        "audit_note": "Reviewed and approved for publication",
        "changes": [
          {
            "field": "status",
            "old_value": "draft",
            "new_value": "published"
          },
          {
            "field": "body",
            "old_value": "<p>Original content...</p>",
            "new_value": "<p>Updated content...</p>"
          }
        ],
        "created_at": "2024-01-07T16:20:00Z",
        "is_current": true
      },
      {
        "version": 4,
        "author": {
          "id": "usr_456def",
          "name": "Ali Khan"
        },
        "action": "edited",
        "audit_note": "Fixed typos",
        "changes": [
          {
            "field": "title",
            "old_value": "Education Initiatve",
            "new_value": "Education Initiative"
          }
        ],
        "created_at": "2024-01-07T15:00:00Z",
        "is_current": false
      }
    ],
    "total_versions": 5,
    "current_version": 5
  }
}
```

---

#### **GET /content/:id/versions/:version**
Retrieve specific version content

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "version": 4,
    "content": {
      "id": "cnt_abc123",
      "type": "case-study",
      "title": "Education Initiatve",
      "body": "<p>Original content...</p>",
      "status": "draft",
      "created_at": "2024-01-07T15:00:00Z"
    },
    "author": {
      "id": "usr_456def",
      "name": "Ali Khan"
    },
    "audit_note": "Fixed typos"
  }
}
```

---

#### **POST /content/:id/versions/:version/restore**
Restore specific version

**Request Body:**
```json
{
  "audit_note": "Reverted to previous version due to error"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "cnt_abc123",
    "version": 6,
    "restored_from_version": 4,
    "created_at": "2024-01-07T16:45:00Z"
  },
  "message": "Version restored successfully"
}
```

---

### 5. Bulk Operations Endpoints

#### **POST /content/bulk/delete**
Bulk delete content items

**Request Body:**
```json
{
  "content_ids": ["cnt_abc123", "cnt_def456", "cnt_ghi789"],
  "force": false  // soft delete by default
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "deleted_count": 3,
    "failed": []
  },
  "message": "3 items deleted successfully"
}
```

---

#### **POST /content/bulk/publish**
Bulk publish content items

**Request Body:**
```json
{
  "content_ids": ["cnt_abc123", "cnt_def456"],
  "audit_note": "Bulk publish approved content"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "published_count": 2,
    "failed": []
  },
  "message": "2 items published successfully"
}
```

---

## 📝 Field Definitions

### Content Item Fields

| Field | Type | Required | Max Length | Description | Validation |
|-------|------|----------|------------|-------------|------------|
| `id` | string | Auto | - | Unique identifier (format: `cnt_xxxxx`) | Read-only |
| `type` | enum | ✅ Yes | - | Content type | `testimonial`, `case-study`, `resource` |
| `title` | string | ✅ Yes | 200 | Content title | Min 10 chars, Max 200 chars |
| `subtitle` | string | No | 250 | Content subtitle | Max 250 chars |
| `slug` | string | Auto | 250 | URL-friendly slug | Auto-generated from title, unique |
| `status` | enum | ✅ Yes | - | Publication status | `draft`, `published`, `scheduled` |
| `featured_image` | object | No | - | Featured image object | See Media Object schema |
| `excerpt` | string | No | 500 | Short description | Max 500 chars, plain text |
| `body` | string | ✅ Yes | 50000 | Main content HTML | HTML, max 50k chars |
| `meta_description` | string | No | 160 | SEO meta description | Recommended 120-160 chars |
| `meta_keywords` | array | No | - | SEO keywords | Max 10 keywords |
| `tags` | array | No | - | Content tags | Max 20 tags |
| `sdg_goals` | array | No | - | UN SDG goal numbers | Values 1-17 |
| `author` | object | Auto | - | Author user object | Read-only, set from auth token |
| `published_at` | datetime | Auto | - | Publication timestamp | ISO 8601, set on publish |
| `scheduled_at` | datetime | No | - | Scheduled publish time | ISO 8601, future date only |
| `created_at` | datetime | Auto | - | Creation timestamp | ISO 8601, read-only |
| `updated_at` | datetime | Auto | - | Last update timestamp | ISO 8601, read-only |
| `version` | number | Auto | - | Version number | Integer, auto-incremented |

---

### Testimonial Fields

| Field | Type | Required | Max Length | Description | Validation |
|-------|------|----------|------------|-------------|------------|
| `id` | string | Auto | - | Unique identifier (format: `test_xxxxx`) | Read-only |
| `quote` | string | ✅ Yes | 500 | Testimonial quote text | Min 20 chars, Max 500 chars |
| `author_name` | string | ✅ Yes | 100 | Testimonial author name | Min 2 chars, Max 100 chars |
| `author_role` | string | ✅ Yes | 100 | Author job title | Max 100 chars |
| `author_company` | string | ✅ Yes | 150 | Author company name | Max 150 chars |
| `author_photo` | string | No | - | Author photo URL or media_id | URL or `med_xxxxx` format |
| `is_visible` | boolean | ✅ Yes | - | Display on homepage | Default: true |
| `order` | number | Auto | - | Display order | Integer, auto-assigned |
| `created_at` | datetime | Auto | - | Creation timestamp | ISO 8601 |
| `updated_at` | datetime | Auto | - | Last update timestamp | ISO 8601 |

---

### Media Object Fields

| Field | Type | Required | Max Size | Description | Validation |
|-------|------|----------|----------|-------------|------------|
| `id` | string | Auto | - | Unique identifier (format: `med_xxxxx`) | Read-only |
| `filename` | string | Auto | - | Stored filename | Sanitized, unique |
| `original_filename` | string | Auto | - | Original uploaded filename | Preserved |
| `url` | string | Auto | - | CDN URL | HTTPS, read-only |
| `thumbnail_url` | string | Auto | - | Thumbnail CDN URL | HTTPS, read-only |
| `format` | enum | Auto | - | File format | `jpg`, `png`, `webp`, `gif`, `svg` |
| `mime_type` | string | Auto | - | MIME type | Auto-detected |
| `size` | number | Auto | 10MB | File size in bytes | Max 10485760 bytes (10MB) |
| `width` | number | Auto | - | Image width in pixels | For images only |
| `height` | number | Auto | - | Image height in pixels | For images only |
| `alt_text` | string | ✅ Recommended | 200 | Accessibility alt text | Max 200 chars |
| `caption` | string | No | 500 | Image caption | Max 500 chars |
| `uploaded_by` | object | Auto | - | Uploader user object | Read-only |
| `usage_count` | number | Auto | - | Number of places used | Read-only |
| `used_in` | array | Auto | - | Content items using this media | Read-only |
| `created_at` | datetime | Auto | - | Upload timestamp | ISO 8601 |

---

## 📊 Data Schemas

### Content Item Schema (JSON)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["type", "title", "status", "body"],
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^cnt_[a-z0-9]{10,}$",
      "readOnly": true
    },
    "type": {
      "type": "string",
      "enum": ["testimonial", "case-study", "resource"]
    },
    "title": {
      "type": "string",
      "minLength": 10,
      "maxLength": 200
    },
    "subtitle": {
      "type": "string",
      "maxLength": 250
    },
    "slug": {
      "type": "string",
      "pattern": "^[a-z0-9-]+$",
      "maxLength": 250
    },
    "status": {
      "type": "string",
      "enum": ["draft", "published", "scheduled"]
    },
    "featured_image": {
      "type": "object",
      "properties": {
        "media_id": {
          "type": "string",
          "pattern": "^med_[a-z0-9]{10,}$"
        },
        "url": { "type": "string", "format": "uri" },
        "alt": { "type": "string", "maxLength": 200 },
        "width": { "type": "integer", "minimum": 1 },
        "height": { "type": "integer", "minimum": 1 }
      }
    },
    "excerpt": {
      "type": "string",
      "maxLength": 500
    },
    "body": {
      "type": "string",
      "minLength": 50,
      "maxLength": 50000
    },
    "meta_description": {
      "type": "string",
      "maxLength": 160
    },
    "meta_keywords": {
      "type": "array",
      "items": { "type": "string" },
      "maxItems": 10
    },
    "tags": {
      "type": "array",
      "items": { "type": "string" },
      "maxItems": 20
    },
    "sdg_goals": {
      "type": "array",
      "items": {
        "type": "integer",
        "minimum": 1,
        "maximum": 17
      }
    },
    "author": {
      "type": "object",
      "readOnly": true,
      "properties": {
        "id": { "type": "string" },
        "name": { "type": "string" },
        "email": { "type": "string", "format": "email" },
        "avatar": { "type": "string", "format": "uri" }
      }
    },
    "published_at": {
      "type": "string",
      "format": "date-time"
    },
    "scheduled_at": {
      "type": "string",
      "format": "date-time"
    },
    "created_at": {
      "type": "string",
      "format": "date-time",
      "readOnly": true
    },
    "updated_at": {
      "type": "string",
      "format": "date-time",
      "readOnly": true
    },
    "version": {
      "type": "integer",
      "minimum": 1,
      "readOnly": true
    }
  }
}
```

---

### Testimonial Schema (JSON)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["quote", "author_name", "author_role", "author_company"],
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^test_[a-z0-9]{10,}$",
      "readOnly": true
    },
    "quote": {
      "type": "string",
      "minLength": 20,
      "maxLength": 500
    },
    "author_name": {
      "type": "string",
      "minLength": 2,
      "maxLength": 100
    },
    "author_role": {
      "type": "string",
      "maxLength": 100
    },
    "author_company": {
      "type": "string",
      "maxLength": 150
    },
    "author_photo": {
      "type": "string",
      "oneOf": [
        { "format": "uri" },
        { "pattern": "^med_[a-z0-9]{10,}$" }
      ]
    },
    "is_visible": {
      "type": "boolean",
      "default": true
    },
    "order": {
      "type": "integer",
      "minimum": 1,
      "readOnly": true
    },
    "created_at": {
      "type": "string",
      "format": "date-time",
      "readOnly": true
    },
    "updated_at": {
      "type": "string",
      "format": "date-time",
      "readOnly": true
    }
  }
}
```

---

## ⚙️ Component Props Specifications

### ContentEditor Component

```typescript
type ContentEditorProps = {
  contentId?: string;              // For editing existing content
  contentType: 'case-study' | 'resource' | 'testimonial';
  initialData?: ContentItem;       // Pre-populate form
  onSave: (data: ContentItem) => void;
  onPublish: (data: ContentItem, auditNote: string) => void;
  onCancel: () => void;
  autosaveInterval?: number;       // ms, default: 30000 (30s)
};
```

---

### WysiwygEditor Component

```typescript
type WysiwygEditorProps = {
  value: string;                   // HTML content
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;              // pixels, default: 400
  maxHeight?: number;              // pixels, default: none
  enableMedia?: boolean;           // default: true
  enableCode?: boolean;            // default: false (admin only)
  onMediaInsert?: () => void;      // Callback to open media library
  readOnly?: boolean;              // default: false
};
```

---

### PreviewModal Component

```typescript
type PreviewModalProps = {
  content: ContentItem;
  isOpen: boolean;
  onClose: () => void;
  initialDevice?: 'desktop' | 'tablet' | 'mobile';  // default: 'desktop'
  showContext?: boolean;           // default: true
};
```

---

### VersionHistoryModal Component

```typescript
type Version = {
  version: number;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  action: 'created' | 'edited' | 'published' | 'unpublished';
  audit_note?: string;
  changes: Array<{
    field: string;
    old_value: any;
    new_value: any;
  }>;
  created_at: string;
  is_current: boolean;
};

type VersionHistoryModalProps = {
  contentId: string;
  isOpen: boolean;
  onClose: () => void;
  onRestore: (version: number, auditNote: string) => void;
};
```

---

### MediaLibrary Component

```typescript
type MediaLibraryProps = {
  mode?: 'select' | 'manage';      // default: 'manage'
  onSelect?: (media: MediaItem) => void;  // For 'select' mode
  allowedFormats?: Array<'jpg' | 'png' | 'webp' | 'gif' | 'svg'>;
  maxFileSize?: number;            // bytes, default: 10485760 (10MB)
  multiSelect?: boolean;           // default: false
};
```

---

### TestimonialBlockEditor Component

```typescript
type TestimonialBlockEditorProps = {
  onSave: (testimonials: Testimonial[]) => void;
  onCancel: () => void;
  initialData?: Testimonial[];
  maxTestimonials?: number;        // default: 12
};
```

---

### Pagination Component

```typescript
type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (perPage: number) => void;
  itemsPerPageOptions?: number[];  // default: [10, 25, 50, 100]
};
```

---

### ImageCropper Component

```typescript
type CropData = {
  x: number;
  y: number;
  width: number;
  height: number;
  aspectRatio: '1:1' | '4:3' | '16:9' | 'free';
  zoom: number;
  rotation: number;
};

type ImageCropperProps = {
  imageUrl: string;
  onComplete: (croppedImageUrl: string, cropData: CropData) => void;
  onCancel: () => void;
  initialAspectRatio?: '1:1' | '4:3' | '16:9' | 'free';  // default: '16:9'
};
```

---

### ContentWarnings Component

```typescript
type ContentWarning = {
  id: string;
  type: 'alt-text' | 'summary' | 'length' | 'seo' | 'accessibility';
  message: string;
  field?: string;
  severity: 'warning' | 'info';
};

type ContentWarningsProps = {
  warnings: ContentWarning[];
  onDismiss?: (warningId: string) => void;
  className?: string;
};
```

---

## 🔧 Integration Guide

### 1. Backend Integration

#### Setup Authentication

```typescript
// middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateCMS = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication token required'
      }
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid or expired token'
      }
    });
  }
};
```

---

#### Content CRUD Example (Node.js/Express)

```typescript
// routes/content.ts
import express from 'express';
import { authenticateCMS } from '../middleware/auth';
import { ContentService } from '../services/content';

const router = express.Router();

// Get content list
router.get('/content', authenticateCMS, async (req, res) => {
  try {
    const filters = {
      type: req.query.type,
      status: req.query.status,
      search: req.query.search,
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
    };

    const result = await ContentService.getAll(filters);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: error.message
      }
    });
  }
});

// Create content
router.post('/content', authenticateCMS, async (req, res) => {
  try {
    const userId = req.user.id;
    const contentData = {
      ...req.body,
      author_id: userId
    };

    const newContent = await ContentService.create(contentData);

    res.status(201).json({
      success: true,
      data: newContent,
      message: 'Content created successfully'
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.message,
          details: error.details
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: error.message
      }
    });
  }
});

// Update content
router.put('/content/:id', authenticateCMS, async (req, res) => {
  try {
    const contentId = req.params.id;
    const userId = req.user.id;

    const updatedContent = await ContentService.update(
      contentId,
      req.body,
      userId
    );

    res.json({
      success: true,
      data: updatedContent,
      message: 'Content updated successfully'
    });
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Content not found'
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: error.message
      }
    });
  }
});

export default router;
```

---

### 2. Frontend Integration

#### API Client Setup

```typescript
// lib/api/client.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to all requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

#### Content Service

```typescript
// lib/api/content.ts
import { apiClient } from './client';
import { ContentItem, ContentFilters } from '@/types/cms';

export const ContentAPI = {
  // Get all content
  getAll: async (filters: ContentFilters) => {
    const response = await apiClient.get('/content', { params: filters });
    return response.data;
  },

  // Get single content
  getById: async (id: string) => {
    const response = await apiClient.get(`/content/${id}`);
    return response.data;
  },

  // Create content
  create: async (data: Partial<ContentItem>) => {
    const response = await apiClient.post('/content', data);
    return response.data;
  },

  // Update content
  update: async (id: string, data: Partial<ContentItem>) => {
    const response = await apiClient.put(`/content/${id}`, data);
    return response.data;
  },

  // Delete content
  delete: async (id: string, force = false) => {
    const response = await apiClient.delete(`/content/${id}`, {
      params: { force }
    });
    return response.data;
  },

  // Publish content
  publish: async (id: string, auditNote: string, scheduledAt?: string) => {
    const response = await apiClient.post(`/content/${id}/publish`, {
      audit_note: auditNote,
      scheduled_at: scheduledAt
    });
    return response.data;
  },

  // Get versions
  getVersions: async (id: string) => {
    const response = await apiClient.get(`/content/${id}/versions`);
    return response.data;
  },

  // Restore version
  restoreVersion: async (id: string, version: number, auditNote: string) => {
    const response = await apiClient.post(
      `/content/${id}/versions/${version}/restore`,
      { audit_note: auditNote }
    );
    return response.data;
  },
};
```

---

#### Using in React Components

```typescript
// pages/cms/ContentEditor.tsx
import { useState, useEffect } from 'react';
import { ContentAPI } from '@/lib/api/content';
import { toast } from 'sonner@2.0.3';

export default function ContentEditor({ contentId }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (contentId) {
      loadContent();
    } else {
      setLoading(false);
    }
  }, [contentId]);

  const loadContent = async () => {
    try {
      const response = await ContentAPI.getById(contentId);
      setContent(response.data);
    } catch (error) {
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data) => {
    try {
      if (contentId) {
        await ContentAPI.update(contentId, data);
        toast.success('Content updated');
      } else {
        const response = await ContentAPI.create(data);
        // Navigate to edit mode with new ID
        window.location.href = `/admin/cms/content/${response.data.id}`;
      }
    } catch (error) {
      toast.error('Failed to save content');
    }
  };

  const handlePublish = async (data, auditNote) => {
    try {
      await ContentAPI.publish(contentId, auditNote);
      toast.success('Content published');
    } catch (error) {
      toast.error('Failed to publish content');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <ContentEditorComponent
      contentId={contentId}
      initialData={content}
      onSave={handleSave}
      onPublish={handlePublish}
    />
  );
}
```

---

### 3. Database Schema

#### PostgreSQL Schema

```sql
-- Content table
CREATE TABLE content (
  id VARCHAR(20) PRIMARY KEY DEFAULT ('cnt_' || gen_random_uuid()::text),
  type VARCHAR(20) NOT NULL CHECK (type IN ('testimonial', 'case-study', 'resource')),
  title VARCHAR(200) NOT NULL,
  subtitle VARCHAR(250),
  slug VARCHAR(250) UNIQUE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
  featured_image_id VARCHAR(20) REFERENCES media(id),
  excerpt TEXT,
  body TEXT NOT NULL,
  meta_description VARCHAR(160),
  meta_keywords TEXT[],
  tags TEXT[],
  sdg_goals INTEGER[],
  author_id VARCHAR(20) NOT NULL REFERENCES users(id),
  published_at TIMESTAMP WITH TIME ZONE,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  version INTEGER DEFAULT 1,
  view_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0
);

CREATE INDEX idx_content_type ON content(type);
CREATE INDEX idx_content_status ON content(status);
CREATE INDEX idx_content_author ON content(author_id);
CREATE INDEX idx_content_published_at ON content(published_at);
CREATE INDEX idx_content_slug ON content(slug);

-- Testimonials table
CREATE TABLE testimonials (
  id VARCHAR(20) PRIMARY KEY DEFAULT ('test_' || gen_random_uuid()::text),
  quote TEXT NOT NULL,
  author_name VARCHAR(100) NOT NULL,
  author_role VARCHAR(100) NOT NULL,
  author_company VARCHAR(150) NOT NULL,
  author_photo_id VARCHAR(20) REFERENCES media(id),
  is_visible BOOLEAN DEFAULT true,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_testimonials_order ON testimonials(display_order);
CREATE INDEX idx_testimonials_visible ON testimonials(is_visible);

-- Media table
CREATE TABLE media (
  id VARCHAR(20) PRIMARY KEY DEFAULT ('med_' || gen_random_uuid()::text),
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  format VARCHAR(10) NOT NULL,
  mime_type VARCHAR(50) NOT NULL,
  size_bytes INTEGER NOT NULL,
  width INTEGER,
  height INTEGER,
  alt_text VARCHAR(200),
  caption TEXT,
  uploaded_by VARCHAR(20) NOT NULL REFERENCES users(id),
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_media_format ON media(format);
CREATE INDEX idx_media_uploaded_by ON media(uploaded_by);

-- Content versions table (for version history)
CREATE TABLE content_versions (
  id SERIAL PRIMARY KEY,
  content_id VARCHAR(20) NOT NULL REFERENCES content(id),
  version INTEGER NOT NULL,
  author_id VARCHAR(20) NOT NULL REFERENCES users(id),
  action VARCHAR(20) NOT NULL,
  audit_note TEXT,
  content_snapshot JSONB NOT NULL,
  changes JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(content_id, version)
);

CREATE INDEX idx_versions_content ON content_versions(content_id);
CREATE INDEX idx_versions_version ON content_versions(content_id, version);

-- Media usage tracking (junction table)
CREATE TABLE media_usage (
  media_id VARCHAR(20) NOT NULL REFERENCES media(id),
  content_id VARCHAR(20) NOT NULL REFERENCES content(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (media_id, content_id)
);

CREATE INDEX idx_usage_media ON media_usage(media_id);
CREATE INDEX idx_usage_content ON media_usage(content_id);
```

---

## ✅ Validation Rules

### Content Validation

```typescript
// validators/content.ts
import Joi from 'joi';

export const contentSchema = Joi.object({
  type: Joi.string()
    .valid('testimonial', 'case-study', 'resource')
    .required()
    .messages({
      'any.required': 'Content type is required',
      'any.only': 'Invalid content type'
    }),

  title: Joi.string()
    .min(10)
    .max(200)
    .required()
    .messages({
      'string.min': 'Title must be at least 10 characters',
      'string.max': 'Title cannot exceed 200 characters',
      'any.required': 'Title is required'
    }),

  subtitle: Joi.string()
    .max(250)
    .allow('', null)
    .messages({
      'string.max': 'Subtitle cannot exceed 250 characters'
    }),

  slug: Joi.string()
    .pattern(/^[a-z0-9-]+$/)
    .max(250)
    .messages({
      'string.pattern.base': 'Slug can only contain lowercase letters, numbers, and hyphens'
    }),

  status: Joi.string()
    .valid('draft', 'published', 'scheduled')
    .required()
    .messages({
      'any.only': 'Invalid status'
    }),

  body: Joi.string()
    .min(50)
    .max(50000)
    .required()
    .messages({
      'string.min': 'Content must be at least 50 characters',
      'string.max': 'Content cannot exceed 50,000 characters',
      'any.required': 'Content body is required'
    }),

  meta_description: Joi.string()
    .max(160)
    .allow('', null)
    .messages({
      'string.max': 'Meta description cannot exceed 160 characters'
    }),

  tags: Joi.array()
    .items(Joi.string())
    .max(20)
    .messages({
      'array.max': 'Cannot have more than 20 tags'
    }),

  sdg_goals: Joi.array()
    .items(Joi.number().integer().min(1).max(17))
    .messages({
      'number.min': 'SDG goal must be between 1 and 17',
      'number.max': 'SDG goal must be between 1 and 17'
    }),

  scheduled_at: Joi.date()
    .iso()
    .greater('now')
    .when('status', {
      is: 'scheduled',
      then: Joi.required(),
      otherwise: Joi.allow(null)
    })
    .messages({
      'date.greater': 'Scheduled date must be in the future',
      'any.required': 'Scheduled date is required for scheduled content'
    }),
});
```

---

### Testimonial Validation

```typescript
// validators/testimonial.ts
import Joi from 'joi';

export const testimonialSchema = Joi.object({
  quote: Joi.string()
    .min(20)
    .max(500)
    .required()
    .messages({
      'string.min': 'Quote must be at least 20 characters',
      'string.max': 'Quote cannot exceed 500 characters',
      'any.required': 'Quote is required'
    }),

  author_name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Author name must be at least 2 characters',
      'string.max': 'Author name cannot exceed 100 characters',
      'any.required': 'Author name is required'
    }),

  author_role: Joi.string()
    .max(100)
    .required()
    .messages({
      'string.max': 'Author role cannot exceed 100 characters',
      'any.required': 'Author role is required'
    }),

  author_company: Joi.string()
    .max(150)
    .required()
    .messages({
      'string.max': 'Company name cannot exceed 150 characters',
      'any.required': 'Company name is required'
    }),

  is_visible: Joi.boolean()
    .default(true),
});
```

---

## ❌ Error Handling

### Standard Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "specific_field",
      "value": "invalid_value",
      "constraint": "validation_rule"
    }
  }
}
```

---

### Error Codes Reference

| Code | HTTP Status | Description | Resolution |
|------|-------------|-------------|------------|
| `UNAUTHORIZED` | 401 | Missing or invalid auth token | Provide valid Bearer token |
| `FORBIDDEN` | 403 | Insufficient permissions | Contact admin for access |
| `NOT_FOUND` | 404 | Resource not found | Check ID is correct |
| `VALIDATION_ERROR` | 400 | Invalid request data | Check validation errors in `details` |
| `DUPLICATE_SLUG` | 409 | Slug already exists | Use different slug |
| `MEDIA_IN_USE` | 409 | Media used in content | Remove from content first |
| `QUOTA_EXCEEDED` | 413 | Storage quota exceeded | Delete unused media |
| `FILE_TOO_LARGE` | 413 | File exceeds size limit | Compress file to <10MB |
| `INVALID_FORMAT` | 415 | Unsupported file format | Use JPG, PNG, WebP, GIF, or SVG |
| `SERVER_ERROR` | 500 | Internal server error | Contact support with request ID |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests | Wait before retrying |

---

### Frontend Error Handling Example

```typescript
// utils/errorHandler.ts
import { toast } from 'sonner@2.0.3';

export const handleAPIError = (error: any) => {
  if (error.response?.data?.error) {
    const { code, message, details } = error.response.data.error;

    switch (code) {
      case 'VALIDATION_ERROR':
        toast.error('Validation Error', {
          description: Object.entries(details)
            .map(([field, msg]) => `${field}: ${msg}`)
            .join('\n')
        });
        break;

      case 'UNAUTHORIZED':
        toast.error('Session expired. Please log in again.');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        break;

      case 'MEDIA_IN_USE':
        toast.error('Cannot delete media', {
          description: `This image is used in ${details.usage_count} content items.`
        });
        break;

      default:
        toast.error(message || 'An error occurred');
    }
  } else {
    toast.error('Network error. Please try again.');
  }
};
```

---

## 📚 Additional Resources

### Rate Limits
- **Content endpoints**: 100 requests/minute per user
- **Media upload**: 20 uploads/minute per user
- **Bulk operations**: 10 operations/minute per user

### CDN & Asset Delivery
- **Images**: Served via Cloudflare CDN
- **Thumbnails**: Auto-generated (400x300px)
- **Cache**: 1 year for media, 1 hour for content API

### Monitoring & Logging
- All API requests logged with request ID
- Performance metrics tracked (response time, error rate)
- Audit trail for all CMS operations

### Support
- **API Status**: https://status.wasilah.pk
- **Documentation**: https://docs.wasilah.pk/cms-api
- **Support Email**: developers@wasilah.pk

---

**Version:** 1.0.0  
**Last Updated:** January 7, 2024  
**Maintained by:** Wasilah Engineering Team
