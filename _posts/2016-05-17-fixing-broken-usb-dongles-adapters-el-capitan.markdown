---
layout: article
title:  "Fixing broken USB dongles/adapters (El Capitan)"
date:   2016-05-17 12:01:00
---

After migration to new system _10.11_, in my console (log history) I had:

    WirelessUtility[1977:13014] [Line 198] OidQueryInformation ==> NoDriver

Similar situation to: [Dongles not working in OS X (El Capitan)?](https://discussions.apple.com/thread/7254856?tstart=0) or [Broken Wireless Adapters](http://www.insanelymac.com/forum/topic/299948-usb-wifi-updated-ralinkmediatek-rt2870-rt2770-rt3x7x-rt537x-rt5572/page-9).

> All because _El Captain_ brings new and better security methods which are causing this problem. By typing `kextstat -sort | grep -v 'com.apple'` you can check all _non-apple/external_ active & supported kernel components.

## Procedure

There is possibility to disable [System Integrity Protection](https://en.wikipedia.org/wiki/System_Integrity_Protection) by typing `csrutil disable`, but it seems dangerous. Below, I propose less intrusive method.

1. Disable the _kext_ signing security setting:

       $ sudo nvram boot-args="kext-dev-mode=1"

2. _Install drivers/utilities for your dongle/adapter..._

    > In my case, I was installing drivers for my [ASUS USB-AC51](https://www.asus.com/us/Networking/USBAC51/) Wi-Fi adapter.

3. Re-enable it again:

       $ sudo nvram -d boot-args

Reboot your computer and check if it works. In my case, after `networksetup -listallhardwareports` I had seen my new interface ;-)
