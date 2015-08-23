---
layout: post
title:  "Finding files, right way using command-line utility..."
date:   2015-08-22 15:20:50
---

_Have you ever saved, moved, or copied a file, script, document, then been unable to find it?_

Maybe you saved it in a different directory, with an unusual name <br> or <u><FONT COLOR="#FF0000">m</FONT><FONT COLOR="#FF4300">a</FONT><FONT COLOR="#FF8600">g</FONT><FONT COLOR="#FFC900">i</FONT><FONT COLOR="#FFff00">c</FONT><FONT COLOR="#BCff00"> </FONT><FONT COLOR="#79ff00">u</FONT><FONT COLOR="#36ff00">n</FONT><FONT COLOR="#00ff00">i</FONT><FONT COLOR="#00ff43">c</FONT><FONT COLOR="#00ff86">o</FONT><FONT COLOR="#00ffC9">r</FONT><FONT COLOR="#00ffff">n</FONT><FONT COLOR="#00C9ff">s</FONT><FONT COLOR="#0086ff"> </FONT><FONT COLOR="#0043ff">s</FONT><FONT COLOR="#0000ff">t</FONT><FONT COLOR="#3600ff">o</FONT><FONT COLOR="#7900ff">l</FONT><FONT COLOR="#BC00ff">e</FONT><FONT COLOR="#FF00ff"> </FONT><FONT COLOR="#FF00C9">i</FONT><FONT COLOR="#FF0086">t</FONT></u>, it’s definitely time to learn [find utility](http://ss64.com/bash/find.html)...

## Command

The __find__ utility recursively descends the directory tree for each path listed, evaluating an expression (composed of the “primaries” and “operands”) in terms of each file in the tree.

![Old files ;-)](http://www.explainxkcd.com/wiki/images/d/d5/old_files.png)

Search a folder hierarchy for filename(s) that meet a desired criteria: name, size, file, type...

    usage: find [-H | -L | -P] [-EXdsx] [-f path] path ... [expression]
           find [-H | -L | -P] [-EXdsx] -f path [path ...] [expression]

## Basics

To find all files on a computer named “mysecretfile.py”, just type:

> It’s possible that you will see _Permission denied_, you should then call this command as root...

    find / -name 'mysecretfile.py'

Command below will show all files in your home directory modified or created today, by default, find counts days from midnight, so an age of 0 means today, -1 means yestarday, -30 means month ago, etc.

    find ~ -type f -mtime 0

You may have used the _-iname_ option with find before, but it can do lots more. These options can be combined, so if that elusive download was an python file, you could narrow the search with:

    find ~ -type f -mtime 0 -iname '*.py'

To find files and directories that are not owned by you, use:

    find ~ ! -user ${USER}

## More

For more information just type in your console _man find_, or visit [this](http://www.tldp.org/LDP/abs/html/moreadv.html) page.


