# Global Meta Tags

This document outlines the validation rules and expected output for the global meta tags.

---

### `gl_charset`

-   **ID:** `gl_charset`
-   **Input Rule:** Must be the first element in `<head>`. Must be within the first 1024 bytes of the HTML. The value is typically "utf-8".
-   **Output:**
    ```html
    <meta charset="utf-8">
    ```

---

### `gl_title`

-   **ID:** `gl_title`
-   **Input Rule:** Max length ~60 chars for optimal SEO (Google truncates after). Unique per page.
-   **Output:**
    ```html
    <title>Your Page Title</title>
    ```

---

### `gl_viewport`

-   **ID:** `gl_viewport`
-   **Input Rule:** Content string must be comma-separated. Required for mobile pass in Google Lighthouse.
-   **Output:**
    ```html
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    ```

---

### `gl_description`

-   **ID:** `gl_description`
-   **Input Rule:** Recommended 155-160 chars. Max 300. Avoid quotes inside content unless escaped.
-   **Output:**
    ```html
    <meta name="description" content="Your page description.">
    ```

---

### `gl_keywords`

-   **ID:** `gl_keywords`
-   **Input Rule:** Comma-separated list of keywords. Deprecated by Google but used by some internal search tools/directories.
-   **Output:**
    ```html
    <meta name="keywords" content="keyword1, keyword2, keyword3">
    ```

---

### `gl_author`

-   **ID:** `gl_author`
-   **Input Rule:** Free text.
-   **Output:**
    ```html
    <meta name="author" content="Author Name">
    ```

---

### `gl_generator`

-   **ID:** `gl_generator`
-   **Input Rule:** Free text. Used for analytics/stats.
-   **Output:**
    ```html
    <meta name="generator" content="Generator Tool">
    ```

---

### `robots`

-   **IDs:** `robots_index`, `robots_follow`, `robots_advanced`
-   **Input Rule:** Accepted values: `index`/`noindex`, `follow`/`nofollow`. Advanced: `max-snippet:[number]`, `max-image-preview:[setting]`.
-   **Output:**
    ```html
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    ```

---

### `gl_themeColor`

-   **ID:** `gl_themeColor`
-   **Input Rule:** Must be a valid HEX color.
-   **Output:**
    ```html
    <meta name="theme-color" content="#ffffff">
    ```

---

### `gl_referrer`

-   **ID:** `gl_referrer`
-   **Input Rule:** 'no-referrer', 'origin', 'strict-origin-when-cross-origin' (Modern Best Practice).
-   **Output:**
    ```html
    <meta name="referrer" content="strict-origin-when-cross-origin">
    ```

---

### `gl_colorScheme`

-   **ID:** `gl_colorScheme`
-   **Input Rule:** 'normal', 'dark', 'light', or 'dark light'. Signals OS dark mode preference.
-   **Output:**
    ```html
    <meta name="color-scheme" content="dark light">
    ```

---

### `gl_formatDetection`

-   **ID:** `gl_formatDetection`
-   **Input Rule:** iOS specific. 'telephone=no' prevents auto-linking numbers.
-   **Output:**
    ```html
    <meta name="format-detection" content="telephone=no">
    ```
