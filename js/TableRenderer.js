/**
 * SCAN360 - Table Renderer Utility
 * Centralizes table rendering logic
 */

const TableRenderer = {
    /**
     * Render a standard financial table
     * @param {HTMLElement} container - The table element
     * @param {Object} config - Table configuration
     */
    renderTable(container, config) {
        if (!container) return;

        const { columns, rows, showYears } = config;

        // Build header
        const thead = `
            <thead>
                <tr>
                    ${columns.map(col => `
                        <th class="${col.align || ''}" style="${col.width ? `width: ${col.width};` : ''}">${col.label}</th>
                    `).join('')}
                </tr>
            </thead>
        `;

        // Build body
        const tbody = `
            <tbody>
                ${rows.map(row => {
                    if (row.isSpacer) {
                        return `<tr style="height: ${row.height || '12px'};"><td colspan="${columns.length}"></td></tr>`;
                    }

                    let className = '';
                    if (row.isHeader) className = 'table-primary';
                    if (row.isTotal) className = 'table-success';
                    if (row.isFinal) className = 'table-primary';
                    if (row.className) className = row.className;

                    return `
                        <tr class="${className}">
                            ${row.cells.map((cell, idx) => {
                                const col = columns[idx];
                                const align = cell.align || col.align || '';
                                const content = this.formatCell(cell.value, cell.type);

                                return `<td class="${align} ${cell.bold ? 'fw-bold' : ''}">${content}</td>`;
                            }).join('')}
                        </tr>
                    `;
                }).join('')}
            </tbody>
        `;

        container.innerHTML = thead + tbody;
    },

    /**
     * Format cell value based on type
     */
    formatCell(value, type) {
        if (value === null || value === undefined || value === '') return '-';

        switch (type) {
            case 'currency':
                return Utils.formatCurrency(value);
            case 'percent':
                return Utils.formatPercent(value);
            case 'number':
                return Utils.formatNumber(value);
            case 'badge':
                return `<span class="badge ${value.type}">${value.text}</span>`;
            default:
                return value;
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TableRenderer;
}
