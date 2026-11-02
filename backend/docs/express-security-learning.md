# Express.js Security, File Uploads and API Documentation

## 1. Purpose

This document explains the security features implemented in the PlaceTrack backend using Express.js and TypeScript. It covers HTTP security headers, CORS, request size limits, rate limiting, secure resume uploads, error handling, and API documentation.

## 2. Helmet

**Purpose:** Helmet sets HTTP response headers that help protect the application against common web vulnerabilities.

**Implementation:** `src/server.ts`

```ts
app.use(helmet());
```

**What I learned:**
- Helmet sets security-related HTTP headers.
- `X-Content-Type-Options` helps prevent MIME-type sniffing.
- Content Security Policy (CSP) controls permitted content sources.
- Helmet adds a useful security layer but does not replace authentication, authorization, or input validation.

## 3. CORS

**Purpose:** Cross-Origin Resource Sharing controls which browser origins are permitted to read responses from the API.

**Implementation:** `src/server.ts`

```ts
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
```

**What I learned:**
- The PlaceTrack frontend runs on port 5173 and the backend runs on port 3000.
- The configured frontend origin is allowed.
- Other origins are not granted the configured CORS permission.
- CORS is a browser security mechanism, not authentication. Non-browser clients can still send requests.

## 4. JSON Request Body Limit

**Purpose:** Limits the size of incoming JSON request bodies to reduce the risk of excessive memory consumption from large payloads.

**Implementation:** `src/server.ts`

```ts
app.use(express.json({ limit: "100kb" }));
```

**Error handling:** `src/middleware/error.middleware.ts`

Oversized JSON requests return HTTP `413 Payload Too Large` with a JSON error message.

**Test performed:** Sent a JSON payload larger than 100 KB.

**Expected result:** HTTP `413`.

## 5. Rate Limiting

**Purpose:** Restricts the number of requests an IP address can make during a time window.

**Implementation:** `src/middleware/rateLimiter.middleware.ts`

```ts
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: "Too many requests. Please try again later.",
  },
});
```

The middleware is registered globally in `src/server.ts`.

**What I learned:**
- The configured limit is 100 requests per 15 minutes per IP address.
- Standard rate-limit headers communicate the current limit and remaining quota.
- HTTP `429 Too Many Requests` indicates that the limit has been exceeded.
- The default in-memory store is suitable for development, but a shared store is generally needed for consistent limits across multiple production server instances.

**Test performed:** Sent repeated requests until the rate limit was reached.

**Observed result:** Requests initially returned `401` for the unauthenticated endpoint, and subsequent requests returned `429` after the quota was exhausted. The initial `401` responses were expected and still counted toward the limit.

## 6. Secure Resume Uploads with Multer

**Purpose:** Allows students to upload PDF resumes while enforcing file restrictions.

**Implementation:** `src/middleware/resumeUpload.ts`

The upload middleware:
- Stores files in `uploads/resumes`.
- Generates UUID-based filenames rather than trusting user-provided filenames.
- Checks the `.pdf` extension and `application/pdf` MIME type.
- Limits each file to 5 MB.
- Allows only one uploaded file per request.

**Route:** `src/routes/resumeRoutes.ts`

The upload route applies authentication and student-role authorization before invoking Multer.

**Controller:** `src/controllers/resumeController.ts`

The controller checks the uploaded file's PDF signature, beginning with `%PDF-`, before saving the resume URL to the user's database record.

**What I learned:**
- MIME types and extensions can be spoofed, so they are not sufficient on their own.
- Checking the PDF signature adds another validation layer.
- UUID filenames reduce filename collisions and prevent the original filename from controlling the storage path.
- Failed validation or database operations trigger cleanup of the newly uploaded file.
- Uploaded files should not be exposed through an unrestricted static directory.

**Error handling:** `src/middleware/error.middleware.ts`

A signature check is not a complete PDF parser or malware scan. Production systems may need additional file inspection, malware scanning, and storage controls.

## 7. Resume Download

**Implementation:** `src/controllers/resumeController.ts`

The download controller:
- Requires authentication.
- Retrieves the authenticated user's resume URL from the database.
- Extracts the stored filename using `path.basename`.
- Checks whether the file exists.
- Sends the file using Express's `res.download()`.

If the user has not uploaded a resume, the endpoint returns HTTP `404`.

## 8. Centralized Error Handling

**Implementation:** `src/middleware/error.middleware.ts`

The error middleware handles:
- Oversized JSON payloads (`413`).
- Multer file upload errors (`400` or `413`).
- Duplicate database records (`409`).
- Missing database records (`404`).
- Database relationship constraint errors (`400`).
- Unhandled errors (`500`).

Register the error middleware after the routes so that errors passed through Express error handling can be processed centrally.

## 9. Testing Summary

The following manual tests were performed during development:

- Helmet response headers were present.
- The configured frontend origin received the expected CORS header.
- An unconfigured origin was not granted the configured CORS permission.
- An oversized JSON payload returned `413`.
- Repeated requests triggered `429`.
- A fake PDF was rejected.
- A file larger than 5 MB was rejected.
- An admin or placement coordinator upload attempt was rejected with `403`.
- The resume download flow was tested.
- An unauthenticated upload request was tested.

These are manual development checks, not a complete automated security audit.

## 10. Swagger / OpenAPI

Swagger documentation will be configured after the security and file-upload work is complete.

The API documentation should describe:
- Available API endpoints and HTTP methods.
- Request parameters and request bodies.
- Successful responses and error responses.
- Bearer-token authentication.
- Resume upload as a multipart form-data request.

## 11. Conclusion

This work introduced several Express.js security practices into PlaceTrack, including HTTP security headers, restricted CORS configuration, JSON body-size limits, rate limiting, protected file uploads, role-based authorization, PDF signature validation, and centralized error handling. These features reduce common risks and provide a foundation for further security testing and API documentation.