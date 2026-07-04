# Resources and Links

This document outlines the validation rules and expected output for resource links and hints.

---

### `res_canonical`

-   **ID:** `res_canonical`
-   **Input Rule:** Must be an Absolute URL (e.g., `https://...`). Should be self-referencing on the main version of a page.
-   **Output:**
    ```html
    <link rel="canonical" href="https://example.com/sample-page">
    ```

---

### `res_shortlink`

-   **ID:** `res_shortlink`
-   **Input Rule:** Must be an Absolute URL.
-   **Output:**
    ```html
    <link rel="shortlink" href="https://ex.co/xyz">
    ```

---

### `res_manifest`

-   **ID:** `res_manifest`
-   **Input Rule:** Link to a valid JSON file. Required for PWA installation.
-   **Output:**
    ```html
    <link rel="manifest" href="/manifest.json">
    ```

---

### `res_preconnect` / `res_preconnect_crossorigin`

-   **IDs:** `res_preconnect`, `res_preconnect_crossorigin`
-   **Input Rule:** Used for high-priority origins (e.g., fonts, CDNs). `crossorigin` attribute is required for CORS assets like fonts. Can have multiple.
-   **Output:**
    ```html
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    ```

---

### `res_dnsPrefetch`

-   **ID:** `res_dnsPrefetch`
-   **Input Rule:** Fallback for browsers lacking `preconnect`. Use for things like analytics/trackers to resolve IP addresses early.
-   **Output:**
    ```html
    <link rel="dns-prefetch" href="https://www.google-analytics.com">
    ```

---

### `alternate` (hreflang)

-   **IDs:** `alternate_*_lang`, `alternate_*_url`
-   **Input Rule:** The language code should be in 'language-country' format (ISO 639-1). The array should include a self-reference and return links.
-   **Output:**
    ```html
    <link rel="alternate" hreflang="en" href="https://example.com/sample-page">
    <link rel="alternate" hreflang="es" href="https://example.com/es/sample-page">
    <link rel="alternate" hreflang="x-default" href="https://example.com/sample-page">
    ```
