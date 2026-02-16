// Custom Cursor
const cursor = document.querySelector('.cursor');

document.addEventListener('mousemove', (e) => {
    if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
});

// Interactive boxes parralax-ish
document.addEventListener('mousemove', (e) => {
    const boxes = document.querySelectorAll('.floating-box');
    const x = (window.innerWidth / 2 - e.pageX) / 50;
    const y = (window.innerHeight / 2 - e.pageY) / 50;

    boxes.forEach((box, index) => {
        const factor = (index + 1) * 0.3;
        box.style.transform = `translate(${x * factor}px, ${y * factor}px) rotate(${index * 3 - 5}deg)`;
    });
});

// Click ripple/effect? Let's just do a simple button feedback
const buttons = document.querySelectorAll('button, .btn-yellow, .btn-green, .btn-blue, .btn-magenta');

buttons.forEach(btn => {
    btn.addEventListener('mousedown', () => {
        btn.style.transform = 'translate(4px, 4px)';
        btn.style.boxShadow = '2px 2px 0px black';
    });

    btn.addEventListener('mouseup', () => {
        btn.style.transform = 'translate(0px, 0px)';
        btn.style.boxShadow = '6px 6px 0px black';
    });
});

// Scroll Reveal
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.project-card, .about-text').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(50px)';
    el.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    observer.observe(el);
});

// Project Data for Detail Pages
const projectsData = {
    'ila': {
        title: 'ILA COMMUNITY',
        windowTitle: 'ILA_COMMUNITY.APK',
        image: 'Reason party 2.jpg',
        description: 'ILA Community is a dedicated event management and engagement platform designed for the Mizo community. It serves as a central hub for cultural events, local news, and community support systems.',
        tags: ['#REACT_NATIVE', '#FIREBASE', '#RAZORPAY'],
        features: [
            'Real-time event notification system',
            'Secure payment integration via Razorpay',
            'Interactive location tagging with Leaflet Maps',
            'User profiles with tiered permissions',
            'Community-led event moderation'
        ],
        technical: 'Built using React Native for cross-platform efficiency. The backend leverages Firebase Realtime Database for instant synchronization across devices. Payments are handled via OAuth-secured Razorpay hooks, and geographical data is visualized using the Leaflet.js ecosystem.',
        screenshots: [],
        apk: '#'
    },
    'anatomypro': {
        title: 'NOVA',
        windowTitle: 'NOVA.EXE',
        image: 'anatomy_pulse.png',
        description: 'AnatomyPro transforms habit tracking into a visual journey. By mapping daily disciplines to a digital anatomy model, users can literally see their "growth" as different muscle groups and organs glow or change color based on session consistency.',
        tags: ['#SVG_ANIMATION', '#HABIT_TECH', '#TSX'],
        features: [
            'Interactive SVG anatomy model with dynamic tinting',
            'Custom goal-to-bodypart mapping algorithm',
            'Real-time analytics for physical habit consistency',
            'Secure local storage for privacy-first tracking',
            'Custom positioning tool for precise overlay alignment'
        ],
        technical: 'The core engine uses React Native Skia for high-performance SVG manipulation. A custom coordinate mapping system ensures overlays align perfectly across different screen aspects. State management is handled through a combination of Context API and persistent local storage.',
        screenshots: ['anatomy_pulse.png', 'anatomy_full.png'],
        apk: '#'
    },
    'spam-remover': {
        title: 'GMAIL SPAM REMOVER',
        windowTitle: 'GMAIL_SPAM_REMOVER.PY',
        image: 'Reason party 2.jpg',
        description: 'A professional-grade inbox hygiene tool that applies corporate-level security filters to personal Gmail accounts. It identifies and segregates sophisticated phishing and marketing spam that standard filters often miss.',
        tags: ['#MACHINE_LEARNING', '#SCIKIT_LEARN', '#OAUTH2'],
        features: [
            'Multinomial Naive Bayes classification engine',
            'Secure Google OAuth 2.0 authentication flow',
            'Real-time scanning of unread messages via Gmail API',
            'Automated batch organization (Trash/Spam folders)',
            'Custom model serialization for rapid cold-start classification'
        ],
        technical: 'The system uses a Scikit-Learn pipeline for text vectorization (CountVectorizer) and classification. It processes data locally to ensure user privacy, interacting with the Gmail API via the Google Auth Python library. The model is trained on integrated public and private datasets for maximum hit rate.',
        screenshots: [],
        apk: '#'
    },
    'inbawk': {
        title: 'INBAWK CARDS',
        windowTitle: 'INBAWK_CARDS.APK',
        image: 'inbawk_board.png',
        description: 'INBAWK brings the high-stakes atmosphere of a professional card room to mobile. It is designed for the Mizo community to enjoy classic and custom card games in a premium, real-time environment.',
        tags: ['#GAMING', '#REALTIME_SYNC', '#LANDSCAPE_UI'],
        features: [
            'Real-time multiplayer lobbies with 100ms latency',
            'Intelligent AI bots for solo play modes',
            'Premium Casino aesthetic with custom asset shaders',
            'Cross-platform account synchronization via Firebase',
            'In-game chat and community features'
        ],
        technical: 'Built on Expo with a heavy focus on landscape UI stability. The real-time synchronization is achieved through Firebase Realtime Database listener trees, ensuring all players see moves simultaneously. Custom character assets are dynamically loaded and tinted to reduce bundle size.',
        screenshots: ['inbawk_board.png'],
        apk: '#'
    }
};

function initProjectDetail() {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('id');
    const project = projectsData[projectId];

    if (!project) {
        document.getElementById('project-title').textContent = 'PROJECT_NOT_FOUND.ERR';
        return;
    }

    // Load simple fields
    document.getElementById('window-title').textContent = project.windowTitle;
    document.getElementById('project-title').textContent = project.title;
    document.getElementById('project-hero-img').src = project.image;
    document.getElementById('project-desc-text').textContent = project.description;

    // Load Technical Details
    document.getElementById('technical-details').textContent = project.technical || 'Detailed technical architecture coming soon.';

    // Load Features
    const featuresList = document.getElementById('project-features');
    if (project.features) {
        project.features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            featuresList.appendChild(li);
        });
    }

    // Load Tags
    const tagsContainer = document.getElementById('project-tags');
    project.tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = tag;
        tagsContainer.appendChild(span);
    });

    // Load Screenshots
    const gallery = document.getElementById('project-gallery');
    project.screenshots.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Screenshot';
        gallery.appendChild(img);
    });

    // APK Section
    if (project.apk && project.apk !== '#') {
        document.getElementById('apk-section').style.display = 'block';
        document.getElementById('apk-link').href = project.apk;
    }
}

console.log('DATA_SCIENCE_SUITE_INITIALIZED');
