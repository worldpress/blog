#!/bin/sh

bash $PWD/scripts/build.sh
gh-pages -d public
