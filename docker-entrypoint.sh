#!/usr/bin/env sh

echo $DOPPLER_TOKEN | doppler configure set token --scope / > /dev/null

exec doppler run -- "$@"
