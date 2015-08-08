---
layout: post
title:  "Find and download music from legal sources, hackers way"
date:   2015-08-07 15:20:50

label:  green
---

> Below is an article describing my tool - named __redhands__. You can go to the [source code](https://github.com/maciejczyzewski/redhands) and find all the missing information. (or contribute)

<div style="float: right">
<a class="github-button" href="https://github.com/maciejczyzewski/redhands" data-icon="octicon-star" data-style="mega" data-count-href="/maciejczyzewski/redhands/stargazers" data-count-api="/repos/maciejczyzewski/redhands#stargazers_count" data-count-aria-label="# stargazers on GitHub" aria-label="Star maciejczyzewski/redhands on GitHub">Star</a>
<a class="github-button" href="https://github.com/maciejczyzewski/redhands/issues" data-icon="octicon-issue-opened" data-style="mega" data-count-api="/repos/maciejczyzewski/redhands#open_issues_count" data-count-aria-label="# issues on GitHub" aria-label="Issue maciejczyzewski/redhands on GitHub">Issue</a>
<a class="github-button" href="https://github.com/maciejczyzewski/redhands/archive/master.zip" data-icon="octicon-cloud-download" data-style="mega" aria-label="Download maciejczyzewski/redhands on GitHub">Download</a>
<script async defer id="github-bjs" src="https://buttons.github.io/buttons.js"></script>
</div>

Have you ever dreamed about a tool that finds given song in the Internet and download it?

I’ll show how to make a tool that automatically searches different sources and finds the soundtrack.

But often their quality is poor and it is difficult to find all album songs because of the small number of views. Our mission is to find, devise, improve, clean, tag, noise-cancel, and download. 

<u>Below I will show you how to do that using python and few libraries.</u>

## Preparation

At the beginning we should upgrade our system tools.

```bash
$ brew install libtool --universal
$ brew link libtool
```

I choose [youtube-dl](https://github.com/rg3/youtube-dl) for downloading videos and [ffmpeg](https://github.com/FFmpeg/FFmpeg), [lame](http://lame.sourceforge.net) as audio liblaries. To install them we can simply run homebrew.  

```bash
$ brew install ffmpeg --with-faac
$ brew install youtube-dl lame
```

## API-s

To be able to create [ID3 tag](https://en.wikipedia.org/wiki/ID3), find, and download the appropriate audio, we need good information sources.

### iTunes

Apple offers [iTunes Search API](https://www.apple.com/itunes/affiliates/resources/documentation/itunes-store-web-service-search-api.html), which is excellent for our purposes. We can extract with this information and fill in all ID3 tags.

Implementing request is relatively simple, example in _python_ below.

```python
def api_itunes(keyword):
  url = 'https://itunes.apple.com/search?term={0}'
  page = urllib.urlopen(url.format(urllib.quote_plus(keyword)))
  return json.loads(page.read())
```

For example for keyword “siena root far from the sun almost there”, result will be:

```bash
{u'resultCount': 1,
 u'results': [{
   u'artistId': 283782827,
   u'artistName': u'Siena Root',
   u'artistViewUrl': u'https://itunes.apple.com/us/artist/siena-root/id283782827?uo=4',
   u'artworkUrl100': u'http://is5.mzstatic.com/image/pf/us/r30/Music2/v4/5a/fe/eb/5afeeba1-348a-5cf9-37e3-637b3b05fcf8/cover.100x100-75.jpg',
   u'artworkUrl30': u'http://is5.mzstatic.com/image/pf/us/r30/Music2/v4/5a/fe/eb/5afeeba1-348a-5cf9-37e3-637b3b05fcf8/cover.30x30-50.jpg',
   u'artworkUrl60': u'http://is4.mzstatic.com/image/pf/us/r30/Music2/v4/5a/fe/eb/5afeeba1-348a-5cf9-37e3-637b3b05fcf8/cover.60x60-50.jpg',
   u'collectionCensoredName': u'Far from the Sun',
   u'collectionExplicitness': u'notExplicit',
   u'collectionId': 995187403,
   u'collectionName': u'Far from the Sun',
   u'collectionPrice': 8.99,
   u'collectionViewUrl': u'https://itunes.apple.com/us/album/almost-there/id995187403?i=995187593&uo=4',
   u'country': u'USA',
   u'currency': u'USD',
   u'discCount': 1,
   u'discNumber': 1,
   u'isStreamable': True,
   u'kind': u'song',
   u'previewUrl': u'http://a194.phobos.apple.com/us/r1000/142/Music1/v4/c0/85/18/c08518ae-9858-a00b-206b-c53df93cba0e/mzaf_6638269841197646676.plus.aac.p.m4a',
   u'primaryGenreName': u'Roots Rock',
   u'radioStationUrl': u'https://itunes.apple.com/station/idra.995187593',
   u'releaseDate': u'2015-05-22T07:00:00Z',
   u'trackCensoredName': u'Almost There',
   u'trackCount': 9,
   u'trackExplicitness': u'notExplicit',
   u'trackId': 995187593,
   u'trackName': u'Almost There',
   u'trackNumber': 4,
   u'trackPrice': 0.99,
   u'trackTimeMillis': 467856,
   u'trackViewUrl': u'https://itunes.apple.com/us/album/almost-there/id995187403?i=995187593&uo=4',
   u'wrapperType': u'track'
 }]
}
```

### Google

For matching videos with a suitable music, we will be using [YouTube Data API](https://developers.google.com/youtube/v3/docs/search/list) for searching, <u>without API_KEY variable</u>. It sounds crazy? We’ll perform a dirty trick.

I noticed in the Google Developers console to test the request.
It uses internal key that you can use when you redirect query on google’s page assigned to the client.

```python
def api_google(keyword):
  page = """curl -s \
            'https://content.googleapis.com/youtube/v3/search?{}' \
            -H 'x-origin: https://developers.google.com' --compressed"""
  params = {
    'part': 'snippet',
    'q': urllib.quote_plus(keyword),
    'videoLicense': 'any',
    'safeSearch': 'none',
    'type': 'video',
    'key': 'AIzaSyCFj15TpkchL4OUhLD1Q2zgxQnMb7v3XaM'
  }
  return json.loads(
      subprocess.Popen(
          page.format(urllib.urlencode(params)),
          stdout=subprocess.PIPE, shell=True).communicate()[0])
```

For example for keyword “siena root wishing for more”, result will be:

```bash
{u'etag': u'"iDqJ1j7zKs4x3o3ZsFlBOwgWAHU/gbka0GZ_qChDgm96DQKmcCuDqsM"',
 u'items': [
   {
     u'etag': u'"iDqJ1j7zKs4x3o3ZsFlBOwgWAHU/nNgzYaVzs7k33BX_IDPpfw3VhGs"',
     u'id': {u'kind': u'youtube#video', u'videoId': u's2_eAJibpQE'},
     u'kind': u'youtube#searchResult',
     u'snippet': {
       u'channelId': u'UC44Ofafh5rj9Q8nkoCH7-8Q',
       u'channelTitle': u'Bhakti2002',
       u'description': u'Sienna Root Wishing for more Far from the Sun (2008)',
       u'liveBroadcastContent': u'none',
       u'publishedAt': u'2010-01-19T10:58:21.000Z',
       u'thumbnails': {u'default': {u'url': u'https://i.ytimg.com/vi/s2_eAJibpQE/default.jpg'},
                       u'high': {u'url': u'https://i.ytimg.com/vi/s2_eAJibpQE/hqdefault.jpg'},
                       u'medium': {u'url': u'https://i.ytimg.com/vi/s2_eAJibpQE/mqdefault.jpg'}},
       u'title': u'Siena Root - Wishing for more'
     }
   }, ...
```

## Classifier

To be capable to make good use of our API-s data we need classifier, will help us find what we seek.

### Audio

Below I am presenting my algorithm, which is able to fit the video to the music with a high probability. (only disadvantage is that sometimes it is not music with the best quality)

The algorithm sends several inquiries, and the results are stored and analyzed by granting score points. Record with the largest number of points is the result.

```python
def classifier_audio(item):
  patterns, storage = [
    u"{artistName} {trackName} HD",
    u"{artistName} {collectionName} {trackName}",
    u"{collectionName} {trackName}",
  ], {}

  def get(pattern, item, result=[]):
    if ':' in item['trackName']:
      _item = item
      _item['trackName'] = _item['trackName'].split(':')[1]
      result += get(pattern, _item)
    keyword = pattern.format(**item).encode('utf-8')
    keyword = str(keyword).translate(None, '?./;:!@#$\\-()[]')
    while True:
      response = api_google(keyword)
      try:
        response['error']['errors']['reason']
      except TypeError:
        sleep(5)
        continue
      except KeyError:
        sleep(2)
        return result + response['items']

  def match(a, b):
    c = set(a) & set(b)
    return difflib.SequenceMatcher(
        None, a, sorted(c, key=lambda k: a.index(k))).ratio()
        
  for pattern in patterns:
    for track in get(pattern, item):
      points = 0.1 * (len(item['trackName'].lower().split()) -
                      len(track['snippet']['title'].lower().split()))
      a = match(item['trackName'].lower().split(),
                track['snippet']['title'].lower().split())
      b = match(
          item['artistName'].lower().split(),
          track['snippet']['title'].lower().split())
      c = match(item['artistName'].lower().split(),
                track['snippet']['description'].lower().split())
      d = match(item['collectionName'].lower().split(),
                track['snippet']['description'].lower().split())
      points += a * 1.5 + b * 1 + c * 0.5 + d * 0.25
      if track['id']['videoId'] in storage:
        points += storage[track['id']['videoId']] / 2
      storage[track['id']['videoId']] = points
  return 'https://www.youtube.com/watch?v=' + max(storage, key=storage.get)
```

### Cover

Finding high resolution cover is childish simple.

```python
def classifier_cover(item):
  return item['artworkUrl100'].replace('.100x100-75.jpg', '.300x300.jpg')
```

## Downloading

We know where, we should just grab it.

### Audio

For videos from youtube there are already effective methods, [youtube-dl](https://github.com/rg3/youtube-dl#description) is funny tool that will perform the dirty work.

```python
def get_audio(url, filename):
  cmd = "youtube-dl --extract-audio --audio-format mp3 --output '{1}.mp3' {0}"
  os.system(cmd.format(url, filename))
```

### Cover

Here you only need to download the image using [curl](http://curl.haxx.se).

```python
def get_cover(url, filename):
  cmd = "curl -s {0} > '{1}.jpg'"
  os.system(cmd.format(url, filename))
```

## Music

Here it is the most important part. All collected information we turn into music.

### Quality

Sometimes it happens that the quality of the audio is extremely low, or it contains erroneous items. With [ffmpeg](https://www.ffmpeg.org/documentation.html) library it is easily fixed.

```python
def restore_quality(filename):
  cmd = """ffmpeg -i {0}.mp3 {0}-x.mp3 && rm {0}.mp3 && mv {0}-x.mp3 {0}.mp3"""
  os.system(cmd.format(filename))
```

### ID3

Now it’s time to exploit all gathered information to recast cover, audio and data to music. Below are depicted all posibble options. Read [lame guide](http://lame.cvs.sourceforge.net/viewvc/lame/lame/USAGE) to learn more.

```bash
  --tt <title>    audio/song title (max 30 chars for version 1 tag)
  --ta <artist>   audio/song artist (max 30 chars for version 1 tag)
  --tl <album>    audio/song album (max 30 chars for version 1 tag)
  --ty <year>     audio/song year of issue (1 to 9999)
  --tc <comment>  user-defined text (max 30 chars for v1 tag, 28 for v1.1)
  --tn <track[/total]>   audio/song track number and (optionally) the total
                         number of tracks on the original recording. (track
                         and total each 1 to 255. just the track number
                         creates v1.1 tag, providing a total forces v2.0).
  --tg <genre>    audio/song genre (name or number in list)
  --ti <file>     audio/song albumArt (jpeg/png/gif file, v2.3 tag)
  --tv <id=value> user-defined frame specified by id and value (v2.3 tag)
  --add-id3v2     force addition of version 2 tag
  --id3v1-only    add only a version 1 tag
  --id3v2-only    add only a version 2 tag
  --id3v2-utf16   add following options in unicode text encoding
  --id3v2-latin1  add following options in latin-1 text encoding
  --space-id3v1   pad version 1 tag with spaces instead of nulls
  --pad-id3v2     same as '--pad-id3v2-size 128'
  --pad-id3v2-size <value> adds version 2 tag, pad with extra <value> bytes
  --genre-list    print alphabetically sorted ID3 genre list and exit
  --ignore-tag-errors  ignore errors in values passed for tags
```

In my implementation it will look like this:

```python
def set_ID3(item, filename):
  title = item['trackName']
  artist = item['artistName']
  album = item['collectionName']
  year = item['releaseDate'].split('-')[0]
  genre = item['primaryGenreName']
  track = "{0}/{1}".format(item['trackNumber'], item['trackCount'])
  cmd = """lame -c -p -q0 --replaygain-accurate -V0 --ti {filename}.jpg \
           --tt \"{title}\" --ta \"{artist}\" --tl \"{album}\" --ty \"{year}\"\
           --tn \"{track}\" --tg \"{genre}\" {filename}.mp3 {filename}-x.mp3 \
           && rm {filename}.mp3 && mv {filename}-x.mp3 {filename}.mp3"""
  os.system(
      cmd.format(
          title=title.encode('utf-8'),
          artist=artist.encode('utf-8'),
          album=album.encode('utf-8'),
          year=year.encode('utf-8'),
          track=track.encode('utf-8'),
          genre=genre.encode('utf-8'),
          filename=filename.encode('utf-8')))
```

## Result

<br>
<style>.asciicast{width: 591px;margin: 0 auto!important;}</style>
<script type="text/javascript" src="https://asciinema.org/a/2wesckfngvotwohk4kefeugwk.js" id="asciicast-2wesckfngvotwohk4kefeugwk" async></script>

## Appendix

If you are interested in full source code, you can download it from [here](https://github.com/maciejczyzewski/redhands). The whole code is written in _python_.