---
layout: article
title:  "Application cache in HTML5"
date:   2014-06-23 21:16:00
---

Often there is no time to retrieve packages again. It’s becoming increasingly important for web-based applications to be accessible offline.


![Diagram](https://lh3.googleusercontent.com/gr3ro0txc2HTy0k0jPWRs2_36FI6ritRWwhlhDGMohw-7HIUMpNCopwKxA_2bly7P3vvIp1Rd5N29GVztmy8Y6KB8N8Gah3iNyqNPTKko0NwzLfnL1JOmxrcrjBZgk8SuawcfPEEE3u1RXAZS5ZSociuOq75K1-K5NtC6yrVQOpgm-03J1bgLWsac4D9IUnOTVv4Dp4v5jtFSC2qIVU9qCDKI6wP1fZyuNBXOu6M8034otqITbwLWSGfZk_KHV1W6KasnbJLm9RQa1L3Id993eMv8b4u6csSWMiQYXhYR58nx-LU5HGdXBR80Vla1QLcHg1ZUpYyxWv0Xg9uNkNsv0ljyp_QjdV3QgzDLvZtJ_7UFwb15NZzoE2lmR1iuKho77qf0yyh7CSgyApJhDxqPsMBa4wR8Vz3ciHzVxWKDs1GkgmJRKaZnSS1V_kM5LSiAhsQFHILhcIf9Q2cWUtk3O6cigzVV9kv18zmSyX339VtkgFD_-nQ3mZJWmTpp-bxZr4xT3aUuong3IsmC_3YO1MEdtdhTvzUwBwnAvNl75kaBeYBmNasdw1G5Y5sNWDSWDVR-BZfiuf0VHG7iFq9XyP_XrjObfs=w1155-h545-no)

> The cache manifest in HTML5 is a software storage feature which provides the ability to access a web application even without a network connection.

Advantages:

* __Offline browsing__ - users can navigate your full site when they’re offline
* __Speed__ - resources come straight from disk, no trip to the network
* __Resilience__ - if your site goes down for "standard", your users will get the offline experience

Disadvantages:

* __Outdated__ - packages don’t resent automatically
* __Storage limit__ - between 5 MB to 10 MB

## Referencing

To enable the application cache for an app, include the manifest attribute on the document’s `html` tag:

{% highlight html %}
<html manifest="example.appcache">
    ...
</html>
{% endhighlight %}

A manifest file must be served with the mime-type `text/cache-manifest`. You may need to add a custom file type to your web server or `.htaccess` configuration.

For example, to serve this mime-type in Apache, add this line to your config file:

    AddType text/cache-manifest .appcache

## Structure

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

## Status

The `window.applicationCache` object is your programmatic access the browser’s app cache. It’s status property is useful for checking the current state of the cache:

{% highlight javascript %}
var appCache = window.applicationCache;

// appCache.status

// UNCACHED     == 0
// IDLE         == 1
// CHECKING     == 2
// DOWNLOADING  == 3
// UPDATEREADY  == 4
// OBSOLETE     == 5
{% endhighlight %}

## Jekyll

If you are using [jekyll](http://jekyllrb.com/), you can do this things easily:

	---
	---
	CACHE MANIFEST
	# {% raw  %}{{ site.time | date_to_xmlschema }}{% endraw %}
	# here, list of your files...
