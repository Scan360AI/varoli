const Parte5Circolante = {
    data: null,
    charts: {},
    async init() {
        try {
            await App.init();
            this.data = App.getData();
            this.renderSectionIntro();
            this.renderCashCycleAlert();
            this.renderWorkingCapitalAnalysis();
            this.renderCycleComponents();
            this.renderCashFlowAnalysis();
            this.renderOptimizationStrategies();
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
        container.innerHTML = `<div class="alert alert-warning"><h5 class="alert-heading"><i class="fas fa-sync-alt me-2"></i>${alert.title || ''}</h5><p style="margin:0;">${alert.description || ''}</p></div>`;
    },
    renderWorkingCapitalAnalysis() {
        const container = document.getElementById('workingCapitalAnalysis');
        if (!container) return;
        const title = this.data.content?.parte5_circolante_flussi?.workingCapitalTitle || 'Capitale Circolante';
        const text = this.data.content?.parte5_circolante_flussi?.workingCapitalAnalysis || '';
        const cycleOpt = this.data.content?.parte5_circolante_flussi?.cycleOptimization || '';
        container.innerHTML = `<div class="content-section"><h3>${title}</h3><p>${text}</p><div class="alert alert-info mt-2"><strong>Ottimizzazione:</strong> ${cycleOpt}</div></div>`;
    },
    renderCycleComponents() {
        const container = document.getElementById('cycleComponentsGrid');
        if (!container) return;
        const dso = this.data.kpis?.dso || {};
        const inventoryNote = this.data.content?.parte5_circolante_flussi?.inventoryNote || '';
        const receivablesNote = this.data.content?.parte5_circolante_flussi?.receivablesNote || '';
        const payablesNote = this.data.content?.parte5_circolante_flussi?.payablesNote || '';
        container.innerHTML = `
            <div class="kpi-card-v4">
                <div class="icon-circle success"><i class="fas fa-calendar-check"></i></div>
                <div class="kpi-content">
                    <div class="kpi-label">DSO (Crediti Clienti)</div>
                    <div class="kpi-value">${dso.value || 'N/A'} giorni</div>
                    <div class="kpi-subtitle">${receivablesNote.substring(0, 50) || ''}</div>
                </div>
            </div>`;
        const inventoryContainer = document.getElementById('inventoryAnalysis');
        if (inventoryContainer) inventoryContainer.innerHTML = `<div class="alert alert-danger">${inventoryNote}</div>`;
        const payablesContainer = document.getElementById('payablesAnalysis');
        if (payablesContainer) payablesContainer.innerHTML = `<div class="alert alert-warning">${payablesNote}</div>`;
    },
    renderCashFlowAnalysis() {
        const container = document.getElementById('cashFlowAnalysis');
        if (!container) return;
        const title = this.data.content?.parte5_circolante_flussi?.cashFlowTitle || 'Cash Flow';
        const intro = this.data.content?.parte5_circolante_flussi?.cashFlowIntro || '';
        const note = this.data.content?.parte5_circolante_flussi?.cashFlowNote || '';
        container.innerHTML = `<div class="content-section"><h3>${title}</h3><p>${intro}</p><div class="alert alert-warning mt-2">${note}</div></div>`;
    },
    renderOptimizationStrategies() {
        const container = document.getElementById('optimizationStrategies');
        if (!container) return;
        const strategies = this.data.content?.parte5_circolante_flussi?.optimizationStrategies || '';
        container.innerHTML = `<div class="alert alert-light"><strong>Strategie di Ottimizzazione:</strong> ${strategies}</div>`;
    }
};
document.addEventListener('DOMContentLoaded', () => { Parte5Circolante.init(); });
