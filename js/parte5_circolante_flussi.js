const Parte5Circolante = {
    data: null,
    charts: {},
    async init() {
        try {
            await App.init();
            this.data = App.getData();
            this.renderCiclo();
            this.renderCCN();
            this.renderCashFlow();
        } catch (error) {
            console.error('Error initializing Parte 5:', error);
        }
    },
    renderCiclo() {
        const container = document.getElementById('cicloGrid');
        if (!container) return;
        const kpis = this.data.kpis || {};
        const dso = kpis.dso?.value || 0;
        const dio = this.data.tables?.parte5_circolante?.cycleMetrics?.rows?.find(r => r.metric === 'DIO')?.[2024] || 0;
        const dpo = this.data.tables?.parte5_circolante?.cycleMetrics?.rows?.find(r => r.metric === 'DPO')?.[2024] || 0;
        const cicli = [
            { label: 'DSO', value: dso, unit: 'giorni', status: dso > 60 ? 'warning' : 'good', description: 'Giorni medi di incasso' },
            { label: 'DIO', value: dio, unit: 'giorni', status: dio > 60 ? 'warning' : 'good', description: 'Giorni giacenza magazzino' },
            { label: 'DPO', value: dpo, unit: 'giorni', status: 'good', description: 'Giorni medi di pagamento' }
        ];
        container.innerHTML = cicli.map(ciclo => '<div class="cycle-kpi ' + ciclo.status + '"><div class="cycle-kpi-label">' + ciclo.label + '</div><div class="cycle-kpi-value">' + ciclo.value + '<span class="cycle-kpi-unit">' + ciclo.unit + '</span></div><div style="margin-top: 12px; font-size: 13px; color: var(--text-secondary);">' + ciclo.description + '</div></div>').join('');
    },
    renderCCN() {
        const container = document.getElementById('ccnTable');
        if (!container) return;
        const ccnData = this.data.tables?.parte5_circolante?.workingCapital;
        if (ccnData) {
            TableRenderer.renderTable(container, ccnData);
        } else {
            container.innerHTML = '<thead><tr><th>Componente</th><th class="text-right">2024</th><th class="text-right">2023</th></tr></thead><tbody><tr class="table-primary"><td>Attivo Circolante</td><td class="text-right">€1.828K</td><td class="text-right">€1.996K</td></tr><tr class="table-primary"><td>Passivo Corrente</td><td class="text-right">€529K</td><td class="text-right">€663K</td></tr><tr><td colspan="3"></td></tr><tr class="table-success"><td><strong>CCN</strong></td><td class="text-right"><strong>€1.299K</strong></td><td class="text-right"><strong>€1.333K</strong></td></tr></tbody>';
        }
    },
    renderCashFlow() {
        const ctx = document.getElementById('cashFlowChart');
        if (!ctx) return;
        const cfData = this.data.tables?.parte5_circolante?.cashFlow?.rows || [];
        const labels = cfData.length > 0 ? cfData.map(r => r.item) : ['Liquidità Iniziale', 'CF Operativo', 'CF Investimenti', 'CF Finanziario', 'Liquidità Finale'];
        const values = cfData.length > 0 ? cfData.map(r => r.value / 1000) : [425, 211, -50, -230, 355];
        if (this.charts.cashFlow) this.charts.cashFlow.destroy();
        this.charts.cashFlow = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Cash Flow (€K)',
                    data: values,
                    backgroundColor: values.map(v => v >= 0 ? '#24b47e' : '#F44336')
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { ticks: { callback: v => '€' + v + 'K' } } }
            }
        });
    }
};
document.addEventListener('DOMContentLoaded', () => { Parte5Circolante.init(); });
