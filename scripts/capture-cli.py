#!/usr/bin/env python3
"""Capture a real CLI session through a pseudo-terminal and render it as a PNG.

The terminal transcript is captured verbatim (ANSI stripped) and drawn in a
styled HTML <pre>; headless Chrome then screenshots it. No npm dependency.
"""

import os
import pty
import re
import select
import shutil
import subprocess
import tempfile
import time

ROOT = os.getcwd()
CHROME = os.environ.get(
    'CHROME_PATH', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
)
CLI = os.path.join(ROOT, 'packages/cli/dist/index.js')
NODE = shutil.which('node') or '/usr/local/bin/node'
OUT = os.path.join(ROOT, 'docs/screenshots/cli.png')


def capture():
    workdir = tempfile.mkdtemp(prefix='tb-cli-')
    pid, fd = pty.fork()
    if pid == 0:
        os.chdir(workdir)
        os.execv(NODE, [NODE, CLI, 'demo-site'])

    chunks = []
    deadline = time.time() + 25
    # Accept every default prompt in sequence.
    keys = [b'\r'] * 9
    next_key = time.time() + 1.2
    while time.time() < deadline:
        readable, _, _ = select.select([fd], [], [], 0.2)
        if readable:
            try:
                data = os.read(fd, 65536)
            except OSError:
                break
            if not data:
                break
            chunks.append(data)
        if keys and time.time() >= next_key:
            os.write(fd, keys.pop(0))
            next_key = time.time() + 0.55
        if not chunks and time.time() > next_key + 3:
            break
    try:
        os.close(fd)
    except OSError:
        pass
    try:
        os.waitpid(pid, os.WNOHANG)
    except ChildProcessError:
        pass
    shutil.rmtree(workdir, ignore_errors=True)
    return b''.join(chunks).decode('utf-8', errors='replace')


ANSI = re.compile(r'\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[()][0-9A-Za-z]|\x1b[=>]|\r')


def clean(text):
    lines = [ANSI.sub('', line).strip() for line in text.replace('\r', '\n').split('\n')]
    lines = [line for line in lines if len(line) >= 3 and not re.fullmatch(r'[0-9;\[\]?mKGLfhA-Za-z ]{1,3}', line)]
    result = []
    for line in lines:
        if result and result[-1] == line:
            continue
        result.append(line)
    return '\n'.join(result[-34:])


def main():
    transcript = clean(capture())
    html = f'''<!doctype html><html><head><meta charset="utf-8"><style>
      html,body{{margin:0;width:1440px;height:1000px;overflow:hidden;background:#08090a;
        font-family:'JetBrains Mono',ui-monospace,monospace}}
      .window{{margin:60px auto;width:1240px;border:1px solid rgba(255,255,255,.1);
        border-radius:14px;background:#101116;box-shadow:0 30px 80px rgba(0,0,0,.5);overflow:hidden}}
      .bar{{height:42px;display:flex;align-items:center;gap:8px;padding:0 16px;
        border-bottom:1px solid rgba(255,255,255,.08);background:#16171c}}
      .dot{{width:11px;height:11px;border-radius:50%}}
      .title{{margin-left:16px;color:#6b7280;font-size:12px}}
      pre{{margin:0;padding:28px 30px;color:#d7ece8;font-size:14px;line-height:1.65;
        white-space:pre-wrap;word-break:break-word}}
      .label{{position:absolute;left:100px;top:34px;color:#5e6ad2;font-size:13px;
        letter-spacing:.16em;text-transform:uppercase}}
    </style></head><body>
      <div class="label">Interactive CLI · real session capture</div>
      <div class="window"><div class="bar">
        <span class="dot" style="background:#ff5f57"></span>
        <span class="dot" style="background:#febc2e"></span>
        <span class="dot" style="background:#28c840"></span>
        <span class="title">create-tanstack-blog — zsh</span>
      </div><pre>{html_escape(transcript)}</pre></div>
    </body></html>'''

    tmp = os.path.join(tempfile.gettempdir(), 'tb-cli-shot.html')
    with open(tmp, 'w', encoding='utf-8') as handle:
        handle.write(html)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    subprocess.run(
        [
            CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
            '--hide-scrollbars', '--window-size=1440,1000',
            '--virtual-time-budget=3000', f'--screenshot={OUT}', f'file://{tmp}',
        ],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True,
    )
    print('captured', os.path.relpath(OUT, ROOT))


def html_escape(text):
    return text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


if __name__ == '__main__':
    main()
