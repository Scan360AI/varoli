/**
 * Table Component
 * Creates dynamic tables from JSON data
 */

const TableComponent = {
    /**
     * Create table from data
     * @param {Object} tableData - Table data with headers and rows
     * @returns {HTMLElement} - Table wrapper element
     */
    create(tableData) {
        const wrapper = document.createElement('div');
        wrapper.className = 'table-wrapper';

        const table = document.createElement('table');
        table.className = 'data-table';

        // Create header
        const thead = this.createHeader(tableData.headers);
        table.appendChild(thead);

        // Create body
        const tbody = this.createBody(tableData.rows, tableData.headers);
        table.appendChild(tbody);

        wrapper.appendChild(table);

        return wrapper;
    },

    /**
     * Create table header
     */
    createHeader(headers) {
        const thead = document.createElement('thead');
        const tr = document.createElement('tr');

        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            tr.appendChild(th);
        });

        thead.appendChild(tr);
        return thead;
    },

    /**
     * Create table body
     */
    createBody(rows, headers) {
        const tbody = document.createElement('tbody');

        rows.forEach(row => {
            const tr = document.createElement('tr');

            // Check if row should be highlighted
            if (row.highlight) {
                tr.classList.add('highlight');
            }

            // Get all row values in order of headers
            Object.keys(row).forEach(key => {
                if (key === 'highlight') return; // Skip highlight flag

                const td = document.createElement('td');
                const value = row[key];

                // Format value based on type
                td.innerHTML = this.formatCellValue(value, key);

                // Add alignment class if needed
                if (this.isNumericKey(key)) {
                    td.classList.add('text-right');
                }

                tr.appendChild(td);
            });

            tbody.appendChild(tr);
        });

        return tbody;
    },

    /**
     * Format cell value
     */
    formatCellValue(value, key) {
        // Handle null/undefined
        if (value === null || value === undefined) {
            return '<span class="text-muted">N/A</span>';
        }

        // Handle numbers with formatting
        if (typeof value === 'number') {
            // Percentage keys
            if (key.includes('pct') || key.includes('Percent') || key.includes('%')) {
                return Utils.formatPercent(value);
            }

            // Currency keys
            if (key.includes('2022') || key.includes('2023') || key.includes('2024') ||
                key.includes('valore') || key.includes('Value')) {
                return Utils.formatNumber(value, 0);
            }

            // Variance keys
            if (key.includes('var') || key.includes('Var') || key.includes('change') || key.includes('Change')) {
                const formatted = Utils.formatPercent(value);
                const className = value > 0 ? 'value-positive' : value < 0 ? 'value-negative' : 'value-neutral';
                return `<span class="${className}">${formatted}</span>`;
            }

            // Default number formatting
            return Utils.formatNumber(value);
        }

        // Handle strings with HTML
        if (typeof value === 'string') {
            // Check if contains HTML tags
            if (value.includes('<') && value.includes('>')) {
                return value;
            }

            // Check for trend indicators
            if (value.includes('↑') || value.includes('↓')) {
                const isPositive = value.includes('↑');
                const className = isPositive ? 'value-positive' : 'value-negative';
                return `<span class="${className}">${value}</span>`;
            }

            // Check for status keywords
            const statusMap = {
                'Ottimo': 'success',
                'Buono': 'success',
                'In linea': 'success',
                'Adeguato': 'warning',
                'Sufficiente': 'warning',
                'Insufficiente': 'danger',
                'Critico': 'danger',
                'Elevato': 'danger',
                'Peggioramento': 'danger',
                'Miglioramento': 'success'
            };

            for (const [keyword, status] of Object.entries(statusMap)) {
                if (value.includes(keyword)) {
                    return `<span class="text-${status}">${value}</span>`;
                }
            }

            return value;
        }

        return value;
    },

    /**
     * Check if key represents numeric data
     */
    isNumericKey(key) {
        const numericKeys = [
            'value', 'valore', 'amount', 'total',
            '2022', '2023', '2024',
            'pct', 'percent', '%',
            'var', 'change', 'delta'
        ];

        return numericKeys.some(k => key.toLowerCase().includes(k.toLowerCase()));
    },

    /**
     * Create table with title
     */
    createWithTitle(title, tableData, subtitle = null) {
        const container = document.createElement('div');
        container.className = 'content-section';

        // Title
        const header = document.createElement('div');
        header.className = 'section-header';

        const titleEl = document.createElement('h3');
        titleEl.className = 'section-title';
        titleEl.textContent = title;
        header.appendChild(titleEl);

        if (subtitle) {
            const subtitleEl = document.createElement('div');
            subtitleEl.className = 'section-description';
            subtitleEl.textContent = subtitle;
            header.appendChild(subtitleEl);
        }

        container.appendChild(header);

        // Table
        const table = this.create(tableData);
        container.appendChild(table);

        return container;
    },

    /**
     * Render table into container
     */
    render(container, tableData, title = null, subtitle = null) {
        if (title) {
            const section = this.createWithTitle(title, tableData, subtitle);
            container.appendChild(section);
        } else {
            const table = this.create(tableData);
            container.appendChild(table);
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TableComponent;
}
