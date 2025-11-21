

// ==================== CONFIGURATION ====================
const CONFIG = {
    GEMINI_API_KEY: 'AIzaSyBEzYCEN0Jhel3WjG_08iraY5NLKMgnrHg',
    GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    APP_VERSION: '2.0.1',
    API_TIMEOUT: 30000,
    MAX_FILE_SIZE: 5242880,
    SUPPORTED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
};

// ==================== GLOBAL STATE ====================
const STATE = {
    currentUser: {
        id: null,
        name: 'Guest User',
        email: 'guest@nagarik.gov.np',
        photo: null,
        isLoggedIn: false,
        profile: {}
    },
    currentTab: 'dashboard',
    currentQuery: '',
    selectedLanguage: 'english',
    isDarkMode: false,
    isVoiceMode: false,
    recognition: null,
    cameraStream: null,
    notifications: [],
    chatHistory: []
};

// ==================== INITIALIZATION ====================
// Global JS error catcher to help debugging when the page appears blank
window.addEventListener('error', function(event) {
    console.error('Global error caught:', event.error || event.message);
    showErrorOverlay(event.message || (event.error && event.error.toString()) || 'Unknown error');
});

window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    showErrorOverlay(event.reason && (event.reason.stack || event.reason.message) || String(event.reason));
});

function showErrorOverlay(msg) {
    let overlay = document.getElementById('jsErrorOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'jsErrorOverlay';
        overlay.style.position = 'fixed';
        overlay.style.inset = '2';
       
        overlay.style.color = 'white';
        overlay.style.zIndex = '99999';
        overlay.style.padding = '2rem';
        overlay.style.overflow = 'auto';
        overlay.innerHTML = ``;
        document.body.appendChild(overlay);
        document.getElementById('jsErrorClose').addEventListener('click', function() {
            overlay.remove();
        });
    } else {
        const content = document.getElementById('jsErrorContent');
        if (content) content.textContent = String(msg);
        overlay.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    // Allow bypass for local testing: use URL hash `#noauth`, set localStorage `bypassLogin` to 'true',
    // or open the file directly (file:// protocol) which is common when running from the filesystem.
    const bypassAuth = location.hash.includes('noauth') || localStorage.getItem('bypassLogin') === 'true' || location.protocol === 'file:';
    if (!isLoggedIn && !bypassAuth) {
        window.location.href = 'login.html';
        return;
    } else if (!isLoggedIn && bypassAuth) {
        console.warn('Bypassing auth for local testing (no logged-in user).');
        // Provide a demo user so the UI shows meaningful data while testing locally.
        STATE.currentUser = {
            id: 'demo',
            name: 'Demo User',
            email: 'demo@example.com',
            photo: null,
            isLoggedIn: true,
            profile: {
                fullNameEn: 'Demo User',
                fullNameNp: 'डेमो प्रयोगकर्ता',
                nationalId: 'NP-DEMO-0001'
            }
        };
        // Inform the user via toast (if available)
        setTimeout(() => {
            if (typeof showToast === 'function') showToast('Local test mode: dashboard loaded (no login required)');
        }, 300);
    }
    
    showLoadingScreen();
    // Give app 1 second to initialize
    setTimeout(() => {
        initializeApp();
        hideLoadingScreen();
    }, 1000);
});

function initializeApp() {
    try {
        console.log('🇳🇵 Nepal e-Governance Platform v' + CONFIG.APP_VERSION);
        
        // Load theme first
        loadTheme();
        
        // Load user profile from localStorage
        loadUserProfile();
        maybePromptProfileSetup();
        updateWelcomeMessage();
        
        // Load language preference and set indicator
        const savedLanguage = localStorage.getItem('appLanguage') || 'english';
        if (typeof setAppLanguage === 'function') {
            console.debug('[init] setting app language to', savedLanguage);
            setAppLanguage(savedLanguage);
        }
        // Initialize language indicator in header
        if (typeof updateLanguageIndicator === 'function') updateLanguageIndicator();
        
        // Parallel initialization without blocking
        populateAllContent();
        setupSettingsNavigation();
        initializeVoiceRecognition();
        initializeNotifications();
        loadAnalyticsChart();

            // Ensure dynamic tabs/content are pre-populated so they appear ready
            // the first time user opens them (fixes issue where content only
            // appears after manual language toggle)
            if (typeof ensureTabsPrepopulated === 'function') ensureTabsPrepopulated();
        
        // Skip service worker for faster loading
        // initializeServiceWorker();
        
        // Skip auto profile setup - let user click to set up profile
        // Users can click profile setup button in sidebar if needed
        
        animateCounters();
        // Re-apply language to ensure dynamic content and translations are in sync
        try {
            const lang = (typeof getCurrentLanguage === 'function') ? getCurrentLanguage() : (localStorage.getItem('appLanguage') || 'english');
            if (typeof setAppLanguage === 'function') setAppLanguage(lang);
            if (typeof populateAllContent === 'function') populateAllContent();
            if (typeof updateLanguageIndicator === 'function') updateLanguageIndicator();
        } catch (e) {
            console.warn('Language re-apply during init failed:', e);
        }

        console.log('✅ System initialized successfully');
    } catch (error) {
        console.error('❌ Initialization error:', error);
        // Still hide loading screen even if there's an error
        hideLoadingScreen();
    }
}

// ==================== LOADING SCREEN ====================
function showLoadingScreen() {
    const screen = document.getElementById('loadingScreen');
    if (screen) screen.classList.remove('hidden');
}

function hideLoadingScreen() {
    const screen = document.getElementById('loadingScreen');
    if (screen) screen.classList.add('hidden');
}

// ==================== PROFILE SETUP ====================
let currentStep = 1;
const totalSteps = 4;

function showProfileSetup() {
    document.getElementById('profileSetupModal').classList.remove('hidden');
}

function closeProfileSetup() {
    document.getElementById('profileSetupModal').classList.add('hidden');
}

function nextStep() {
    if (currentStep < totalSteps) {
        if (!validateStep(currentStep)) {
            showToast('Please fill all required fields', 'error');
            return;
        }
        currentStep++;
        updateProfileSetupStep();
    } else {
        saveProfile();
    }
}

function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        updateProfileSetupStep();
    }
}

function updateProfileSetupStep() {
    document.querySelectorAll('.profile-setup-step').forEach(step => {
        step.classList.remove('active');
    });
    
    document.querySelector(`.profile-setup-step[data-step="${currentStep}"]`).classList.add('active');
    
    document.querySelectorAll('.step-dot').forEach((dot, index) => {
        if (index < currentStep) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
    
    document.getElementById('prevBtn').disabled = currentStep === 1;
    
    const nextBtn = document.getElementById('nextBtn');
    if (currentStep === totalSteps) {
        nextBtn.innerHTML = '<i class="fas fa-check"></i> Complete Setup';
    } else {
        nextBtn.innerHTML = 'Next <i class="fas fa-arrow-right"></i>';
    }
}

function validateStep(step) {
    switch(step) {
        case 1:
            return document.getElementById('fullNameEn').value &&
                   document.getElementById('fullNameNp').value &&
                   document.getElementById('dob').value &&
                   document.getElementById('gender').value &&
                   document.getElementById('mobile').value;
        case 2:
            return true;
        case 3:
            return document.getElementById('province').value &&
                   document.getElementById('district').value &&
                   document.getElementById('municipality').value &&
                   document.getElementById('ward').value;
        case 4:
            return true;
        default:
            return true;
    }
}

function saveProfile() {
    const profile = {
        fullNameEn: (document.getElementById('fullNameEn') && document.getElementById('fullNameEn').value) || '',
        fullNameNp: (document.getElementById('fullNameNp') && document.getElementById('fullNameNp').value) || '',
        dob: (document.getElementById('dob') && document.getElementById('dob').value) || '',
        gender: (document.getElementById('gender') && document.getElementById('gender').value) || '',
        bloodGroup: (document.getElementById('bloodGroup') && document.getElementById('bloodGroup').value) || '',
        mobile: (document.getElementById('mobile') && document.getElementById('mobile').value) || '',
        province: (document.getElementById('province') && document.getElementById('province').value) || '',
        district: (document.getElementById('district') && document.getElementById('district').value) || '',
        municipality: (document.getElementById('municipality') && document.getElementById('municipality').value) || '',
        ward: (document.getElementById('ward') && document.getElementById('ward').value) || '',
        tole: (document.getElementById('tole') && document.getElementById('tole').value) || '',
        citizenshipNo: (document.getElementById('citizenshipNo') && document.getElementById('citizenshipNo').value) || '',
        passportNo: (document.getElementById('passportNo') && document.getElementById('passportNo').value) || '',
        nationalId: 'NP-' + Date.now().toString().slice(-8)
    };

    STATE.currentUser.profile = profile;
    STATE.currentUser.name = profile.fullNameEn || STATE.currentUser.name;
    STATE.currentUser.isLoggedIn = true;

    localStorage.setItem('userProfile', JSON.stringify(profile));
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('profileCompleted', String(isProfileComplete(profile)));

    updateProfileDisplay();
    closeProfileSetup();
    showToast('Profile setup completed successfully! 🎉');

    currentStep = 1;
    updateProfileSetupStep();
}

function updateProfileDisplay() {
    const profile = STATE.currentUser.profile;
    
    const headerName = document.getElementById('headerUserName');
    if (headerName) headerName.textContent = STATE.currentUser.name;
    const dashName = document.getElementById('dashUserName');
    if (dashName) dashName.textContent = STATE.currentUser.name;
    const menuName = document.getElementById('menuUserName');
    if (menuName) menuName.textContent = STATE.currentUser.name;
    const menuEmail = document.getElementById('menuUserEmail');
    if (menuEmail) menuEmail.textContent = STATE.currentUser.email;
    
    const initials = STATE.currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    document.querySelectorAll('.user-avatar, .menu-avatar').forEach(el => {
        el.textContent = initials;
    });
    
    const profileName = document.getElementById('profileFullName');
    if (profileName) profileName.textContent = STATE.currentUser.name;
    const profileId = document.getElementById('profileNationalId');
    if (profileId) profileId.textContent = profile.nationalId || 'NP-xxxx-xxxx';
    
    const infoFullName = document.getElementById('infoFullName');
    if (infoFullName) infoFullName.textContent = profile.fullNameEn || '-';
    const infoFullNameNp = document.getElementById('infoFullNameNp');
    if (infoFullNameNp) infoFullNameNp.textContent = profile.fullNameNp || '-';
    const infoDob = document.getElementById('infoDob');
    if (infoDob) infoDob.textContent = profile.dob || '-';
    const infoGender = document.getElementById('infoGender');
    if (infoGender) infoGender.textContent = profile.gender || '-';
    const infoBlood = document.getElementById('infoBloodGroup');
    if (infoBlood) infoBlood.textContent = profile.bloodGroup || '-';
    const infoCitizenship = document.getElementById('infoCitizenship');
    if (infoCitizenship) infoCitizenship.textContent = profile.citizenshipNo || '-';
    const infoProvince = document.getElementById('infoProvince');
    if (infoProvince) infoProvince.textContent = getProvinceName(profile.province) || '-';
    const infoDistrict = document.getElementById('infoDistrict');
    if (infoDistrict) infoDistrict.textContent = profile.district || '-';
    const infoMunicipality = document.getElementById('infoMunicipality');
    if (infoMunicipality) infoMunicipality.textContent = profile.municipality || '-';
    const infoWard = document.getElementById('infoWard');
    if (infoWard) infoWard.textContent = profile.ward || '-';
    
    const infoAddress = document.getElementById('infoFullAddress');
    if (infoAddress) {
        const provinceName = getProvinceName(profile.province) || '';
        const wardText = profile.ward ? `Ward ${profile.ward}` : '';
        const parts = [profile.municipality, wardText, profile.district, provinceName].filter(Boolean);
        infoAddress.textContent = parts.length ? parts.join(', ') : '-';
    }

    updateWelcomeMessage();
}

function updateWelcomeMessage() {
    const welcomeEl = document.querySelector('[data-i18n="dashboard_welcome"]');
    if (!welcomeEl) return;
    const lang = (typeof getCurrentLanguage === 'function') ? getCurrentLanguage() : (localStorage.getItem('appLanguage') || 'english');
    const template = (typeof getTranslation === 'function') ? getTranslation('dashboard_welcome', lang) : 'Welcome back, {name}! 👋';
    const displayName = (STATE?.currentUser?.name && STATE.currentUser.name.trim()) || 'Citizen';
    welcomeEl.textContent = template.replace('{name}', displayName);
}

function loadUserProfile() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userData = localStorage.getItem('user');
    const savedProfile = localStorage.getItem('userProfile');
    
    // Load from new login system (user data stored from login.html)
    if (userData && isLoggedIn === 'true') {
        try {
            const user = JSON.parse(userData);
            STATE.currentUser.id = user.id;
            STATE.currentUser.name = user.name;
            STATE.currentUser.email = user.email;
            STATE.currentUser.photo = user.photo;
            STATE.currentUser.isLoggedIn = true;
            if (user.profile && Object.keys(user.profile).length > 0) {
                STATE.currentUser.profile = user.profile;
            }
        } catch (e) {
            console.error('Error loading user data:', e);
        }
    }
    
    // Load extended profile if available
    if (savedProfile) {
        try {
            const profile = JSON.parse(savedProfile);
            STATE.currentUser.profile = { ...STATE.currentUser.profile, ...profile };
        } catch (e) {
            console.error('Error loading profile:', e);
        }
    }
    
    // Update display if user is logged in
    if (STATE.currentUser.isLoggedIn) {
        updateProfileDisplay();
    }

    if (isProfileComplete(STATE.currentUser.profile)) {
        localStorage.setItem('profileCompleted', 'true');
    } else {
        localStorage.removeItem('profileCompleted');
    }
}

function isProfileComplete(profile = {}) {
    const requiredFields = [
        'fullNameEn',
        'fullNameNp',
        'dob',
        'gender',
        'mobile',
        'province',
        'district',
        'municipality',
        'ward'
    ];
    return requiredFields.every(field => Boolean(profile[field]));
}

function maybePromptProfileSetup() {
    const profileCompletedFlag = localStorage.getItem('profileCompleted') === 'true';
    if (!profileCompletedFlag || !isProfileComplete(STATE.currentUser.profile)) {
        setTimeout(() => {
            showProfileSetup();
            updateProfileSetupStep();
        }, 400);
    }
}

// ==================== PHOTO UPLOAD ====================
const photoInput = document.getElementById('profilePhoto');
if (photoInput) {
    photoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            if (!CONFIG.SUPPORTED_FILE_TYPES.includes(file.type)) {
                showToast('Please select a valid image file', 'error');
                return;
            }
            if (file.size > CONFIG.MAX_FILE_SIZE) {
                showToast('File size must be less than 5MB', 'error');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const photoPreview = document.getElementById('photoPreview');
                photoPreview.innerHTML = `<img src="${e.target.result}" alt="Profile">`;
                STATE.currentUser.photo = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
}

function capturePhoto() {
    document.getElementById('cameraModal').classList.remove('hidden');
    startCamera();
}

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'user' } 
        });
        const video = document.getElementById('cameraVideo');
        video.srcObject = stream;
        STATE.cameraStream = stream;
    } catch (error) {
        console.error('Camera error:', error);
        showToast('Could not access camera', 'error');
        closeCameraModal();
    }
}

function capturePhotoNow() {
    const video = document.getElementById('cameraVideo');
    const canvas = document.getElementById('cameraCanvas');
    const context = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);
    
    const photoData = canvas.toDataURL('image/jpeg');
    const photoPreview = document.getElementById('photoPreview');
    photoPreview.innerHTML = `<img src="${photoData}" alt="Profile">`;
    STATE.currentUser.photo = photoData;
    
    closeCameraModal();
    showToast('Photo captured successfully!');
}

function closeCameraModal() {
    if (STATE.cameraStream) {
        STATE.cameraStream.getTracks().forEach(track => track.stop());
        STATE.cameraStream = null;
    }
    document.getElementById('cameraModal').classList.add('hidden');
}

// ==================== ADDRESS DATA ====================
function getProvinceName(id) {
    const provinces = {
        '1': 'Koshi Pradesh',
        '2': 'Madhesh Pradesh',
        '3': 'Bagmati Pradesh',
        '4': 'Gandaki Pradesh',
        '5': 'Lumbini Pradesh',
        '6': 'Karnali Pradesh',
        '7': 'Sudurpashchim Pradesh'
    };
    return provinces[id];
}

const DISTRICTS_BY_PROVINCE = {
    '1': ['Morang', 'Sunsari', 'Jhapa', 'Ilam'],
    '2': ['Dhanusha', 'Siraha', 'Saptari', 'Mahottari'],
    '3': ['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Kavrepalanchok', 'Dhading'],
    '4': ['Kaski', 'Lamjung', 'Tanahu', 'Syangja'],
    '5': ['Rupandehi', 'Kapilvastu', 'Nawalparasi', 'Palpa'],
    '6': ['Surkhet', 'Dailekh', 'Jajarkot', 'Salyan'],
    '7': ['Kailali', 'Kanchanpur', 'Doti', 'Dadeldhura']
};

const MUNICIPALITIES_BY_DISTRICT = {
    // Bagmati
    'Kathmandu': ['Kathmandu Metropolitan City', 'Budhanilkantha', 'Chandragiri', 'Dakshinkali', 'Gokarneshwar'],
    'Lalitpur': ['Lalitpur Metropolitan City', 'Mahalaxmi', 'Godawari'],
    'Bhaktapur': ['Bhaktapur Municipality', 'Changunarayan', 'Madhyapur Thimi'],
    'Kavrepalanchok': ['Banepa', 'Dhulikhel', 'Panauti', 'Namobuddha'],
    'Dhading': ['Nilkantha', 'Khaniyabas', 'Gajuri', 'Jwalamukhi'],
    // Koshi
    'Morang': ['Biratnagar', 'Urlabari', 'Letang', 'Sundar Haraicha'],
    'Sunsari': ['Dharan', 'Inaruwa', 'Itahari', 'Duhabi'],
    'Jhapa': ['Birtamod', 'Damak', 'Mechinagar', 'Kankai'],
    'Ilam': ['Ilam Municipality', 'Deumai', 'Sandakpur'],
    // Madhesh
    'Dhanusha': ['Janakpurdham', 'Chhireshwarnath', 'Ganeshman Charnath'],
    'Siraha': ['Lahan', 'Siraha Municipality', 'Mirchaiya'],
    'Saptari': ['Rajbiraj', 'Kanchanrup', 'Dakneshwori'],
    'Mahottari': ['Jaleshwar', 'Bardibas', 'Mahottari Rural'],
    // Gandaki
    'Kaski': ['Pokhara Metropolitan City', 'Annapurna', 'Machhapuchhre'],
    'Lamjung': ['Besisahar', 'Dudhpokhari', 'MadhyaNepal'],
    'Tanahu': ['Byas', 'Shuklagandaki', 'Vyas'],
    'Syangja': ['Waling', 'Galyang', 'Biruwa'],
    // Lumbini
    'Rupandehi': ['Butwal', 'Siddharthanagar', 'Devdaha'],
    'Kapilvastu': ['Kapilvastu Municipality', 'Krishnanagar', 'Buddhabhumi'],
    'Nawalparasi': ['Kawasoti', 'Ramgram', 'Bungdikali'],
    'Palpa': ['Tansen', 'Rampur', 'Nisdi'],
    // Karnali
    'Surkhet': ['Birendranagar', 'Bheriganga', 'Gurbhakot'],
    'Dailekh': ['Narayan', 'Aathbis', 'Chamunda Bindrasaini'],
    'Jajarkot': ['Bheri Municipality', 'Kuse', 'Nalgad'],
    'Salyan': ['Bagchaur', 'Shaarda', 'Bangad Kupinde'],
    // Sudurpashchim
    'Kailali': ['Dhangadhi', 'Ghodaghodi', 'Lamki Chuha'],
    'Kanchanpur': ['Bhimdatta', 'Bedkot', 'Krishnapur'],
    'Doti': ['Silgadhi', 'Dipayal', 'Shikhar'],
    'Dadeldhura': ['Amargadhi', 'Parashuram', 'Ajayameru']
};

function loadDistricts() {
    const provinceId = document.getElementById('province').value;
    const districtSelect = document.getElementById('district');
    
    districtSelect.innerHTML = '<option value="">Select District</option>';
    if (DISTRICTS_BY_PROVINCE[provinceId]) {
        DISTRICTS_BY_PROVINCE[provinceId].forEach(district => {
            districtSelect.innerHTML += `<option value="${district}">${district}</option>`;
        });
    }
    // Reset municipalities when province changes
    const municipalitySelect = document.getElementById('municipality');
    if (municipalitySelect) {
        municipalitySelect.innerHTML = '<option value="">Select Municipality</option>';
        municipalitySelect.disabled = true;
    }
}

function loadMunicipalities() {
    const district = document.getElementById('district').value;
    const municipalitySelect = document.getElementById('municipality');
    if (!municipalitySelect) return;
    
    municipalitySelect.innerHTML = '<option value="">Select Municipality</option>';
    
    if (MUNICIPALITIES_BY_DISTRICT[district]) {
        MUNICIPALITIES_BY_DISTRICT[district].forEach(mun => {
            municipalitySelect.innerHTML += `<option value="${mun}">${mun}</option>`;
        });
        municipalitySelect.disabled = false;
    } else {
        municipalitySelect.innerHTML += '<option value="">Municipality data coming soon</option>';
        municipalitySelect.disabled = true;
    }
}

// ==================== THEME MANAGEMENT ====================
function toggleTheme() {
    STATE.isDarkMode = !STATE.isDarkMode;
    applyTheme();
}

function applyTheme() {
    document.body.classList.toggle('dark-mode', STATE.isDarkMode);
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
        themeIcon.className = STATE.isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
    }
    localStorage.setItem('theme', STATE.isDarkMode ? 'dark' : 'light');
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    STATE.isDarkMode = savedTheme === 'dark';
    applyTheme();
}

// ==================== NAVIGATION ====================
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    const selectedTab = document.getElementById(tabName + '-tab');
    if (selectedTab) {
        selectedTab.classList.add('active');
        STATE.currentTab = tabName;
    }
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeBtn = Array.from(document.querySelectorAll('.nav-btn')).find(btn => 
        btn.getAttribute('onclick')?.includes(tabName)
    );
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    if (window.innerWidth < 1024) {
        document.getElementById('sidebar').classList.remove('open');
    }
    
    closeAllDropdowns();
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

// ==================== DROPDOWNS ====================
function toggleUserMenu() {
    const menu = document.getElementById('userMenu');
    menu.classList.toggle('hidden');
    closeOtherDropdowns('userMenu');
}

function toggleNotifications() {
    const panel = document.getElementById('notificationsPanel');
    panel.classList.toggle('hidden');
    closeOtherDropdowns('notificationsPanel');
    
    if (!panel.classList.contains('hidden')) {
        populateNotifications();
    }
}

function toggleLanguage() {
    const selector = document.getElementById('languageSelector');
    selector.classList.toggle('hidden');
    closeOtherDropdowns('languageSelector');
}

function closeOtherDropdowns(except) {
    ['userMenu', 'notificationsPanel', 'languageSelector'].forEach(id => {
        if (id !== except) {
            const element = document.getElementById(id);
            if (element) element.classList.add('hidden');
        }
    });
}

function closeAllDropdowns() {
    closeOtherDropdowns(null);
}

// ==================== NOTIFICATIONS ====================
function populateNotifications() {
    const notifications = [
        {
            id: 1,
            type: 'success',
            icon: 'fa-check-circle',
            title: 'Application Approved',
            message: 'Your citizenship application has been approved',
            time: '2 hours ago',
            unread: true
        },
        {
            id: 2,
            type: 'warning',
            icon: 'fa-exclamation-triangle',
            title: 'Document Expiring Soon',
            message: 'Your passport expires in 30 days',
            time: '1 day ago',
            unread: true
        },
        {
            id: 3,
            type: 'info',
            icon: 'fa-info-circle',
            title: 'New Policy Update',
            message: 'Digital signature service now available',
            time: '3 days ago',
            unread: false
        }
    ];
    
    const notificationsList = document.getElementById('notificationsList');
    if (notificationsList) {
        notificationsList.innerHTML = notifications.map(notif => `
            <div class="notification-item ${notif.unread ? 'unread' : ''}" onclick="markAsRead(${notif.id})">
                <div class="notification-icon ${notif.type}">
                    <i class="fas ${notif.icon}"></i>
                </div>
                <div class="notification-content">
                    <h4>${notif.title}</h4>
                    <p>${notif.message}</p>
                    <span class="time">${notif.time}</span>
                </div>
            </div>
        `).join('');
    }
}

function markAsRead(id) {
    showToast('Notification marked as read');
}

function markAllRead() {
    showToast('All notifications marked as read');
    populateNotifications();
}

// ==================== TOAST NOTIFICATIONS ====================
function showToast(message, type = 'success', duration = 3000) {
    const toast = document.getElementById('successToast');
    if (!toast) return;
    
    const toastMessage = document.getElementById('toastMessage');
    const icon = toast.querySelector('i');
    
    if (type === 'error') {
        icon.className = 'fas fa-exclamation-circle';
        toast.style.borderColor = '#ef4444';
    } else if (type === 'warning') {
        icon.className = 'fas fa-exclamation-triangle';
        toast.style.borderColor = '#f59e0b';
    } else {
        icon.className = 'fas fa-check-circle';
        toast.style.borderColor = '#10b981';
    }
    
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, duration);
}

// ==================== VOICE RECOGNITION ====================
function initializeVoiceRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
        STATE.recognition = new SpeechRecognition();
        STATE.recognition.continuous = false;
        STATE.recognition.interimResults = false;
        STATE.recognition.lang = 'en-US';
        
        STATE.recognition.onstart = function() {
            const voiceBtn = document.getElementById('voiceBtn');
            if (voiceBtn) {
                voiceBtn.classList.add('recording');
                voiceBtn.innerHTML = '<i class="fas fa-stop"></i>';
            }
        };
        
        STATE.recognition.onend = function() {
            const voiceBtn = document.getElementById('voiceBtn');
            if (voiceBtn) {
                voiceBtn.classList.remove('recording');
                voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            }
        };
        
        STATE.recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            const input = document.getElementById('userInput');
            if (input) input.value = transcript;
            handleVoiceCommand(transcript.toLowerCase());
        };
        
        STATE.recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            showToast('Voice recognition error. Please try again.', 'error');
        };
    }
}

function startVoiceRecognition() {
    if (STATE.recognition) {
        const voiceBtn = document.getElementById('voiceBtn');
        if (voiceBtn && voiceBtn.classList.contains('recording')) {
            STATE.recognition.stop();
        } else {
            STATE.recognition.start();
        }
    } else {
        showToast('Voice recognition not supported in your browser', 'error');
    }
}

function handleVoiceCommand(command) {
    const commands = {
        'open dashboard': 'dashboard',
        'go to dashboard': 'dashboard',
        'open services': 'services',
        'go to services': 'services',
        'open passport': 'passport',
        'passport service': 'passport',
        'open payment': 'payments',
        'pay bills': 'payments',
        'open voting': 'voting',
        'vote': 'voting',
        'open identity': 'identity',
        'digital id': 'identity',
        'open document': 'documents',
        'my documents': 'documents',
        'open profile': 'profile',
        'my profile': 'profile',
        'open settings': 'settings'
    };
    
    for (const [cmd, tab] of Object.entries(commands)) {
        if (command.includes(cmd)) {
            showTab(tab);
            showToast(`Opening ${tab}`);
            return;
        }
    }
    
    setTimeout(() => sendMessage(), 500);
}

// ==================== AI ASSISTANT ====================
function sendMessage() {
    const input = document.getElementById('userInput');
    if (!input) return;
    
    const query = input.value.trim();
    
    if (!query) {
        showToast('Please enter a message', 'warning');
        return;
    }
    
    STATE.currentQuery = query;
    addMessage(query, 'user');
    input.value = '';
    
    const modal = document.getElementById('languageModal');
    if (modal) modal.classList.remove('hidden');
}

function sendPrompt(prompt) {
    const input = document.getElementById('userInput');
    if (input) {
        input.value = prompt;
        sendMessage();
    }
}

function selectLanguage(lang) {
    STATE.selectedLanguage = lang;
    closeLanguageModal();
    addThinkingMessage();
    callGeminiAPI(STATE.currentQuery, lang);
}

// ==================== APP LANGUAGE SWITCHING ====================
function changeAppLanguage(language) {
    // Normalize language input (handles 'en'/'ne' shorthand and full names)
    const languageMap = {
        'en': 'english',
        'ne': 'nepali',
        'english': 'english',
        'nepali': 'nepali'
    };
    const lang = languageMap[language] || 'english';
    applyAppLanguage(lang);
}

// Apply language system-wide and refresh all dynamic UI
function applyAppLanguage(lang) {
    // Call the language system function (from languages.js)
    if (typeof setAppLanguage === 'function') {
        setAppLanguage(lang);
    } else {
        localStorage.setItem('appLanguage', lang);
    }
    
    // Close language selector dropdown
    const selector = document.getElementById('languageSelector');
    if (selector) selector.classList.add('hidden');
    
    // Refresh all dynamic content and UI
    setTimeout(() => {
        // Refresh dynamic lists (activity, notices, services, counters)
        if (typeof populateAllContent === 'function') populateAllContent();
        if (typeof populateRecentActivity === 'function') populateRecentActivity();
        if (typeof populateImportantNotices === 'function') populateImportantNotices();
        if (typeof populatePopularServices === 'function') populatePopularServices();
        // Update profile display in header
        if (typeof updateProfileDisplay === 'function') updateProfileDisplay();
        // Re-animate counters
        if (typeof animateCounters === 'function') animateCounters();
        // Update language indicator badge
        updateLanguageIndicator();
    }, 100);
    
    // Show notification
    if (typeof showToast === 'function') {
        showToast(lang === 'nepali' ? 'भाषा नेपालीमा परिवर्तन भयो' : 'Language changed to English');
    }
}

// Quick toggle from header (English <-> Nepali)
function toggleTopLanguage() {
    const current = (typeof getCurrentLanguage === 'function') ? getCurrentLanguage() : (localStorage.getItem('appLanguage') || 'english');
    const newLang = current === 'nepali' ? 'english' : 'nepali';
    applyAppLanguage(newLang);
}

// Update language indicator badge in header
function updateLanguageIndicator() {
    const lang = (typeof getCurrentLanguage === 'function') ? getCurrentLanguage() : (localStorage.getItem('appLanguage') || 'english');
    const el = document.getElementById('currentLanguage');
    if (!el) return;
    el.textContent = lang === 'nepali' ? 'ने' : 'EN';
}

// Ensure dynamic tabs and lists are populated at initialization so they
// display immediately (prevents empty tabs until user clicks language).
function ensureTabsPrepopulated() {
    try {
        if (typeof populateAllContent === 'function') populateAllContent();
        if (typeof populateRecentActivity === 'function') populateRecentActivity();
        if (typeof populateImportantNotices === 'function') populateImportantNotices();
        if (typeof populatePopularServices === 'function') populatePopularServices();
        if (typeof populateServicesTab === 'function') populateServicesTab();
    } catch (err) {
        console.warn('ensureTabsPrepopulated failed:', err);
    }
}

function closeLanguageModal() {
    const modal = document.getElementById('languageModal');
    if (modal) modal.classList.add('hidden');
}

function addMessage(content, role) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const welcome = chatMessages.querySelector('.chat-welcome');
    if (welcome) welcome.remove();
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    
    if (role === 'user') {
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="message-content">
                <p>${escapeHtml(content)}</p>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="message-header">
                    <span>AI Assistant</span>
                </div>
                <p>${escapeHtml(content)}</p>
            </div>
        `;
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addThinkingMessage() {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const thinkingDiv = document.createElement('div');
    thinkingDiv.id = 'thinking-message';
    thinkingDiv.className = 'message assistant';
    thinkingDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="message-header">
                <span>AI Assistant</span>
            </div>
            <p>
                <i class="fas fa-spinner fa-spin"></i> Thinking...
            </p>
        </div>
    `;
    
    chatMessages.appendChild(thinkingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeThinkingMessage() {
    const thinkingMsg = document.getElementById('thinking-message');
    if (thinkingMsg) thinkingMsg.remove();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

async function callGeminiAPI(query, language) {
    const languageInstruction = language === 'nepali' 
        ? 'You must respond ONLY in Nepali language using Devanagari script.'
        : 'You must respond ONLY in English language.';
    
    const systemPrompt = `${languageInstruction}

You are an AI assistant for Nepal's e-governance platform. Help citizens with government services including citizenship, passport, business registration, driving license, and more.

Provide helpful, step-by-step guidance specific to Nepal. Keep responses concise.

User query: ${query}`;

    try {
        const response = await fetch(`${CONFIG.GEMINI_API_URL}?key=${CONFIG.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt }] }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                }
            })
        });

        const data = await response.json();
        removeThinkingMessage();
        
        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            addMessage(data.candidates[0].content.parts[0].text, 'assistant');
        } else if (data.error) {
            const errorMsg = language === 'nepali' 
                ? 'माफ गर्नुहोस्, त्रुटि: ' + data.error.message
                : 'Sorry, error: ' + data.error.message;
            addMessage(errorMsg, 'assistant');
        } else {
            const errorMsg = language === 'nepali' 
                ? 'माफ गर्नुहोस्, समस्या भयो।'
                : 'Sorry, encountered an issue.';
            addMessage(errorMsg, 'assistant');
        }
    } catch (error) {
        console.error('API Error:', error);
        removeThinkingMessage();
        const errorMsg = language === 'nepali'
            ? '⚠️ API जडान गर्न समस्या भयो।'
            : '⚠️ API connection error.';
        addMessage(errorMsg, 'assistant');
    }
}

// ==================== POPULATE CONTENT ====================
function populateAllContent() {
    console.debug('[populate] populateAllContent starting');
    populateRecentActivity();
    populateImportantNotices();
    populatePopularServices();
    if (typeof populateServicesTab === 'function') populateServicesTab();
    animateCounters();
    // Ensure other tabs also contain helpful placeholders if they are empty
    if (typeof populateEmptyTabs === 'function') populateEmptyTabs();

    console.debug('[populate] populateAllContent completed');
}

// Populate common placeholder content into tabs that were left empty
function populateEmptyTabs() {
    const tabs = [
        { id: 'identity-tab', key: 'sidebar_identity', defaultTitle: 'Digital Identity', descKey: null, defaultDesc: 'Digital identity features coming soon...'},
        { id: 'passport-tab', key: 'sidebar_passport', defaultTitle: 'Passport Services', descKey: null, defaultDesc: 'Passport application and tracking features...'},
        { id: 'documents-tab', key: 'sidebar_documents', defaultTitle: 'Documents', descKey: null, defaultDesc: 'Document issuance and downloads will appear here.'},
        { id: 'payments-tab', key: 'sidebar_payments', defaultTitle: 'Payments', descKey: null, defaultDesc: 'Payment services and billing features...'},
        { id: 'voting-tab', key: 'sidebar_voting', defaultTitle: 'e-Voting', descKey: null, defaultDesc: 'Digital voting features coming soon...'},
        { id: 'applications-tab', key: 'sidebar_applications', defaultTitle: 'My Applications', descKey: null, defaultDesc: 'Track all your applications here...'}
    ];

    tabs.forEach(tab => {
        const el = document.getElementById(tab.id);
        if (!el) return;

        // If it's essentially empty (no child elements or only whitespace), fill it
        if (!el.innerHTML || el.innerHTML.trim().length < 20) {
            const title = (typeof getTranslation === 'function') ? getTranslation(tab.key) || tab.defaultTitle : tab.defaultTitle;
            const desc = tab.defaultDesc;

            el.innerHTML = `
                <div class="empty-tab-card">
                    <div class="empty-tab-header">
                        <h2><i class="fas fa-info-circle"></i> ${title}</h2>
                        <p>${desc}</p>
                    </div>
                    <div class="empty-tab-actions">
                        <button class="btn-primary" onclick="showTab('services')">${(typeof getTranslation === 'function') ? getTranslation('dashboard_browse') || 'Browse Services' : 'Browse Services'}</button>
                        <button class="btn-secondary" onclick="showTab('settings')">${(typeof getTranslation === 'function') ? getTranslation('header_settings') || 'Settings' : 'Settings'}</button>
                    </div>
                    <div class="empty-tab-suggestions">
                        <h4>${(typeof getTranslation === 'function') ? getTranslation('dashboard_popular') || 'Popular Services' : 'Popular Services'}</h4>
                        <div class="suggestion-list">
                            <button class="suggestion" onclick="quickApply('citizenship')">${(typeof getTranslation === 'function') ? getTranslation('sidebar_identity') || 'Identity' : 'Identity'}</button>
                            <button class="suggestion" onclick="quickApply('passport')">${(typeof getTranslation === 'function') ? getTranslation('sidebar_passport') || 'Passport' : 'Passport'}</button>
                            <button class="suggestion" onclick="quickApply('payments')">${(typeof getTranslation === 'function') ? getTranslation('sidebar_payments') || 'Payments' : 'Payments'}</button>
                        </div>
                    </div>
                </div>
            `;
        }
    });
}

function populateRecentActivity() {
    const lang = getCurrentLanguage ? getCurrentLanguage() : 'english';
    
    const activities = lang === 'nepali' ? [
        { title: 'नागरिकता आवेदन', id: 'CIT-2025-001234', status: 'approved', icon: 'fa-id-card', time: '२ घण्टा पहिले' },
        { title: 'व्यवसाय पञ्जीकरण', id: 'BUS-2025-005678', status: 'processing', icon: 'fa-building', time: '१ दिन पहिले' },
        { title: 'पासपोर्ट नवीकरण', id: 'PAS-2025-009876', status: 'pending', icon: 'fa-passport', time: '३ दिन पहिले' }
    ] : [
        { title: 'Citizenship Application', id: 'CIT-2025-001234', status: 'approved', icon: 'fa-id-card', time: '2 hours ago' },
        { title: 'Business Registration', id: 'BUS-2025-005678', status: 'processing', icon: 'fa-building', time: '1 day ago' },
        { title: 'Passport Renewal', id: 'PAS-2025-009876', status: 'pending', icon: 'fa-passport', time: '3 days ago' }
    ];
    
    const container = document.getElementById('recentActivity');
    if (container) {
        container.innerHTML = activities.map(activity => `
            <div class="timeline-item">
                <div class="timeline-icon">
                    <i class="fas ${activity.icon}"></i>
                </div>
                <div class="timeline-content">
                    <h4>${activity.title}</h4>
                    <p>${activity.id}</p>
                    <span class="status ${activity.status}">${activity.status}</span>
                    <span class="time">${activity.time}</span>
                </div>
            </div>
        `).join('');
    }
}

function populateImportantNotices() {
    const lang = getCurrentLanguage ? getCurrentLanguage() : 'english';
    
    const notices = lang === 'nepali' ? [
        { title: 'नयाँ डिजिटल हस्ताक्षर सेवा', desc: 'अनलाइनमा डिजिटल हस्ताक्षरको लागि आवेदन गर्नुहोस्', icon: 'fa-signature' },
        { title: 'पासपोर्ट शुल्क कम', desc: 'पासपोर्ट आवेदनमा २०% छुट', icon: 'fa-percentage' }
    ] : [
        { title: 'New Digital Signature Service', desc: 'Apply for digital signature online', icon: 'fa-signature' },
        { title: 'Passport Fee Reduced', desc: '20% discount on passport applications', icon: 'fa-percentage' }
    ];
    
    const container = document.getElementById('importantNotices');
    if (container) {
        container.innerHTML = notices.map(notice => `
            <div class="notice-item">
                <div class="notice-icon">
                    <i class="fas ${notice.icon}"></i>
                </div>
                <div class="notice-content">
                    <h4>${notice.title}</h4>
                    <p>${notice.desc}</p>
                </div>
            </div>
        `).join('');
    }
}

function populatePopularServices() {
    const lang = getCurrentLanguage ? getCurrentLanguage() : 'english';
    
    const services = lang === 'nepali' ? [
        { title: 'नागरिकता', icon: 'fa-id-card', color: 'blue', onclick: "showTab('services')" },
        { title: 'पासपोर्ट', icon: 'fa-passport', color: 'red', onclick: "showTab('services')" },
        { title: 'लाइसेन्स', icon: 'fa-car', color: 'purple', onclick: "showTab('services')" },
        { title: 'बिलहरु', icon: 'fa-bolt', color: 'green', onclick: "showTab('services')" }
    ] : [
        { title: 'Citizenship', icon: 'fa-id-card', color: 'blue', onclick: "showTab('services')" },
        { title: 'Passport', icon: 'fa-passport', color: 'red', onclick: "showTab('services')" },
        { title: 'License', icon: 'fa-car', color: 'purple', onclick: "showTab('services')" },
        { title: 'Bills', icon: 'fa-bolt', color: 'green', onclick: "showTab('services')" }
    ];
    
    const container = document.getElementById('popularServices');
    if (container) {
        container.innerHTML = services.map(service => `
            <div class="service-shortcut ${service.color}" onclick="${service.onclick}">
                <i class="fas ${service.icon}"></i>
                <span>${service.title}</span>
            </div>
        `).join('');
    }
}

// ==================== ALL 120 SERVICES DATA ====================
const ALL_SERVICES = {
    'Identity & Verification (Digital Core)': {
        icon: 'fa-id-card',
        color: 'blue',
        services: [
            { id: 1, title: 'Unified National Digital ID', desc: 'For all government services', icon: 'fa-id-card' },
            { id: 2, title: 'Biometric Login', desc: 'Fingerprint & Face ID authentication', icon: 'fa-fingerprint' },
            { id: 3, title: 'Offline QR Verification', desc: 'Verify identity offline using QR code', icon: 'fa-qrcode' },
            { id: 4, title: 'Dynamic QR Code', desc: 'Security QR that updates every few minutes', icon: 'fa-qrcode' },
            { id: 5, title: 'Family Linkage', desc: 'Link parents, children, spouse records', icon: 'fa-users' },
            { id: 6, title: 'National Address Verification', desc: 'Verify and update address database', icon: 'fa-map-marker-alt' },
            { id: 7, title: 'Digital Signature & Stamp', desc: 'Legally certified digital signature', icon: 'fa-signature' },
            { id: 8, title: 'e-Residency ID for Diaspora', desc: 'For Nepalis living abroad', icon: 'fa-globe' },
            { id: 9, title: 'Citizenship & Passport Integration', desc: 'Linked citizenship and passport services', icon: 'fa-passport' },
            { id: 10, title: 'Age Verification API', desc: 'For alcohol, voting, and other age-restricted services', icon: 'fa-birthday-cake' },
            { id: 11, title: 'Digital Birth Certificate', desc: 'Auto-issued at birth registration', icon: 'fa-certificate' },
            { id: 12, title: 'Blockchain-based ID Ledger', desc: 'Tamper-proof identity records', icon: 'fa-link' },
            { id: 13, title: 'Emergency ID Retrieval', desc: 'Recover ID if phone is lost', icon: 'fa-life-ring' },
            { id: 14, title: 'National ID for Job & SIM', desc: 'Verification for employment and telecom registration', icon: 'fa-check-circle' },
            { id: 15, title: 'Real-time Facial Verification', desc: 'For sensitive government actions', icon: 'fa-face-smile' }
        ]
    },
    'Integrated Government Services': {
        icon: 'fa-cogs',
        color: 'purple',
        services: [
            { id: 16, title: 'Passport Application & Renewal', desc: 'Apply or renew passport online', icon: 'fa-passport' },
            { id: 17, title: 'Citizenship Verification & Re-issue', desc: 'Verify or re-issue citizenship', icon: 'fa-id-card' },
            { id: 18, title: 'Police Report Request & Tracking', desc: 'Request and track police reports', icon: 'fa-shield-alt' },
            { id: 19, title: 'Driving License Issue/Renewal', desc: 'Get or renew driving license', icon: 'fa-car' },
            { id: 20, title: 'Vehicle Tax & Renewal Reminder', desc: 'Track and pay vehicle tax', icon: 'fa-bell' },
            { id: 21, title: 'Land Ownership Records', desc: 'View digital "Lalpurja" land records', icon: 'fa-home' },
            { id: 22, title: 'Business Registration & VAT', desc: 'Register business and manage VAT', icon: 'fa-briefcase' },
            { id: 23, title: 'Labor Permit Tracking', desc: 'Track foreign employment permits', icon: 'fa-suitcase' },
            { id: 24, title: 'Health Insurance Registration', desc: 'Register for national health insurance', icon: 'fa-hospital' },
            { id: 25, title: 'National Pension & Social Security', desc: 'Access pension and social security benefits', icon: 'fa-coins' },
            { id: 26, title: 'Scholarship & Education Grants', desc: 'Apply for educational support', icon: 'fa-graduation-cap' },
            { id: 27, title: 'Utility Bill Payments', desc: 'Pay electricity, water, and internet bills', icon: 'fa-bolt' },
            { id: 28, title: 'Traffic Fine Payment & History', desc: 'View and pay traffic violations', icon: 'fa-traffic-light' },
            { id: 29, title: 'Voter Registration + e-Voting', desc: 'Register and vote online (pilot)', icon: 'fa-vote-yea' },
            { id: 30, title: 'Passport Delivery Tracking', desc: 'Track passport delivery status', icon: 'fa-shipping-fast' },
            { id: 31, title: 'Municipality Service Integration', desc: 'Access local government services', icon: 'fa-building' },
            { id: 32, title: 'Property Tax Auto-calculation', desc: 'Calculate property taxes automatically', icon: 'fa-calculator' },
            { id: 33, title: 'Farmer Subsidy Registration', desc: 'Register for agricultural subsidies', icon: 'fa-leaf' },
            { id: 34, title: 'Government Job Vacancy Portal', desc: 'Browse and apply for government jobs', icon: 'fa-briefcase' },
            { id: 35, title: 'Smart Travel Pass', desc: 'For internal travel and trekking permits', icon: 'fa-map' }
        ]
    },
    'Finance & Payment Features': {
        icon: 'fa-credit-card',
        color: 'green',
        services: [
            { id: 36, title: 'Integrated Payment Gateway', desc: 'Banks, eSewa, Khalti, cards accepted', icon: 'fa-credit-card' },
            { id: 37, title: 'Auto Payment Reminders', desc: 'Get deadline reminders for payments', icon: 'fa-bell' },
            { id: 38, title: 'Real-time Transaction Dashboard', desc: 'View all transactions in real-time', icon: 'fa-chart-line' },
            { id: 39, title: 'Digital Wallet', desc: 'Built-in app wallet for quick payments', icon: 'fa-wallet' },
            { id: 40, title: 'One-click Service Payment', desc: 'Fast checkout for government services', icon: 'fa-mouse-pointer' },
            { id: 41, title: 'Receipt & Invoice Download', desc: 'Download and store receipts', icon: 'fa-receipt' },
            { id: 42, title: 'Income Tax & VAT Integration', desc: 'Manage tax payments and returns', icon: 'fa-percent' },
            { id: 43, title: 'Refund Tracking System', desc: 'Track refund status and timing', icon: 'fa-undo' },
            { id: 44, title: 'Cross-border Payments', desc: 'For Nepalis abroad', icon: 'fa-globe' },
            { id: 45, title: 'Remittance System Integration', desc: 'Receive remittances directly', icon: 'fa-exchange-alt' },
            { id: 46, title: 'Fee Waiver for Low-income Users', desc: 'Reduced fees based on income', icon: 'fa-hand-holding-heart' }
        ]
    },
    'Document & Record Management': {
        icon: 'fa-file',
        color: 'red',
        services: [
            { id: 47, title: 'Central Digital Locker', desc: 'Store & verify all documents', icon: 'fa-lock' },
            { id: 48, title: 'Auto-sync Reissued Documents', desc: 'Automatically update reissued documents', icon: 'fa-sync' },
            { id: 49, title: 'Secure Document Sharing', desc: 'Share documents via secure link or QR', icon: 'fa-share-alt' },
            { id: 50, title: 'Expiry Reminder System', desc: 'Get alerts for expiring licenses and certificates', icon: 'fa-calendar-times' },
            { id: 51, title: 'Offline Document Viewer', desc: 'View documents without internet', icon: 'fa-file-pdf' },
            { id: 52, title: 'Certificate Validation', desc: 'For education and employment', icon: 'fa-check-circle' },
            { id: 53, title: 'Cloud Backup with Encryption', desc: 'Government-encrypted cloud backup', icon: 'fa-cloud' },
            { id: 54, title: 'E-contract Signing', desc: 'Sign legal documents digitally', icon: 'fa-pen-fancy' },
            { id: 55, title: 'Third-party Verification Portal', desc: 'For schools, companies to verify documents', icon: 'fa-tasks' },
            { id: 56, title: 'My Applications Tracker', desc: 'Track all pending and completed applications', icon: 'fa-list' }
        ]
    },
    'User Interface & Accessibility': {
        icon: 'fa-universal-access',
        color: 'indigo',
        services: [
            { id: 57, title: 'Multi-language Support', desc: 'Nepali, English, and regional languages', icon: 'fa-language' },
            { id: 58, title: 'Voice-guided Navigation', desc: 'Audio guidance through the app', icon: 'fa-volume-up' },
            { id: 59, title: 'Accessibility Mode', desc: 'For visually impaired users', icon: 'fa-eye-slash' },
            { id: 60, title: 'Simple Clean Dashboard', desc: 'Icon-based intuitive interface', icon: 'fa-th' },
            { id: 61, title: 'Customizable Themes', desc: 'Dark mode and color customization', icon: 'fa-palette' },
            { id: 62, title: 'Interactive How-to Videos', desc: 'Step-by-step video guides', icon: 'fa-video' },
            { id: 63, title: 'User Onboarding Tutorial', desc: 'First-time user guidance', icon: 'fa-graduation-cap' },
            { id: 64, title: 'Elderly-friendly Large Text', desc: 'Enhanced font size for elderly users', icon: 'fa-text-height' },
            { id: 65, title: 'Adaptive Low-end Mobile Layout', desc: 'Works on all smartphone types', icon: 'fa-mobile-alt' },
            { id: 66, title: 'Local News & Notice Board', desc: 'Community announcements and news', icon: 'fa-newspaper' }
        ]
    },
    'Communication & Feedback': {
        icon: 'fa-comments',
        color: 'cyan',
        services: [
            { id: 67, title: 'Live Chat Support', desc: 'Connect with human support agents', icon: 'fa-headset' },
            { id: 68, title: 'AI Chatbot 24/7', desc: 'Instant answers anytime', icon: 'fa-robot' },
            { id: 69, title: 'Feedback & Complaint System', desc: 'Submit complaints with tracking number', icon: 'fa-exclamation-circle' },
            { id: 70, title: 'Service Rating System', desc: 'Rate each government department', icon: 'fa-star' },
            { id: 71, title: 'Suggestion Box', desc: 'Send improvement ideas', icon: 'fa-lightbulb' },
            { id: 72, title: 'Email & SMS Notifications', desc: 'Receive updates via email or SMS', icon: 'fa-envelope' },
            { id: 73, title: 'Push Notifications', desc: 'Alerts for deadlines and updates', icon: 'fa-bell' },
            { id: 74, title: 'Contact Municipality', desc: 'Reach out to local government', icon: 'fa-phone' },
            { id: 75, title: 'Escalation System', desc: 'For unresolved issues', icon: 'fa-arrow-up' }
        ]
    },
    'Security & Privacy': {
        icon: 'fa-shield-alt',
        color: 'orange',
        services: [
            { id: 76, title: 'Two-step Verification', desc: 'Extra security for sensitive data', icon: 'fa-check-double' },
            { id: 77, title: 'Auto Session Logout', desc: 'Automatic logout after inactivity', icon: 'fa-clock' },
            { id: 78, title: 'Data Encryption', desc: 'Encryption at rest and in transit', icon: 'fa-lock' },
            { id: 79, title: 'Cybersecurity Audits', desc: 'Regular third-party security checks', icon: 'fa-search' },
            { id: 80, title: 'Privacy Consent System', desc: 'GDPR-style privacy controls', icon: 'fa-user-shield' },
            { id: 81, title: 'Data Download & Deletion', desc: 'Option to export or delete personal data', icon: 'fa-download' },
            { id: 82, title: 'Suspicious Activity Alerts', desc: 'Notifications of unusual account activity', icon: 'fa-exclamation-triangle' },
            { id: 83, title: 'Device Login History', desc: 'View where and when you logged in', icon: 'fa-history' },
            { id: 84, title: 'Secure ID Credential Backup', desc: 'Safely backup identity credentials', icon: 'fa-key' },
            { id: 85, title: 'Minor Privacy Settings', desc: 'Special privacy for users under 18', icon: 'fa-child' }
        ]
    },
    'Smart & AI-Based Features': {
        icon: 'fa-brain',
        color: 'pink',
        services: [
            { id: 86, title: 'AI Assistant for FAQs', desc: 'Intelligent FAQ guidance', icon: 'fa-robot' },
            { id: 87, title: 'Predictive Auto-fill', desc: 'Smart form filling suggestions', icon: 'fa-magic' },
            { id: 88, title: 'Auto Error Detection', desc: 'Catch application mistakes automatically', icon: 'fa-check-circle' },
            { id: 89, title: 'Nepali Language Chatbot', desc: 'AI support in Nepali', icon: 'fa-comments' },
            { id: 90, title: 'AI Recommendations', desc: 'Suggestions like "You might need to renew..."', icon: 'fa-lightbulb' },
            { id: 91, title: 'Smart Queue System', desc: 'Intelligent appointment scheduling', icon: 'fa-calendar-check' },
            { id: 92, title: 'Voice-to-Text Form Filling', desc: 'Fill forms by speaking', icon: 'fa-microphone' },
            { id: 93, title: 'Sentiment Analysis Feedback', desc: 'Analyze user feedback sentiment', icon: 'fa-smile' },
            { id: 94, title: 'AI Fraud Detection', desc: 'Detect suspicious activities automatically', icon: 'fa-shield-alt' },
            { id: 95, title: 'Document OCR Scanner', desc: 'Extract text from scanned documents', icon: 'fa-camera' }
        ]
    },
    'Analytics, Monitoring & Transparency': {
        icon: 'fa-chart-bar',
        color: 'teal',
        services: [
            { id: 96, title: 'Public Service Dashboard', desc: 'View service completion rates', icon: 'fa-chart-pie' },
            { id: 97, title: 'Real-time Performance Analytics', desc: 'Analytics for each ministry', icon: 'fa-chart-line' },
            { id: 98, title: 'Corruption Risk Detection', desc: 'Data analysis for corruption prevention', icon: 'fa-eye' },
            { id: 99, title: 'Transparent Procurement Tracking', desc: 'Track government tenders and contracts', icon: 'fa-gavel' },
            { id: 100, title: 'Service Ranking by Region', desc: 'Compare services across regions', icon: 'fa-trophy' },
            { id: 101, title: 'Open Data Portal', desc: 'Research and innovation data', icon: 'fa-database' },
            { id: 102, title: 'Monthly Service Reports', desc: 'Government service reports', icon: 'fa-file-alt' }
        ]
    },
    'International & Future-Ready': {
        icon: 'fa-globe',
        color: 'fuchsia',
        services: [
            { id: 103, title: 'e-Visa System for Foreigners', desc: 'Online visa application and approval', icon: 'fa-passport' },
            { id: 104, title: 'Foreign Embassy Integration', desc: 'Document verification with embassies', icon: 'fa-building' },
            { id: 105, title: 'Diaspora Citizen Login', desc: 'Services for Nepalis abroad', icon: 'fa-globe' },
            { id: 106, title: 'UN & SAARC Standards', desc: 'Integration with international e-governance', icon: 'fa-handshake' },
            { id: 107, title: 'Cross-border Data Portability', desc: 'Share data with India and Bhutan securely', icon: 'fa-exchange-alt' },
            { id: 108, title: 'Blockchain Voting System', desc: 'Tamper-proof digital voting (future)', icon: 'fa-vote-yea' },
            { id: 109, title: 'Digital Notary & Court Filing', desc: 'Online notary and legal document filing', icon: 'fa-gavel' },
            { id: 110, title: 'Multi-language AI Chatbot', desc: 'Support in multiple international languages', icon: 'fa-language' },
            { id: 111, title: 'Smart Citizen Scorecard', desc: 'Reputation and reliability system', icon: 'fa-medal' },
            { id: 112, title: 'Green Citizenship Initiative', desc: 'Paperless office model', icon: 'fa-leaf' }
        ]
    },
    'Innovation & Collaboration': {
        icon: 'fa-lightbulb',
        color: 'violet',
        services: [
            { id: 113, title: 'Developer API', desc: 'Build public service apps with our API', icon: 'fa-code' },
            { id: 114, title: 'Hackathon Programs', desc: 'Civic tech innovation competitions', icon: 'fa-laptop-code' },
            { id: 115, title: 'Citizen Innovation Challenges', desc: 'Win rewards for improvement ideas', icon: 'fa-trophy' },
            { id: 116, title: 'University Partnerships', desc: 'Collaboration with universities', icon: 'fa-graduation-cap' },
            { id: 117, title: 'Global E-governance Leaders', desc: 'Learn from Estonia, Singapore, and others', icon: 'fa-star' },
            { id: 118, title: 'Data-sharing Standards', desc: 'Standards for private company integration', icon: 'fa-handshake' },
            { id: 119, title: 'Blockchain Tender Verification', desc: 'Verify government contracts on blockchain', icon: 'fa-link' },
            { id: 120, title: 'Citizen Digital Literacy Portal', desc: 'Training portal for digital skills', icon: 'fa-book' }
        ]
    }
};

// Optional mapping of service titles to official homepages.
// If a service isn't listed here, the Connect button will perform a Google search.
const SERVICE_HOME_PAGES = {
    // Examples (add real URLs as available):
    // 'Passport Application & Renewal': 'https://www.nepalpassport.gov.np',
    // 'Citizenship Verification & Re-issue': 'https://www.citizenship.gov.np'
};

function connectToHomepage(serviceName) {
    const url = SERVICE_HOME_PAGES[serviceName];
    if (url) {
        window.open(url, '_blank');
        showToast(`Opening official page for ${serviceName}`);
    } else {
        const query = encodeURIComponent(`Nepal ${serviceName} official`);
        window.open(`https://www.google.com/search?q=${query}`, '_blank');
        showToast(`Searching for official page of ${serviceName}`);
    }
}

// ==================== POPULATE SERVICES TAB ====================
function populateServicesTab() {
    const servicesTab = document.getElementById('services-tab');
    if (!servicesTab) return;
    
    const title = (typeof getTranslation === 'function') ? (getTranslation('sidebar_services') + ' (120+)') : 'All Government Services (120+)';
    const desc = (typeof getTranslation === 'function') ? (getTranslation('dashboard_apply_desc') || 'Explore all available e-governance services organized by category') : 'Explore all available e-governance services organized by category';
    const searchPlaceholder = (typeof getTranslation === 'function') ? (getTranslation('ui_search') || 'Search services...') : 'Search services...';

    let html = `
        <div class="services-container">
            <div class="services-header">
                <h2><i class="fas fa-list-ul"></i> ${title}</h2>
                <p>${desc}</p>
                <div class="services-search">
                    <input type="text" id="servicesSearch" class="services-search-input" placeholder="${searchPlaceholder}">
                    <i class="fas fa-search"></i>
                </div>
            </div>
            
            <div class="services-categories">
    `;
    
    for (const [category, data] of Object.entries(ALL_SERVICES)) {
        html += `
            <div class="service-category">
                <div class="category-header">
                    <div class="category-title">
                        <i class="fas ${data.icon}"></i>
                        <h3>${category}</h3>
                    </div>
                    <span class="service-count">${data.services.length} services</span>
                </div>
                
                <div class="services-grid">
        `;
        
        data.services.forEach(service => {
            html += `
                <div class="service-card" data-service="${service.title}">
                    <div class="service-card-icon">
                        <i class="fas ${service.icon}"></i>
                    </div>
                    <div class="service-card-content">
                        <h4>${service.title}</h4>
                        <p>${service.desc}</p>
                    </div>
                    <div class="service-card-footer">
                            <button class="btn-small-primary" onclick="accessService('${service.title}')">
                                Access <i class="fas fa-arrow-right"></i>
                            </button>
                            <button class="btn-small-secondary connect-homepage-btn" onclick="connectToHomepage('${service.title}')">
                                Connect <i class="fas fa-link"></i>
                            </button>
                        </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    html += `
            </div>
        </div>
    `;
    
    servicesTab.innerHTML = html;
    setupServicesSearch();
}

function setupServicesSearch() {
    const searchInput = document.getElementById('servicesSearch');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach(card => {
            const serviceName = card.getAttribute('data-service').toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            
            if (serviceName.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = '';
                card.style.animation = 'fadeIn 0.3s ease';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

function accessService(serviceName) {
    showToast(`Opening ${serviceName}...`);
    setTimeout(() => {
        showToast(`✅ ${serviceName} service loaded successfully!`);
    }, 1000);
}

// ==================== COUNTER ANIMATION ====================
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                counter.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    });
}

// ==================== SETTINGS NAVIGATION ====================
function setupSettingsNavigation() {
    document.querySelectorAll('.settings-nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            
            document.querySelectorAll('.settings-nav-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            document.querySelectorAll('.settings-section').forEach(s => s.classList.remove('active'));
            const targetSection = document.getElementById(section + '-settings');
            if (targetSection) targetSection.classList.add('active');
        });
    });
}

// ==================== PROFILE TABS ====================
function showProfileTab(tabName) {
    document.querySelectorAll('.profile-tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.profile-tab-content').forEach(content => content.classList.remove('active'));
    
    event.target.classList.add('active');
    const tab = document.getElementById(`profile-${tabName}-tab`);
    if (tab) tab.classList.add('active');
}

// ==================== HELPER FUNCTIONS ====================
function trackApplication() {
    const input = document.querySelector('.track-input');
    if (!input) return;
    
    const appId = input.value.trim();
    
    if (!appId) {
        showToast('Please enter application ID', 'warning');
        return;
    }
    
    showToast('Fetching application status...');
    setTimeout(() => {
        showToast('Application found! Status: Processing');
    }, 1500);
}

function quickApply(service) {
    showTab('services');
    showToast(`Opening ${service} application form...`);
}

function quickPay() {
    showTab('payments');
    showToast('Opening payment dashboard...');
}

// Renamed from changeAppLanguage to changeRecognitionLanguage to avoid
// colliding with the main UI language switcher. This adjusts voice
// recognition language when requested.
function changeRecognitionLanguage(lang) {
    const languages = {
        'en': 'English',
        'ne': 'नेपाली',
        'mai': 'मैथिली',
        'bho': 'भोजपुरी',
        'new': 'नेवारी',
        'tam': 'तामाङ'
    };

    showToast(`Language changed to ${languages[lang] || lang}`);
    closeAllDropdowns();

    if (STATE.recognition) {
        STATE.recognition.lang = lang === 'ne' ? 'ne-NP' : 'en-US';
    }
}

function newChat() {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.innerHTML = `
            <div class="chat-welcome">
                <div class="welcome-icon">
                    <i class="fas fa-hands-helping"></i>
                </div>
                <h3>Namaste! 🙏 How can I help you today?</h3>
                <p>I can assist you with citizenship, passport, licenses, and all government services</p>
            </div>
        `;
    }
    showToast('New chat started');
}

function clearChat() {
    if (confirm('Clear this conversation?')) {
        newChat();
    }
}

function shareChat() {
    showToast('Chat share feature coming soon!');
}

function attachFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.jpg,.jpeg,.png';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            showToast('File attached: ' + file.name);
        }
    };
    input.click();
}

function editProfile() {
    showProfileSetup();
}

function editAddress() {
    showProfileSetup();
    currentStep = 3;
    updateProfileSetupStep();
}

function editProfilePhoto() {
    const input = document.getElementById('profilePhoto');
    if (input) input.click();
}

function editBanner() {
    showToast('Banner upload feature coming soon!');
}

function generateQR() {
    showToast('Generating QR code...');
    setTimeout(() => {
        showToast('QR code generated successfully!');
    }, 1000);
}

function verifyBlockchain() {
    showToast('Verifying on blockchain...');
    setTimeout(() => {
        showToast('✓ Verified on blockchain - Tamper-proof record created');
    }, 2000);
}

function uploadDocument() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.jpg,.jpeg,.png';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            showToast('Uploading document...');
            setTimeout(() => {
                showToast('Document uploaded successfully! 🔒');
            }, 2000);
        }
    };
    input.click();
}

function scanDocument() {
    showToast('Opening OCR scanner...');
    setTimeout(() => {
        showToast('Document scanned and text extracted! 📄');
    }, 2000);
}

function downloadMyData() {
    showToast('Preparing your data for download...');
    setTimeout(() => {
        showToast('✓ Data downloaded successfully!');
    }, 2000);
}

function exportData() {
    showToast('Exporting data...');
    setTimeout(() => {
        showToast('✓ Data exported to your device');
    }, 1500);
}

function clearCache() {
    showToast('Clearing cache...');
    setTimeout(() => {
        showToast('✓ Cache cleared - 8 MB freed');
    }, 1000);
}

function requestDataDeletion() {
    if (confirm('Are you sure you want to request data deletion? This action cannot be undone.')) {
        showToast('Data deletion request submitted.');
    }
}

function setup2FA() {
    showToast('Opening 2FA setup...');
    setTimeout(() => {
        showToast('Two-factor authentication enabled! 🔐');
    }, 1500);
}

function setupBiometric() {
    if (!window.PublicKeyCredential) {
        showToast('Biometric authentication not supported', 'error');
        return;
    }
    
    showToast('Place your finger on the sensor...');
    setTimeout(() => {
        showToast('Biometric authentication enabled successfully! 🔐');
        localStorage.setItem('biometricEnabled', 'true');
    }, 2000);
}

function changePassword() {
    showToast('Opening password change form...');
}

function manageSessions() {
    showToast('Loading active sessions...');
}

function viewLoginHistory() {
    showToast('Loading login history...');
    setTimeout(() => {
        showTab('security');
    }, 500);
}

function contactSupport() {
    showToast('Opening support options...');
}

function startLiveChat() {
    showToast('Connecting to live agent...');
    showTab('ai-assistant');
}

function callSupport() {
    window.location.href = 'tel:1660-01-55555';
}

function emailSupport() {
    window.location.href = 'mailto:support@nagarik.gov.np';
}

function downloadReceipt() {
    showToast('Receipt downloaded successfully!');
}

function logout() {
    const confirmMsg = typeof getTranslation === 'function' 
        ? getTranslation('confirm_logout', STATE.selectedLanguage) 
        : 'Are you sure you want to logout?';
    
    if (confirm(confirmMsg)) {
        // Clear all user data
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
        localStorage.removeItem('userProfile');
        localStorage.removeItem('rememberLogin');
        localStorage.removeItem('rememberedEmail');
        
        // Reset STATE
        STATE.currentUser = {
            id: null,
            name: 'Guest User',
            email: 'guest@nagarik.gov.np',
            photo: null,
            isLoggedIn: false,
            profile: {}
        };
        
        const successMsg = typeof getTranslation === 'function' 
            ? getTranslation('success_logout', STATE.selectedLanguage) 
            : 'Logged out successfully. Redirecting...';
        
        showToast(successMsg);
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    }
}

function vote(pollTitle) {
    showToast('Opening voting interface...');
}

function submitVote(choice) {
    showToast('Recording vote on blockchain...');
    setTimeout(() => {
        showToast('✓ Vote recorded successfully!');
    }, 2000);
}

// ==================== EVENT LISTENERS ====================
// ==================== ANALYTICS & CHARTS ====================
function loadAnalyticsChart() {
    // Use hardcoded data instead of API
    const data = {
        categories: ['Service 1', 'Service 2', 'Service 3'],
        completed: [120, 100, 80],
        remaining: [160, 140, 120]
    };
    renderBarChart(data);
}

function renderBarChart(data) {
    const chartContainer = document.getElementById('analyticsChart');
    if (!chartContainer) return;
    
    // Create simple SVG bar chart (no external library needed)
    const width = 600;
    const height = 300;
    const barWidth = 40;
    const spacing = 80;
    const maxValue = Math.max(...data.completed, ...data.remaining);
    const scale = (height - 50) / maxValue;
    
    let svg = `<svg width="${width}" height="${height}" style="border: 1px solid #e0e0e0; border-radius: 8px; background: #fafafa;">`;
    
    // Y-axis
    svg += `<line x1="40" y1="20" x2="40" y2="${height - 30}" stroke="#333" stroke-width="2"/>`;
    
    // X-axis
    svg += `<line x1="40" y1="${height - 30}" x2="${width}" y2="${height - 30}" stroke="#333" stroke-width="2"/>`;
    
    // Y-axis labels
    for (let i = 0; i <= maxValue; i += Math.ceil(maxValue / 5)) {
        const y = height - 30 - (i * scale);
        svg += `<line x1="35" y1="${y}" x2="40" y2="${y}" stroke="#333" stroke-width="1"/>`;
        svg += `<text x="10" y="${y + 5}" font-size="12" fill="#666">${i}</text>`;
    }
    
    // Bars for Completed (blue)
    data.completed.forEach((value, index) => {
        const x = 60 + (index * spacing);
        const barHeight = value * scale;
        const y = height - 30 - barHeight;
        svg += `<rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="#3b82f6" opacity="0.8" rx="4"/>`;
        svg += `<text x="${x}" y="${height - 5}" font-size="12" text-anchor="middle" fill="#333">${data.categories[index]}</text>`;
    });
    
    // Legend
    svg += `<rect x="50" y="10" width="12" height="12" fill="#3b82f6" opacity="0.8"/>`;
    svg += `<text x="70" y="20" font-size="12" fill="#333">Completed</text>`;
    
    svg += `</svg>`;
    chartContainer.innerHTML = svg;
}

function setupEventListeners() {
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.user-profile-btn') && 
            !e.target.closest('#userMenu') &&
            !e.target.closest('.icon-btn')) {
            closeAllDropdowns();
        }
    });
    
    const globalSearch = document.getElementById('globalSearch');
    if (globalSearch) {
        globalSearch.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase();
            if (query.length > 2) {
                console.log('Searching for:', query);
            }
        });
    }
    
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const search = document.getElementById('globalSearch');
            if (search) search.focus();
        }
        
        if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
            e.preventDefault();
            showTab('dashboard');
        }
        
        if (e.key === 'Escape') {
            closeAllDropdowns();
        }
    });
    
    const userInput = document.getElementById('userInput');
    if (userInput) {
        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
}

// ==================== SERVICE WORKER ====================
function initializeServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('ServiceWorker registered:', registration.scope);
        }).catch(function(error) {
            console.log('ServiceWorker registration failed:', error);
        });
    }
}

// ==================== NOTIFICATION SYSTEM ====================
function initializeNotifications() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

// ==================== INITIALIZATION COMPLETE ====================
console.log('🇳🇵 Nepal e-Governance Platform - All Features Loaded');
console.log('✅ System Ready');
console.log('जय नेपाल! 🇳🇵'); 