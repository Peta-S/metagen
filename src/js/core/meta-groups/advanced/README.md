# Advanced Meta Tags

This document outlines validation rules and output for advanced and edge-case meta tags.

---

### Verification Tags

-   **IDs:** `ver_google`, `ver_yandex`, `ver_bing`
-   **Input Rule:** Case-sensitive verification tokens provided by search console tools. `bing` is not in the sample but follows the same pattern.
-   **Output:**
    ```html
    <meta name="google-site-verification" content="VerificationString123">
    <meta name="yandex-verification" content="VerificationString456">
    <meta name="msvalidate.01" content="BingVerificationString789">
    ```

---

### `http-equiv`

-   **IDs:** `httpEquiv_*_name`, `httpEquiv_*_content`
-   **Input Rule:** Simulates HTTP response headers. Syntax can be strict (e.g., Content-Security-Policy). Can be used for multiple different headers.
-   **Output:**
    ```html
    <meta http-equiv="Content-Security-Policy" content="default-src 'self';">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta http-equiv="refresh" content="300">
    ```

---

### `itemprop`

-   **IDs:** `itemprop_name`, `itemprop_description`, `itemprop_image`
-   **Input Rule:** Used for Microdata/Schema.org syntax applied directly to meta tags. Attributes should match Schema.org vocabulary.
-   **Output:**
    ```html
    <meta itemprop="name" content="Your Item Name">
    <meta itemprop="description" content="Your item description.">
    <meta itemprop="image" content="https://example.com/item-image.jpg">
    ```
