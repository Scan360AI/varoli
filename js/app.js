/**
 * SCAN360 Dashboard - Main Application
 * Handles data loading, initialization, and global state
 */

const App = {
    // Global data storage
    data: {
        company: null,
        config: null,
        kpis: null,
        content: null,
        charts: null,
        tables: null
    },

    // Loading state
    isLoading: false,
    loadingErrors: [],

    /**
     * Initialize application
     */
    async init() {
        console.log('🚀 Initializing SCAN360 Dashboard...');

        // Check authentication
        if (!Utils.requireAuth()) {
            return;
        }

        // Show loading state
        this.showLoading();

        try {
            // Load all JSON data in parallel
            await this.loadAllData();

            // Initialize UI components
            this.initializeUI();

            // Hide loading state
            this.hideLoading();

            console.log('✅ SCAN360 Dashboard initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing dashboard:', error);
            this.showError('Errore nel caricamento dei dati. Riprova.');
            this.hideLoading();
        }
    },

    /**
     * Load all JSON data files
     */
    async loadAllData() {
        const files = [
            { key: 'company', path: 'data/company.json' },
            { key: 'config', path: 'data/config.json' },
            { key: 'kpis', path: 'data/kpis.json' },
            { key: 'content', path: 'data/content.json' },
            { key: 'charts', path: 'data/charts.json' },
            { key: 'tables', path: 'data/tables.json' }
        ];

        const promises = files.map(file =>
            fetch(file.path)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to load ${file.path}`);
                    }
                    return response.json();
                })
                .then(data => {
                    this.data[file.key] = data;
                    console.log(`✓ Loaded ${file.key}`);
                })
                .catch(error => {
                    console.error(`✗ Error loading ${file.path}:`, error);
                    this.loadingErrors.push({ file: file.key, error });
                    throw error;
                })
        );

        await Promise.all(promises);

        // Store in session for quick access
        Utils.setSessionData('scan360_data', this.data);

        return this.data;
    },

    /**
     * Get cached data or reload
     */
    getData() {
        if (this.data.company) {
            return this.data;
        }

        // Try to get from session
        const cachedData = Utils.getSessionData('scan360_data');
        if (cachedData) {
            this.data = cachedData;
            return this.data;
        }

        // Otherwise reload
        console.warn('Data not loaded, reloading...');
        this.loadAllData();
        return this.data;
    },

    /**
     * Initialize UI components
     */
    initializeUI() {
        // Update company info in sidebar
        this.updateCompanyInfo();

        // Update user info
        this.updateUserInfo();

        // Set active navigation
        this.setActiveNavigation();

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Setup logout button
        this.setupLogout();

        // Setup export button
        this.setupExportButton();
    },

    /**
     * Update company information in sidebar
     */
    updateCompanyInfo() {
        const companyData = this.data.company;
        if (!companyData) return;

        const companyNameEl = document.querySelector('.company-name');
        const companyDetailEl = document.querySelector('.company-detail');

        if (companyNameEl) {
            companyNameEl.textContent = companyData.shortName || companyData.name;
        }

        if (companyDetailEl) {
            companyDetailEl.textContent = `Anno fiscale ${companyData.fiscalYear}`;
        }
    },

    /**
     * Update user information in header
     */
    updateUserInfo() {
        const username = Utils.getUsername();
        const userNameEl = document.querySelector('.user-name');
        const userAvatarEl = document.querySelector('.user-avatar');

        if (userNameEl) {
            userNameEl.textContent = username;
        }

        if (userAvatarEl) {
            const initials = username.split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .substr(0, 2);
            userAvatarEl.textContent = initials;
        }
    },

    /**
     * Set active navigation item based on current page
     */
    setActiveNavigation() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navItems = document.querySelectorAll('.nav-item');

        navItems.forEach(item => {
            const href = item.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    },

    /**
     * Setup logout functionality
     */
    setupLogout() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (confirm('Sei sicuro di voler uscire?')) {
                    Utils.logout();
                }
            });
        }
    },

    /**
     * Setup export button
     */
    setupExportButton() {
        const exportBtn = document.getElementById('exportPdfBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', async () => {
                await ExportAPI.generatePDF();
            });
        }
    },

    /**
     * Show loading state
     */
    showLoading() {
        this.isLoading = true;
        const loadingEl = document.getElementById('loadingOverlay');
        if (loadingEl) {
            loadingEl.style.display = 'flex';
        }
    },

    /**
     * Hide loading state
     */
    hideLoading() {
        this.isLoading = false;
        const loadingEl = document.getElementById('loadingOverlay');
        if (loadingEl) {
            loadingEl.style.display = 'none';
        }
    },

    /**
     * Show error message
     */
    showError(message) {
        Utils.showToast(message, 'error', 5000);
    },

    /**
     * Get theme configuration
     */
    getTheme() {
        return this.data.config?.theme || {};
    },

    /**
     * Get color from theme
     */
    getColor(colorPath) {
        const theme = this.getTheme();
        return Utils.getNestedProperty(theme.colors, colorPath);
    },

    /**
     * Get benchmark value
     */
    getBenchmark(key) {
        return this.data.config?.benchmarks?.[key];
    },

    /**
     * Get threshold value
     */
    getThreshold(category, level) {
        return this.data.config?.thresholds?.[category]?.[level];
    },

    /**
     * Get chart options
     */
    getChartOptions() {
        return this.data.config?.chartOptions || {};
    }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
}
