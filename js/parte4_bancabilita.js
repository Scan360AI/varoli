const Parte4Bancabilita = {
    data: null,
    charts: {},
    async init() {
        try {
            await App.init();
            this.data = App.getData();
            this.renderSectionIntro();
            this.renderDSCRAlert();
            this.renderSustainabilityAnalysis();
            this.renderSostenibilitaDebitoTable();
            this.createDebtSustainabilityChart();
            this.createFinancialDebtChart();
            this.createDebtCostChart();
            this.renderCCIIAnalysis();
            this.renderCCIIIndicatorsTable();
            this.renderBankabilityRecommendation();
            this.renderValutazioneBancabilitaTable();
            this.renderMeritoGrid();
            this.renderDSCRTable();
            this.renderRatingCards();
        } catch (error) {
            console.error('Error initializing Parte 4:', error);
        }
    },
    renderSectionIntro() {
        const container = document.getElementById('sectionIntro');
        if (!container) return;
        const intro = this.data.content?.parte4_bancabilita?.sectionIntro || '';
        container.innerHTML = `<div class="alert alert-info"><i class="fas fa-info-circle me-2"></i>${intro}</div>`;
    },
    renderDSCRAlert() {
        const container = document.getElementById('dscrAlert');
        if (!container) return;
        const alert = this.data.content?.parte4_bancabilita?.dscrAlert || {};
        container.innerHTML = `<div class="alert alert-danger"><h5 class="alert-heading"><i class="fas fa-exclamation-triangle me-2"></i>${alert.title || ''}</h5><p style="margin:0;">${alert.description || ''}</p></div>`;
    },
    renderSustainabilityAnalysis() {
        const container = document.getElementById('sustainabilityAnalysis');
        if (!container) return;
        const title = this.data.content?.parte4_bancabilita?.sustainabilityTitle || 'Sostenibilità Debito';
        const intro = this.data.content?.parte4_bancabilita?.sustainabilityIntro || '';
        const pfnNote = this.data.content?.parte4_bancabilita?.pfnEbitdaNote || '';
        const intNote = this.data.content?.parte4_bancabilita?.interestCoverageNote || '';
        container.innerHTML = `<div class="content-section"><h3>${title}</h3><p>${intro}</p><div class="alert alert-danger mt-2"><strong>PFN/EBITDA:</strong> ${pfnNote}</div><div class="alert alert-danger mt-2"><strong>Interest Coverage:</strong> ${intNote}</div></div>`;
    },
    renderCCIIAnalysis() {
        const container = document.getElementById('cciiAnalysis');
        if (!container) return;
        const title = this.data.content?.parte4_bancabilita?.cciiTitle || 'CCII';
        const note = this.data.content?.parte4_bancabilita?.cciiNote || '';
        container.innerHTML = `<div class="content-section"><h3>${title}</h3><div class="alert alert-warning">${note}</div></div>`;
    },
    renderBankabilityRecommendation() {
        const container = document.getElementById('bankabilityRecommendation');
        if (!container) return;
        const title = this.data.content?.parte4_bancabilita?.bankabilityTitle || 'Bancabilità';
        const intro = this.data.content?.parte4_bancabilita?.bankabilityIntro || '';
        const ratingNote = this.data.content?.parte4_bancabilita?.creditRatingNote || '';
        const actionPlan = this.data.content?.parte4_bancabilita?.actionPlanBankability || '';
        container.innerHTML = `<div class="content-section"><h3>${title}</h3><p>${intro}</p><div class="alert alert-danger mt-2">${ratingNote}</div><div class="alert alert-info mt-3"><strong>Raccomandazioni:</strong> ${actionPlan}</div></div>`;
    },
    renderSostenibilitaDebitoTable() {
        const container = document.getElementById('sostenibilitaDebitoTable');
        if (!container) return;
        const data = this.data.tables?.parte4_bancabilita?.sostenibilitaDebito;
        if (!data) return;
        const thead = '<thead><tr>' + data.headers.map(h => '<th>' + h + '</th>').join('') + '</tr></thead>';
        const tbody = '<tbody>' + data.rows.map(row => {
            const badgeColor = row.valutazione === 'Critico' ? 'danger' : row.valutazione === 'Allerta' ? 'warning' : row.valutazione === 'Buono' ? 'success' : 'info';
            return '<tr><td>' + row.indicatore + '</td><td class="text-center">' + row['2022'] + '</td><td class="text-center">' + row['2023'] + '</td><td class="text-center">' + row['2024'] + '</td><td class="text-center">' + row.benchmark + '</td><td class="text-center"><span class="badge bg-' + badgeColor + '">' + row.valutazione + '</span></td><td>' + row.note + '</td></tr>';
        }).join('') + '</tbody>';
        container.innerHTML = thead + tbody;
    },
    renderCCIIIndicatorsTable() {
        const container = document.getElementById('cciiIndicatorsTable');
        if (!container) return;
        const data = this.data.tables?.parte4_bancabilita?.cciiIndicators;
        if (!data) return;
        const thead = '<thead><tr>' + data.headers.map(h => '<th>' + h + '</th>').join('') + '</tr></thead>';
        const tbody = '<tbody>' + data.rows.map(row => {
            const badgeColor = row.status === 'Critico' ? 'danger' : row.status === 'Allerta' ? 'warning' : 'success';
            return '<tr><td><i class="fas ' + row.icon + ' text-' + row.iconColor + ' me-2"></i>' + row.indicatore + '</td><td class="text-center">' + row.valore + '</td><td class="text-center">' + row.soglia + '</td><td class="text-center"><span class="badge bg-' + badgeColor + '">' + row.status + '</span></td><td>' + row.note + '</td></tr>';
        }).join('') + '</tbody>';
        container.innerHTML = thead + tbody;
    },
    renderValutazioneBancabilitaTable() {
        const container = document.getElementById('valutazioneBancabilitaTable');
        if (!container) return;
        const data = this.data.tables?.parte4_bancabilita?.valutazioneBancabilita;
        if (!data) return;
        const thead = '<thead><tr>' + data.headers.map(h => '<th>' + h + '</th>').join('') + '</tr></thead>';
        const tbody = '<tbody>' + data.rows.map(row => {
            const scoreClass = row.score < 50 ? 'text-danger' : row.score < 70 ? 'text-warning' : 'text-success';
            return '<tr><td>' + row.criterio + '</td><td class="text-center">' + row.peso + '%</td><td class="text-center ' + scoreClass + '">' + row.score + '</td><td class="text-center">' + (row.peso * row.score / 100).toFixed(1) + '</td><td>' + row.note + '</td></tr>';
        }).join('') + '</tbody>';
        container.innerHTML = thead + tbody;
    },
    renderRatingCards() {
        const container = document.getElementById('ratingCardsGrid');
        if (!container) return;
        const leanus = this.data.kpis?.leanusScore || {};
        const irp = this.data.kpis?.irp || {};
        const leanusNote = this.data.content?.parte4_bancabilita?.leanusScoreNote || '';
        container.innerHTML = `
            <div class="kpi-card-v4">
                <div class="icon-circle warning"><i class="fas fa-chart-bar"></i></div>
                <div class="kpi-content">
                    <div class="kpi-label">Leanus Score</div>
                    <div class="kpi-value">${leanus.displayValue || 'N/A'}</div>
                    <div class="kpi-subtitle">${leanus.metadata?.category || ''}</div>
                </div>
            </div>
            <div class="kpi-card-v4">
                <div class="icon-circle danger"><i class="fas fa-exclamation-triangle"></i></div>
                <div class="kpi-content">
                    <div class="kpi-label">IRP</div>
                    <div class="kpi-value">${irp.value?.toFixed(1) || 'N/A'}/100</div>
                    <div class="kpi-subtitle">${irp.categoryLabel || ''}</div>
                </div>
            </div>`;
        const noteContainer = document.getElementById('leanusNote');
        if (noteContainer) noteContainer.innerHTML = `<div class="alert alert-light mt-3">${leanusNote}</div>`;
    },
    createDebtSustainabilityChart() {
        const ctx = document.getElementById('debtSustainabilityChart');
        if (!ctx) return;
        const chartData = this.data.charts?.reports?.parte4?.debtSustainabilityChart;
        if (!chartData) return;
        if (this.charts.debtSustainability) this.charts.debtSustainability.destroy();
        this.charts.debtSustainability = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: chartData.labels,
                datasets: [
                    {
                        label: chartData.datasets.company.label,
                        data: chartData.datasets.company.data,
                        backgroundColor: 'rgba(220, 53, 69, 0.2)',
                        borderColor: 'rgba(220, 53, 69, 1)',
                        borderWidth: 2,
                        pointBackgroundColor: 'rgba(220, 53, 69, 1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(220, 53, 69, 1)'
                    },
                    {
                        label: chartData.datasets.target.label,
                        data: chartData.datasets.target.data,
                        backgroundColor: 'rgba(40, 167, 69, 0.2)',
                        borderColor: 'rgba(40, 167, 69, 1)',
                        borderWidth: 2,
                        pointBackgroundColor: 'rgba(40, 167, 69, 1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(40, 167, 69, 1)'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            stepSize: 20
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.r.toFixed(0) + '/100';
                            }
                        }
                    }
                }
            }
        });
    },
    createFinancialDebtChart() {
        const ctx = document.getElementById('financialDebtChart');
        if (!ctx) return;
        const chartData = this.data.charts?.reports?.parte4?.financialDebtChart;
        if (!chartData) return;
        if (this.charts.financialDebt) this.charts.financialDebt.destroy();
        this.charts.financialDebt = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: chartData.labels,
                datasets: [{
                    data: chartData.datasets.values.data,
                    backgroundColor: [
                        'rgba(220, 53, 69, 0.8)',
                        'rgba(255, 193, 7, 0.8)'
                    ],
                    borderColor: [
                        'rgba(220, 53, 69, 1)',
                        'rgba(255, 193, 7, 1)'
                    ],
                    borderWidth: 1
                }]
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
                                const value = Utils.formatCurrency(context.raw);
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.raw / total) * 100).toFixed(1);
                                return `${context.label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    },
    createDebtCostChart() {
        const ctx = document.getElementById('debtCostChart');
        if (!ctx) return;
        const chartData = this.data.charts?.reports?.parte4?.debtCostChart;
        if (!chartData) return;
        if (this.charts.debtCost) this.charts.debtCost.destroy();
        this.charts.debtCost = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartData.labels,
                datasets: [
                    {
                        label: chartData.datasets.ebitda.label,
                        data: chartData.datasets.ebitda.data,
                        backgroundColor: 'rgba(0, 123, 255, 0.8)',
                        type: 'bar'
                    },
                    {
                        label: chartData.datasets.debtCapacity.label,
                        data: chartData.datasets.debtCapacity.data,
                        borderColor: 'rgba(40, 167, 69, 1)',
                        borderWidth: 3,
                        fill: false,
                        type: 'line'
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
    renderMeritoGrid() {
        const container = document.getElementById('meritoGrid');
        if (!container) return;
        const pfnEbitda = this.data.kpis?.pfnEbitda || {};
        const leverageDE = this.data.kpis?.leverageDE || {};
        const cashFlow = this.data.kpis?.cashFlowOperativo || {};
        const dso = this.data.kpis?.dso || {};
        container.innerHTML = `
            <div class="kpi-card-v4">
                <div class="icon-circle ${pfnEbitda.status || 'danger'}"><i class="fas ${pfnEbitda.icon || 'fa-balance-scale'}"></i></div>
                <div class="kpi-content">
                    <div class="kpi-label">${pfnEbitda.title || 'PFN/EBITDA'}</div>
                    <div class="kpi-value">${pfnEbitda.displayValue || 'N/A'}</div>
                    <div class="kpi-subtitle">${pfnEbitda.description || ''}</div>
                </div>
            </div>
            <div class="kpi-card-v4">
                <div class="icon-circle ${leverageDE.status || 'danger'}"><i class="fas ${leverageDE.icon || 'fa-money-bill-wave'}"></i></div>
                <div class="kpi-content">
                    <div class="kpi-label">${leverageDE.title || 'D/E'}</div>
                    <div class="kpi-value">${leverageDE.displayValue || 'N/A'}</div>
                    <div class="kpi-subtitle">${leverageDE.description || ''}</div>
                </div>
            </div>
            <div class="kpi-card-v4">
                <div class="icon-circle ${cashFlow.status || 'warning'}"><i class="fas ${cashFlow.icon || 'fa-coins'}"></i></div>
                <div class="kpi-content">
                    <div class="kpi-label">${cashFlow.title || 'Cash Flow Op.'}</div>
                    <div class="kpi-value">${cashFlow.displayValue || 'N/A'}</div>
                    <div class="kpi-subtitle">${cashFlow.trend?.displayValue || ''} ${cashFlow.trend?.label || ''}</div>
                </div>
            </div>
            <div class="kpi-card-v4">
                <div class="icon-circle ${dso.status || 'warning'}"><i class="fas ${dso.icon || 'fa-file-invoice-dollar'}"></i></div>
                <div class="kpi-content">
                    <div class="kpi-label">${dso.title || 'DSO'}</div>
                    <div class="kpi-value">${dso.displayValue || 'N/A'}</div>
                    <div class="kpi-subtitle">${dso.description || ''}</div>
                </div>
            </div>
        `;
    },
    renderDSCRTable() {
        const container = document.getElementById('dscrTable');
        if (!container) return;
        const dscrData = this.data.tables?.parte4_bancabilita?.sostenibilitaDebito;
        if (!dscrData) return;
        const dscrRow = dscrData.rows.find(r => r.indicatore === 'DSCR');
        if (!dscrRow) return;
        const headers = '<thead><tr><th>Metrica</th><th>2022</th><th>2023</th><th>2024</th><th>Benchmark</th><th>Valutazione</th></tr></thead>';
        const tbody = '<tbody><tr><td><strong>DSCR (Debt Service Coverage Ratio)</strong></td><td class="text-center">' + (dscrRow['2022'] || '-') + '</td><td class="text-center">' + (dscrRow['2023'] || '-') + '</td><td class="text-center">' + (dscrRow['2024'] || '-') + '</td><td class="text-center">' + (dscrRow.benchmark || '-') + '</td><td class="text-center"><span class="badge bg-success">Sufficiente</span></td></tr></tbody>';
        container.innerHTML = headers + tbody;
    }
};
document.addEventListener('DOMContentLoaded', () => { Parte4Bancabilita.init(); });
