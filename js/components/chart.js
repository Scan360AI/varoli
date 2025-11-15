/**
 * Chart Component
 * Wrapper for Chart.js to create charts from JSON data
 */

const ChartComponent = {
    /**
     * Default Chart.js configuration
     */
    defaultConfig: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    boxWidth: 12,
                    padding: 15,
                    font: {
                        size: 11
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleFont: {
                    size: 13,
                    weight: 'bold'
                },
                bodyFont: {
                    size: 12
                },
                padding: 10,
                cornerRadius: 4
            }
        },
        animation: {
            duration: 400
        }
    },

    /**
     * Color palette from config
     */
    colors: {
        primary: 'rgb(25, 25, 112)',
        secondary: 'rgb(77, 140, 87)',
        tertiary: 'rgb(217, 140, 0)',
        danger: 'rgb(214, 34, 70)',
        neutral: 'rgb(79, 109, 122)',
        success: '#4CAF50',
        warning: '#FFC107',
        info: '#4a69bd'
    },

    /**
     * Create chart from data
     * @param {string} canvasId - Canvas element ID
     * @param {Object} chartData - Chart data from charts.json
     * @returns {Chart} - Chart.js instance
     */
    create(canvasId, chartData) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            console.error(`Canvas element #${canvasId} not found`);
            return null;
        }

        const ctx = canvas.getContext('2d');

        // Prepare chart configuration based on type
        const config = this.prepareConfig(chartData);

        // Create chart
        return new Chart(ctx, config);
    },

    /**
     * Prepare Chart.js configuration from data
     */
    prepareConfig(chartData) {
        const type = chartData.type || 'line';
        const config = {
            type: type === 'mixed' ? 'bar' : type,
            data: this.prepareData(chartData),
            options: this.prepareOptions(chartData)
        };

        return config;
    },

    /**
     * Prepare chart data
     */
    prepareData(chartData) {
        const data = {
            labels: chartData.labels || [],
            datasets: []
        };

        // Convert datasets object to array
        const datasets = chartData.datasets;
        if (!datasets) return data;

        let colorIndex = 0;
        const colorKeys = Object.keys(this.colors);

        for (const [key, dataset] of Object.entries(datasets)) {
            const color = this.getDatasetColor(key, colorIndex++);

            const datasetConfig = {
                label: dataset.label || key,
                data: dataset.data || [],
                backgroundColor: this.getBackgroundColor(dataset.type || chartData.type, color),
                borderColor: color,
                borderWidth: 2,
                tension: 0,  // No curved lines
                fill: dataset.fill !== undefined ? dataset.fill : false,
                pointRadius: 3,
                pointHoverRadius: 5
            };

            // Handle mixed charts
            if (dataset.type) {
                datasetConfig.type = dataset.type;
            }

            // Handle second Y axis
            if (dataset.yAxisID) {
                datasetConfig.yAxisID = dataset.yAxisID;
            }

            // Handle stacked charts
            if (chartData.stacked) {
                datasetConfig.stack = 'stack0';
            }

            data.datasets.push(datasetConfig);
        }

        return data;
    },

    /**
     * Get color for dataset
     */
    getDatasetColor(key, index) {
        const colorMap = {
            'revenue': this.colors.primary,
            'ebitda': this.colors.secondary,
            'ebitdaMargin': this.colors.tertiary,
            'ebitdaPercent': this.colors.tertiary,
            'ebitdaMarginPercent': this.colors.tertiary,
            'pfnEbitda': this.colors.danger,
            'pfn': this.colors.danger,
            'threshold': this.colors.neutral,
            'company': this.colors.primary,
            'sector': this.colors.secondary,
            'target': this.colors.success,
            'roe': this.colors.danger,
            'roi': this.colors.info,
            'ros': this.colors.warning,
            'equity': this.colors.success,
            'financialDebt': this.colors.danger,
            'debtToEquity': this.colors.tertiary,
            'cash': this.colors.success,
            'totalDebt': this.colors.danger,
            'operating': this.colors.primary,
            'investing': this.colors.warning,
            'netChange': this.colors.success
        };

        if (colorMap[key]) {
            return colorMap[key];
        }

        // Fallback to color palette
        const colorKeys = Object.keys(this.colors);
        return this.colors[colorKeys[index % colorKeys.length]];
    },

    /**
     * Get background color based on chart type
     */
    getBackgroundColor(type, borderColor) {
        if (type === 'line') {
            return 'transparent';
        }

        if (type === 'pie' || type === 'doughnut') {
            return [
                this.colors.primary,
                this.colors.secondary,
                this.colors.tertiary,
                this.colors.success,
                this.colors.warning,
                this.colors.info
            ];
        }

        // For bar charts, use semi-transparent version of border color
        return borderColor.replace('rgb', 'rgba').replace(')', ', 0.7)');
    },

    /**
     * Prepare chart options
     */
    prepareOptions(chartData) {
        const options = { ...this.defaultConfig };

        // Scales configuration
        if (chartData.type !== 'pie' && chartData.type !== 'doughnut' && chartData.type !== 'radar') {
            options.scales = {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        font: {
                            size: 11
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 11
                        }
                    }
                }
            };

            // Add second Y axis if needed (for mixed charts)
            const hasSecondAxis = Object.values(chartData.datasets || {}).some(d => d.yAxisID === 'y1');
            if (hasSecondAxis) {
                options.scales.y1 = {
                    position: 'right',
                    beginAtZero: true,
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 11
                        }
                    }
                };
            }

            // Handle stacked charts
            if (chartData.stacked) {
                options.scales.y.stacked = true;
                options.scales.x.stacked = true;
            }
        }

        // Radar chart specific options
        if (chartData.type === 'radar') {
            options.scales = {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20,
                        font: {
                            size: 10
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        circular: false  // Angular grid, not circular
                    },
                    pointLabels: {
                        font: {
                            size: 11,
                            weight: '600'
                        }
                    }
                }
            };
        }

        // Pie and Doughnut specific options
        if (chartData.type === 'pie' || chartData.type === 'doughnut') {
            options.plugins.legend.position = 'right';
            options.borderWidth = 0;  // No borders on pie slices
            options.spacing = 2;
        }

        return options;
    },

    /**
     * Create chart container with title
     * @param {string} title - Chart title
     * @param {string} subtitle - Chart subtitle (optional)
     * @param {string} canvasId - Canvas ID for chart
     * @param {string} size - Chart size: 'small', 'medium', 'large'
     * @returns {HTMLElement} - Container element
     */
    createContainer(title, subtitle, canvasId, size = 'medium') {
        const container = document.createElement('div');
        container.className = 'chart-container';

        // Header
        const header = document.createElement('div');
        header.className = 'chart-header';

        const titleEl = document.createElement('h3');
        titleEl.className = 'chart-title';
        titleEl.textContent = title;
        header.appendChild(titleEl);

        if (subtitle) {
            const subtitleEl = document.createElement('div');
            subtitleEl.className = 'chart-subtitle';
            subtitleEl.textContent = subtitle;
            header.appendChild(subtitleEl);
        }

        container.appendChild(header);

        // Canvas wrapper
        const wrapper = document.createElement('div');
        wrapper.className = `chart-wrapper ${size}`;

        const canvas = document.createElement('canvas');
        canvas.id = canvasId;
        wrapper.appendChild(canvas);

        container.appendChild(wrapper);

        return container;
    },

    /**
     * Render chart into container
     * @param {HTMLElement} container - Container element
     * @param {Object} chartData - Chart data from charts.json
     * @param {string} title - Chart title
     * @param {string} subtitle - Chart subtitle (optional)
     */
    render(container, chartData, title, subtitle = null) {
        const canvasId = `chart_${Utils.generateId()}`;
        const chartContainer = this.createContainer(title, subtitle, canvasId);

        container.appendChild(chartContainer);

        // Create chart after DOM update
        setTimeout(() => {
            this.create(canvasId, chartData);
        }, 0);
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChartComponent;
}
