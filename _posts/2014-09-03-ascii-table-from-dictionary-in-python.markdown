---
layout: post
title:  "ASCII table from dictionary in Python"
date:   2014-09-03 17:14:00
---

Sometimes I wish to print pretty table of dictionary as an ASCII, like this:

               | Github project | Number of stars | Number of watchers |
               +----------------+-----------------+--------------------+
               | hyhyhy         |             195 |                 12 |
               | bottomline     |              17 |                  3 |
               | retter         |               2 |                  2 |
               | hashbase       |               1 |                  1 |


Surprisingly it got complicated because of variable lengths of the data.
I _googled_ for 'standard' ways of doing this and I found suggestions like:

[http://stackoverflow.com/questions/5909873/python-pretty-printing-ascii-tables][stackoverflow]

Which were a bit dated and hard to read or full scale modules like:

- [texttable](http://pypi.python.org/pypi/texttable/) by Gerome Fournier
- [text_table](http://pypi.python.org/pypi/text_table/) by Swaroop C. H.
- [asciitable](http://pypi.python.org/pypi/asciitable/) by Tom Aldcroft

Which were an overkill. So I decided to write my own function and am quite
pleased with what I got!

Here is a simple function that generate table, where each row runs the `leftright()` function:

{% highlight python %}
def table(data, headers):
    """
    Generate ASCII table
    data: list of dicts,
    headers: e.g. [('name', 'Github project'), ('stars', 'Number of stars')]
    template:
        asc_p[0]          %s         asc_s          %s         asc_p[1]
        asc_h[0] (a) * max_widths[0] asc_t (a) * max_widths[1] asc_h[1]
        asc_p[0]          %s         asc_s          %s         asc_p[1]
        asc_p[0]          %s         asc_s          %s         asc_p[1]
        asc_p[0]          %s         asc_s          %s         asc_p[1]
        asc_p[0]          %s         asc_s          %s         asc_p[1]
    table e.g.:
           | Github project            | Files                    |
           +---------------------------+--------------------------+
           | long_repo_but_empty_hyhyh | 234234342354345645645612 |
           | bottomline                |                       56 |
           | retter                    |                        5 |
           | hashbase                  |                       73 |
    """

    # Processing
    max_widths, data_copy, final = {}, [dict(headers)] + list(data), ''

    a, asc_s, asc_t, asc_p, asc_h = '-', ' | ', '-+-', '| %s |\n', '+-%s-+\n'

    # Analyse
    for col in data_copy[0].keys():
        max_widths[col] = max([len(str(row[col])) for row in data_copy])
    cols_order = [tup[0] for tup in headers]

    # Filter
    def leftright(col, value):
        if type(value) == int:
            return str(value).rjust(max_widths[col])
        else:
            return value.ljust(max_widths[col])

    # Final
    for row in data_copy:
        row_str = asc_s.join([leftright(col, row[col]) for col in cols_order])
        final = final + asc_p % row_str
        if data_copy.index(row) == 0:
            line = asc_t.join([a * max_widths[col] for col in cols_order])
            final = final + asc_h % line

    # Remove last '\n'
    return final[:-1]
{% endhighlight %}

Now it’s time to play code.

{% highlight python %}
data = [
    {'name': 'hyhyhy',     'stars': 195, 'watchers': 12},
    {'name': 'bottomline', 'stars': 17,  'watchers': 3},
    {'name': 'retter',     'stars': 2,   'watchers': 2},
    {'name': 'hashbase',   'stars': 1,   'watchers': 1}
]

headers = [
    ('name',     'Github project'),
    ('stars',    'Number of stars'),
    ('watchers', 'Number of watchers')
]

print table(data, headers)
{% endhighlight %}

Remember! Wikipedia is lying... My table is better.

> A table is a form of furniture with a flat horizontal upper surface used to support objects of interest, for storage, show, and/or manipulation.

[stackoverflow]: http://stackoverflow.com/questions/5909873/python-pretty-printing-ascii-tables
