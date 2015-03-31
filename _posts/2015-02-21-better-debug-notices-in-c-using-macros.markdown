---
layout: post
title:  "Better debug notices in C, using macros"
date:   2015-02-21 16:03:22
---

In almost every programming language handling errors is a difficult activity, but very important.

Last day, I was exploring some small projects on __Github__. Most didn’t have any notifications, the rest had some creative solutions. Their problem was that they were unreadable.

So below I present my simple solution, using macros.

## Implementation

```C
#include <stdlib.h>

/* Debugger */

#define note(S, ...) fprintf(stderr,                                     \
  "\x1b[1m(%s:%d, %s)\x1b[0m\n  \x1b[1m\x1b[90mnote:\x1b[0m " S "\n",    \
  __FILE__, __LINE__, __FUNCTION__, ##__VA_ARGS__)

#define warn(S, ...) fprintf(stderr,                                     \
  "\x1b[1m(%s:%d, %s)\x1b[0m\n  \x1b[1m\x1b[33mwarning:\x1b[0m " S "\n", \
  __FILE__, __LINE__, __FUNCTION__, ##__VA_ARGS__)

#define errn(S, ...) fprintf(stderr,                                     \
  "\x1b[1m(%s:%d, %s)\x1b[0m\n  \x1b[1m\x1b[31merror:\x1b[0m " S "\n",   \
  __FILE__, __LINE__, __FUNCTION__, ##__VA_ARGS__); exit(1);
```

## Testing

```C
#include <stdio.h>
#include "utils.h" // debugger macros

int main(int argc, char const *argv[])
{
  note("this will be a hard error in the future");
  warn("function '%s' redefined as non-inline ", "my_function");
  errn("no such file or directory");

  return 0;
}
```

## Results

![Testing](/assets/images/prints/Screenshot 2015-03-31 00.10.31.png)

> Please... Start doing it legibly, do nice notices! They have to facilitate the work. That’s why they are.

<br><br>