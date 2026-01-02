#!/bin/bash
echo "Clearing Expo and Metro caches..."
rm -rf .expo
rm -rf node_modules/.cache
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-map-*
echo "Cache cleared! Now run: npm start -- --clear"
