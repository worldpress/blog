#!/bin/sh

bash $PWD/scripts/build.sh
if [ -e $PWD/public/index.html ]; then
  echo 'publish /public to gh-pages branch'
  gh-pages -d public
else
  exit 1
fi
