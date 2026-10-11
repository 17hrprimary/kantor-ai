#!/usr/bin/env python3
"""Bikin theater/videos.json dari semua file video di folder theater/ (dipakai Bioskop Lt 4).
Jalankan dari root repo:  python3 tools/theater-list.py"""
import json, os, re
d = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'theater')
ext = re.compile(r'\.(mp4|webm|m4v|mov|ogv|ogg|mkv)$', re.I)
files = []
for root, _, names in os.walk(d):
    for n in names:
        if ext.search(n):
            files.append(os.path.relpath(os.path.join(root, n), d).replace(os.sep, '/'))
files.sort(key=str.lower)
out = {"videos": [{"file": f, "title": re.sub(r'[_]+', ' ', ext.sub('', os.path.basename(f)))} for f in files]}
with open(os.path.join(d, 'videos.json'), 'w', encoding='utf-8') as fh:
    json.dump(out, fh, ensure_ascii=False, indent=1)
print(f"{len(files)} video -> theater/videos.json")
