# eCommerce Meta Tags (Open Graph)

This document outlines validation rules and expected output for eCommerce / product-related meta tags. These are primarily based on the Open Graph protocol for products.

---

### `ec_priceAmount` / `ec_priceCurrency`

-   **IDs:** `ec_priceAmount`, `ec_priceCurrency`
-   **Input Rule:** `ec_priceAmount` should be a number. `ec_priceCurrency` should be a 3-letter ISO 4217 currency code (e.g., USD, EUR).
-   **Output:**
    ```html
    <meta property="product:price:amount" content="99.99">
    <meta property="product:price:currency" content="USD">
    ```

---

### `ec_availability`

-   **ID:** `ec_availability`
-   **Input Rule:** Standard Open Graph availability values: `in stock`, `out of stock`, `preorder`, `available for order`, `discontinued`.
-   **Output:**
    ```html
    <meta property="product:availability" content="in stock">
    ```

---

### `ec_brand`

-   **ID:** `ec_brand`
-   **Input Rule:** The brand name of the product. Free text.
-   **Output:**
    ```html
    <meta property="product:brand" content="ACME Corporation">
    ```

---

### `ec_condition`

-   **ID:** `ec_condition`
-   **Input Rule:** The condition of the product. Standard Open Graph values: `new`, `refurbished`, `used`.
-   **Output:**
    ```html
    <meta property="product:condition" content="new">
    ```

---

### `ec_retailerItemId`

-   **ID:** `ec_retailerItemId`
-   **Input Rule:** A retailer-specific ID for the product (e.g., SKU).
-   **Output:**
    ```html
    <meta property="product:retailer_item_id" content="sku-12345-abc">
    ```

---

### `ec_itemGroupId`

-   **ID:** `ec_itemGroupId`
-   **Input Rule:** The item group ID for the product. Free text.
-   **Output:**
    ```html
    <meta property="product:item_group_id" content="GROUP-789">
    ```

---

### `ec_category`

-   **ID:** `ec_category`
-   **Input Rule:** The product category. Free text, hierarchical structure recommended (e.g., "Electronics > Audio > Headphones").
-   **Output:**
    ```html
    <meta property="product:category" content="Electronics > Audio > Headphones">
    ```

---

### `twitter_product_card`

-   **IDs:** `twitter_label1`, `twitter_data1`, `twitter_label2`, `twitter_data2`
-   **Input Rule:** `twitter_label1` and `twitter_label2` are labels for product attributes. `twitter_data1` and `twitter_data2` are the corresponding data values. Free text.
-   **Output:**
    ```html
    <!-- Twitter Product Card -->
    <meta name="twitter:label1" content="Price">
    <meta name="twitter:data1" content="$149.99">
    <meta name="twitter:label2" content="Availability">
    <meta name="twitter:data2" content="In Stock">
    ```

