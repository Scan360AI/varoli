/**
 * SCAN360 - Main Application
 * Handles data loading and initialization
 */

const App = {
    data: {},

    /**
     * Initialize application
     */
    async init() {
        try {
            await this.loadData();
            this.updateHeaderIRP();
            this.initializeLogout();
            this.hideLoading();
        } catch (error) {
            console.error('Error initializing app:', error);
            alert('Errore durante il caricamento dei dati. Ricarica la pagina.');
        }
    },

    /**
     * Load all JSON data files
     */
    async loadData() {
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
                .then(res => res.json())
                .then(data => {
                    this.data[file.key] = data;
                })
        );

        await Promise.all(promises);
    },

    /**
     * Get loaded data
     */
    getData() {
        return this.data;
    },

    /**
     * Update header IRP badge
     */
    updateHeaderIRP() {
        const irpBadge = document.getElementById('headerIRPBadge');
        if (!irpBadge) return;

        // Get IRP from content or tables
        const irpData = this.data.tables?.irp_dettaglio?.irpOverall;
        if (!irpData) return;

        const score = irpData.score || 0;
        const category = irpData.category || '';

        irpBadge.innerHTML = `
            <span>IRP:</span>
            <span class="irp-badge-score">${score.toFixed(1)}</span>
            <span class="badge ${Utils.getRiskLevel(score) === 'low' ? 'success' : Utils.getRiskLevel(score) === 'medium' ? 'warning' : 'danger'}" style="background: white; color: var(--primary-color);">
                ${category}
            </span>
        `;
    },

    /**
     * Initialize logout functionality
     */
    initializeLogout() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (confirm('Sei sicuro di voler uscire?')) {
                    sessionStorage.clear();
                    window.location.href = 'login.html';
                }
            });
        }
    },

    /**
     * Hide loading overlay
     */
    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            setTimeout(() => {
                overlay.style.opacity = '0';
                setTimeout(() => {
                    overlay.style.display = 'none';
                }, 300);
            }, 200);
        }
    },

    /**
     * Show loading overlay
     */
    showLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = 'flex';
            overlay.style.opacity = '1';
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
}
