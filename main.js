/* ════════════════════════════════════════════
   LARSSON PORTFOLIO — MAIN JS
   ════════════════════════════════════════════ */

import { db, auth, googleProvider } from './firebase-config.js';
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { signInWithPopup } from "firebase/auth";

// ─── Constants & State ───────────────────────
const VISIT_COUNT_KEY = 'portfolio_visit_count';
const SESSION_TRACKED_KEY = 'portfolio_session_tracked';

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
        apk: 'apk/nova.apk'
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

// ─── UI Utilities ────────────────────────────

// 1. Custom Cursor
const cursor = document.querySelector('.cursor');
const cursorTrail = document.querySelector('.cursor-trail');
let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

function initCursor() {
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (cursor) {
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        }
    });

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

    document.querySelectorAll('a, button, .tech-item, .project-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursor) {
                cursor.style.width = '22px'; cursor.style.height = '22px';
                cursor.style.background = 'var(--bg-yellow)';
            }
        });
        el.addEventListener('mouseleave', () => {
            if (cursor) {
                cursor.style.width = '14px'; cursor.style.height = '14px';
                cursor.style.background = 'var(--bg-magenta)';
            }
        });
    });
}

// 2. Scroll Reveal
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const parent = entry.target.parentElement;
            const siblings = parent ? parent.querySelectorAll('.reveal') : [entry.target];
            let delay = 0;
            siblings.forEach((sib, i) => { if (sib === entry.target) delay = i * 80; });
            setTimeout(() => { if (entry.target) entry.target.classList.add('visible'); }, delay);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

function initReveal() {
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    // Failsafe
    setTimeout(() => {
        document.querySelectorAll('.reveal:not(.visible)').forEach(el => el.classList.add('visible'));
    }, 2000);
}

// 3. Interaction Effects
function initInteractions() {
    // Parallax
    document.addEventListener('mousemove', (e) => {
        const boxes = document.querySelectorAll('.floating-box');
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const dx = (cx - e.clientX) / 55;
        const dy = (cy - e.clientY) / 55;
        boxes.forEach((box, i) => {
            const f = (i + 1) * 0.35;
            box.style.transform = `translate(${dx * f}px, ${dy * f}px) rotate(${i * 3 - 5}deg)`;
        });
    });

    // Stickers
    document.querySelectorAll('.sticker').forEach(sticker => {
        sticker.addEventListener('mousemove', (e) => {
            const rect = sticker.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const rx = (e.clientY - cy) / 5;
            const ry = -(e.clientX - cx) / 5;
            sticker.style.transform = `perspective(300px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.1)`;
        });
        sticker.addEventListener('mouseleave', () => sticker.style.transform = '');
    });

    // Nav
    const hamburger = document.getElementById('hamburger');
    const nav = document.querySelector('nav');
    if (hamburger && nav) {
        hamburger.addEventListener('click', () => nav.classList.toggle('open'));
        nav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => nav.classList.remove('open'));
        });
    }
}

// ─── Core Logic ──────────────────────────────

async function trackVisit() {
    if (sessionStorage.getItem(SESSION_TRACKED_KEY)) return;
    let count = parseInt(localStorage.getItem(VISIT_COUNT_KEY)) || 0;
    count++;
    localStorage.setItem(VISIT_COUNT_KEY, count);
    sessionStorage.setItem(SESSION_TRACKED_KEY, 'true');
    console.log('SYSTEM_LOG: VISIT_RECORDED');
}

window.initProjectDetail = async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');
    const project = projectsData[projectId];
    if (!project) return;

    window.currentProject = project;
    window.currentProjectId = projectId;

    const map = {
        'project-title': project.title,
        'project-desc-text': project.description,
        'info-platform': project.platform,
        'info-type': project.type,
        'info-stack': project.stack,
        'project-tagline': project.tagline,
        'window-title': project.windowTitle
    };

    for (let id in map) {
        const el = document.getElementById(id);
        if (el) el.textContent = map[id];
    }

    const heroImg = document.getElementById('project-hero-img');
    if (heroImg) heroImg.src = project.image;

    const githubLink = document.getElementById('btn-github');
    if (githubLink) githubLink.href = project.github;

    // Lists
    const features = document.getElementById('project-features');
    if (features && project.features) {
        features.innerHTML = project.features.map(f => `<li>${f}</li>`).join('');
    }

    const tags = document.getElementById('project-tags');
    if (tags && project.tags) {
        tags.innerHTML = project.tags.map(t => `<span class="tech-tag">${t}</span>`).join('');
    }

    const gallery = document.getElementById('project-gallery');
    if (gallery && project.screenshots) {
        gallery.innerHTML = project.screenshots.map(s => {
            const src = typeof s === 'string' ? s : s.src;
            return `<img src="${src}" loading="lazy">`;
        }).join('');
    }

    if (window.lucide) lucide.createIcons();
    initProjectListeners();
};

function initProjectListeners() {
    const modal = document.getElementById('download-modal');
    const trigger = document.getElementById('btn-download-trigger');
    const closer = document.getElementById('close-modal');
    const signin = document.getElementById('google-signin-btn');
    const authStatus = document.getElementById('auth-status');
    const feedbackForm = document.getElementById('feedback-form');

    if (trigger && modal) trigger.addEventListener('click', () => modal.style.display = 'flex');
    if (closer && modal) closer.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

    if (signin) {
        signin.addEventListener('click', async () => {
            signin.disabled = true;
            if (authStatus) { authStatus.style.display = 'block'; authStatus.textContent = 'AUTHORIZING...'; }
            try {
                const result = await signInWithPopup(auth, googleProvider);
                await addDoc(collection(db, "downloads"), {
                    projectId: window.currentProjectId,
                    projectName: window.currentProject.title,
                    userName: result.user.displayName,
                    userEmail: result.user.email,
                    timestamp: serverTimestamp(),
                    verified: true
                });
                if (authStatus) authStatus.textContent = 'ACCESS_GRANTED. DOWNLOADING...';
                if (window.currentProject.apk && window.currentProject.apk !== '#') {
                    window.location.href = window.currentProject.apk;
                }
            } catch (e) {
                if (authStatus) authStatus.textContent = 'ERROR: ' + e.message;
                signin.disabled = false;
            }
        });
    }

    if (feedbackForm) {
        feedbackForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = feedbackForm.querySelector('button');
            const status = document.getElementById('feedback-status');
            btn.disabled = true;
            try {
                await addDoc(collection(db, "feedback"), {
                    projectId: window.currentProjectId,
                    projectName: window.currentProject.title,
                    text: document.getElementById('feedback-text').value,
                    timestamp: serverTimestamp()
                });
                if (status) { status.style.display = 'block'; status.textContent = 'FEEDBACK_RECEIVED!'; }
                feedbackForm.reset();
            } finally {
                btn.disabled = false;
            }
        });
    }
}

window.initAdminDashboard = async function () {
    const downloadsBody = document.getElementById('downloads-body');
    const feedbackList = document.getElementById('feedback-list');
    const diag = document.getElementById('admin-diagnostics');
    const log = (m) => { if (diag) diag.textContent = m; console.log(m); };

    log('CONNECTING...');
    try {
        const snapshot = await getDocs(collection(db, "downloads"));
        const docs = [];
        snapshot.forEach(d => docs.push(d.data()));
        docs.sort((a, b) => (b.timestamp?.toDate() || 0) - (a.timestamp?.toDate() || 0));

        if (downloadsBody) {
            downloadsBody.innerHTML = docs.map(d => `
                <tr>
                    <td>${d.projectName || '—'}</td>
                    <td>${d.userName || '—'}</td>
                    <td>${d.userEmail || '—'}</td>
                    <td>${d.verified ? '[VERIFIED]' : '[MANUAL]'}</td>
                    <td>${d.timestamp ? d.timestamp.toDate().toLocaleString() : '—'}</td>
                </tr>
            `).join('') || '<tr><td colspan="5">NO_DATA</td></tr>';
        }

        const feedbackSnap = await getDocs(collection(db, "feedback"));
        if (feedbackList) {
            feedbackList.innerHTML = '';
            feedbackSnap.forEach(doc => {
                const data = doc.data();
                feedbackList.innerHTML += `<div class="feedback-entry">${data.projectName}: ${data.text}</div>`;
            });
        }
        log('COMPLETE');
    } catch (e) {
        log('ERROR: ' + e.message);
    }
};

// ─── Start ───────────────────────────────────

console.log('LARSSON_MODULE: BOOTING...');

initCursor();
initInteractions();
trackVisit();
initReveal();

if (document.getElementById('proposals-list')) window.initAdminDashboard();
if (document.getElementById('project-title')) window.initProjectDetail();

const buildForm = document.getElementById('build-form');
if (buildForm) {
    buildForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const status = document.getElementById('status-msg');
        if (status) { status.style.display = 'block'; status.textContent = 'PROPOSAL_LOCKED_IN!'; }
        buildForm.reset();
    });
}
