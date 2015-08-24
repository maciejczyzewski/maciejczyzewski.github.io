---
layout: post
title:  "History built-in, often forgotten command"
date:   2015-08-24 13:00:22
---

All modern shells have some mechanism of working with the history of commands.

It is operated on history file and memory buffer with recent commands. History file is stored in a regular flat file. (generally .bash\_history, .sh\_history or .zsh\_history)

To check which file are you using now, simply write in your terminal prompt:

    $ echo $HISTFILE

To find all such files type the command below:

    $ ls -f ~ | grep "_history"

## Controls

Control of the behavior of the command history is provided jointly by bash and the readline library. In addition to classic variable _$HISTFILE_ bash provides four other variables that control what information is written to history: _$HISTTIMEFORMAT_, _$HISTSIZE_, _$HISTCONTROL_ and _$HISTIGNORE_.

## Basics

To see which commands you type most often and convert some of them into aliases you can use:

    $ cut -f2 -d";" $HISTFILE | sort | uniq -c | sort -nr | head -10

> Yeah, for me the most popular are _ls_ and _cd_!

Entering the _history_ command without any switches displays the full history list with line numbers:

    $ history

This list can be of course searched with _grep_:

    $ history | grep "cd"

You can cut the search to the the last 100 commands entered:

    $ history 100

_That’s all you should know! Happy hacking..._
