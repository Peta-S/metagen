# Social Meta Tags (Open Graph, Twitter)

This document outlines validation rules and output for social media tags.

---

## Open Graph / Facebook

### `og_siteName`
-   **ID:** `og_siteName`
-   **Input Rule:** Use `property` attribute.
-   **Output:** `<meta property="og:site_name" content="Meta Tag Generator">`

### `og_locale` / `og_localeAlternates`
-   **IDs:** `og_locale`, `og_localeAlternates`
-   **Input Rule:** Format 'language_TERRITORY'. Default `en_US`.
-   **Output:**
    ```html
    <meta property="og:locale" content="en_US">
    <meta property="og:locale:alternate" content="es_ES">
    ```

### `og_type`
-   **ID:** `og_type`
-   **Input Rule:** 'website', 'article', 'book', 'profile'. This changes which other properties are required.
-   **Output:** `<meta property="og:type" content="article">`

### `og_title`
-   **ID:** `og_title`
-   **Input Rule:** Max ~95 chars.
-   **Output:** `<meta property="og:title" content="Your OG Title">`

### `og_description`
-   **ID:** `og_description`
-   **Input Rule:** Recommended 2-4 sentences.
-   **Output:** `<meta property="og:description" content="Your OG description.">`

### `og_url`
-   **ID:** `og_url`
-   **Input Rule:** Absolute URL. Must match Canonical URL usually.
-   **Output:** `<meta property="og:url" content="https://example.com/page">`

### Open Graph Images
-   **IDs:** `og_image_*_url`, `og_image_*_secureUrl`, `og_image_*_width`, `og_image_*_height`, `og_image_*_alt`, `og_image_*_type`
-   **Input Rule:** Absolute URL. JPG/PNG/GIF. Recommended size: 1200x630px. Max 8MB.
-   **Output (for one image):**
    ```html
    <meta property="og:image" content="https://example.com/og-image.jpg">
    <meta property="og:image:secure_url" content="https://example.com/og-image.jpg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="Description of image">
    <meta property="og:image:type" content="image/jpeg">
    ```

### `fb_facebookAppId`
-   **ID:** `fb_facebookAppId`
-   **Input Rule:** Numeric Facebook App ID.
-   **Output:** `<meta property="fb:app_id" content="1234567890">`

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

## Twitter Cards

### `twt_card`
-   **ID:** `twt_card`
-   **Input Rule:** 'summary', 'summary_large_image', 'app', 'player'.
-   **Output:** `<meta name="twitter:card" content="summary_large_image">`

### `twt_site` / `twt_creator`
-   **IDs:** `twt_site`, `twt_creator`
-   **Input Rule:** Twitter @username.
-   **Output:**
    ```html
    <meta name="twitter:site" content="@site_username">
    <meta name="twitter:creator" content="@creator_username">
    ```

### `twt_title`
-   **ID:** `twt_title`
-   **Input Rule:** Max 70 chars. Falls back to `og:title` if missing.
-   **Output:** `<meta name="twitter:title" content="Your Twitter Title">`

### `twt_description`
-   **ID:** `twt_description`
-   **Input Rule:** Max 200 chars. Falls back to `og:description` if missing.
-   **Output:** `<meta name="twitter:description" content="Your Twitter description.">`

### `twt_image`
-   **ID:** `twt_image`
-   **Input Rule:** Must be < 5MB. WebP/JPG/PNG. Falls back to `og:image` if missing.
-   **Output:** `<meta name="twitter:image" content="https://example.com/twitter-image.jpg">`

### `twt_imageAlt`
-   **ID:** `twt_imageAlt`
-   **Input Rule:** Max 420 chars. Critical for accessibility.
-   **Output:** `<meta name="twitter:image:alt" content="Description of Twitter image">`
