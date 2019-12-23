#!/bin/sh

mkdir yt-timemarks
cp bicon*.png yt-timemarks
cp icon*.png yt-timemarks
cp manifest.json yt-timemarks
cp options.html yt-timemarks
cp *.js yt-timemarks

[[ -e yt-timemarks.zipo ]] && rm yt-timemarks.zip
zip -r yt-timemarks.zip yt-timemarks
rm -r yt-timemarks
