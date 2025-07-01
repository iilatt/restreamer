#!/bin/bash
set -e

nest="$(realpath tool/nest-0.4)"
webcat="$(realpath tool/webcat-0.3)"
minhtml="$(realpath tool/minhtml-0.15.0) --minify-css --minify-js"

app_name='Example'
app_desc="ReStreamer Example App."
app_url='example.com'
mkdir -p temp
static_path="$(realpath static)"

cat 'web/root.css' > 'temp/all.css'
$nest 'web/main.nest' >> 'temp/all.css'
$nest 'web/live.nest' >> 'temp/all.css'
cat 'web/main.js' 'web/helper.js' 'web/live.js' > 'temp/all.js'
$webcat "--name=$app_name" "--desc=$app_desc" "--url=https://$app_url" '--main=web/main.html' '--css=temp/all.css' '--js=temp/all.js' | $minhtml > "$static_path/app.html"