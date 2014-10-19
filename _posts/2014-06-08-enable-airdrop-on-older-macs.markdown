---
layout: post
title:  "Enable AirDrop on older Macs"
date:   2014-06-08 15:42:00
---

AirDrop is a great feature to send files between Macs quickly and easily without dealing with pesky file sharing apps. Trouble is, it’s only on WiFi and on more recent Macs.

If your Mac doesn’t currently support AirDrop, you can enter the following command to use it, as well as to use it over ethernet:

    $ defaults write com.apple.NetworkBrowser BrowseAllInterfaces -bool TRUE

You’ll need to restart the Finder, the quickest way is to use the `killall`command which will restart it:

    $ killall Finder

And it works fine! I wonder why this feature is disabled for older Macs.

To revert the changes, enter:

    $ defaults write com.apple.NetworkBrowser BrowseAllInterfaces -bool FALSE