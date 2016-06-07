---
layout: article
title:  "Fixing sudo on OS X, tricky method"
date:   2015-08-23 18:42:22
---

![Sudo](https://imgs.xkcd.com/comics/sandwich.png)

If your _sudo_ does not work anymore and displays something like:

    sudo: can't open /private/etc/sudoers: Permission denied
    sudo: no valid sudoers sources found, quitting

_Looks matter seriously, do not worry..._

## Solution

First, you need to be logged in as an administrator, open a console and enable root if not done yet.

    $ dsenableroot

> You’ll have to type your user and password, and set root a new password (can be the same).

Now, you can log in as root...

    $ su

Last step is fixing the root "/" directory permissions:

    $ chmod go+rx-w /

Yeah, it’s good time to repair your sudoers file using _visudo_...
