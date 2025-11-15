/**
 * SCAN360 - Parte 2: Analisi Economica
 */

const Parte2Economico = {
    data: null,
    charts: {},

    /**
     * Initialize the page
     */
    async init() {
        try {
            await App.init();
            this.data = App.getData();

            this.renderContoEconomico();
            this.renderMarginalita();
            this.renderRedditabilita();
            this.renderValoreAggiunto();
            this.renderRicaviTrend();
        } catch (error) {
            console.error('Error initializing Parte 2:', error);
        }
    },

    /**
     * Render Conto Economico table (2.1)
     */
    renderContoEconomico() {
        const container = document.getElementById('contoEconomicoTable');
        if (!container) return;

        // Sample data structure - will be replaced with actual JSON data
        const data = this.data.tables?.parte2_economico?.contoEconomico || {
            years: ['2024', '2023', '2022'],
            rows: [
                { label: 'Ricavi delle Vendite', values: [1030748, 1014133, 998621], isHeader: true },
                { label: 'Altri Ricavi', values: [0, 0, 0] },
                { label: 'Valore della Produzione', values: [1030748, 1014133, 998621], isTotal: true },
                { label: '', values: [], isSpacer: true },
                { label: 'Consumi di Materie Prime', values: [-514373, -505733, -498205] },
                { label: 'Costi per Servizi', values: [-208141, -204827, -201724] },
                { label: 'Costi per Godimento Beni Terzi', values: [-51537, -50707, -49931] },
                { label: 'Valore Aggiunto', values: [256697, 252866, 248761], isTotal: true },
                { label: '', values: [], isSpacer: true },
                { label: 'Costo del Personale', values: [-120787, -118826, -116975] },
                { label: 'MOL (EBITDA)', values: [135910, 134040, 131786], isTotal: true },
                { label: '', values: [], isSpacer: true },
                { label: 'Ammortamenti', values: [-30922, -30423, -29966] },
                { label: 'Accantonamenti', values: [-2614, -2571, -2532] },
                { label: 'RO (EBIT)', values: [102374, 101046, 99288], isTotal: true },
                { label: '', values: [], isSpacer: true },
                { label: 'Proventi Finanziari', values: [103, 101, 100] },
                { label: 'Oneri Finanziari', values: [-6180, -60814, -59882] },
                { label: 'Risultato Gestione Finanziaria', values: [-6077, -60713, -59782] },
                { label: '', values: [], isSpacer: true },
                { label: 'Risultato Ante Imposte', values: [96297, 40333, 39506], isTotal: true },
                { label: 'Imposte', values: [-514, -827, -1185] },
                { label: 'Utile (Perdita) d\'Esercizio', values: [95783, 39506, 38321], isFinal: true }
            ]
        };

        const thead = `
            <thead>
                <tr>
                    <th style="width: 50%;">Conto Economico</th>
                    ${data.years.map(year => `<th class="text-right">${year}</th>`).join('')}
                </tr>
            </thead>
        `;

        const tbody = `
            <tbody>
                ${data.rows.map(row => {
                    if (row.isSpacer) {
                        return '<tr style="height: 12px;"><td colspan="4"></td></tr>';
                    }

                    let className = '';
                    if (row.isHeader) className = 'table-primary';
                    if (row.isTotal) className = 'table-success';
                    if (row.isFinal) className = 'table-primary';

                    return `
                        <tr class="${className}">
                            <td>${row.label}</td>
                            ${row.values.map(val =>
                                `<td class="text-right">${val !== undefined ? Utils.formatCurrency(val) : ''}</td>`
                            ).join('')}
                        </tr>
                    `;
                }).join('')}
            </tbody>
        `;

        container.innerHTML = thead + tbody;
    },

    /**
     * Render Marginalità section (2.2)
     */
    renderMarginalita() {
        const container = document.getElementById('marginalitaGrid');
        if (!container) return;

        const margins = [
            {
                label: 'Margine Lordo',
                value: '24,9%',
                amount: '€256.697',
                trend: '+1,5%',
                trendType: 'positive',
                icon: 'fa-chart-line',
                iconType: 'success'
            },
            {
                label: 'EBITDA Margin',
                value: '13,2%',
                amount: '€135.910',
                trend: '+1,4%',
                trendType: 'positive',
                icon: 'fa-percentage',
                iconType: 'success'
            },
            {
                label: 'EBIT Margin',
                value: '9,9%',
                amount: '€102.374',
                trend: '+1,3%',
                trendType: 'positive',
                icon: 'fa-chart-area',
                iconType: 'warning'
            },
            {
                label: 'Margine Netto',
                value: '9,3%',
                amount: '€95.783',
                trend: '+142,5%',
                trendType: 'positive',
                icon: 'fa-trophy',
                iconType: 'success'
            }
        ];

        container.innerHTML = margins.map(margin => `
            <div class="kpi-card-v4">
                <div class="icon-circle ${margin.iconType}">
                    <i class="fas ${margin.icon}"></i>
                </div>
                <div class="kpi-content">
                    <div class="kpi-label">${margin.label}</div>
                    <div class="kpi-value">${margin.value}</div>
                    <div class="kpi-subtitle">${margin.amount}</div>
                    <div class="kpi-trend ${margin.trendType}">
                        <i class="fas fa-arrow-up"></i>
                        <span>${margin.trend} vs 2023</span>
                    </div>
                </div>
            </div>
        `).join('');

        // Create marginalità chart
        this.createMarginalitaChart();
    },

    /**
     * Create Marginalità chart
     */
    createMarginalitaChart() {
        const ctx = document.getElementById('marginalitaChart');
        if (!ctx) return;

        if (this.charts.marginalita) {
            this.charts.marginalita.destroy();
        }

        this.charts.marginalita = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['2022', '2023', '2024'],
                datasets: [
                    {
                        label: 'Margine Lordo %',
                        data: [24.9, 24.9, 24.9],
                        borderColor: '#24b47e',
                        backgroundColor: 'rgba(36, 180, 126, 0.1)',
                        tension: 0
                    },
                    {
                        label: 'EBITDA %',
                        data: [13.2, 13.2, 13.2],
                        borderColor: '#2196F3',
                        backgroundColor: 'rgba(33, 150, 243, 0.1)',
                        tension: 0
                    },
                    {
                        label: 'EBIT %',
                        data: [9.9, 10.0, 9.9],
                        borderColor: '#FFC107',
                        backgroundColor: 'rgba(255, 193, 7, 0.1)',
                        tension: 0
                    },
                    {
                        label: 'Margine Netto %',
                        data: [3.8, 3.9, 9.3],
                        borderColor: '#191970',
                        backgroundColor: 'rgba(25, 25, 112, 0.1)',
                        tension: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: { size: 12, family: 'Titillium Web' }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => value + '%'
                        }
                    }
                }
            }
        });
    },

    /**
     * Render Redditabilità section (2.3)
     */
    renderRedditabilita() {
        const container = document.getElementById('reditabilitaGrid');
        if (!container) return;

        const ratios = [
            {
                label: 'ROE',
                value: '40,9%',
                description: 'Return on Equity',
                trend: '+82,7%',
                trendType: 'positive',
                icon: 'fa-university',
                iconType: 'success'
            },
            {
                label: 'ROI',
                value: '14,2%',
                description: 'Return on Investment',
                trend: '+0,3%',
                trendType: 'positive',
                icon: 'fa-chart-pie',
                iconType: 'success'
            },
            {
                label: 'ROS',
                value: '9,9%',
                description: 'Return on Sales',
                trend: '+0,1%',
                trendType: 'positive',
                icon: 'fa-percent',
                iconType: 'warning'
            },
            {
                label: 'ROA',
                value: '13,3%',
                description: 'Return on Assets',
                trend: '+3,3%',
                trendType: 'positive',
                icon: 'fa-balance-scale-right',
                iconType: 'success'
            }
        ];

        container.innerHTML = ratios.map(ratio => `
            <div class="kpi-card-v4">
                <div class="icon-circle ${ratio.iconType}">
                    <i class="fas ${ratio.icon}"></i>
                </div>
                <div class="kpi-content">
                    <div class="kpi-label">${ratio.label}</div>
                    <div class="kpi-value">${ratio.value}</div>
                    <div class="kpi-subtitle">${ratio.description}</div>
                    <div class="kpi-trend ${ratio.trendType}">
                        <i class="fas fa-arrow-up"></i>
                        <span>${ratio.trend} vs 2023</span>
                    </div>
                </div>
            </div>
        `).join('');

        // Create redditabilità chart
        this.createRedditabilitaChart();
    },

    /**
     * Create Redditabilità chart
     */
    createRedditabilitaChart() {
        const ctx = document.getElementById('reditabilitaChart');
        if (!ctx) return;

        if (this.charts.reditabilita) {
            this.charts.reditabilita.destroy();
        }

        this.charts.reditabilita = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['2022', '2023', '2024'],
                datasets: [
                    {
                        label: 'ROE %',
                        data: [27.7, 22.4, 40.9],
                        backgroundColor: 'rgba(36, 180, 126, 0.8)'
                    },
                    {
                        label: 'ROI %',
                        data: [13.8, 13.9, 14.2],
                        backgroundColor: 'rgba(33, 150, 243, 0.8)'
                    },
                    {
                        label: 'ROS %',
                        data: [9.9, 9.8, 9.9],
                        backgroundColor: 'rgba(255, 193, 7, 0.8)'
                    },
                    {
                        label: 'ROA %',
                        data: [10.0, 10.0, 13.3],
                        backgroundColor: 'rgba(25, 25, 112, 0.8)'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: { size: 12, family: 'Titillium Web' }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => value + '%'
                        }
                    }
                }
            }
        });
    },

    /**
     * Render Valore Aggiunto section (2.4)
     */
    renderValoreAggiunto() {
        // Create valore aggiunto chart
        this.createValoreAggiuntoChart();

        // Create valore aggiunto table
        const table = document.getElementById('valoreAggiuntoTable');
        if (!table) return;

        const data = [
            { label: 'Costo del Personale', value: 120787, percent: 47.1, color: '#24b47e' },
            { label: 'Ammortamenti', value: 30922, percent: 12.0, color: '#2196F3' },
            { label: 'Oneri Finanziari', value: 6180, percent: 2.4, color: '#FFC107' },
            { label: 'Imposte', value: 514, percent: 0.2, color: '#F44336' },
            { label: 'Utile d\'Esercizio', value: 95783, percent: 37.3, color: '#191970' },
            { label: 'Altri', value: 2511, percent: 1.0, color: '#9E9E9E' }
        ];

        const total = data.reduce((sum, item) => sum + item.value, 0);

        table.innerHTML = `
            <thead>
                <tr>
                    <th>Componente</th>
                    <th class="text-right">Valore</th>
                    <th class="text-right">% su VA</th>
                </tr>
            </thead>
            <tbody>
                ${data.map(item => `
                    <tr>
                        <td>
                            <span style="display: inline-block; width: 12px; height: 12px; background: ${item.color}; border-radius: 3px; margin-right: 8px;"></span>
                            ${item.label}
                        </td>
                        <td class="text-right">${Utils.formatCurrency(item.value)}</td>
                        <td class="text-right fw-bold">${item.percent.toFixed(1)}%</td>
                    </tr>
                `).join('')}
                <tr class="table-primary">
                    <td class="fw-bold">Totale Valore Aggiunto</td>
                    <td class="text-right fw-bold">${Utils.formatCurrency(total)}</td>
                    <td class="text-right fw-bold">100,0%</td>
                </tr>
            </tbody>
        `;
    },

    /**
     * Create Valore Aggiunto chart
     */
    createValoreAggiuntoChart() {
        const ctx = document.getElementById('valoreAggiuntoChart');
        if (!ctx) return;

        if (this.charts.valoreAggiunto) {
            this.charts.valoreAggiunto.destroy();
        }

        this.charts.valoreAggiunto = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Costo del Personale', 'Utile d\'Esercizio', 'Ammortamenti', 'Oneri Finanziari', 'Imposte', 'Altri'],
                datasets: [{
                    data: [47.1, 37.3, 12.0, 2.4, 0.2, 1.0],
                    backgroundColor: [
                        '#24b47e',
                        '#191970',
                        '#2196F3',
                        '#FFC107',
                        '#F44336',
                        '#9E9E9E'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 10,
                            font: { size: 11, family: 'Titillium Web' }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => `${context.label}: ${context.parsed}%`
                        }
                    }
                }
            }
        });
    },

    /**
     * Render Ricavi Trend (2.5)
     */
    renderRicaviTrend() {
        const ctx = document.getElementById('ricaviTrendChart');
        if (!ctx) return;

        if (this.charts.ricaviTrend) {
            this.charts.ricaviTrend.destroy();
        }

        this.charts.ricaviTrend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['2022', '2023', '2024'],
                datasets: [
                    {
                        label: 'Ricavi',
                        data: [999, 1014, 1031],
                        borderColor: '#191970',
                        backgroundColor: 'rgba(25, 25, 112, 0.1)',
                        borderWidth: 3,
                        tension: 0,
                        yAxisID: 'y'
                    },
                    {
                        label: 'EBITDA',
                        data: [132, 134, 136],
                        borderColor: '#24b47e',
                        backgroundColor: 'rgba(36, 180, 126, 0.1)',
                        borderWidth: 3,
                        tension: 0,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Utile Netto',
                        data: [38, 40, 96],
                        borderColor: '#2196F3',
                        backgroundColor: 'rgba(33, 150, 243, 0.1)',
                        borderWidth: 3,
                        tension: 0,
                        yAxisID: 'y'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: { size: 13, family: 'Titillium Web', weight: '600' }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => `${context.dataset.label}: €${context.parsed.y.toFixed(0)}K`
                        }
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => '€' + value + 'K'
                        }
                    }
                }
            }
        });
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Parte2Economico.init();
});
