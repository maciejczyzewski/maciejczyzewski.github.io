---
layout: article
title:  "Better debug notices in C, using macros"
date:   2015-02-21 16:03:22
---

In almost every programming language handling errors is a difficult activity, but very important.

Last day, I was exploring some small projects on __Github__. Most didn’t have any notifications, the rest had some creative solutions. Their problem was that they were unreadable.

So below I present my simple solution, using macros.

## Implementation

{% highlight c++ %}
#include <stdlib.h>

/* Debugger */

#define note(S, ...) fprintf(stderr,                                     \
  "\x1b[1m(%s:%d, %s)\x1b[0m\n  \x1b[1m\x1b[90mnote:\x1b[0m " S "\n",    \
  __FILE__, __LINE__, __FUNCTION__, ##__VA_ARGS__)

#define warn(S, ...) fprintf(stderr,                                     \
  "\x1b[1m(%s:%d, %s)\x1b[0m\n  \x1b[1m\x1b[33mwarning:\x1b[0m " S "\n", \
  __FILE__, __LINE__, __FUNCTION__, ##__VA_ARGS__)

#define errn(S, ...) do { fprintf(stderr,                                \
  "\x1b[1m(%s:%d, %s)\x1b[0m\n  \x1b[1m\x1b[31merror:\x1b[0m " S "\n",   \
  __FILE__, __LINE__, __FUNCTION__, ##__VA_ARGS__); exit(1); } while (0) \
{% endhighlight %}

## Testing

{% highlight ruby %}
#include <stdio.h>
#include "utils.h" // debugger macros

int main(int argc, char const *argv[])
{
  note("this will be a hard error in the future");
  warn("function '%s' redefined as non-inline", "my_function");
  errn("no such file or directory");

  return 0;
}
{% endhighlight %}

## Results

![Testing](https://lh3.googleusercontent.com/vdmeGth8VMAx0r8T-s-4F5N6dNi_ohig_1bxgE5Nx2s7PyfdiKxKBPyzi8PVUPNX6kdTJzf-QAGah8KZdvhwkuVt4KaBM6LaBxic_TesF4eclOIivt59hcU62uumpk6nmFqTy6OkL1GqZgXqp6FEokVgS2JjcEI6YeQvF5nEEghRpc7fEbzPQ6w02nGqw34ftnc-26PHFhsyudiIs6EMHw44RRrEYwvogPv4Ltlt3CnijptgVuBYvqHH4pRFn4cauIn0EvBz1NR0ZjJIDdzu50Z3dSi-K9J2b94QMfwEQuEWuFp1wXyAJAEZZEkoA6OIXwokKbE0ghDtrmGkDg3gpmUo8OUVTf0D302eJy1Zo8Wqb6UvN5nHvcnKDKpbmGDiB1voJXuu0Kz0SdgdUpFLJ6D0V4pR7xjINqRs7Prt2YG0ldy4_gia-BC0x7z5NCfqMkTmBdhwYkVegTOEa1yLjIvCrGNnH9m8eonzVUYt_iNVF3N8rfoSA_b66Tn3p1RegPnTKIuMJNKS7hiDJDUVFiDPGcMig7nD99WIUqJJ6bRzXgdNPCaa6oZJhEbFTmZ5yVGNbHsKEjMsa776Ft54AuwJWahrr18=w1504-h786-no)

> Please... Start doing it legibly, do nice notices! They have to facilitate the work. That’s why they are.

## Thanks

__Bill Lynch__ - Improved code, found a bug.
