/**
 * SCAN360 - Parte 3: Analisi Patrimoniale
 */

const Parte3Patrimoniale = {
    data: null,
    charts: {},

    /**
     * Initialize the page
     */
    async init() {
        try {
            await App.init();
            this.data = App.getData();

            this.renderStatoPatrimoniale();
            this.renderIndiciPatrimoniali();
            this.renderComposizioneAttivo();
            this.renderComposizionePassivo();
            this.renderPatrimonioNettoEvolution();
        } catch (error) {
            console.error('Error initializing Parte 3:', error);
        }
    },

    /**
     * Render Stato Patrimoniale table (3.1)
     */
    renderStatoPatrimoniale() {
        const container = document.getElementById('statoPatrimonialeTable');
        if (!container) return;

        const data = {
            years: ['2024', '2023', '2022'],
            attivo: [
                { label: 'Immobilizzazioni Immateriali', values: [12045, 11850, 11660] },
                { label: 'Immobilizzazioni Materiali', values: [195342, 192167, 189086] },
                { label: 'Immobilizzazioni Finanziarie', values: [0, 0, 0] },
                { label: 'Totale Immobilizzazioni', values: [207387, 204017, 200746], isTotal: true },
                { label: '', values: [], isSpacer: true },
                { label: 'Rimanenze', values: [58912, 57967, 57043] },
                { label: 'Crediti Commerciali', values: [488957, 481013, 473330] },
                { label: 'Altri Crediti', values: [15432, 15179, 14935] },
                { label: 'Disponibilità Liquide', values: [48674, 47884, 47109] },
                { label: 'Totale Attivo Circolante', values: [611975, 602043, 592417], isTotal: true },
                { label: '', values: [], isSpacer: true },
                { label: 'Ratei e Risconti Attivi', values: [1546, 1521, 1497] },
                { label: '', values: [], isSpacer: true },
                { label: 'TOTALE ATTIVO', values: [820908, 807581, 794660], isFinal: true }
            ],
            passivo: [
                { label: 'Capitale Sociale', values: [10000, 10000, 10000] },
                { label: 'Riserve', values: [128351, 88828, 49322] },
                { label: 'Utile (Perdita) d\'Esercizio', values: [95783, 39523, 38506] },
                { label: 'Totale Patrimonio Netto', values: [234134, 138351, 97828], isTotal: true },
                { label: '', values: [], isSpacer: true },
                { label: 'Debiti Finanziari M/L Termine', values: [0, 0, 0] },
                { label: 'TFR e Fondi', values: [37234, 36621, 36023] },
                { label: 'Totale Passività Consolidate', values: [37234, 36621, 36023], isTotal: true },
                { label: '', values: [], isSpacer: true },
                { label: 'Debiti Finanziari Breve Termine', values: [320145, 314980, 309949] },
                { label: 'Debiti Commerciali', values: [203456, 200095, 196893] },
                { label: 'Altri Debiti', values: [25939, 25514, 25112] },
                { label: 'Totale Passività Correnti', values: [549540, 540589, 531954], isTotal: true },
                { label: '', values: [], isSpacer: true },
                { label: 'Ratei e Risconti Passivi', values: [0, 0, 0] },
                { label: '', values: [], isSpacer: true },
                { label: 'TOTALE PASSIVO E PN', values: [820908, 807561, 794805], isFinal: true }
            ]
        };

        const thead = `
            <thead>
                <tr>
                    <th style="width: 50%;">Stato Patrimoniale</th>
                    ${data.years.map(year => `<th class="text-right">${year}</th>`).join('')}
                </tr>
            </thead>
        `;

        const renderSection = (rows) => rows.map(row => {
            if (row.isSpacer) {
                return '<tr style="height: 12px;"><td colspan="4"></td></tr>';
            }

            let className = '';
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
        }).join('');

        container.innerHTML = thead + `
            <tbody>
                <tr class="table-primary">
                    <td colspan="4" class="fw-bold" style="background: rgba(25, 25, 112, 0.1);">ATTIVO</td>
                </tr>
                ${renderSection(data.attivo)}
                <tr style="height: 24px;"><td colspan="4"></td></tr>
                <tr class="table-primary">
                    <td colspan="4" class="fw-bold" style="background: rgba(25, 25, 112, 0.1);">PASSIVO E PATRIMONIO NETTO</td>
                </tr>
                ${renderSection(data.passivo)}
            </tbody>
        `;
    },

    /**
     * Render Indici Patrimoniali (3.2)
     */
    renderIndiciPatrimoniali() {
        const container = document.getElementById('indiciPatrimonialiGrid');
        if (!container) return;

        const indices = [
            {
                label: 'Indipendenza Finanziaria',
                value: '28,5%',
                description: 'PN / Totale Passivo',
                icon: 'fa-shield-alt',
                iconType: 'success',
                trend: '+12,4%',
                trendType: 'positive'
            },
            {
                label: 'Grado di Indebitamento',
                value: '2,5',
                description: 'Debiti / PN',
                icon: 'fa-balance-scale',
                iconType: 'warning',
                trend: '-0,7',
                trendType: 'positive'
            },
            {
                label: 'Copertura Immobilizzazioni',
                value: '1,13',
                description: 'PN / Immobilizzazioni',
                icon: 'fa-warehouse',
                iconType: 'success',
                trend: '+0,15',
                trendType: 'positive'
            },
            {
                label: 'Margine di Struttura',
                value: '€26.747',
                description: 'PN - Immobilizzazioni',
                icon: 'fa-chart-area',
                iconType: 'success',
                trend: '+€22.413',
                trendType: 'positive'
            }
        ];

        container.innerHTML = indices.map(idx => `
            <div class="kpi-card-v4">
                <div class="icon-circle ${idx.iconType}">
                    <i class="fas ${idx.icon}"></i>
                </div>
                <div class="kpi-content">
                    <div class="kpi-label">${idx.label}</div>
                    <div class="kpi-value">${idx.value}</div>
                    <div class="kpi-subtitle">${idx.description}</div>
                    ${idx.trend ? `
                        <div class="kpi-trend ${idx.trendType}">
                            <i class="fas fa-arrow-up"></i>
                            <span>${idx.trend} vs 2023</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
    },

    /**
     * Render Composizione Attivo chart (3.3)
     */
    renderComposizioneAttivo() {
        const ctx = document.getElementById('attivoChart');
        if (!ctx) return;

        if (this.charts.attivo) {
            this.charts.attivo.destroy();
        }

        this.charts.attivo = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Immobilizzazioni', 'Crediti Commerciali', 'Rimanenze', 'Disponibilità Liquide', 'Altri'],
                datasets: [{
                    data: [25.3, 59.6, 7.2, 5.9, 2.0],
                    backgroundColor: [
                        '#191970',
                        '#24b47e',
                        '#2196F3',
                        '#FFC107',
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
     * Render Composizione Passivo chart (3.3)
     */
    renderComposizionePassivo() {
        const ctx = document.getElementById('passivoChart');
        if (!ctx) return;

        if (this.charts.passivo) {
            this.charts.passivo.destroy();
        }

        this.charts.passivo = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Patrimonio Netto', 'Debiti Finanziari Breve', 'Debiti Commerciali', 'TFR e Fondi', 'Altri Debiti'],
                datasets: [{
                    data: [28.5, 39.0, 24.8, 4.5, 3.2],
                    backgroundColor: [
                        '#24b47e',
                        '#F44336',
                        '#FF9800',
                        '#2196F3',
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
     * Render Patrimonio Netto Evolution chart (3.4)
     */
    renderPatrimonioNettoEvolution() {
        const ctx = document.getElementById('patrimonioNettoChart');
        if (!ctx) return;

        if (this.charts.patrimonioNetto) {
            this.charts.patrimonioNetto.destroy();
        }

        this.charts.patrimonioNetto = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['2022', '2023', '2024'],
                datasets: [{
                    label: 'Patrimonio Netto',
                    data: [98, 138, 234],
                    backgroundColor: '#24b47e'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => `Patrimonio Netto: €${context.parsed.y}K`
                        }
                    }
                },
                scales: {
                    y: {
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
    Parte3Patrimoniale.init();
});
