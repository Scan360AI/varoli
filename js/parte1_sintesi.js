const Parte1Sintesi = {
    data: null,
    async init() {
        try {
            await App.init();
            this.data = App.getData();
            this.renderPageIntro();
            this.renderKPICards();
            this.renderKPICommentary();
            this.renderIRPSection();
            this.renderBusinessModel();
            this.renderCCIIAlert();
            this.renderNormativeContext();
            this.renderProfileCards();
            this.renderSWOTCards();
            this.renderPriorityActionsTable();
        } catch (error) {
            console.error('Error initializing Parte 1:', error);
        }
    },
    renderPageIntro() {
        const container = document.getElementById('pageIntro');
        if (!container) return;
        const intro = this.data.content?.parte1_sintesi?.pageIntro || '';
        container.innerHTML = `<div class="alert alert-info"><i class="fas fa-info-circle me-2"></i>${intro}</div>`;
    },
    renderKPICards() {
        const container = document.getElementById('kpiMainGrid');
        if (!container) return;
        const kpis = this.data.kpis || {};
        const kpiConfigs = [
            { kpi: 'revenue', icon: 'fa-chart-line' },
            { kpi: 'ebitda', icon: 'fa-piggy-bank' },
            { kpi: 'netIncome', icon: 'fa-coins' },
            { kpi: 'equity', icon: 'fa-university' }
        ];
        container.innerHTML = kpiConfigs.map(cfg => {
            const kpi = kpis[cfg.kpi] || {};
            const trendDir = kpi.trend?.direction === 'up' ? 'up' : kpi.trend?.direction === 'down' ? 'down' : 'minus';
            const trendType = kpi.trend?.direction === 'up' ? 'positive' : kpi.trend?.direction === 'down' ? 'negative' : 'neutral';
            return `<div class="kpi-card-v4">
                <div class="icon-circle ${kpi.status || 'warning'}"><i class="fas ${cfg.icon}"></i></div>
                <div class="kpi-content">
                    <div class="kpi-label">${kpi.title || 'N/A'}</div>
                    <div class="kpi-value">${kpi.displayValue || '-'}</div>
                    <div class="kpi-trend ${trendType}">
                        <i class="fas fa-arrow-${trendDir}"></i>
                        <span>${kpi.trend?.displayValue || '-'} ${kpi.trend?.label || ''}</span>
                    </div>
                </div>
            </div>`;
        }).join('');
    },
    renderKPICommentary() {
        const container = document.getElementById('kpiCommentary');
        if (!container) return;
        const commentary = this.data.content?.parte1_sintesi?.kpiCommentary || '';
        if (commentary) {
            container.innerHTML = `<div class="alert alert-warning mt-3"><i class="fas fa-exclamation-triangle me-2"></i>${commentary}</div>`;
        }
    },
    renderIRPSection() {
        const irpData = this.data.kpis?.irp || {};
        const score = irpData.value || 0;
        const category = irpData.category || 'N/A';
        const riskLevel = irpData.categoryLabel || 'Non disponibile';
        const riskClass = Utils.getRiskLevel(score);
        const scoreCircle = document.getElementById('irpScoreCircle');
        if (scoreCircle) scoreCircle.className = 'irp-score-circle risk-' + riskClass;
        const scoreValue = document.getElementById('irpScoreValue');
        if (scoreValue) scoreValue.textContent = score.toFixed(1);
        const categoryBadge = document.getElementById('irpCategoryBadge');
        if (categoryBadge) {
            categoryBadge.className = 'badge ' + (irpData.status || 'danger');
            categoryBadge.textContent = 'Categoria ' + category;
        }
        const riskLevelEl = document.getElementById('irpRiskLevel');
        if (riskLevelEl) riskLevelEl.textContent = riskLevel;
        const visualSection = document.getElementById('irpVisualSection');
        if (visualSection) visualSection.className = 'irp-visual-section risk-' + riskClass;
        const marker = document.getElementById('irpMarker');
        if (marker) marker.style.left = score + '%';
        this.renderIRPIndicators();
        const narrative = document.getElementById('irpNarrative');
        if (narrative) narrative.innerHTML = this.data.content?.parte1_sintesi?.irpDescription || 'L\'azienda presenta un IRP di ' + score.toFixed(1) + '/100.';
    },
    renderIRPIndicators() {
        const container = document.getElementById('irpIndicators');
        if (!container) return;
        const supportData = this.data.tables?.parte1_sintesi?.supportIndicators?.rows || [];
        const indicators = [
            { label: this.data.kpis?.leanusScore?.title || 'Leanus Score', value: this.data.kpis?.leanusScore?.displayValue || 'N/A', max: this.data.kpis?.leanusScore?.metadata?.max },
            { label: 'Business Category', value: this.data.kpis?.leanusScore?.metadata?.category || 'N/A' },
            { label: 'Rating MCC', value: supportData.find(r => r.indicator === 'Rating MCC')?.value || 'n.d.' }
        ];
        container.innerHTML = indicators.map(ind => `<div class="col-md-4"><div class="kpi-card-v4"><div class="kpi-content" style="text-align: center; width: 100%;"><div class="kpi-label">${ind.label}</div><div class="kpi-value" style="font-size: 24px;">${ind.value}${ind.max ? '<span style="font-size: 16px; color: var(--text-secondary);"> / ' + ind.max + '</span>' : ''}</div></div></div></div>`).join('');
    },
    renderBusinessModel() {
        const container = document.getElementById('businessModelSection');
        if (!container) return;
        const title = this.data.content?.parte1_sintesi?.businessModelTitle || 'Modello di Business';
        const text = this.data.content?.parte1_sintesi?.businessModel || '';
        container.innerHTML = `
            <div class="content-section">
                <div class="section-header">
                    <h2 class="section-title"><i class="fas fa-industry"></i> ${title}</h2>
                </div>
                <div class="alert alert-light">
                    <p style="margin: 0; line-height: 1.8;">${text}</p>
                </div>
            </div>`;
    },
    renderCCIIAlert() {
        const container = document.getElementById('cciiAlertSection');
        if (!container) return;
        const ccii = this.data.content?.parte1_sintesi?.cciiAlert || {};
        if (ccii.title) {
            container.innerHTML = `
                <div class="alert alert-warning">
                    <h5 class="alert-heading"><i class="fas fa-gavel me-2"></i>${ccii.title}</h5>
                    <p style="margin: 0;">${ccii.description || ''}</p>
                </div>`;
        }
    },
    renderNormativeContext() {
        const container = document.getElementById('normativeSection');
        if (!container) return;
        const title = this.data.content?.parte1_sintesi?.normativeTitle || 'Quadro Normativo';
        const items = this.data.content?.parte1_sintesi?.normativeContext || [];
        if (items.length > 0) {
            container.innerHTML = `
                <div class="content-section">
                    <div class="section-header">
                        <h2 class="section-title"><i class="fas fa-balance-scale"></i> ${title}</h2>
                    </div>
                    <div class="alert alert-light">
                        <ul style="margin: 0; padding-left: 20px; line-height: 2;">
                            ${items.map(item => '<li>' + item + '</li>').join('')}
                        </ul>
                    </div>
                </div>`;
        }
    },
    renderProfileCards() {
        const container = document.getElementById('profileGrid');
        if (!container) return;
        const company = this.data.company || {};
        const profiles = [
            {
                title: 'Dati Identificativi',
                icon: 'fa-id-card',
                items: [
                    { label: 'Ragione Sociale', value: company.profile?.legalName || company.name || '-' },
                    { label: 'Settore', value: company.profile?.sector || '-' },
                    { label: 'ATECO', value: company.profile?.ateco || '-' },
                    { label: 'Sede', value: company.profile?.headquarters ? (company.profile.headquarters.city + ', ' + company.profile.headquarters.region) : '-' }
                ]
            },
            {
                title: 'Operatività',
                icon: 'fa-industry',
                items: [
                    { label: 'Anno costituzione', value: company.profile?.founded || '-' },
                    { label: 'Dipendenti', value: company.profile?.employees || '-' },
                    { label: 'Dimensione', value: company.profile?.size || '-' },
                    { label: 'Business Model', value: company.profile?.businessModel || '-' }
                ]
            },
            {
                title: 'Governance',
                icon: 'fa-users',
                items: [
                    { label: 'Capitale Sociale', value: company.profile?.shareCapital ? Utils.formatCurrency(company.profile.shareCapital) : '-' },
                    { label: 'Proprietà', value: company.profile?.ownership || '-' },
                    { label: 'Forma Giuridica', value: 'S.R.L.' },
                    { label: 'Anno fiscale', value: company.fiscalYear || '-' }
                ]
            }
        ];
        container.innerHTML = profiles.map(profile => `<div class="profile-section-restored"><div class="profile-section-title"><i class="fas ${profile.icon}"></i>${profile.title}</div>${profile.items.map(item => '<div class="profile-item"><div class="profile-label">' + item.label + '</div><div class="profile-value">' + item.value + '</div></div>').join('')}</div>`).join('');
    },
    renderSWOTCards() {
        const container = document.getElementById('swotGrid');
        if (!container) return;
        const swotIntro = document.getElementById('swotIntro');
        if (swotIntro) {
            const intro = this.data.content?.parte1_sintesi?.swotIntro || '';
            if (intro) swotIntro.innerHTML = `<p class="mb-3">${intro}</p>`;
        }
        const swotData = this.data.tables?.parte1_sintesi?.swot || {};
        const swotCards = [
            { type: 'strengths', title: 'Punti di Forza', icon: 'fa-thumbs-up', items: swotData.strengths || ['Dati non disponibili'] },
            { type: 'weaknesses', title: 'Punti di Debolezza', icon: 'fa-thumbs-down', items: swotData.weaknesses || ['Dati non disponibili'] },
            { type: 'opportunities', title: 'Opportunità', icon: 'fa-lightbulb', items: swotData.opportunities || ['Dati non disponibili'] },
            { type: 'threats', title: 'Minacce', icon: 'fa-exclamation-triangle', items: swotData.threats || ['Dati non disponibili'] }
        ];
        container.innerHTML = swotCards.map(card => `<div class="swot-card-restored"><div class="swot-card-header ${card.type}"><i class="fas ${card.icon}"></i><span>${card.title}</span></div><div class="swot-card-body"><ul>${card.items.map(item => '<li>' + item + '</li>').join('')}</ul></div></div>`).join('');
    },
    renderPriorityActionsTable() {
        const container = document.getElementById('priorityActionsTable');
        if (!container) return;
        const intro = document.getElementById('priorityActionsIntro');
        if (intro) {
            const introText = this.data.content?.parte1_sintesi?.priorityActionsIntro || '';
            if (introText) intro.innerHTML = `<p class="mb-3">${introText}</p>`;
        }
        const actionsData = this.data.tables?.parte1_sintesi?.priorityActions?.rows || [];
        const getPriorityBadge = (priority) => ({ 'Alta': 'danger', 'Media': 'warning', 'Bassa': 'info' }[priority] || 'info');
        container.innerHTML = '<thead><tr><th>Priorità</th><th>Area</th><th>Azione</th><th>Impatto Atteso</th></tr></thead><tbody>' +
            (actionsData.length > 0 ? actionsData.map(action => '<tr><td><span class="badge ' + getPriorityBadge(action.priority) + '">' + action.priority + '</span></td><td class="fw-semibold">' + action.area + '</td><td>' + action.action + '</td><td>' + action.impact + '</td></tr>').join('') : '<tr><td colspan="4" class="text-center">Nessun dato disponibile</td></tr>') +
            '</tbody>';
    }
};
document.addEventListener('DOMContentLoaded', () => { Parte1Sintesi.init(); });
