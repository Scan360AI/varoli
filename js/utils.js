/**
 * SCAN360 - Utility Functions
 */

const Utils = {
    /**
     * Format number with thousands separator
     */
    formatNumber(value, decimals = 0) {
        if (value === null || value === undefined) return '-';
        const num = Number(value);
        if (isNaN(num)) return value;

        return new Intl.NumberFormat('it-IT', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(num);
    },

    /**
     * Format currency (Euro)
     */
    formatCurrency(value, decimals = 0) {
        if (value === null || value === undefined) return '-';
        const num = Number(value);
        if (isNaN(num)) return value;

        // Format in thousands (K) or millions (M)
        const absNum = Math.abs(num);
        let formatted;

        if (absNum >= 1000000) {
            formatted = this.formatNumber(num / 1000000, 2) + ' M';
        } else if (absNum >= 1000) {
            formatted = this.formatNumber(num / 1000, 1) + ' K';
        } else {
            formatted = this.formatNumber(num, decimals);
        }

        return '€' + formatted;
    },

    /**
     * Format percentage
     */
    formatPercent(value, decimals = 2) {
        if (value === null || value === undefined) return '-';
        const num = Number(value);
        if (isNaN(num)) return value;

        return this.formatNumber(num, decimals) + '%';
    },

    /**
     * Get trend icon based on direction
     */
    getTrendIcon(direction) {
        if (direction === 'up') return 'fa-arrow-up';
        if (direction === 'down') return 'fa-arrow-down';
        return 'fa-minus';
    },

    /**
     * Get risk level from IRP score
     */
    getRiskLevel(score) {
        if (score >= 75) return 'low';
        if (score >= 50) return 'medium';
        return 'high';
    },

    /**
     * Get risk category from IRP score
     */
    getRiskCategory(score) {
        if (score >= 90) return 'A';
        if (score >= 80) return 'B';
        if (score >= 70) return 'C';
        if (score >= 60) return 'D';
        return 'E';
    },

    /**
     * Generate unique ID
     */
    generateId() {
        return 'id_' + Math.random().toString(36).substr(2, 9);
    },

    /**
     * Debounce function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}
