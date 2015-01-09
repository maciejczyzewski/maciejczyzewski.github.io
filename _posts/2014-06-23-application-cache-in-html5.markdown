---
layout: post
title:  "Application cache in HTML5"
date:   2014-06-23 21:16:00
---

Often there is no time to retrieve packages again. It’s becoming increasingly important for web-based applications to be accessible offline.

> The cache manifest in HTML5 is a software storage feature which provides the ability to access a web application even without a network connection.

Advantages:

* __Offline browsing__ - users can navigate your full site when they’re offline
* __Speed__ - resources come straight from disk, no trip to the network
* __Resilience__ - if your site goes down for "maintenance", your users will get the offline experience

Disadvantages:

* __Outdated__ - packages don’t resent automatically

### Referencing

To enable the application cache for an app, include the manifest attribute on the document’s `html` tag:

```html
<html manifest="example.appcache">
    ...
</html>
```

A manifest file must be served with the mime-type `text/cache-manifest`. You may need to add a custom file type to your web server or `.htaccess` configuration.

For example, to serve this mime-type in Apache, add this line to your config file:

    AddType text/cache-manifest .appcache


### Structure

The manifest is a separate file you link to via the manifest attribute on the html element. A simple manifest looks something like this:

    CACHE MANIFEST
    # 2014-01-01:v5

    # Explicitly cached
    CACHE:
    favicon.ico
    index.html
    styles/main.css
    scripts/main.js
    images/logo.png

    # Resources that require the user to be online
    NETWORK:
    *

### Status

The `window.applicationCache` object is your programmatic access the browser’s app cache. Its status property is useful for checking the current state of the cache:

```javascript
var appCache = window.applicationCache;

// appCache.status

// UNCACHED     == 0
// IDLE         == 1
// CHECKING     == 2
// DOWNLOADING  == 3
// UPDATEREADY  == 4
// OBSOLETE     == 5
```
