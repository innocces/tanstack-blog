#!/usr/bin/env python3
"""Drive the real CLI in a pseudo-terminal and emit a timestamped transcript as JSON."""

import json
import os
import pty
import re
import select
import shutil
import sys
import tempfile
import time

ROOT = os.getcwd()
CLI = os.path.join(ROOT, 'packages/cli/dist/index.js')
NODE = shutil.which('node') or '/usr/local/bin/node'

# Keys sent at each step: Enter accepts defaults; arrow keys change selections.
# Two profiles produce two genuinely different CLI sessions.
PROFILES = {
    'default': [b'\r'] * 9,
    'muji': [
        b'\r',                      # project name
        b'\r',                      # package manager
        b'\x1b[B\r',                # content modes: move selection, confirm
        b'\x1b[B\r',                # theme: MUJI
        b'\r',                      # locales
        b'\x1b[B\r',                # search: local
        b'\x1b[B\r',                # deploy: vercel
        b'\r',                      # git
    ],
}

ANSI = re.compile(r'\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[()][0-9A-Za-z]|\x1b[=>]|\r')


def clean(text):
    lines = [ANSI.sub('', line).strip() for line in text.replace('\r', '\n').split('\n')]
    return [line for line in lines if len(line) >= 3]


def main():
    profile = sys.argv[1] if len(sys.argv) > 1 else 'default'
    workdir = tempfile.mkdtemp(prefix='tb-video-')
    pid, fd = pty.fork()
    if pid == 0:
        os.chdir(workdir)
        os.execv(NODE, [NODE, CLI, 'demo-site'])

    events = []
    keys = list(PROFILES[profile])
    start = time.time()
    next_key = start + 1.0
    deadline = start + 20
    while time.time() < deadline:
        readable, _, _ = select.select([fd], [], [], 0.15)
        if readable:
            try:
                data = os.read(fd, 65536)
            except OSError:
                break
            if not data:
                break
            events.append({'t': round(time.time() - start, 2), 'text': data.decode('utf-8', 'replace')})
        if keys and time.time() >= next_key:
            os.write(fd, keys.pop(0))
            next_key = time.time() + 0.7
    try:
        os.close(fd)
        os.waitpid(pid, os.WNOHANG)
    except (OSError, ChildProcessError):
        pass
    shutil.rmtree(workdir, ignore_errors=True)

    # Reconstruct the visible transcript at each event, keeping stable lines.
    timeline = []
    visible = []
    for event in events:
        for line in clean(event['text']):
            if visible and visible[-1] == line:
                continue
            visible.append(line)
        timeline.append({'t': event['t'], 'lines': visible[-22:]})

    print(json.dumps({'profile': profile, 'timeline': timeline}))


if __name__ == '__main__':
    main()
