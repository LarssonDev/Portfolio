/* ════════════════════════════════════════════
   LARSSON PORTFOLIO — MAIN JS
   ════════════════════════════════════════════ */

// ─── Custom Cursor ───────────────────────────
const cursor = document.querySelector('.cursor');
const cursorTrail = document.querySelector('.cursor-trail');
let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursor) {
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    }
});

// Smooth trailing cursor
function animateTrail() {
    trailX += (mouseX - trailX) * 0.15;
    trailY += (mouseY - trailY) * 0.15;
    if (cursorTrail) {
        cursorTrail.style.left = trailX + 'px';
        cursorTrail.style.top = trailY + 'px';
    }
    requestAnimationFrame(animateTrail);
}
animateTrail();

// Cursor grow on links/buttons
document.querySelectorAll('a, button, .tech-item, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        if (cursor) {
            cursor.style.width = '22px';
            cursor.style.height = '22px';
            cursor.style.background = 'var(--bg-yellow)';
        }
    });
    el.addEventListener('mouseleave', () => {
        if (cursor) {
            cursor.style.width = '14px';
            cursor.style.height = '14px';
            cursor.style.background = 'var(--bg-magenta)';
        }
    });
});

// ─── Hamburger Menu ──────────────────────────
const hamburger = document.getElementById('hamburger');
const nav = document.querySelector('nav');

if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
        nav.classList.toggle('open');
    });

    // Close on link click
    nav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => nav.classList.remove('open'));
    });
}

// ─── Floating Box Parallax ───────────────────
document.addEventListener('mousemove', (e) => {
    const boxes = document.querySelectorAll('.floating-box');
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (cx - e.clientX) / 55;
    const dy = (cy - e.clientY) / 55;

    boxes.forEach((box, i) => {
        const f = (i + 1) * 0.35;
        const rot = i * 3 - 5;
        box.style.transform = `translate(${dx * f}px, ${dy * f}px) rotate(${rot}deg)`;
    });
});

// ─── Scroll Reveal ───────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
            // Stagger cards in a grid
            const siblings = entry.target.parentElement.querySelectorAll('.reveal');
            let delay = 0;
            siblings.forEach((sib, i) => {
                if (sib === entry.target) delay = i * 80;
            });
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, delay);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ─── Active Nav Highlight ─────────────────────
const sections = document.querySelectorAll('section[id], footer[id]');
const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => {
                link.classList.remove('nav-active');
                if (link.getAttribute('href') === '#' + entry.target.id) {
                    link.classList.add('nav-active');
                }
            });
        }
    });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ─── Button Press Effect ─────────────────────
document.querySelectorAll('button, .btn-yellow, .btn-green, .btn-blue, .btn-magenta, .btn-primary, .btn-secondary').forEach(btn => {
    btn.addEventListener('mousedown', () => {
        btn.style.transform = 'translate(4px, 4px)';
        btn.style.boxShadow = '2px 2px 0px black';
    });
    btn.addEventListener('mouseup', () => {
        btn.style.transform = '';
        btn.style.boxShadow = '';
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.boxShadow = '';
    });
});

// ─── Sticker Hover Tilt ──────────────────────
document.querySelectorAll('.sticker').forEach(sticker => {
    sticker.addEventListener('mousemove', (e) => {
        const rect = sticker.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const rx = (e.clientY - cy) / 5;
        const ry = -(e.clientX - cx) / 5;
        sticker.style.transform = `perspective(300px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.1)`;
    });
    sticker.addEventListener('mouseleave', () => {
        sticker.style.transform = '';
    });
});

// ─── Project Data ────────────────────────────
const projectsData = {
    'ila': {
        title: 'ILA COMMUNITY',
        windowTitle: 'ILA_SOURCE.APK',
        tagline: 'An event management and community platform for the Mizo people — built with real-time sync and secure payments.',
        platform: 'Android / iOS',
        type: 'Community App',
        stack: 'React Native',
        image: 'icon.png',
        description: 'ILA Community is a dedicated event management and engagement platform for the Mizo community. It serves as a central hub for cultural events, local news, and community support systems.',
        tags: ['React Native', 'Firebase', 'Razorpay', 'Leaflet Maps'],
        features: [
            'Real-time event notification system',
            'Secure payment integration via Razorpay',
            'Interactive location tagging with Leaflet Maps',
            'User profiles with tiered permissions',
            'Community-led event moderation'
        ],
        technical: 'Built using React Native for cross-platform efficiency. The backend leverages Firebase Realtime Database for instant synchronization across devices. Payments are handled via OAuth-secured Razorpay hooks, and geographical data is visualized using the Leaflet.js ecosystem.',
        screenshots: [],
        github: 'https://github.com/LarssonDev',
        apk: '#'
    },
    'anatomypro': {
        title: 'NOVA',
        windowTitle: 'NOVA_SYSTEM.EXE',
        tagline: 'Habit tracking reimagined — see your discipline reflected on an interactive anatomy model in real time.',
        platform: 'Android / iOS',
        type: 'Health & Productivity',
        stack: 'React Native + Skia',
        image: 'anatomy_pulse.png',
        description: 'NOVA maps daily habits to a 3D anatomy model. As you build consistency, different muscle groups and organs glow — making growth visible and motivating.',
        tags: ['React Native', 'TypeScript', 'Skia', 'SVG Animation', 'Async Storage'],
        features: [
            'Interactive SVG anatomy model with dynamic color tinting',
            'Custom goal-to-bodypart mapping algorithm',
            'Real-time analytics for physical habit consistency',
            'Privacy-first — all data stays local on device',
            'Custom positioning tool for precise overlay alignment'
        ],
        technical: 'The core engine uses React Native Skia for high-performance SVG manipulation. A custom coordinate mapping system ensures overlays align perfectly across different screen sizes. State is managed through Context API + persistent local storage.',
        screenshots: [
            { src: 'nova_screens/nova_dashboard.jpg', caption: 'NOVA_DASHBOARD: Visual overview of habit progress.' },
            { src: 'nova_screens/nova_tasks.jpg', caption: 'HABIT_CALENDAR: Monthly tracking view.' },
            { src: 'nova_screens/nova_analytics_2.jpg', caption: 'PERFORMANCE_VELOCITY: Real-time tracking.' },
            { src: 'nova_screens/nova_analytics_1.jpg', caption: 'SYSTEM_BALANCE: Granular analysis.' },
            { src: 'nova_screens/nova_config.jpg', caption: 'SYSTEM_CONFIG: Advanced local storage management.' }
        ],
        github: 'https://github.com/LarssonDev',
        apk: '#'
    },
    'spam-remover': {
        title: 'GMAIL SPAM REMOVER',
        windowTitle: 'SPAM_FILTER.PY',
        tagline: 'ML-powered Gmail cleaner that catches phishing and spam that standard filters miss — built with Naive Bayes.',
        platform: 'Desktop (Python)',
        type: 'ML Tool',
        stack: 'Python + Scikit-Learn',
        image: 'spam_remover.jpg',
        description: 'An inbox hygiene tool applying Naive Bayes ML filters to Gmail accounts, identifying sophisticated phishing and marketing spam that Google\'s built-in filters often miss.',
        tags: ['Python', 'Scikit-Learn', 'Gmail API', 'OAuth2', 'Naive Bayes'],
        features: [
            'Multinomial Naive Bayes classification engine',
            'Secure Google OAuth 2.0 authentication flow',
            'Real-time scanning of unread messages via Gmail API',
            'Automated batch organisation into Trash / Spam folders',
            'Model serialisation for rapid cold-start classification'
        ],
        technical: 'Uses a Scikit-Learn pipeline for text vectorisation (CountVectorizer) and classification. Processes data locally to ensure privacy. Integrates with the Gmail API via google-auth-oauthlib.',
        screenshots: [],
        github: 'https://github.com/LarssonDev',
        apk: null
    },
    'inbawk': {
        title: 'INBAWK CARDS',
        windowTitle: 'INBAWK_BUILD.APK',
        tagline: 'Real-time multiplayer card game for the Mizo community — premium casino aesthetic on mobile.',
        platform: 'Android / iOS',
        type: 'Multiplayer Game',
        stack: 'Expo + Firebase',
        image: 'inbawk_board.png',
        description: 'INBAWK brings the atmosphere of a professional card room to mobile. Designed for the Mizo community to enjoy classic and custom card games in a premium, real-time environment.',
        tags: ['React Native', 'Expo', 'Firebase', 'Realtime DB', 'Custom Shaders'],
        features: [
            'Real-time multiplayer lobbies with ~100ms latency',
            'Intelligent AI bots for solo play modes',
            'Premium aesthetic with custom asset shaders',
            'Cross-platform account sync via Firebase',
            'In-game chat and community features'
        ],
        technical: 'Built on Expo with heavy focus on landscape UI stability. Real-time sync uses Firebase Realtime Database listener trees. Custom character assets are dynamically tinted to reduce bundle size.',
        screenshots: [
            'inbawk/inbawk_1.jpg',
            'inbawk/inbawk_2.jpg',
            'inbawk/inbawk_3.jpg',
            'inbawk/inbawk_4.jpg',
            'inbawk/inbawk_5.jpg',
            'inbawk/inbawk_6.jpg'
        ],
        github: 'https://github.com/LarssonDev',
        apk: '#'
    }
};




// ─── Project Detail Page ─────────────────────
function initProjectDetail() {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('id');
    const project = projectsData[projectId];

    if (!project) {
        const titleEl = document.getElementById('project-title');
        if (titleEl) titleEl.textContent = 'PROJECT_NOT_FOUND.ERR';
        return;
    }

    // Update page title
    document.title = project.title + ' | LARSSON.DS';

    // Window & hero
    const wtEl = document.getElementById('window-title');
    if (wtEl) wtEl.textContent = project.windowTitle;

    const heroImg = document.getElementById('project-hero-img');
    if (heroImg) {
        heroImg.src = project.image;
        heroImg.alt = project.title;
    }

    // Title + tagline
    const titleEl = document.getElementById('project-title');
    if (titleEl) titleEl.textContent = project.title;

    const taglineEl = document.getElementById('project-tagline');
    if (taglineEl) taglineEl.textContent = project.tagline || '';

    // Action buttons
    const btnDemo = document.getElementById('btn-demo');
    if (btnDemo) {
        if (project.apk && project.apk !== '#') {
            btnDemo.href = project.apk;
            btnDemo.removeAttribute('style');
        } else if (project.apk === '#') {
            // Placeholder — APK not hosted yet
            btnDemo.style.opacity = '0.5';
            btnDemo.style.pointerEvents = 'none';
            btnDemo.title = 'APK coming soon';
        } else {
            // No APK (e.g. Python project) — hide entirely
            btnDemo.style.display = 'none';
        }
    }

    const btnGithub = document.getElementById('btn-github');
    if (btnGithub && project.github) btnGithub.href = project.github;

    // Quick info panel
    const infoPlatform = document.getElementById('info-platform');
    if (infoPlatform) infoPlatform.textContent = project.platform || '—';

    const infoType = document.getElementById('info-type');
    if (infoType) infoType.textContent = project.type || '—';

    const infoStack = document.getElementById('info-stack');
    if (infoStack) infoStack.textContent = project.stack || '—';

    // Overview
    const descEl = document.getElementById('project-desc-text');
    if (descEl) descEl.textContent = project.description;

    // Features
    const featuresList = document.getElementById('project-features');
    if (featuresList && project.features) {
        project.features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            featuresList.appendChild(li);
        });
    }

    // Tech tags
    const tagsEl = document.getElementById('project-tags');
    if (tagsEl && project.tags) {
        project.tags.forEach(tag => {
            const span = document.createElement('span');
            span.className = 'tech-tag';
            span.textContent = tag;
            tagsEl.appendChild(span);
        });
    }

    // Technical notes
    const techEl = document.getElementById('technical-details');
    if (techEl) techEl.textContent = project.technical || 'Technical architecture details coming soon.';

    // Screenshots gallery
    const gallery = document.getElementById('project-gallery');
    const galleryWrapper = document.getElementById('gallery-wrapper');
    if (gallery && project.screenshots && project.screenshots.length > 0) {
        galleryWrapper.style.display = 'block';
        project.screenshots.forEach(screenshot => {
            const img = document.createElement('img');
            img.src = typeof screenshot === 'string' ? screenshot : screenshot.src;
            img.alt = typeof screenshot === 'string' ? project.title : (screenshot.caption || project.title);
            img.loading = 'lazy';
            gallery.appendChild(img);
        });
    }

    // Lucide icons refresh
    if (window.lucide) lucide.createIcons();
}

// ─── Build Form ──────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    trackVisit();

    if (document.getElementById('proposals-list')) {
        initAdminDashboard();
    }

    const buildForm = document.getElementById('build-form');
    if (buildForm) {
        buildForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('submit-btn');
            const status = document.getElementById('status-msg');

            btn.textContent = 'UPLOADING_LOGIC...';
            btn.disabled = true;

            const proposal = {
                client: document.getElementById('client-name').value,
                type: document.getElementById('project-type').value,
                budget: document.getElementById('budget').value,
                requirements: document.getElementById('requirements').value,
                timestamp: new Date().toISOString(),
                status: 'PENDING'
            };

            const success = await submitBuildRequest(proposal);

            if (success) {
                status.style.display = 'block';
                status.style.background = 'var(--bg-green)';
                status.textContent = '✅ PROPOSAL_LOCKED_IN. I WILL REVIEW AND REACH OUT.';
                buildForm.style.display = 'none';
            } else {
                status.style.display = 'block';
                status.style.background = 'var(--bg-magenta)';
                status.style.color = 'white';
                status.textContent = '❌ ERROR: SYSTEM_OFFLINE. EMAIL ME DIRECTLY.';
                btn.disabled = false;
                btn.textContent = 'RETRY_UPLOAD.EXE';
            }
        });
    }

    // Init project detail if on that page
    if (document.getElementById('project-title')) {
        initProjectDetail();
    }
});

// ─── Visit Tracking ──────────────────────────
const VISIT_COUNT_KEY = 'portfolio_visit_count';
const SESSION_TRACKED_KEY = 'portfolio_session_tracked';

async function trackVisit() {
    if (sessionStorage.getItem(SESSION_TRACKED_KEY)) {
        return parseInt(localStorage.getItem(VISIT_COUNT_KEY)) || 0;
    }
    let count = parseInt(localStorage.getItem(VISIT_COUNT_KEY)) || 0;
    count++;
    localStorage.setItem(VISIT_COUNT_KEY, count);
    sessionStorage.setItem(SESSION_TRACKED_KEY, 'true');
    console.log(`SYSTEM_LOG: NEW_VISIT [TOTAL: ${count}]`);
    return count;
}

// ─── Admin Dashboard ─────────────────────────
async function initAdminDashboard() {
    const totalVisitsEl = document.getElementById('total-visits');
    const visits = localStorage.getItem(VISIT_COUNT_KEY) || 0;
    if (totalVisitsEl) totalVisitsEl.textContent = visits;
    startLiveLog();

    const mockProposals = [
        { id: '1', client: 'TECH_GURU_INC', type: 'data-science', budget: '$5,000', requirements: 'Predictive analytics for customer churn using LSTM models.', status: 'PENDING' },
        { id: '2', client: 'STARTUP_X', type: 'app-dev', budget: '$2,500', requirements: 'MVP for a niche social network focused on Mizo culture.', status: 'ACCEPTED' }
    ];
    renderProposals(mockProposals);
}

function startLiveLog() {
    const logContainer = document.getElementById('log-container');
    if (!logContainer) return;

    const events = [
        'INCOMING_TRAFFIC: [UID_4829] CONNECTED VIA_GITHUB',
        'SYSTEM_CHECK: CORE_MODULES_STABLE',
        'DATABASE_STATUS: CLOUD_SYNC_ACTIVE',
        'TRAFFIC_SOURCE: SEARCH_ENGINE_REFERRAL',
        'NETWORK_SIGNAL: ENCRYPTED_HANDSHAKE_COMPLETE',
        'SECURITY_SCAN: NO_THREATS_DETECTED',
        'VISITOR_LOCALE: EN-US [LATENCY: 42MS]',
        'CACHE_HIT: PROJECT_MEDIA_ASSETS',
        'UPTIME: 24H 42M 15S'
    ];

    setInterval(() => {
        const event = events[Math.floor(Math.random() * events.length)];
        const time = new Date().toLocaleTimeString();
        const line = document.createElement('div');
        line.className = 'log-line';
        line.textContent = `[${time}] ${event}`;
        logContainer.prepend(line);
        if (logContainer.children.length > 20) {
            logContainer.removeChild(logContainer.lastChild);
        }
    }, 3000);
}

function renderProposals(proposals) {
    const list = document.getElementById('proposals-list');
    if (!list) return;
    list.innerHTML = '';

    proposals.forEach(p => {
        const card = document.createElement('div');
        card.className = `window proposal-card ${p.status.toLowerCase()}`;
        card.innerHTML = `
            <div class="window-header">
                <span class="window-title">PROPOSAL_ID_${p.id}.JSON</span>
            </div>
            <div class="window-content">
                <div class="proposal-meta">
                    <span>CLIENT: ${p.client}</span>
                    <span>TYPE: ${p.type.toUpperCase()}</span>
                </div>
                <div class="proposal-details">
                    <h3>REQUEST: ${p.budget}</h3>
                    <p>${p.requirements}</p>
                    <div class="status-badge">STATUS: ${p.status}</div>
                </div>
                <div class="admin-actions">
                    <button class="admin-btn btn-accept" onclick="updateProposalStatus('${p.id}', 'ACCEPTED')">ACCEPT</button>
                    <button class="admin-btn btn-decline" onclick="updateProposalStatus('${p.id}', 'DECLINED')">DECLINE</button>
                </div>
            </div>
        `;
        list.appendChild(card);
    });
}

window.updateProposalStatus = (id, status) => {
    console.log(`BUILD_ENGINE: UPDATING_STATUS [${id}] -> ${status}`);
    alert(`PROPOSAL [${id}] MARKED AS ${status}`);
    document.querySelectorAll('.proposal-card').forEach(card => {
        if (card.querySelector('.window-title').textContent.includes(id)) {
            card.className = `window proposal-card ${status.toLowerCase()}`;
            card.querySelector('.status-badge').textContent = `STATUS: ${status}`;
        }
    });
};

async function submitBuildRequest(proposal) {
    console.log('BUILD_ENGINE: UPLOADING_PROPOSAL...', proposal);
    return new Promise(resolve => setTimeout(() => resolve(true), 1500));
}

console.log('LARSSON_PORTFOLIO: SYSTEM_INITIALIZED 🚀');
