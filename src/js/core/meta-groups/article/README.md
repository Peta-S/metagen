# Article Meta Tags 

This document outlines validation rules and output for article media tags.

---

### Article Specific Tags
-   **IDs:** `art_publishedTime`, `art_modifiedTime`, `art_authorUrl`, `art_tags`
-   **Input Rule:** Only if `og:type` is 'article'. Dates must be ISO 8601 format. Author should be a URL. Tags are looped.
-   **Output:**
    ```html
    <meta property="article:published_time" content="2023-10-27T14:00:00+00:00">
    <meta property="article:modified_time" content="2023-10-28T09:30:00+00:00">
    <meta property="article:author" content="https://www.facebook.com/profile.url">
    <meta property="article:tag" content="Tag1">
    <meta property="article:tag" content="Tag2">
    ```

---
