// src/js/services/csv-generator.js

/**
 * @fileoverview This module provides functionality to generate and download the CSV meta tag template.
 * It creates a Blob from the CSV content and triggers a file download.
 *
 * The CSV content is hardcoded here to ensure the latest template is always available.
 * If the template structure or content changes, this file should be updated accordingly.
 */

/**
 * Generates and downloads the meta tag CSV template.
 * The filename will be 'meta-tag-template.csv'.
 */
export function downloadCsvTemplate() {
  const csvContent = `Section,Field,YourInput,SampleInput,ValidationRules,Description
*📋 INSTRUCTIONS: 
*Only fill the 'YourInput' column for tags you want generated.
*Empty or invalid inputs will NOT generate meta tags. 
*Delete any rows below that you don't need.
*Do not edit this template. It is formatted to generate professional meta tags for your website. 


"📄 FILE NAME","set_name","","Page 1","Short File Name","No Special Characters"

"⚙️ TECHNICAL","gl_charset","","utf-8","Valid charset","Character encoding (leave as utf-8)"
"🌐 BASIC INFO","gl_title","","Example | Home Page","60 characters max recommended","The main title shown in browser tabs and search results"
"🌐 BASIC INFO","gl_description","","A sample description of example website.","160 characters max recommended","Brief description shown in search results - make it compelling!"
"🌐 BASIC INFO","gl_keywords","","example, sample","Comma-separated, 10 max","Related keywords (less important for modern SEO)"
"🌐 BASIC INFO","gl_author","","Example Web Team","Text only","Your name or organization"
"⚙️ TECHNICAL","gl_referrer","","strict-origin-when-cross-origin","no-referrer, origin, strict-origin-when-cross-origin","Referrer policy (default is fine for most)"
"⚙️ TECHNICAL","gl_generator","","MyMetaGen v1.0","Text (optional)","Tool used to generate your site"
"⚙️ TECHNICAL","gl_format_detection","","telephone=no","Options: telephone=no, date=no, email=no, address=no","Stop the browser from turning numbers into clickable links"
"🎨 APPEARANCE","gl_theme_color","","#3b5998","Hex color (e.g., #ffffff)","Browser color on mobile devices"
"🎨 APPEARANCE","gl_color_scheme","","dark light","normal, dark, light, or 'dark light'","Preferred color scheme for your site"
"📱 MOBILE","gl_viewport","","width=device-width, initial-scale=1, shrink-to-fit=no","Valid viewport string","How page scales on mobile (leave default unless you know what you're doing)"

"🤖 SEARCH ENGINES","gl_robots","","index, follow, max-image-preview:large, max-snippet:-1","Comma-separated directives","Allow Google/Bing to show this page in results and control crawling behavior."

"🔗 PAGE LINKS","res_canonical","","https://example.com/sample-page","Full URL required","The main URL for this content (prevents duplicate issues)"
"🔗 PAGE LINKS","res_shortlink","","https://ex.co/xyz","Full URL (optional)","Shortened URL for easy sharing"
"🔗 PAGE LINKS","res_manifest","","/manifest.json","Path or URL","Link to web app manifest file"

"⚡ PERFORMANCE","res_preconnect","","https://fonts.googleapis.com","Valid URL","External domain to connect to speed up loading by connecting early"
"⚡ PERFORMANCE","res_preconnect_crossorigin","","https://fonts.googleapis.com","Valid URL","External domain with cross-origin setting"
"⚡ PERFORMANCE","res_dnsPrefetch","","https://fonts.gstatic.com","Valid URL","Speed up loading by connecting early to external sites"
*Add more by copying the required row

"🌍 LANGUAGES","alternate_1_lang","","en","Language code (e.g., en, es, fr)","Alternate language versions of this page"
"🌍 LANGUAGES","alternate_1_url","","https://example.com/sample-page","Full URL","Link to alternative language"
"🌍 LANGUAGES","alternate_2_lang","","es","Language code","Add more by copying these 2 rows and incrementing numbers"
"🌍 LANGUAGES","alternate_2_url","","https://example.com/es/sample-page","Full URL","Link to alternative language"
"🌍 LANGUAGES","alternate_3_lang","","x-default","Use 'x-default' for default version","The fallback version for unspecified languages"
"🌍 LANGUAGES","alternate_3_url","","https://example.com/sample-page","Full URL","Link to fallback language"
*Add more by copying the required rows

"📱 SOCIAL MEDIA","og_siteName","","Meta Tag Generator","Your site/brand name","Your website or brand name"
"📱 SOCIAL MEDIA","og_type","","article","website, article, product, book, profile, video.movie, music.song","Type of content (use 'website' for most pages)"
"📱 SOCIAL MEDIA","og_title","","Example | Home Page","60 characters max recommended","The main title shown in browser tabs and search results"
"📱 SOCIAL MEDIA","og_description","","A comprehensive test output for meta tag generation","60 characters max recommended","Description for social media (optional)"
"📱 SOCIAL MEDIA","og_url","","https://example.com/sample-page","Full URL","URL for social sharing (usually same as canonical)"
"📱 SOCIAL MEDIA","og_locale","","en_US","Language code format: en_US","Primary language and region"
"📱 SOCIAL MEDIA","og_localeAlternates","","es_ES","Language code format: en_US","Other available languages"
*Copy above line to add more languages

"🖼️ SOCIAL - IMAGES","og_image_url","","https://example.com/uploads/og-landscape.jpg","Full URL to image (.jpg, .jpeg, .png, .gif, .webp)","Primary social media share image (1200x630px recommended)"
"🖼️ SOCIAL - IMAGES","og_image_width","","1200","Number (pixels)","Image width in pixels"
"🖼️ SOCIAL - IMAGES","og_image_height","","630","Number (pixels)","Image height in pixels"
"🖼️ SOCIAL - IMAGES","og_image_alt","","A landscape view of the dashboard","Descriptive text","Description of image for accessibility"
"🖼️ SOCIAL - IMAGES","og_image_type","","image/jpeg","image/jpeg, image/png, image/gif, image/webp","Image file type"
*Add another image by copying the above block

"📱 SOCIAL MEDIA","fb_facebookAppId","","1234567890","Numeric ID (optional)","Your Facebook App ID for insights"
"🐦 TWITTER CARD","twt_card","","summary_large_image","summary, summary_large_image, app, player","Card display type (large image is most popular)"
"🐦 TWITTER CARD","twt_site","","@MetaGenApp","@username","Your website's Twitter handle"
"🐦 TWITTER CARD","twt_creator","","@SeniorDev","@username","Content creator's Twitter handle"
"🐦 TWITTER CARD","twt_title","","Example | Home Page","70 characters max","Override title for Twitter (rarely needed)"
"🐦 TWITTER CARD","twt_description","","A sample description of example website.","200 characters max","Override description for Twitter (rarely needed)"
"🐦 TWITTER CARD","twt_image","","https://example.com/uploads/og-landscape.jpg","Full URL (.jpg, .jpeg, .png, .gif, .webp)","Override image for Twitter (rarely needed)"
"🐦 TWITTER CARD","twt_imageAlt","","Dashboard view","Descriptive text","Image description for accessibility"

*If SOCIAL MEDIA (og_type) is set to "article" then add the following tags:
"📄 ARTICLES ONLY","art_publishedTime","","2023-10-27T14:00:00+00:00","ISO date format (YYYY-MM-DDTHH:MM:SS+00:00)","When article was first published (only if og_type is 'article')"
"📄 ARTICLES ONLY","art_modifiedTime","","2023-10-28T09:30:00+00:00","ISO date format","When article was last updated"
"📄 ARTICLES ONLY","art_authorUrl","","https://www.facebook.com/seniordev","Facebook profile URL","Author's Facebook profile"
"📄 ARTICLES ONLY","art_tags","","Sample Topic","One tag for each meta tag","Article topics/categories"
*Copy the above line for additional tags

*If :SOCIAL MEDIA (og_type) is set to "product" then add the following tags:
"🛒 ECOMMERCE","ec_priceAmount","","19.99","number, required, min: 0","The price of the product."
"🛒 ECOMMERCE","ec_priceCurrency","","USD","Must be a 3-letter currency code (e.g., USD).","The currency of the price (e.g., USD, EUR)."
"🛒 ECOMMERCE","ec_availability","","in stock","select from: in stock, out of stock, preorder, available for order, discontinued","The availability of the product."
"🛒 ECOMMERCE","ec_brand","","Acme Inc.","Text","The brand of the product."
"🛒 ECOMMERCE","ec_condition","","new","select from: new, used, refurbished","The condition of the product."
"🛒 ECOMMERCE","ec_retailerItemId","","SKU12345","Text","Unique identifier for the product from the retailer."
"🛒 ECOMMERCE","ec_itemGroupId","","GROUP-789","Text","The item group ID for the product."
"🛒 ECOMMERCE","ec_category","","Electronics > Audio > Headphones","Text","The product category."
"🛒 ECOMMERCE","ec_product_id","","A123B456","Text","Unique identifier for the product, often SKU or GTIN"
"🛒 ECOMMERCE","ec_gtin","","0123456789012","Text (UPC/EAN/ISBN)","Global Trade Item Number (e.g., UPC, EAN, ISBN)"
"🛒 ECOMMERCE","ec_mpn","","XYZ789","Text","Manufacturer Part Number"
"🛒 ECOMMERCE","ec_rating_value","","4.5","number (0.0-5.0)","Average rating of the product"
"🛒 ECOMMERCE","ec_review_count","","123","number","Total number of reviews for the product"
"🛒 ECOMMERCE","twitter_label1","","Price","Text","Label for a product attribute on a Twitter card."
"🛒 ECOMMERCE","twitter_data1","","$149.99","Text","Data for a product attribute on a Twitter card."
"🛒 ECOMMERCE","twitter_label2","","Availability","Text","Label for a second product attribute on a Twitter card."
"🛒 ECOMMERCE","twitter_data2","","In Stock","Text","Data for a second product attribute on a Twitter card."

"✅ VERIFICATION","ver_google","","VerificationString123","Verification code from Google","Google Search Console verification code"
"✅ VERIFICATION","ver_yandex","","VerificationString456","Verification code from Yandex","Yandex Webmaster verification code"
"✅ VERIFICATION","ver_bing","","VerificationString789","Verification code from Bing","Bing Webmaster verification code"

"⚙️ ADVANCED - HTTP","httpEquiv_csp","","default-src 'self'; img-src https://example.com/landscape.jpg; child-src 'none';","Syntax can be very strict (e.g., default-src 'self'; script-src 'self' https://apis.google.com).","A security layer that helps to detect and mitigate certain types of attacks, including Cross-Site Scripting (XSS) and data injection attacks."
"⚙️ ADVANCED - HTTP","httpEquiv_uaCompatible","","IE=edge","IE=edge, IE=EmulateIE7, IE=EmulateIE8","Legacy directive to specify the document mode for Internet Explorer."
"⚙️ ADVANCED - HTTP","httpEquiv_refresh","","30;url=https://example.com","Enter seconds (e.g., '30') or seconds and a URL (e.g., '30; url=https://example.com/').","Reloads the page or redirects to a new URL after a specified number of seconds."
"⚙️ ADVANCED - SCHEMA","itemprop_name","","Sample Website","Name","Schema.org structured data (advanced)"
"⚙️ ADVANCED - SCHEMA","itemprop_description","","Testing a website.","Description","Schema.org structured data"
"⚙️ ADVANCED - SCHEMA","itemprop_image","","https://example.com/uploads/sample-image.jpg","Image link","Schema.org structured data"`;

  // Create a Blob with the CSV content and specify the MIME type
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  // Create a temporary URL for the Blob
  const url = URL.createObjectURL(blob);

  // Create a temporary anchor element for downloading
  const a = document.createElement('a');
  a.href = url;
  a.download = 'meta-tag-template.csv'; // Set the desired filename

  // Append the anchor to the body (it doesn't need to be visible)
  document.body.appendChild(a);

  // Programmatically click the anchor to trigger the download
  a.click();

  // Clean up by revoking the object URL and removing the anchor element
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  console.log('CSV template download initiated.');
}