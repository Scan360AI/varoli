/**
 * KPI Card Component
 * Renders a KPI card with icon, value, trend, and description
 */

const KPICard = {
    /**
     * Create a KPI card element
     * @param {Object} kpiData - KPI data from kpis.json
     * @returns {HTMLElement} - Card element
     */
    create(kpiData) {
        const card = document.createElement('div');
        card.className = `kpi-card border-${kpiData.status}`;

        // Header with title and icon
        const header = this.createHeader(kpiData);

        // Value
        const value = this.createValue(kpiData);

        // Description
        const description = this.createDescription(kpiData);

        // Trend
        const trend = this.createTrend(kpiData);

        // Action button (if any)
        const action = this.createAction(kpiData);

        card.appendChild(header);
        card.appendChild(value);
        if (description) card.appendChild(description);
        if (trend) card.appendChild(trend);
        if (action) card.appendChild(action);

        return card;
    },

    /**
     * Create card header with title and icon
     */
    createHeader(kpiData) {
        const header = document.createElement('div');
        header.className = 'kpi-header';

        const title = document.createElement('div');
        title.className = 'kpi-title';
        title.textContent = kpiData.title;

        const iconContainer = document.createElement('div');
        iconContainer.className = 'kpi-icon';
        iconContainer.innerHTML = `<i data-lucide="${kpiData.icon}"></i>`;

        header.appendChild(title);
        header.appendChild(iconContainer);

        return header;
    },

    /**
     * Create value element
     */
    createValue(kpiData) {
        const value = document.createElement('div');
        value.className = 'kpi-value';
        value.textContent = kpiData.displayValue || kpiData.value;
        return value;
    },

    /**
     * Create description element
     */
    createDescription(kpiData) {
        if (!kpiData.description) return null;

        const description = document.createElement('div');
        description.className = 'kpi-description';
        description.textContent = kpiData.description;
        return description;
    },

    /**
     * Create trend element
     */
    createTrend(kpiData) {
        if (!kpiData.trend) return null;

        const trendData = kpiData.trend;

        // Handle badges instead of trend
        if (trendData.badges && trendData.badges.length > 0) {
            const container = document.createElement('div');
            container.style.display = 'flex';
            container.style.gap = 'var(--space-2)';
            container.style.marginTop = 'var(--space-2)';

            trendData.badges.forEach(badge => {
                const badgeEl = document.createElement('span');
                badgeEl.className = `badge ${badge.class}`;
                badgeEl.textContent = badge.text;
                container.appendChild(badgeEl);
            });

            return container;
        }

        // Regular trend
        if (trendData.direction === 'none' && !trendData.value) return null;

        const trend = document.createElement('div');
        trend.className = `kpi-trend trend-${trendData.direction}`;

        if (trendData.iconClass && trendData.value !== null) {
            const icon = document.createElement('i');
            icon.setAttribute('data-lucide', Utils.getTrendIcon(trendData.direction));
            trend.appendChild(icon);
        }

        const text = document.createElement('span');
        if (trendData.displayValue) {
            text.textContent = `${trendData.displayValue}`;
            if (trendData.label) {
                text.textContent += ` ${trendData.label}`;
            }
        } else if (trendData.displayValue === null && trendData.label) {
            text.textContent = trendData.label;
        }

        trend.appendChild(text);

        return trend;
    },

    /**
     * Create action button
     */
    createAction(kpiData) {
        if (!kpiData.action || !kpiData.action.enabled) return null;

        const action = kpiData.action;
        const button = document.createElement('a');
        button.href = action.link || '#';
        button.className = action.buttonClass || 'btn btn-primary btn-sm';
        button.textContent = action.buttonText || 'Vedi dettagli';
        button.style.marginTop = 'var(--space-3)';
        button.style.display = 'inline-block';

        return button;
    },

    /**
     * Render multiple KPI cards into a container
     * @param {HTMLElement} container - Container element
     * @param {Array} kpiKeys - Array of KPI keys to render
     * @param {Object} kpisData - All KPIs data
     */
    renderMultiple(container, kpiKeys, kpisData) {
        container.innerHTML = '';
        container.className = 'kpi-grid';

        kpiKeys.forEach(key => {
            const kpiData = kpisData[key];
            if (kpiData) {
                const card = this.create(kpiData);
                container.appendChild(card);
            }
        });

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KPICard;
}
