/**
 * Table Renderer Utility
 * Modern table rendering with background highlighting
 */

const TableRenderer = {
    /**
     * Render a modern table with proper highlighting
     * @param {string} containerId - Container element ID
     * @param {Object} tableData - Table data with headers and rows
     */
    render(containerId, tableData) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container #${containerId} not found`);
            return;
        }

        const html = `
            <div class="chart-card-modern">
                <div class="table-wrapper" style="border: none; box-shadow: none;">
                    <table class="table-modern">
                        <thead>
                            <tr>
                                ${tableData.headers.map(h => `<th>${h}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${this.renderRows(tableData.rows)}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        container.innerHTML = html;
    },

    /**
     * Render table rows with smart formatting
     */
    renderRows(rows) {
        return rows.map(row => {
            const isHighlight = row.highlight || false;
            const rowClass = isHighlight ? 'style="background: var(--color-primary-light); font-weight: 600;"' : '';

            const cells = this.renderCells(row);
            return `<tr ${rowClass}>${cells.join('')}</tr>`;
        }).join('');
    },

    /**
     * Render table cells with smart formatting and highlighting
     */
    renderCells(row) {
        return Object.keys(row)
            .filter(k => k !== 'highlight')
            .map(key => {
                const value = row[key];
                return this.formatCell(key, value);
            });
    },

    /**
     * Format a single cell based on key and value
     */
    formatCell(key, value) {
        // Handle null/undefined
        if (value === null || value === undefined) {
            return '<td style="text-align: right; color: #9ca3af;">-</td>';
        }

        // Handle percentages and variations
        if (key.includes('pct') || key === 'var' || key.includes('Var')) {
            return this.formatPercentCell(value);
        }

        // Handle trend columns
        if (key.includes('trend') || key.includes('Trend')) {
            return this.formatTrendCell(value);
        }

        // Handle evaluation/assessment columns
        if (key.includes('valutazione') || key.includes('assessment') || key.includes('interpretazione') || key.includes('alert')) {
            return this.formatEvaluationCell(value);
        }

        // Handle priority columns
        if (key.includes('priorita') || key.includes('priority')) {
            return this.formatPriorityCell(value);
        }

        // Handle numeric values
        if (typeof value === 'number' && !key.includes('categoria') && !key.includes('componente') && !key.includes('indice')) {
            return `<td style="text-align: right;">${Utils.formatNumber(value, 2)}</td>`;
        }

        // Default text cell
        return `<td>${value}</td>`;
    },

    /**
     * Format percentage cell with colored background
     */
    formatPercentCell(value) {
        if (value === null || value === undefined) {
            return '<td style="text-align: right; color: #9ca3af;">-</td>';
        }

        const formatted = Utils.formatPercent(value);
        let badgeClass = '';

        if (value < -10) {
            badgeClass = 'bg-danger-light';
        } else if (value < 0) {
            badgeClass = 'bg-warning-light';
        } else if (value > 10) {
            badgeClass = 'bg-success-light';
        } else if (value > 0) {
            badgeClass = 'bg-info-light';
        }

        if (badgeClass) {
            return `<td style="text-align: right;"><span class="${badgeClass}">${formatted}</span></td>`;
        }

        return `<td style="text-align: right;">${formatted}</td>`;
    },

    /**
     * Format trend cell with colored background
     */
    formatTrendCell(value) {
        if (!value) return '<td>-</td>';

        const colorMap = {
            'Miglioramento': 'bg-success-light',
            'Peggioramento': 'bg-danger-light',
            'Stabile': 'bg-info-light',
            'Invariato': 'bg-info-light'
        };

        let badgeClass = '';
        for (const [keyword, cls] of Object.entries(colorMap)) {
            if (value.includes(keyword)) {
                badgeClass = cls;
                break;
            }
        }

        if (badgeClass) {
            return `<td><span class="${badgeClass}">${value}</span></td>`;
        }

        return `<td>${value}</td>`;
    },

    /**
     * Format evaluation cell with colored background
     */
    formatEvaluationCell(value) {
        if (!value) return '<td>-</td>';

        const colorMap = {
            'Critico': 'bg-danger-light',
            'Elevato': 'bg-danger-light',
            'Molto Alto': 'bg-danger-light',
            'Alto': 'bg-warning-light',
            'Medio': 'bg-warning-light',
            'Basso': 'bg-success-light',
            'Ottimo': 'bg-success-light',
            'Buono': 'bg-success-light',
            'In linea': 'bg-success-light',
            'Ampiamente in linea': 'bg-success-light',
            'Insufficiente': 'bg-danger-light',
            'Sufficiente': 'bg-warning-light',
            'Default': 'bg-danger-light',
            'Zona grigia': 'bg-warning-light'
        };

        let badgeClass = '';
        for (const [keyword, cls] of Object.entries(colorMap)) {
            if (value.includes(keyword)) {
                badgeClass = cls;
                break;
            }
        }

        if (badgeClass) {
            return `<td><span class="${badgeClass}">${value}</span></td>`;
        }

        return `<td>${value}</td>`;
    },

    /**
     * Format priority cell with colored background
     */
    formatPriorityCell(value) {
        if (!value) return '<td>-</td>';

        const colorMap = {
            'Alta': 'bg-danger-light',
            'High': 'bg-danger-light',
            'Media': 'bg-warning-light',
            'Medium': 'bg-warning-light',
            'Bassa': 'bg-info-light',
            'Low': 'bg-info-light'
        };

        const badgeClass = colorMap[value] || '';

        if (badgeClass) {
            return `<td><span class="${badgeClass}"><strong>${value}</strong></span></td>`;
        }

        return `<td><strong>${value}</strong></td>`;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TableRenderer;
}
