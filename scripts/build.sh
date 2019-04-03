#!/bin/sh

gatsby build --prefix-paths
cp $PWD/src/assets/CNAME $PWD/public/
cp $PWD/src/assets/robots.txt $PWD/public/
