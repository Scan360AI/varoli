const Parte4Bancabilita = {
    data: null,
    async init() {
        try {
            await App.init();
            this.data = App.getData();
            this.renderSectionIntro();
            this.renderDSCRAlert();
            this.renderSustainabilityAnalysis();
            this.renderCCIIAnalysis();
            this.renderBankabilityRecommendation();
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
    }
};
document.addEventListener('DOMContentLoaded', () => { Parte4Bancabilita.init(); });
