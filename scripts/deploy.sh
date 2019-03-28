#!/bin/sh

gatsby build --prefix-paths
cp $PWD/src/assets/CNAME $PWD/public/
gh-pages -d public
