/* ═══════════════════════════════════════
   TERMINAL.JS — Interactive terminal
   ═══════════════════════════════════════ */

(function () {
  const COMMANDS = {
    help: {
      desc: 'Show available commands',
      run: () => [
        { t: 'h1', v: '┌─ VORSYNTH TERMINAL ──────────────────────┐' },
        { t: 'out', v: '  help         Show this help menu' },
        { t: 'out', v: '  whoami       Identity and profile' },
        { t: 'out', v: '  skills       Technology stack' },
        { t: 'out', v: '  projects     Deployed systems' },
        { t: 'out', v: '  stack [name] Detail on a specific tech' },
        { t: 'out', v: '  contact      How to reach Vorsynth' },
        { t: 'out', v: '  github       Open GitHub profile' },
        { t: 'out', v: '  pypi         Open PyPI profile' },
        { t: 'out', v: '  resume       Open résumé / profile' },
        { t: 'out', v: '  philosophy   Core engineering directives' },
        { t: 'out', v: '  uptime       System runtime info' },
        { t: 'out', v: '  ls           List available resources' },
        { t: 'out', v: '  pwd          Print current directory' },
        { t: 'out', v: '  cd [dir]     Change directory' },
        { t: 'out', v: '  history      Show command history' },
        { t: 'out', v: '  date         Show current date/time' },
        { t: 'out', v: '  echo [text]  Print text' },
        { t: 'out', v: '  cat [file]   Read a file (try: cat README)' },
        { t: 'out', v: '  ping         Test connection' },
        { t: 'out', v: '  clear        Clear terminal' },
        { t: 'info', v: '└──────────────────────────────────────────┘' },
      ],
    },

    whoami: {
      desc: 'Identity',
      run: () => [
        { t: 'h1',  v: 'VORSYNTH' },
        { t: 'out', v: 'handle   : @alanhasn' },
        { t: 'out', v: 'focus    : Backend Engineering · Security · DevOps' },
        { t: 'out', v: 'stack    : Python · Django · Redis · PostgreSQL · Docker' },
        { t: 'out', v: 'approach : Security-first · Understand internals · Build real systems' },
        { t: 'out', v: 'current  : SMBN Command Center — distributed real-time backend' },
        { t: 'out', v: 'pypi     : pypi.org/user/alanhasn' },
        { t: 'out', v: 'github   : github.com/alanhasn' },
        { t: 'ok',  v: '→ Available for backend and security projects.' },
      ],
    },

    skills: {
      desc: 'Technology stack',
      run: () => [
        { t: 'h1',  v: 'TECHNOLOGY MATRIX' },
        { t: 'out', v: '' },
        { t: 'out', v: 'LANGUAGES    Python · Kotlin · JavaScript · Bash · HTML · CSS' },
        { t: 'out', v: 'FRAMEWORKS   Django · DRF · FastAPI · HTMX' },
        { t: 'out', v: 'DATABASE     PostgreSQL · Redis · SQLite · MySQL' },
        { t: 'out', v: 'INFRA        Docker · Linux · Git' },
        { t: 'out', v: 'SECURITY     XSScan · SecureTool · Static Analysis · RE' },
        { t: 'out', v: 'MOBILE       Kotlin · Android Studio · Android SDK' },
        { t: 'info', v: '' },
        { t: 'info', v: 'Run: stack <name>  for detail on any technology.' },
      ],
    },

    projects: {
      desc: 'Deployed systems',
      run: () => [
        { t: 'h1',  v: 'DEPLOYED SYSTEMS' },
        { t: 'out', v: '' },
        { t: 'ok',  v: '● SMBN Command Center     Distributed real-time backend · Django/ASGI/Redis' },
        { t: 'ok',  v: '● XSScan                  XSS detection library · PyPI published' },
        { t: 'ok',  v: '● SecureTool              Python security primitives · PyPI published' },
        { t: 'warn',v: '◈ Vulnerability Scanner   Web security platform · Active development' },
        { t: 'warn',v: '◈ Android OTA System      OTA delivery integrated into SMBN' },
        { t: 'out', v: '◎ Backend API Systems     Production REST/WebSocket infrastructure' },
      ],
    },

    contact: {
      desc: 'Contact information',
      run: () => [
        { t: 'h1',  v: 'CONTACT' },
        { t: 'out', v: 'github  : https://github.com/alanhasn' },
        { t: 'out', v: 'pypi    : https://pypi.org/user/alanhasn' },
        { t: 'ok',  v: '→ Open to backend, security, and infrastructure collaboration.' },
      ],
    },

    github: {
      desc: 'Open GitHub profile',
      run: () => {
        const tab = window.open('https://github.com/vorsynth', '_blank');
        if (tab) tab.opener = null;
        return [{ t: 'ok', v: 'Opening GitHub profile...' }];
      },
    },

    pypi: {
      desc: 'Open PyPI profile',
      run: () => {
        const tab = window.open('https://pypi.org/user/vorsynth', '_blank');
        if (tab) tab.opener = null;
        return [{ t: 'ok', v: 'Opening PyPI profile...' }];
      },
    },

    resume: {
      desc: 'Open résumé / profile',
      run: () => {
        const tab = window.open('https://github.com/alanhasn', '_blank');
        if (tab) tab.opener = null;
        return [{ t: 'ok', v: 'Opening résumé / profile...' }];
      },
    },

    philosophy: {
      desc: 'Core engineering directives',
      run: () => [
        { t: 'h1',  v: 'CORE DIRECTIVES' },
        { t: 'out', v: '01  Security is architecture — not a feature bolted on later' },
        { t: 'out', v: '02  Read the source. The docs lie. The code does not.' },
        { t: 'out', v: '03  Understand the protocol before touching the library' },
        { t: 'out', v: '04  Break systems deliberately. Fix with precision.' },
        { t: 'out', v: '05  Automate the repeatable. Think harder on the novel.' },
        { t: 'out', v: '06  Clean code is a forcing function for clear thinking' },
        { t: 'out', v: '07  Know the failure modes before the system ships' },
      ],
    },

    ping: {
      desc: 'Test connection',
      run: () => {
        const ms = Math.floor(Math.random() * 8) + 1;
        return [
          { t: 'out', v: 'PING vorsynth.dev (127.0.0.1)' },
          { t: 'ok',  v: `64 bytes from vorsynth.dev: icmp_seq=1 ttl=64 time=${ms}.${Math.floor(Math.random()*9)} ms` },
          { t: 'ok',  v: `64 bytes from vorsynth.dev: icmp_seq=2 ttl=64 time=${ms-1}.${Math.floor(Math.random()*9)} ms` },
          { t: 'ok',  v: `64 bytes from vorsynth.dev: icmp_seq=3 ttl=64 time=${ms}.${Math.floor(Math.random()*9)} ms` },
          { t: 'info', v: '--- vorsynth.dev ping statistics ---' },
          { t: 'info', v: '3 packets transmitted, 3 received, 0% packet loss' },
        ];
      },
    },

    uptime: {
      desc: 'System uptime',
      run: () => {
        const start = new Date('2024-03-17');
        const now   = new Date();
        const days  = Math.floor((now - start) / 86400000);
        return [
          { t: 'h1',  v: 'SYSTEM UPTIME' },
          { t: 'out', v: `started  : Mar 17, 2024` },
          { t: 'out', v: `runtime  : ${days} days` },
          { t: 'out', v: `commits  : 312 (public)` },
          { t: 'ok',  v: 'status   : OPERATIONAL' },
        ];
      },
    },

    ls: {
      desc: 'List resources',
      run: () => [
        { t: 'out', v: 'total 8' },
        { t: 'ok',  v: 'drwxr-xr-x  projects/     6 items' },
        { t: 'ok',  v: 'drwxr-xr-x  stack/        22 items' },
        { t: 'ok',  v: '-rw-r--r--  README        3.2K' },
        { t: 'ok',  v: '-rw-r--r--  PHILOSOPHY    512' },
        { t: 'ok',  v: '-rw-r--r--  CONTACT       128' },
        { t: 'info', v: 'Run cat <file> to read.' },
      ],
    },

    clear: {
      desc: 'Clear terminal',
      run: () => { clearOutput(); return []; },
    },
  };

  // Dynamic stack <name> command
  const STACK_DETAIL = {
    python:     ['Python 3.12', 'Primary language', 'Django · FastAPI · security tooling · scripting'],
    django:     ['Django 5.x', 'Main web framework', 'DRF · ASGI · Channels · ORM · Auth · Admin'],
    fastapi:    ['FastAPI 0.11x', 'Async API framework', 'Pydantic · async/await · OpenAPI · Starlette'],
    redis:      ['Redis 7.2', 'In-memory data store', 'Pub/Sub · Caching · Session · Queue · Streams'],
    docker:     ['Docker 26', 'Container platform', 'Compose · Networking · Volumes · Registry'],
    postgresql: ['PostgreSQL 15', 'Primary database', 'JSONB · Indexing · Transactions · Replication'],
    linux:      ['Linux (Debian/Ubuntu)', 'OS of choice', 'systemd · networking · hardening · shell'],
    kotlin:     ['Kotlin', 'Android development', 'Jetpack · Coroutines · Android SDK · Gradle'],
  };

  // cat <file> command
  const FILES = {
    readme: [
      { t: 'h1',  v: '# VORSYNTH' },
      { t: 'out', v: 'Backend engineer building distributed systems and security tooling.' },
      { t: 'out', v: '' },
      { t: 'out', v: 'I reverse-engineer software to understand how things actually work —' },
      { t: 'out', v: 'not how documentation claims they do.' },
      { t: 'out', v: '' },
      { t: 'ok',  v: 'Security is not a feature I bolt on. It is baked in from day one.' },
    ],
    philosophy: [
      { t: 'h1',  v: '# PHILOSOPHY' },
      { t: 'out', v: '01  Security is architecture — not a feature bolted on later' },
      { t: 'out', v: '02  Read the source. The docs lie. The code does not.' },
      { t: 'out', v: '03  Understand the protocol before touching the library' },
      { t: 'out', v: '04  Break systems deliberately. Fix with precision.' },
      { t: 'out', v: '05  Automate the repeatable. Think harder on the novel.' },
    ],
    contact: [
      { t: 'h1',  v: '# CONTACT' },
      { t: 'out', v: 'github : https://github.com/alanhasn' },
      { t: 'out', v: 'pypi   : https://pypi.org/user/alanhasn' },
    ],
  };

  const FS = {
    '~': ['README', 'PHILOSOPHY', 'CONTACT', 'projects', 'stack'],
    '/home': ['vorsynth'],
    '/home/vorsynth': ['README', 'PHILOSOPHY', 'CONTACT', 'projects', 'stack'],
    '/home/vorsynth/projects': ['README', 'PHILOSOPHY', 'CONTACT'],
    '/home/vorsynth/stack': ['python', 'django', 'fastapi', 'redis', 'docker', 'postgresql', 'linux', 'kotlin'],
    '/etc': ['issue', 'profile'],
  };

  function resolvePath(target) {
    if (!target || target === '~' || target === '/') return '~';
    if (target.startsWith('/')) return target;
    if (cwd === '~') return `/home/vorsynth/${target.toLowerCase()}`;
    if (cwd === '/home') return `/home/${target.toLowerCase()}`;
    return `${cwd}/${target.toLowerCase()}`;
  }

  function parentPath(path) {
    if (path === '~') return '~';
    const parts = path.split('/').filter(Boolean);
    if (parts.length <= 1) return '~';
    parts.pop();
    const next = '/' + parts.join('/');
    return next === '/home' ? '/home' : next;
  }

  let output, input, history = [], histIdx = -1;
  let cwd = '~';

  function line(type, value) {
    const el = document.createElement('div');
    el.className = `term-line ${type}`;
    el.textContent = value;
    output.appendChild(el);
    output.scrollTop = output.scrollHeight;
  }

  function clearOutput() {
    output.innerHTML = '';
  }

  function prompt(cmd) {
    line('cmd', `vorsynth@backend:${cwd}$ ${cmd}`);
  }

  function runCommand(raw) {
    const parts = raw.trim().split(/\s+/);
    const cmd   = parts[0].toLowerCase();
    const arg   = parts.slice(1).join(' ');
    const argKey = arg.toLowerCase();

    if (!cmd) return;

    // History
    history.unshift(raw);
    histIdx = -1;

    if (cmd === 'pwd') {
      line('out', cwd === '~' ? '/home/vorsynth' : cwd);
      return;
    }

    if (cmd === 'cd') {
      const target = arg.trim();
      if (!target || target === '~') {
        cwd = '~';
        return;
      }
      if (target === '..') {
        cwd = parentPath(cwd);
        return;
      }
      const path = resolvePath(target);
      if (FS[path]) {
        cwd = path;
      } else {
        line('err', `bash: cd: ${target}: No such file or directory`);
      }
      return;
    }

    if (cmd === 'history') {
      history.slice(0, 20).reverse().forEach((item, idx) => line('out', `${idx + 1}  ${item}`));
      return;
    }

    if (cmd === 'date') {
      line('out', new Date().toString());
      return;
    }

    if (cmd === 'echo') {
      line('out', arg);
      return;
    }

    if (cmd === 'ls') {
      const target = argKey || cwd;
      const dir = FS[target] || FS[cwd];
      if (dir) {
        line('out', dir.join('  '));
      } else {
        line('err', `ls: cannot access '${arg || cwd}': No such file or directory`);
      }
      return;
    }

    if (cmd === 'cat' && arg) {
      const file = FILES[argKey] || FILES[argKey.replace(/\//g, '')];
      if (file) {
        file.forEach(l => line(l.t, l.v));
      } else {
        line('err', `cat: ${arg}: No such file`);
        line('info', 'Available: README  PHILOSOPHY  CONTACT');
      }
      return;
    }

    const handler = COMMANDS[cmd];
    if (handler) {
      const result = handler.run();
      (result || []).forEach(l => line(l.t, l.v));
    } else {
      line('err', `command not found: ${cmd}`);
      line('info', "Type 'help' to see available commands.");
    }
  }

  function init() {
    output = document.getElementById('term-output');
    input  = document.getElementById('term-input');
    if (!output || !input) return;

    // Welcome banner
    const welcomeLines = [
      { t: 'info', v: '╔══════════════════════════════════════════════╗' },
      { t: 'info', v: '║  VORSYNTH TERMINAL  v2.4.1                   ║' },
      { t: 'info', v: '║  Backend Engineer · Security · Infrastructure ║' },
      { t: 'info', v: '╚══════════════════════════════════════════════╝' },
      { t: 'out',  v: '' },
      { t: 'ok',   v: 'System online. All services nominal.' },
      { t: 'out',  v: "Type 'help' to see available commands." },
      { t: 'out',  v: '' },
    ];
    welcomeLines.forEach((l, i) => setTimeout(() => line(l.t, l.v), i * 60));

    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const val = input.value.trim();
        prompt(val);
        input.value = '';
        runCommand(val);
      }
      if (e.key === 'ArrowUp') {
        histIdx = Math.min(histIdx + 1, history.length - 1);
        input.value = history[histIdx] || '';
        e.preventDefault();
      }
      if (e.key === 'ArrowDown') {
        histIdx = Math.max(histIdx - 1, -1);
        input.value = histIdx >= 0 ? history[histIdx] : '';
        e.preventDefault();
      }
    });

    // Focus terminal when section is shown
    document.querySelector('[data-section="terminal"]')?.addEventListener('click', () => {
      input.focus();
    });
  }

  window.addEventListener('boot-complete', () => setTimeout(init, 700));
})();