/**
 * SCAN360 Dashboard - Utility Functions
 * Formatters, helpers, and common functions
 */

const Utils = {
    /**
     * Format number as currency (EUR)
     */
    formatCurrency(value, decimals = 0) {
        if (value === null || value === undefined || isNaN(value)) {
            return 'N/A';
        }

        const absValue = Math.abs(value);
        const sign = value < 0 ? '-' : '';

        // Format in K or M
        if (absValue >= 1000000) {
            return `${sign}€ ${(absValue / 1000000).toFixed(2)} M`;
        } else if (absValue >= 1000) {
            return `${sign}€ ${(absValue / 1000).toFixed(decimals)} K`;
        } else {
            return `${sign}€ ${absValue.toLocaleString('it-IT', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
        }
    },

    /**
     * Format number as percentage
     */
    formatPercent(value, decimals = 2) {
        if (value === null || value === undefined || isNaN(value)) {
            return 'N/A';
        }
        return `${value.toFixed(decimals)}%`;
    },

    /**
     * Format number as decimal
     */
    formatNumber(value, decimals = 2) {
        if (value === null || value === undefined || isNaN(value)) {
            return 'N/A';
        }
        return value.toLocaleString('it-IT', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    },

    /**
     * Format large numbers with K/M suffix
     */
    formatLargeNumber(value, decimals = 0) {
        if (value === null || value === undefined || isNaN(value)) {
            return 'N/A';
        }

        const absValue = Math.abs(value);
        const sign = value < 0 ? '-' : '';

        if (absValue >= 1000000) {
            return `${sign}${(absValue / 1000000).toFixed(2)} M`;
        } else if (absValue >= 1000) {
            return `${sign}${(absValue / 1000).toFixed(decimals)} K`;
        } else {
            return `${sign}${absValue.toFixed(decimals)}`;
        }
    },

    /**
     * Get status class based on value and thresholds
     */
    getStatusClass(value, type = 'default') {
        if (value === null || value === undefined) return 'neutral';

        switch(type) {
            case 'positive-good': // Higher is better
                return value > 0 ? 'success' : 'danger';

            case 'negative-good': // Lower is better
                return value < 0 ? 'success' : 'danger';

            case 'margin': // EBITDA margin
                if (value >= 5) return 'success';
                if (value >= 0) return 'warning';
                return 'danger';

            case 'growth': // Revenue growth
                if (value >= 5) return 'success';
                if (value >= 0) return 'warning';
                return 'danger';

            default:
                return 'neutral';
        }
    },

    /**
     * Get trend icon based on direction
     */
    getTrendIcon(direction) {
        const icons = {
            'up': 'trending-up',
            'down': 'trending-down',
            'none': 'minus',
            'neutral': 'minus'
        };
        return icons[direction] || 'minus';
    },

    /**
     * Get status color from config
     */
    getStatusColor(status) {
        const colors = {
            'success': 'var(--color-success)',
            'warning': 'var(--color-warning)',
            'danger': 'var(--color-danger)',
            'info': 'var(--color-info)',
            'neutral': 'var(--color-neutral)'
        };
        return colors[status] || colors['neutral'];
    },

    /**
     * Format date
     */
    formatDate(dateString) {
        if (!dateString) return 'N/A';

        const date = new Date(dateString);
        return date.toLocaleDateString('it-IT', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
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
    },

    /**
     * Create Lucide icon element
     */
    createIcon(iconName, size = 16) {
        const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        icon.setAttribute('width', size);
        icon.setAttribute('height', size);
        icon.setAttribute('viewBox', '0 0 24 24');
        icon.setAttribute('fill', 'none');
        icon.setAttribute('stroke', 'currentColor');
        icon.setAttribute('stroke-width', '2');
        icon.setAttribute('stroke-linecap', 'round');
        icon.setAttribute('stroke-linejoin', 'round');
        icon.setAttribute('data-lucide', iconName);

        return icon;
    },

    /**
     * Show toast notification
     */
    showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            padding: 16px 24px;
            background: var(--color-${type === 'error' ? 'danger' : type});
            color: white;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    /**
     * Deep clone object
     */
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    /**
     * Safe get nested property
     */
    getNestedProperty(obj, path) {
        return path.split('.').reduce((current, prop) =>
            current?.[prop], obj);
    },

    /**
     * Calculate percentage change
     */
    calculatePercentChange(newValue, oldValue) {
        if (!oldValue || oldValue === 0) return null;
        return ((newValue - oldValue) / Math.abs(oldValue)) * 100;
    },

    /**
     * Get CSS variable value
     */
    getCSSVariable(variable) {
        return getComputedStyle(document.documentElement)
            .getPropertyValue(variable).trim();
    },

    /**
     * Animate counter
     */
    animateCounter(element, start, end, duration = 1000) {
        const startTime = performance.now();
        const difference = end - start;

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const current = start + (difference * progress);
            element.textContent = Math.round(current);

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    },

    /**
     * Generate unique ID
     */
    generateId() {
        return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return sessionStorage.getItem('scan360_authenticated') === 'true';
    },

    /**
     * Redirect to login if not authenticated
     */
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    },

    /**
     * Logout user
     */
    logout() {
        sessionStorage.clear();
        window.location.href = 'login.html';
    },

    /**
     * Get username
     */
    getUsername() {
        return sessionStorage.getItem('scan360_username') || 'User';
    },

    /**
     * Store data in session
     */
    setSessionData(key, data) {
        sessionStorage.setItem(key, JSON.stringify(data));
    },

    /**
     * Get data from session
     */
    getSessionData(key) {
        const data = sessionStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}
