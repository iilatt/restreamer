#!/bin/bash
set -e

./build.sh
rm -rf hls
mkdir hls
node src/main.js