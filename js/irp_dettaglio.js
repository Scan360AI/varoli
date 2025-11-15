const IRPDettaglio = {
    data: null,
    charts: {},
    async init() {
        try {
            await App.init();
            this.data = App.getData();
            this.renderIRPMain();
            this.renderComponents();
            this.renderComposition();
            this.renderIndicators();
            this.renderTrend();
        } catch (error) {
            console.error('Error initializing IRP Dettaglio:', error);
        }
    },
    renderIRPMain() {
        const irpData = this.data.tables?.irp_dettaglio?.irpOverall || {
            score: 78.5,
            category: 'B',
            riskLevel: 'Rischio Moderato-Basso'
        };
        const score = irpData.score || 78.5;
        const category = irpData.category || 'B';
        const riskLevel = irpData.riskLevel || 'Rischio Moderato-Basso';
        const riskClass = Utils.getRiskLevel(score);

        const scoreCircle = document.getElementById('irpMainCircle');
        if (scoreCircle) scoreCircle.className = 'irp-score-circle risk-' + riskClass;

        const scoreValue = document.getElementById('irpMainValue');
        if (scoreValue) scoreValue.textContent = score.toFixed(1);

        const categoryBadge = document.getElementById('irpMainBadge');
        if (categoryBadge) {
            const badgeClass = riskClass === 'low' ? 'success' : riskClass === 'medium' ? 'warning' : 'danger';
            categoryBadge.className = 'badge ' + badgeClass;
            categoryBadge.textContent = 'Categoria ' + category;
        }

        const riskLevelEl = document.getElementById('irpMainRisk');
        if (riskLevelEl) riskLevelEl.textContent = riskLevel;

        const visualSection = document.getElementById('irpMainSection');
        if (visualSection) visualSection.className = 'irp-visual-section risk-' + riskClass;

        const marker = document.getElementById('irpMainMarker');
        if (marker) marker.style.left = score + '%';

        const narrative = document.getElementById('irpMainNarrative');
        if (narrative) {
            narrative.textContent = 'L\'IRP di ' + score.toFixed(1) + '/100 (Categoria ' + category + ') riflette una buona solidità complessiva dell\'azienda. ' +
                'Le principali aree di forza sono la redditività e la patrimonializzazione, mentre opportunità di miglioramento esistono nella gestione del circolante.';
        }
    },
    renderComponents() {
        const container = document.getElementById('irpComponentsGrid');
        if (!container) return;
        const components = [
            { label: 'Solidità Patrimoniale', score: 85, weight: 30, icon: 'fa-shield-alt', iconType: 'success' },
            { label: 'Redditività', score: 82, weight: 25, icon: 'fa-chart-line', iconType: 'success' },
            { label: 'Liquidità', score: 70, weight: 25, icon: 'fa-tint', iconType: 'warning' },
            { label: 'Sostenibilità Debito', score: 75, weight: 20, icon: 'fa-balance-scale', iconType: 'success' }
        ];
        container.innerHTML = components.map(comp => {
            const contribution = (comp.score * comp.weight / 100).toFixed(1);
            return '<div class="kpi-card-v4">' +
                '<div class="icon-circle ' + comp.iconType + '"><i class="fas ' + comp.icon + '"></i></div>' +
                '<div class="kpi-content">' +
                '<div class="kpi-label">' + comp.label + '</div>' +
                '<div class="kpi-value">' + comp.score + '/100</div>' +
                '<div class="kpi-subtitle">Peso: ' + comp.weight + '% • Contributo: ' + contribution + '</div>' +
                '</div></div>';
        }).join('');
    },
    renderComposition() {
        const ctx = document.getElementById('irpCompositionChart');
        if (!ctx) return;
        if (this.charts.composition) this.charts.composition.destroy();
        this.charts.composition = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Solidità Patrimoniale', 'Redditività', 'Liquidità', 'Sostenibilità Debito'],
                datasets: [{
                    data: [25.5, 20.5, 17.5, 15.0],
                    backgroundColor: ['#24b47e', '#2196F3', '#FFC107', '#191970']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { padding: 10, font: { size: 11, family: 'Titillium Web' } }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => context.label + ': ' + context.parsed + ' punti'
                        }
                    }
                }
            }
        });

        const table = document.getElementById('irpWeightsTable');
        if (!table) return;
        TableRenderer.renderTable(table, {
            columns: [
                { label: 'Area', width: '50%' },
                { label: 'Peso', align: 'text-right', width: '25%' },
                { label: 'Contributo', align: 'text-right', width: '25%' }
            ],
            rows: [
                { cells: [{ value: 'Solidità Patrimoniale' }, { value: '30%' }, { value: '25.5' }] },
                { cells: [{ value: 'Redditività' }, { value: '25%' }, { value: '20.5' }] },
                { cells: [{ value: 'Liquidità' }, { value: '25%' }, { value: '17.5' }] },
                { cells: [{ value: 'Sostenibilità Debito' }, { value: '20%' }, { value: '15.0' }] },
                { isSpacer: true },
                { cells: [{ value: 'TOTALE IRP', bold: true }, { value: '100%', bold: true }, { value: '78.5', bold: true }], className: 'table-primary' }
            ]
        });
    },
    renderIndicators() {
        const container = document.getElementById('irpIndicatorsTable');
        if (!container) return;
        TableRenderer.renderTable(container, {
            columns: [
                { label: 'Area', width: '20%' },
                { label: 'Indicatore', width: '30%' },
                { label: 'Valore', align: 'text-right', width: '20%' },
                { label: 'Score', align: 'text-right', width: '15%' },
                { label: 'Valutazione', align: 'text-center', width: '15%' }
            ],
            rows: [
                { cells: [{ value: 'Solidità' }, { value: 'Indipendenza Finanziaria' }, { value: '28.5%' }, { value: '85' }, { value: { type: 'badge', text: 'Ottimo' }, align: 'text-center' }] },
                { cells: [{ value: 'Solidità' }, { value: 'Copertura Immobilizzazioni' }, { value: '1.13' }, { value: '90' }, { value: { type: 'badge', text: 'Ottimo' }, align: 'text-center' }] },
                { cells: [{ value: 'Redditività' }, { value: 'ROE' }, { value: '40.9%' }, { value: '95' }, { value: { type: 'badge', text: 'Eccellente' }, align: 'text-center' }] },
                { cells: [{ value: 'Redditività' }, { value: 'ROS' }, { value: '9.9%' }, { value: '75' }, { value: { type: 'badge', text: 'Buono' }, align: 'text-center' }] },
                { cells: [{ value: 'Liquidità' }, { value: 'Current Ratio' }, { value: '1.11' }, { value: '70' }, { value: { type: 'badge', text: 'Sufficiente' }, align: 'text-center' }] },
                { cells: [{ value: 'Liquidità' }, { value: 'Quick Ratio' }, { value: '1.01' }, { value: '65' }, { value: { type: 'badge', text: 'Adeguato' }, align: 'text-center' }] },
                { cells: [{ value: 'Debito' }, { value: 'DSCR' }, { value: '22.0x' }, { value: '95' }, { value: { type: 'badge', text: 'Eccellente' }, align: 'text-center' }] },
                { cells: [{ value: 'Debito' }, { value: 'Debt/Equity' }, { value: '2.5' }, { value: '60' }, { value: { type: 'badge', text: 'Accettabile' }, align: 'text-center' }] }
            ]
        });
    },
    renderTrend() {
        const ctx = document.getElementById('irpTrendChart');
        if (!ctx) return;
        if (this.charts.trend) this.charts.trend.destroy();
        this.charts.trend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['2022', '2023', '2024'],
                datasets: [
                    {
                        label: 'IRP Complessivo',
                        data: [75.2, 76.8, 78.5],
                        borderColor: '#191970',
                        backgroundColor: 'rgba(25, 25, 112, 0.1)',
                        borderWidth: 3,
                        tension: 0
                    },
                    {
                        label: 'Solidità Patrimoniale',
                        data: [80, 82, 85],
                        borderColor: '#24b47e',
                        backgroundColor: 'rgba(36, 180, 126, 0.1)',
                        borderWidth: 2,
                        tension: 0
                    },
                    {
                        label: 'Redditività',
                        data: [78, 79, 82],
                        borderColor: '#2196F3',
                        backgroundColor: 'rgba(33, 150, 243, 0.1)',
                        borderWidth: 2,
                        tension: 0
                    },
                    {
                        label: 'Liquidità',
                        data: [68, 69, 70],
                        borderColor: '#FFC107',
                        backgroundColor: 'rgba(255, 193, 7, 0.1)',
                        borderWidth: 2,
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
                        labels: { padding: 15, font: { size: 12, family: 'Titillium Web' } }
                    }
                },
                scales: {
                    y: {
                        min: 0,
                        max: 100,
                        ticks: {
                            callback: (value) => value
                        }
                    }
                }
            }
        });
    }
};
document.addEventListener('DOMContentLoaded', () => { IRPDettaglio.init(); });
