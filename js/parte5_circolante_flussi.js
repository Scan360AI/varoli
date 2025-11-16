const Parte5Circolante = {
    data: null,
    charts: {},
    async init() {
        try {
            await App.init();
            this.data = App.getData();
            this.renderSectionIntro();
            this.renderCashCycleAlert();
            this.createWorkingCapitalCycleChart();
            this.renderWorkingCapitalAnalysis();
            this.renderCycleComponents();
            this.renderInventoryAnalysis();
            this.renderReceivablesAnalysis();
            this.renderPayablesAnalysis();
            this.createCashFlowTrendChart();
            this.renderCashFlowAnalysis();
            this.createCashFlowProjectionChart();
            this.renderOptimizationStrategies();
            this.renderCicloGrid();
            this.renderCCNTable();
            this.createCashFlowWaterfallChart();
        } catch (error) {
            console.error('Error initializing Parte 5:', error);
        }
    },
    renderSectionIntro() {
        const container = document.getElementById('sectionIntro');
        if (!container) return;
        const intro = this.data.content?.parte5_circolante_flussi?.sectionIntro || '';
        container.innerHTML = `<div class="alert alert-info"><i class="fas fa-info-circle me-2"></i>${intro}</div>`;
    },
    renderCashCycleAlert() {
        const container = document.getElementById('cashCycleAlert');
        if (!container) return;
        const alert = this.data.content?.parte5_circolante_flussi?.cashCycleAlert || {};
        container.innerHTML = `<div class="alert alert-warning"><h5 class="alert-heading"><i class="fas fa-sync-alt me-2"></i>${alert.title || 'Ciclo del Circolante: 167 giorni'}</h5><p style="margin:0;">${alert.description || ''}</p></div>`;
    },
    createWorkingCapitalCycleChart() {
        const ctx = document.getElementById('workingCapitalCycleChart');
        if (!ctx) return;
        const chartData = this.data.charts?.reports?.parte5?.workingCapitalCycleChart;
        if (!chartData) return;
        if (this.charts.workingCapitalCycle) this.charts.workingCapitalCycle.destroy();
        this.charts.workingCapitalCycle = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartData.labels,
                datasets: [
                    {
                        label: chartData.datasets.company.label,
                        data: chartData.datasets.company.data,
                        backgroundColor: 'rgba(255, 193, 7, 0.8)',
                        borderColor: 'rgba(255, 193, 7, 1)',
                        borderWidth: 1
                    },
                    {
                        label: chartData.datasets.benchmark.label,
                        data: chartData.datasets.benchmark.data,
                        backgroundColor: 'rgba(76, 175, 80, 0.6)',
                        borderColor: 'rgba(76, 175, 80, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.y + ' giorni';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Giorni'
                        }
                    }
                }
            }
        });
    },
    createCashFlowWaterfallChart() {
        const ctx = document.getElementById('cashFlowWaterfallChart');
        if (!ctx) return;
        const chartData = this.data.charts?.reports?.parte5?.cashFlowWaterfallChart;
        if (!chartData) return;
        if (this.charts.cashFlowWaterfall) this.charts.cashFlowWaterfall.destroy();
        this.charts.cashFlowWaterfall = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: chartData.datasets.values.label || 'Flussi di Cassa 2024',
                    data: chartData.datasets.values.data,
                    backgroundColor: chartData.datasets.values.data.map(v => v >= 0 ? 'rgba(76, 175, 80, 0.8)' : 'rgba(244, 67, 54, 0.8)'),
                    borderColor: chartData.datasets.values.data.map(v => v >= 0 ? 'rgba(76, 175, 80, 1)' : 'rgba(244, 67, 54, 1)'),
                    borderWidth: 1
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
                            label: function(context) {
                                return Utils.formatCurrency(context.parsed.y);
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Euro (€)'
                        },
                        ticks: {
                            callback: function(value) {
                                return Utils.formatCurrency(value);
                            }
                        }
                    }
                }
            }
        });
    },
    createCashFlowTrendChart() {
        const ctx = document.getElementById('cashFlowTrendChart');
        if (!ctx) return;
        const chartData = this.data.charts?.reports?.parte5?.cashFlowTrendChart;
        if (!chartData) return;
        if (this.charts.cashFlowTrend) this.charts.cashFlowTrend.destroy();
        this.charts.cashFlowTrend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: [
                    {
                        label: chartData.datasets.operating.label,
                        data: chartData.datasets.operating.data,
                        borderColor: 'rgba(33, 150, 243, 1)',
                        backgroundColor: 'rgba(33, 150, 243, 0.1)',
                        borderWidth: 3,
                        tension: 0.3,
                        fill: false
                    },
                    {
                        label: chartData.datasets.investing.label,
                        data: chartData.datasets.investing.data,
                        borderColor: 'rgba(255, 193, 7, 1)',
                        backgroundColor: 'rgba(255, 193, 7, 0.1)',
                        borderWidth: 3,
                        tension: 0.3,
                        fill: false
                    },
                    {
                        label: chartData.datasets.netChange.label,
                        data: chartData.datasets.netChange.data,
                        borderColor: 'rgba(76, 175, 80, 1)',
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        borderWidth: 3,
                        tension: 0.3,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Euro (€)'
                        },
                        ticks: {
                            callback: function(value) {
                                return Utils.formatCurrency(value);
                            }
                        }
                    }
                }
            }
        });
    },
    createCashFlowProjectionChart() {
        const ctx = document.getElementById('cashFlowProjectionChart');
        if (!ctx) return;
        const chartData = this.data.charts?.reports?.parte5?.cashFlowProjectionChart;
        if (!chartData) return;
        if (this.charts.cashFlowProjection) this.charts.cashFlowProjection.destroy();
        this.charts.cashFlowProjection = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartData.labels,
                datasets: [
                    {
                        label: chartData.datasets.operating.label,
                        data: chartData.datasets.operating.data,
                        backgroundColor: 'rgba(0, 123, 255, 0.8)',
                        type: 'bar',
                        yAxisID: 'y'
                    },
                    {
                        label: chartData.datasets.debtVariation.label,
                        data: chartData.datasets.debtVariation.data,
                        backgroundColor: 'rgba(255, 193, 7, 0.8)',
                        type: 'bar',
                        yAxisID: 'y'
                    },
                    {
                        label: chartData.datasets.cashBalance.label,
                        data: chartData.datasets.cashBalance.data,
                        borderColor: 'rgba(76, 175, 80, 1)',
                        borderWidth: 3,
                        fill: false,
                        type: 'line',
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Flussi (€)'
                        },
                        ticks: {
                            callback: function(value) {
                                return Utils.formatCurrency(value);
                            }
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Liquidità (€)'
                        },
                        ticks: {
                            callback: function(value) {
                                return Utils.formatCurrency(value);
                            }
                        },
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                }
            }
        });
    },
    renderWorkingCapitalAnalysis() {
        const container = document.getElementById('workingCapitalAnalysis');
        if (!container) return;
        const title = this.data.content?.parte5_circolante_flussi?.workingCapitalTitle || 'Dinamica del Capitale Circolante';
        const text = this.data.content?.parte5_circolante_flussi?.workingCapitalAnalysis || '';
        const cycleOpt = this.data.content?.parte5_circolante_flussi?.cycleOptimization || '';
        container.innerHTML = `<div class="content-section"><h3>${title}</h3><p>${text}</p><div class="alert alert-info mt-2"><strong>Ottimizzazione:</strong> ${cycleOpt}</div></div>`;
    },
    renderCycleComponents() {
        const container = document.getElementById('cycleComponentsGrid');
        if (!container) return;
        const dso = this.data.kpis?.dso || {};
        const cycleData = this.data.tables?.parte5_circolante?.cicloCircolanteSintesi || {};
        container.innerHTML = `
            <div class="kpi-card-v4">
                <div class="icon-circle warning"><i class="fas fa-file-invoice-dollar"></i></div>
                <div class="kpi-content">
                    <div class="kpi-label">DSO (Crediti Clienti)</div>
                    <div class="kpi-value">${cycleData.dso || dso.value || 'N/A'} giorni</div>
                    <div class="kpi-subtitle">${dso.description || 'Ottimo tempo di incasso'}</div>
                </div>
            </div>
            <div class="kpi-card-v4">
                <div class="icon-circle success"><i class="fas fa-boxes"></i></div>
                <div class="kpi-content">
                    <div class="kpi-label">DIO (Magazzino)</div>
                    <div class="kpi-value">${cycleData.dio || '194'} giorni</div>
                    <div class="kpi-subtitle">Critico - richiede ottimizzazione</div>
                </div>
            </div>
            <div class="kpi-card-v4">
                <div class="icon-circle warning"><i class="fas fa-truck"></i></div>
                <div class="kpi-content">
                    <div class="kpi-label">DPO (Debiti Fornitori)</div>
                    <div class="kpi-value">${cycleData.dpo || '68'} giorni</div>
                    <div class="kpi-subtitle">In linea con benchmark</div>
                </div>
            </div>
        `;
    },
    renderInventoryAnalysis() {
        const container = document.getElementById('inventoryAnalysis');
        if (!container) return;
        const title = this.data.content?.parte5_circolante_flussi?.inventoryTitle || 'Analisi del Magazzino (DIO)';
        const note = this.data.content?.parte5_circolante_flussi?.inventoryNote || '';
        container.innerHTML = `<div class="content-section"><h3>${title}</h3><div class="alert alert-danger">${note}</div></div>`;
    },
    renderReceivablesAnalysis() {
        const container = document.getElementById('receivablesAnalysis');
        if (!container) return;
        const title = this.data.content?.parte5_circolante_flussi?.receivablesTitle || 'Gestione Crediti Clienti (DSO)';
        const note = this.data.content?.parte5_circolante_flussi?.receivablesNote || '';
        container.innerHTML = `<div class="content-section"><h3>${title}</h3><div class="alert alert-success">${note}</div></div>`;
    },
    renderPayablesAnalysis() {
        const container = document.getElementById('payablesAnalysis');
        if (!container) return;
        const title = this.data.content?.parte5_circolante_flussi?.payablesTitle || 'Gestione Debiti Fornitori (DPO)';
        const note = this.data.content?.parte5_circolante_flussi?.payablesNote || '';
        container.innerHTML = `<div class="content-section"><h3>${title}</h3><div class="alert alert-warning">${note}</div></div>`;
    },
    renderCashFlowAnalysis() {
        const container = document.getElementById('cashFlowAnalysis');
        if (!container) return;
        const title = this.data.content?.parte5_circolante_flussi?.cashFlowTitle || 'Analisi dei Flussi di Cassa';
        const intro = this.data.content?.parte5_circolante_flussi?.cashFlowIntro || '';
        const note = this.data.content?.parte5_circolante_flussi?.cashFlowNote || '';
        container.innerHTML = `<div class="content-section"><h3>${title}</h3><p>${intro}</p><div class="alert alert-info mt-2">${note}</div></div>`;
    },
    renderOptimizationStrategies() {
        const container = document.getElementById('optimizationStrategies');
        if (!container) return;
        const strategies = this.data.content?.parte5_circolante_flussi?.optimizationStrategies || '';
        const strategyData = this.data.tables?.parte5_circolante?.miglioramentoCircolante;
        if (strategyData) {
            let html = '<div class="content-section"><h3>Strategie di Ottimizzazione</h3>';
            html += '<div class="table-wrapper"><table class="table table-striped table-hover">';
            html += '<thead><tr>' + strategyData.headers.map(h => '<th>' + h + '</th>').join('') + '</tr></thead>';
            html += '<tbody>';
            strategyData.rows.forEach(row => {
                html += '<tr><td><strong>' + row.area + '</strong></td><td>' + row.strategie + '</td><td class="text-success"><strong>' + row.impatto + '</strong></td></tr>';
            });
            html += '</tbody></table></div></div>';
            container.innerHTML = html;
        } else {
            container.innerHTML = `<div class="alert alert-light"><strong>Strategie di Ottimizzazione:</strong> ${strategies}</div>`;
        }
    },
    renderCicloGrid() {
        const container = document.getElementById('cicloGrid');
        if (!container) return;
        const cycleData = this.data.tables?.parte5_circolante?.cicloCircolanteSintesi || {};
        container.innerHTML = `
            <div class="kpi-card-v4">
                <div class="icon-circle warning"><i class="fas fa-calendar-day"></i></div>
                <div class="kpi-content">
                    <div class="kpi-label">DSO</div>
                    <div class="kpi-value">${cycleData.dso || '41'} gg</div>
                    <div class="kpi-subtitle">Giorni Crediti</div>
                </div>
            </div>
            <div class="kpi-card-v4">
                <div class="icon-circle success"><i class="fas fa-warehouse"></i></div>
                <div class="kpi-content">
                    <div class="kpi-label">DIO</div>
                    <div class="kpi-value">${cycleData.dio || '194'} gg</div>
                    <div class="kpi-subtitle">Giorni Magazzino</div>
                </div>
            </div>
            <div class="kpi-card-v4">
                <div class="icon-circle warning"><i class="fas fa-hand-holding-usd"></i></div>
                <div class="kpi-content">
                    <div class="kpi-label">DPO</div>
                    <div class="kpi-value">${cycleData.dpo || '68'} gg</div>
                    <div class="kpi-subtitle">Giorni Debiti</div>
                </div>
            </div>
        `;
    },
    renderCCNTable() {
        const container = document.getElementById('ccnTable');
        if (!container) return;
        const ccnData = this.data.tables?.parte5_circolante?.flussiCassa2024;
        if (!ccnData) return;
        const thead = '<thead><tr>' + ccnData.headers.map(h => '<th>' + h + '</th>').join('') + '</tr></thead>';
        let tbody = '<tbody>';
        ccnData.rows.forEach(row => {
            const rowClass = row.highlight ? 'table-warning' : '';
            const valueClass = row.valore >= 0 ? 'text-success' : 'text-danger';
            tbody += '<tr class="' + rowClass + '"><td>' + row.voce + '</td><td class="text-end ' + valueClass + '">' + Utils.formatCurrency(row.valore) + '</td><td class="text-end">' + row.pctRicavi.toFixed(2) + '%</td></tr>';
        });
        tbody += '</tbody>';
        container.innerHTML = thead + tbody;
    }
};
document.addEventListener('DOMContentLoaded', () => { Parte5Circolante.init(); });
