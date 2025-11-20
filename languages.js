// ============================================
// LANGUAGE TRANSLATION SYSTEM
// ============================================

const TRANSLATIONS = {
    english: {
        // Header
        'header_search': 'Search services, documents...',
        'header_notifications': 'Notifications',
        'header_language': 'Change Language',
        'header_profile': 'My Profile',
        'header_settings': 'Settings',
        'header_security': 'Security & Privacy',
        'header_help': 'Help & Support',
        'header_logout': 'Logout',
        
        // Sidebar
        'sidebar_dashboard': 'Dashboard',
        'sidebar_ai': 'AI Assistant',
        'sidebar_services': 'All Services',
        'sidebar_identity': 'Digital Identity',
        'sidebar_passport': 'Passport',
        'sidebar_documents': 'Documents',
        'sidebar_payments': 'Payments',
        'sidebar_voting': 'Voting',
        'sidebar_applications': 'My Applications',
        'sidebar_profile': 'Profile',
        'sidebar_settings': 'Settings',
        
        // Dashboard
        'dashboard_welcome': 'Welcome back, {name}! 👋',
        'dashboard_subtitle': 'Here\'s what\'s happening with your services today',
        'dashboard_ask_ai': 'Ask AI Assistant',
        'dashboard_stats_citizens': 'Active Citizens',
        'dashboard_stats_applications': 'My Applications',
        'dashboard_stats_documents': 'Documents Issued',
        'dashboard_stats_satisfaction': 'Satisfaction Rate',
        'dashboard_apply': 'Apply for Services',
        'dashboard_apply_desc': 'Quick access to 120+ government services',
        'dashboard_browse': 'Browse Services',
        'dashboard_track': 'Track Applications',
        'dashboard_track_desc': 'Real-time status of your applications',
        'dashboard_payments': 'Pending Payments',
        'dashboard_payments_desc': 'Manage your bills and payments',
        'dashboard_recent': 'Recent Activity',
        'dashboard_notices': 'Important Notices',
        'dashboard_popular': 'Popular Services',
        
        // AI Assistant
        'ai_title': 'AI-Powered Service Assistant',
        'ai_subtitle': 'Ask anything about government services',
        'ai_24_7': '24/7 Available',
        'ai_bilingual': 'Bilingual',
        'ai_secure': 'Secure',
        'ai_powered': 'AI-Powered',
        'ai_welcome': 'Namaste! 🙏 How can I help you today?',
        'ai_help_text': 'I can assist you with citizenship, passport, licenses, and all government services',
        'ai_placeholder': 'Type your question or use voice...',
        'ai_citizenship': 'Apply for Citizenship',
        'ai_passport': 'Track Passport',
        'ai_bills': 'Pay Bills',
        'ai_nepali': 'Ask in Nepali',
        
        // Profile
        'profile_complete': 'Complete Your Profile',
        'profile_personal': 'Personal Information',
        'profile_photo': 'Upload Profile Picture',
        'profile_address': 'Address Information',
        'profile_documents': 'Identity Documents',
        'profile_full_name_en': 'Full Name (English)',
        'profile_full_name_np': 'पूरा नाम (नेपाली)',
        'profile_dob': 'Date of Birth',
        'profile_gender': 'Gender',
        'profile_blood': 'Blood Group',
        'profile_mobile': 'Mobile Number',
        'profile_province': 'Province',
        'profile_district': 'District',
        'profile_municipality': 'Municipality',
        'profile_ward': 'Ward No.',
        'profile_citizenship': 'Citizenship Number',
        'profile_passport': 'Passport Number',
        'profile_next': 'Next',
        'profile_previous': 'Previous',
        'profile_complete_setup': 'Complete Setup',
        
        // Settings
        'settings_general': 'General Settings',
        'settings_appearance': 'Appearance',
        'settings_notifications': 'Notifications',
        'settings_privacy': 'Privacy & Data',
        'settings_security': 'Security Settings',
        'settings_autosave': 'Auto-save Forms',
        'settings_autosave_desc': 'Automatically save form progress',
        'settings_remember': 'Remember Login',
        'settings_remember_desc': 'Stay logged in on this device',
        'settings_theme': 'Theme',
        'settings_light': 'Light',
        'settings_dark': 'Dark',
        'settings_push': 'Push Notifications',
        'settings_push_desc': 'Receive alerts for important updates',
        'settings_download': 'Download My Data',
        'settings_delete': 'Request Data Deletion',
        'settings_2fa': 'Two-Factor Authentication',
        'settings_2fa_desc': 'Add extra security to your account',
        'settings_biometric': 'Biometric Login',
        'settings_biometric_desc': 'Use fingerprint or face ID to login',
        
        // Buttons
        'btn_apply': 'Apply',
        'btn_cancel': 'Cancel',
        'btn_save': 'Save',
        'btn_delete': 'Delete',
        'btn_edit': 'Edit',
        'btn_close': 'Close',
        'btn_next': 'Next',
        'btn_previous': 'Previous',
        'btn_submit': 'Submit',
        'btn_logout': 'Logout',
        
        // Messages
        'msg_success': 'Operation completed successfully!',
        'msg_error': 'An error occurred. Please try again.',
        'msg_loading': 'Loading...',
        'msg_required': 'This field is required',
        
        // LOGIN PAGE
        'login_title': 'Welcome Back! 👋',
        'login_subtitle': 'Sign in to access your government services',
        'login_credentials': 'Credentials',
        'login_biometric': 'Biometric',
        'login_faceId': 'Face ID',
        'login_email': 'Email or National ID',
        'login_email_placeholder': 'Enter your email or NP-XXXX-XXXX',
        'login_password': 'Password',
        'login_password_placeholder': 'Enter your password',
        'login_remember': 'Remember me',
        'login_forgot': 'Forgot Password?',
        'login_signin': 'Sign In',
        'login_or_continue': 'Or continue with',
        'login_create_account': 'Don\'t have an account?',
        'login_create_link': 'Create Account',
        'login_scanning': 'Scanning fingerprint...',
        'login_analyzing': 'Analyzing your face...',
        'login_place_finger': 'Place your finger on the sensor',
        'login_position_face': 'Position your face in the circle',
        'login_verify': 'Verifying...',
        'login_scan_finger': 'Scan Fingerprint',
        'login_start_face': 'Start Face Recognition',
        'login_verified': 'Face verified successfully!',
        'login_authenticating': 'Authenticating...',
        'login_success': 'Login successful! Redirecting...',
        'login_camera_error': 'Could not access camera. Please check permissions.',
        'login_feature_secure': 'Secure & Encrypted',
        'login_feature_secure_desc': 'Bank-level security',
        'login_feature_biometric': 'Biometric Login',
        'login_feature_biometric_desc': 'Face & fingerprint',
        'login_feature_services': '120+ Services',
        'login_feature_services_desc': 'All in one place',
        'login_feature_multi': 'Multi-Language',
        'login_feature_multi_desc': '7+ languages',
        
        // SIGNUP/REGISTRATION
        'signup_title': 'Create Your Account',
        'signup_subtitle': 'Join Nepal e-Governance Platform',
        'signup_email': 'Email Address',
        'signup_fullname': 'Full Name',
        'signup_password': 'Create Password',
        'signup_confirm_password': 'Confirm Password',
        'signup_terms': 'I agree to the Terms of Service',
        'signup_privacy': 'Privacy Policy',
        'signup_button': 'Create Account',
        'signup_have_account': 'Already have an account?',
        'signup_signin_link': 'Sign In',
        
        // FORM LABELS & PLACEHOLDERS
        'form_required': 'Required field',
        'form_optional': 'Optional',
        'form_invalid_email': 'Invalid email address',
        'form_password_short': 'Password must be at least 8 characters',
        'form_passwords_mismatch': 'Passwords do not match',
        'form_submit': 'Submit',
        'form_cancel': 'Cancel',
        'form_save': 'Save Changes',
        'form_update': 'Update',
        'form_delete': 'Delete',
        'form_reset': 'Reset',
        'form_clear': 'Clear Form',
        
        // DROPDOWN ITEMS
        'menu_profile': 'My Profile',
        'menu_settings': 'Settings',
        'menu_security': 'Security & Privacy',
        'menu_help': 'Help & Support',
        'menu_logout': 'Logout',
        'menu_switch_language': 'Switch Language',
        'menu_theme': 'Change Theme',
        'menu_notifications': 'Manage Notifications',
        
        // MODAL BUTTONS
        'modal_close': 'Close',
        'modal_confirm': 'Confirm',
        'modal_cancel': 'Cancel',
        'modal_save': 'Save',
        'modal_delete': 'Delete',
        'modal_edit': 'Edit',
        'modal_view': 'View Details',
        'modal_download': 'Download',
        
        // NOTIFICATIONS
        'notif_new': 'You have new notifications',
        'notif_all': 'Mark All as Read',
        'notif_clear': 'Clear All',
        'notif_empty': 'No notifications',
        'notif_settings': 'Notification Settings',
        
        // ERRORS & VALIDATION
        'error_title': 'Error',
        'error_invalid_credentials': 'Invalid email or password',
        'error_account_locked': 'Your account has been locked',
        'error_network': 'Network error. Please try again.',
        'error_server': 'Server error. Please try again later.',
        'error_timeout': 'Request timeout. Please try again.',
        'error_not_found': 'Page not found',
        'error_unauthorized': 'Unauthorized access',
        'error_forbidden': 'Access denied',
        
        // SUCCESS MESSAGES
        'success_login': 'Successfully logged in!',
        'success_logout': 'Successfully logged out!',
        'success_saved': 'Changes saved successfully!',
        'success_deleted': 'Item deleted successfully!',
        'success_updated': 'Updated successfully!',
        'success_created': 'Created successfully!',
        
        // CONFIRMATION DIALOGS
        'confirm_logout': 'Are you sure you want to logout?',
        'confirm_delete': 'Are you sure you want to delete this item?',
        'confirm_discard': 'Discard unsaved changes?',
        
        // UI CONTROLS
        'ui_search': 'Search',
        'ui_filter': 'Filter',
        'ui_sort': 'Sort',
        'ui_export': 'Export',
        'ui_import': 'Import',
        'ui_refresh': 'Refresh',
        'ui_back': 'Back',
        'ui_forward': 'Forward',
        'ui_home': 'Home',
        'ui_menu': 'Menu',
        'ui_more': 'More',
        'ui_loading': 'Loading...',
        'ui_no_data': 'No data available',
        'ui_empty_state': 'Nothing to show here',
        // App-specific
        'app_name': 'Smart Nepal',
        'app_subtitle': 'Nepal e-Governance',
        'quick_apply_citizenship': 'Apply Citizenship',
        'quick_apply_passport': 'Renew Passport',
        'quick_apply_payments': 'Pay Bills',
        'contact_police': 'Police',
        'contact_support': 'Support',
        'footer_version': 'Version {version}',
        'footer_copyright': '© 2025 Nepal Government',
        'loading_title': 'Nepal e-Governance',
        'loading_message': 'Loading your services...',
        'toast_success': 'Success!',
        'choose_photo': 'Choose Photo',
        'use_camera': 'Use Camera',
        'security_notice': 'All your personal data is encrypted and stored securely using blockchain technology.',
        'track_placeholder': 'Enter application ID...',
        'view_all': 'View All',
        'chat_history': 'Chat History',
        'new_chat': 'New Chat',
        'language_modal_title': 'Choose Response Language',
        'language_modal_subtitle': 'भाषा छान्नुहोस् / Select Language',
        'lang_english': 'English',
        'lang_nepali': 'नेपाली',
        'camera_capture': 'Capture',
        'camera_cancel': 'Cancel',
        'empty_tab_browse': 'Browse Services',
        'empty_tab_settings': 'Settings',
        'profile_tab_personal': 'Personal Info',
        'profile_tab_contact': 'Contact',
        'profile_tab_documents': 'Documents',
        'profile_tab_activity': 'Activity Log',
        'settings_title': 'Settings',
        'general_settings': 'General Settings',
        'appearance': 'Appearance',
        'notifications_title': 'Notifications',
        'camera_title': 'Capture Photo',
        'input_tip': 'Press Enter to send',
        'ai_status_ready': 'AI Ready',
        'identity_desc': 'Digital identity features coming soon...',
        'passport_desc': 'Passport application and tracking features...',
        'payments_desc': 'Payment services and billing features...',
        'voting_desc': 'Digital voting features coming soon...',
        'applications_desc': 'Track all your applications here...'
    },
    
    nepali: {
        // Header
        'header_search': 'सेवा, दस्तावेज खोज्नुहोस्...',
        'header_notifications': 'सूचनाहरु',
        'header_language': 'भाषा परिवर्तन गर्नुहोस्',
        'header_profile': 'मेरो प्रोफाइल',
        'header_settings': 'सेटिङ्स',
        'header_security': 'सुरक्षा र गोपनीयता',
        'header_help': 'मद्दत र समर्थन',
        'header_logout': 'बाहिर निस्कनुहोस्',
        
        // Sidebar
        'sidebar_dashboard': 'ड्याशबोर्ड',
        'sidebar_ai': 'एआई सहायक',
        'sidebar_services': 'सबै सेवाहरु',
        'sidebar_identity': 'डिजिटल पहिचान',
        'sidebar_passport': 'पासपोर्ट',
        'sidebar_documents': 'दस्तावेजहरु',
        'sidebar_payments': 'भुक्तानी',
        'sidebar_voting': 'मतदान',
        'sidebar_applications': 'मेरा आवेदनहरु',
        'sidebar_profile': 'प्रोफाइल',
        'sidebar_settings': 'सेटिङ्स',
        
        // Dashboard
        'dashboard_welcome': 'स्वागत छ, {name}! 👋',
        'dashboard_subtitle': 'आज तपाईंको सेवाहरुमा के भइरहेको छ',
        'dashboard_ask_ai': 'एआई सहायकलाई सोध्नुहोस्',
        'dashboard_stats_citizens': 'सक्रिय नागरिकहरु',
        'dashboard_stats_applications': 'मेरा आवेदनहरु',
        'dashboard_stats_documents': 'जारी गरिएका दस्तावेजहरु',
        'dashboard_stats_satisfaction': 'सन्तुष्टि दर',
        'dashboard_apply': 'सेवाको लागि आवेदन गर्नुहोस्',
        'dashboard_apply_desc': '120+ सरकारी सेवाहरुको द्रुत पहुँच',
        'dashboard_browse': 'सेवाहरु ब्राउज गर्नुहोस्',
        'dashboard_track': 'आवेदनहरु ट्र्याक गर्नुहोस्',
        'dashboard_track_desc': 'तपाईंको आवेदनहरुको वास्तविक समय स्थिति',
        'dashboard_payments': 'विचाराधीन भुक्तानीहरु',
        'dashboard_payments_desc': 'तपाईंको बिलहरु र भुक्तानीहरु प्रबन्ध गर्नुहोस्',
        'dashboard_recent': 'हालको गतिविधि',
        'dashboard_notices': 'महत्त्वपूर्ण सूचनाहरु',
        'dashboard_popular': 'लोकप्रिय सेवाहरु',
        
        // AI Assistant
        'ai_title': 'एआई-संचालित सेवा सहायक',
        'ai_subtitle': 'सरकारी सेवाहरु बारे कुनै पनि कुरा सोध्नुहोस्',
        'ai_24_7': '२४/७ उपलब्ध',
        'ai_bilingual': 'द्विभाषिक',
        'ai_secure': 'सुरक्षित',
        'ai_powered': 'एआई-संचालित',
        'ai_welcome': 'नमस्ते! 🙏 मैले आज तपाईंलाई कसरी मद्दत गर्न सक्छु?',
        'ai_help_text': 'मैले तपाईंलाई नागरिकता, पासपोर्ट, लाइसेन्स, र सबै सरकारी सेवाहरुमा मद्दत गर्न सक्छु',
        'ai_placeholder': 'आफ्नो प्रश्न टाइप गर्नुहोस् वा आवाज प्रयोग गर्नुहोस्...',
        'ai_citizenship': 'नागरिकताको लागि आवेदन गर्नुहोस्',
        'ai_passport': 'पासपोर्ट ट्र्याक गर्नुहोस्',
        'ai_bills': 'बिलहरु तिर्नुहोस्',
        'ai_nepali': 'नेपालीमा सोध्नुहोस्',
        
        // Profile
        'profile_complete': 'आफ्नो प्रोफाइल पूरा गर्नुहोस्',
        'profile_personal': 'व्यक्तिगत जानकारी',
        'profile_photo': 'प्रोफाइल तस्बिर अपलोड गर्नुहोस्',
        'profile_address': 'ठेगाना जानकारी',
        'profile_documents': 'पहिचान दस्तावेजहरु',
        'profile_full_name_en': 'पूरा नाम (अङ्ग्रेजी)',
        'profile_full_name_np': 'पूरा नाम (नेपाली)',
        'profile_dob': 'जन्ममिति',
        'profile_gender': 'लिङ्ग',
        'profile_blood': 'रक्त समूह',
        'profile_mobile': 'मोबाइल नम्बर',
        'profile_province': 'प्रदेश',
        'profile_district': 'जिल्ला',
        'profile_municipality': 'नगरपालिका',
        'profile_ward': 'वार्ड न.',
        'profile_citizenship': 'नागरिकता नम्बर',
        'profile_passport': 'पासपोर्ट नम्बर',
        'profile_next': 'अगला',
        'profile_previous': 'पिछला',
        'profile_complete_setup': 'सेटअप पूरा गर्नुहोस्',
        
        // Settings
        'settings_general': 'सामान्य सेटिङ्स',
        'settings_appearance': 'उपस्थिति',
        'settings_notifications': 'सूचनाहरु',
        'settings_privacy': 'गोपनीयता र डेटा',
        'settings_security': 'सुरक्षा सेटिङ्स',
        'settings_autosave': 'ऑटो-सेभ फर्मस',
        'settings_autosave_desc': 'फर्म प्रगति स्वचालित रूपमा सेभ गर्नुहोस्',
        'settings_remember': 'लग इन याद राख्नुहोस्',
        'settings_remember_desc': 'यस डिभाइसमा लग इन रहनुहोस्',
        'settings_theme': 'थीम',
        'settings_light': 'हल्का',
        'settings_dark': 'गहिरो',
        'settings_push': 'पुश सूचनाहरु',
        'settings_push_desc': 'महत्त्वपूर्ण अपडेटहरुको लागि सतर्कताहरु प्राप्त गर्नुहोस्',
        'settings_download': 'मेरो डेटा डाउनलोड गर्नुहोस्',
        'settings_delete': 'डेटा हटाउन अनुरोध गर्नुहोस्',
        'settings_2fa': 'दुई-कारक प्रमाणीकरण',
        'settings_2fa_desc': 'आफ्नो खातामा अतिरिक्त सुरक्षा थप्नुहोस्',
        'settings_biometric': 'बायोमेट्रिक लग इन',
        'settings_biometric_desc': 'लग इन गर्न औंठोको छाप वा अनुहार आईडी प्रयोग गर्नुहोस्',
        
        // Buttons
        'btn_apply': 'आवेदन गर्नुहोस्',
        'btn_cancel': 'रद्द गर्नुहोस्',
        'btn_save': 'सेभ गर्नुहोस्',
        'btn_delete': 'हटाउनुहोस्',
        'btn_edit': 'सम्पादन गर्नुहोस्',
        'btn_close': 'बन्द गर्नुहोस्',
        'btn_next': 'अगला',
        'btn_previous': 'पिछला',
        'btn_submit': 'पेश गर्नुहोस्',
        'btn_logout': 'बाहिर निस्कनुहोस्',
        
        // Messages
        'msg_success': 'कार्य सफलतापूर्वक पूरा भयो!',
        'msg_error': 'एक त्रुटि भयो। कृपया पुनः प्रयास गर्नुहोस्।',
        'msg_loading': 'लोड हुँदैछ...',
        'msg_required': 'यो क्षेत्र आवश्यक छ',
        
        // LOGIN PAGE
        'login_title': 'स्वागत छ फिर्ता! 👋',
        'login_subtitle': 'आफ्नो सरकारी सेवाहरु पहुँच गर्न साइन इन गर्नुहोस्',
        'login_credentials': 'लेखपत्र',
        'login_biometric': 'बायोमेट्रिक',
        'login_faceId': 'अनुहार आईडी',
        'login_email': 'ईमेल वा राष्ट्रिय ID',
        'login_email_placeholder': 'आफ्नो ईमेल वा NP-XXXX-XXXX प्रविष्ट गर्नुहोस्',
        'login_password': 'पासवर्ड',
        'login_password_placeholder': 'आफ्नो पासवर्ड प्रविष्ट गर्नुहोस्',
        'login_remember': 'मलाई याद राख्नुहोस्',
        'login_forgot': 'पासवर्ड भुल्नु भयो?',
        'login_signin': 'साइन इन गर्नुहोस्',
        'login_or_continue': 'वा यससँग जारी गर्नुहोस्',
        'login_create_account': 'खाता छैन?',
        'login_create_link': 'खाता बनाउनुहोस्',
        'login_scanning': 'फिंगरप्रिन्ट स्क्यान गरिँदैछ...',
        'login_analyzing': 'आफ्नो अनुहार विश्लेषण गरिँदैछ...',
        'login_place_finger': 'सेन्सरमा आफ्नो औंठो राख्नुहोस्',
        'login_position_face': 'सर्कलमा आफ्नो अनुहार राख्नुहोस्',
        'login_verify': 'प्रमाणित गरिँदैछ...',
        'login_scan_finger': 'फिंगरप्रिन्ट स्क्यान गर्नुहोस्',
        'login_start_face': 'अनुहार पहिचान सुरु गर्नुहोस्',
        'login_verified': 'अनुहार सफलतापूर्वक प्रमाणित!',
        'login_authenticating': 'प्रमाणीकरण हुँदैछ...',
        'login_success': 'साइन इन सफल! पुनः निर्देशन हुँदैछ...',
        'login_camera_error': 'क्यामरा पहुँच गर्न सकिएन। कृपया अनुमति जाँच गर्नुहोस्।',
        'login_feature_secure': 'सुरक्षित र एनक्रिप्ट गरिएको',
        'login_feature_secure_desc': 'बैंक-स्तरको सुरक्षा',
        'login_feature_biometric': 'बायोमेट्रिक साइन इन',
        'login_feature_biometric_desc': 'अनुहार र फिंगरप्रिन्ट',
        'login_feature_services': '120+ सेवाहरु',
        'login_feature_services_desc': 'सबै एक ठाउँमा',
        'login_feature_multi': 'बहु-भाषा',
        'login_feature_multi_desc': '7+ भाषा',
        
        // SIGNUP/REGISTRATION
        'signup_title': 'आफ्नो खाता बनाउनुहोस्',
        'signup_subtitle': 'नेपाल ई-गभर्नेन्स प्ल्याटफर्ममा जोडिनुहोस्',
        'signup_email': 'ईमेल ठेगाना',
        'signup_fullname': 'पूरा नाम',
        'signup_password': 'पासवर्ड बनाउनुहोस्',
        'signup_confirm_password': 'पासवर्ड पुष्टि गर्नुहोस्',
        'signup_terms': 'मैले सेवा शर्तहरु सहमत छु',
        'signup_privacy': 'गोपनीयता नीति',
        'signup_button': 'खाता बनाउनुहोस्',
        'signup_have_account': 'पहिले नै खाता छ?',
        'signup_signin_link': 'साइन इन',
        
        // FORM LABELS & PLACEHOLDERS
        'form_required': 'आवश्यक क्षेत्र',
        'form_optional': 'वैकल्पिक',
        'form_invalid_email': 'अमान्य ईमेल ठेगाना',
        'form_password_short': 'पासवर्ड कम्तिमा 8 वर्ण हुनुपर्छ',
        'form_passwords_mismatch': 'पासवर्ड मेल खाएन',
        'form_submit': 'जमा गर्नुहोस्',
        'form_cancel': 'रद्द गर्नुहोस्',
        'form_save': 'परिवर्तन सेभ गर्नुहोस्',
        'form_update': 'अपडेट गर्नुहोस्',
        'form_delete': 'हटाउनुहोस्',
        'form_reset': 'रिसेट गर्नुहोस्',
        'form_clear': 'फर्म खाली गर्नुहोस्',
        
        // DROPDOWN ITEMS
        'menu_profile': 'मेरो प्रोफाइल',
        'menu_settings': 'सेटिङ्स',
        'menu_security': 'सुरक्षा र गोपनीयता',
        'menu_help': 'मद्दत र समर्थन',
        'menu_logout': 'बाहिर निस्कनुहोस्',
        'menu_switch_language': 'भाषा परिवर्तन गर्नुहोस्',
        'menu_theme': 'थीम परिवर्तन गर्नुहोस्',
        'menu_notifications': 'सूचनाहरु व्यवस्थापन गर्नुहोस्',
        
        // MODAL BUTTONS
        'modal_close': 'बन्द गर्नुहोस्',
        'modal_confirm': 'पुष्टि गर्नुहोस्',
        'modal_cancel': 'रद्द गर्नुहोस्',
        'modal_save': 'सेभ गर्नुहोस्',
        'modal_delete': 'हटाउनुहोस्',
        'modal_edit': 'सम्पादन गर्नुहोस्',
        'modal_view': 'विवरण हेर्नुहोस्',
        'modal_download': 'डाउनलोड गर्नुहोस्',
        
        // NOTIFICATIONS
        'notif_new': 'तपाईंको नयाँ सूचनाहरु छन्',
        'notif_all': 'सबै पढिएको चिन्ह गर्नुहोस्',
        'notif_clear': 'सबै मेटाउनुहोस्',
        'notif_empty': 'कुनै सूचना छैन',
        'notif_settings': 'सूचना सेटिङ्स',
        
        // ERRORS & VALIDATION
        'error_title': 'त्रुटि',
        'error_invalid_credentials': 'अमान्य ईमेल वा पासवर्ड',
        'error_account_locked': 'आफ्नो खाता लक भएको छ',
        'error_network': 'नेटवर्क त्रुटि। कृपया पुनः प्रयास गर्नुहोस्।',
        'error_server': 'सर्भर त्रुटि। कृपया पछि प्रयास गर्नुहोस्।',
        'error_timeout': 'अनुरोध समय सकिएको। कृपया पुनः प्रयास गर्नुहोस्।',
        'error_not_found': 'पृष्ठ फेला परेन',
        'error_unauthorized': 'अनुमति नदिइएको पहुँच',
        'error_forbidden': 'पहुँच गर्न इनकार गरिएको',
        
        // SUCCESS MESSAGES
        'success_login': 'सफलतापूर्वक साइन इन!',
        'success_logout': 'सफलतापूर्वक बाहिर निस्कियो!',
        'success_saved': 'परिवर्तनहरु सफलतापूर्वक सेभ!',
        'success_deleted': 'वस्तु सफलतापूर्वक हटाइयो!',
        'success_updated': 'सफलतापूर्वक अपडेट!',
        'success_created': 'सफलतापूर्वक बनेको!',
        
        // CONFIRMATION DIALOGS
        'confirm_logout': 'के तपाई बाहिर निस्कन चाहनुहुन्छ?',
        'confirm_delete': 'के तपाई यो वस्तु हटाउन चाहनुहुन्छ?',
        'confirm_discard': 'अलक गरिएका परिवर्तनहरु हराउनुहोस्?',
        
        // UI CONTROLS
        'ui_search': 'खोज गर्नुहोस्',
        'ui_filter': 'फिल्टर गर्नुहोस्',
        'ui_sort': 'क्रमबद्ध गर्नुहोस्',
        'ui_export': 'निर्यात गर्नुहोस्',
        'ui_import': 'आयात गर्नुहोस्',
        'ui_refresh': 'ताजा गर्नुहोस्',
        'ui_back': 'पछाडि',
        'ui_forward': 'अगाडि',
        'ui_home': 'गृह',
        'ui_menu': 'मेनु',
        'ui_more': 'अधिक',
        'ui_loading': 'लोड हुँदैछ...',
        'ui_no_data': 'कुनै डेटा उपलब्ध छैन',
        'ui_empty_state': 'यहाँ कुनै कुरा छैन',
        // App-specific
        'app_name': 'स्मार्ट नेपाल',
        'app_subtitle': 'नेपाल ई-गभर्नेन्स',
        'quick_apply_citizenship': 'नागरिकताको लागि आवेदन',
        'quick_apply_passport': 'पासपोर्ट नवीकरण',
        'quick_apply_payments': 'बिलहरु तिर्नुहोस्',
        'contact_police': 'प्रहरी',
        'contact_support': 'समर्थन',
        'footer_version': 'संस्करण {version}',
        'footer_copyright': '© 2025 नेपाल सरकार',
        'loading_title': 'नेपाल ई-गभर्नेन्स',
        'loading_message': 'तपाईंको सेवाहरू लोड भइरहेको छ...',
        'toast_success': 'सफलता!',
        'choose_photo': 'फोटो छान्नुहोस्',
        'use_camera': 'क्यामेरा प्रयोग गर्नुहोस्',
        'security_notice': 'तपाईंको व्यक्तिगत डेटा इन्क्रिप्टेड र सुरक्षित रूपमा भण्डारण गरिन्छ।',
        'track_placeholder': 'आवेदन आईडी प्रविष्ट गर्नुहोस्...',
        'view_all': 'सबै हेर्नुहोस्',
        'chat_history': 'च्याट इतिहास',
        'new_chat': 'नयाँ च्याट',
        'language_modal_title': 'प्रतिक्रिया भाषा छान्नुहोस्',
        'language_modal_subtitle': 'भाषा छान्नुहोस् / Select Language',
        'lang_english': 'English',
        'lang_nepali': 'नेपाली',
        'camera_capture': 'क्याप्चर',
        'camera_cancel': 'रद्द गर्नुहोस्',
        'empty_tab_browse': 'सेवाहरु ब्राउज गर्नुहोस्',
        'empty_tab_settings': 'सेटिङ्स',
        'profile_tab_personal': 'व्यक्तिगत जानकारी',
        'profile_tab_contact': 'सम्पर्क',
        'profile_tab_documents': 'दस्तावेजहरु',
        'profile_tab_activity': 'गतिविधि लग',
        'settings_title': 'सेटिङ्स',
        'general_settings': 'सामान्य सेटिङ्स',
        'appearance': 'उपस्थिति',
        'notifications_title': 'सूचनाहरु',
        'camera_title': 'फोटो लिउनुहोस्',
        'input_tip': 'इन्टर थिचेर पठाउनुहोस्',
        'ai_status_ready': 'AI तयार छ',
        'identity_desc': 'डिजिटल पहिचान सुविधाहरु चाँडै आउनेछन्...',
        'passport_desc': 'पासपोर्ट आवेदन र ट्र्याकिङ सुविधाहरु...',
        'payments_desc': 'भुक्तानी सेवाहरु र बिलिङ सुविधाहरु...',
        'voting_desc': 'डिजिटल मतदान सुविधाहरु चाँडै आउनेछन्...',
        'applications_desc': 'यहाँ तपाईंका सबै आवेदनहरु ट्र्याक गर्नुहोस्...'
    }
};

// ============================================
// LANGUAGE FUNCTIONS
// ============================================

function getTranslation(key, language = null) {
    const lang = language || localStorage.getItem('appLanguage') || 'english';
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS['english']?.[key] || key;
}

function setAppLanguage(language) {
    if (language !== 'english' && language !== 'nepali') {
        language = 'english';
    }
    
    localStorage.setItem('appLanguage', language);
    document.documentElement.lang = language === 'nepali' ? 'ne' : 'en';
    document.body.setAttribute('data-language', language);
    
    // Apply Nepali font if needed
    if (language === 'nepali') {
        document.body.style.fontFamily = "'Noto Sans Devanagari', 'Inter', sans-serif";
    } else {
        document.body.style.fontFamily = "'Inter', sans-serif";
    }
    
    console.debug('[lang] setAppLanguage -> updateAllUIText with', language);
    updateAllUIText(language);

    // Also ask the app to re-populate any dynamic content that may not
    // be backed by `data-i18n` attributes (services, activity lists, etc.)
    try {
        if (typeof populateAllContent === 'function') {
            console.debug('[lang] setAppLanguage -> calling populateAllContent to refresh dynamic content');
            populateAllContent();
        }
    } catch (e) {
        console.warn('populateAllContent unavailable during setAppLanguage:', e);
    }
    return language;
}

function updateAllUIText(language = null) {
    const lang = language || localStorage.getItem('appLanguage') || 'english';
    console.debug('[lang] updateAllUIText running for', lang);
    
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = getTranslation(key, lang);
    });
    
    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.placeholder = getTranslation(key, lang);
    });
    
    // Update aria-labels
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
        const key = el.getAttribute('data-i18n-aria');
        el.setAttribute('aria-label', getTranslation(key, lang));
    });

    if (typeof window.updateWelcomeMessage === 'function') {
        window.updateWelcomeMessage();
    }
}

function getCurrentLanguage() {
    return localStorage.getItem('appLanguage') || 'english';
}

function getLanguageName(lang) {
    return lang === 'nepali' ? 'नेपाली' : 'English';
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedLanguage = localStorage.getItem('appLanguage') || 'english';
    setAppLanguage(savedLanguage);
});
