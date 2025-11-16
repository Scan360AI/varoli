const Parte6Rischi = {
    data: null,
    async init() {
        try {
            await App.init();
            this.data = App.getData();
            this.renderSectionIntro();
            this.renderIndicatoriRischioTable();
            this.renderZScoreRatingTable();
            this.renderRedFlagsTable();
            this.renderManipulationAnalysisTable();
            this.renderSensitivityAnalysisTable();
            this.renderStressTestTable();
            this.renderActionPlanOperativo();
            this.renderTimelineActions();
            this.renderKPITargetTable();
            this.renderAlertingSystemTable();
            this.renderSummaryCard();
            this.renderRiskMatrix();
            this.renderRedFlags();
            this.renderActionPlan();
            this.renderDashboardKPITable();
            this.renderGovernanceNote();
            this.renderScenarioAnalysis();
        } catch (error) {
            console.error('Error initializing Parte 6:', error);
        }
    },
    renderSectionIntro() {
        const container = document.getElementById('sectionIntro');
        if (!container) return;
        const intro = this.data.content?.parte6_rischi_raccomandazioni?.sectionIntro || '';
        container.innerHTML = `<div class="alert alert-info"><i class="fas fa-info-circle me-2"></i>${intro}</div>`;
    },
    renderIndicatoriRischioTable() {
        const container = document.getElementById('indicatoriRischioTable');
        if (!container) return;
        const data = this.data.tables?.parte6_rischi?.indicatoriRischio;
        if (!data) return;
        const thead = '<thead class="table-light"><tr>' + data.headers.map(h => '<th>' + h + '</th>').join('') + '</tr></thead>';
        const tbody = '<tbody>' + data.rows.map(row => {
            const trendIcon = row.trend === 'Peggioramento' ? '↘' : row.trend === 'Miglioramento' ? '↗' : '→';
            const valClass = row.valutazione.includes('critico') || row.valutazione.includes('Forte') ? 'text-danger' :
                           row.valutazione.includes('sufficiente') || row.valutazione.includes('positiv') ? 'text-warning' : 'text-secondary';
            return '<tr><td>' + row.indicatore + '</td><td class="text-end">' + (row['2022'] !== null ? row['2022'] : 'N/D') + '</td><td class="text-end">' +
                   (row['2023'] !== null ? row['2023'] : 'N/D') + '</td><td class="text-end">' + (row['2024'] !== null ? row['2024'] : 'NOK') +
                   '</td><td>' + trendIcon + '</td><td class="' + valClass + '">' + row.valutazione + '</td></tr>';
        }).join('') + '</tbody>';
        container.innerHTML = thead + tbody;
    },
    renderZScoreRatingTable() {
        const container = document.getElementById('zScoreRatingTable');
        if (!container) return;
        const data = this.data.tables?.parte6_rischi?.zScoreRating;
        if (!data) return;
        const thead = '<thead class="table-light"><tr>' + data.headers.map(h => '<th>' + h + '</th>').join('') + '</tr></thead>';
        const tbody = '<tbody>' + data.rows.map(row => {
            let badgeClass = 'info';
            if (row.interpretazione.includes('Elevat') || row.interpretazione.includes('Critico') || row.interpretazione.includes('Default')) {
                badgeClass = 'danger';
            } else if (row.interpretazione.includes('Zona grigia') || row.interpretazione.includes('Fragilità')) {
                badgeClass = 'warning text-dark';
            }
            return '<tr><td>' + row.indicatore + '</td><td class="text-end value-highlight">' + row.valore +
                   '</td><td><span class="badge bg-' + badgeClass + '">' + row.interpretazione + '</span></td></tr>';
        }).join('') + '</tbody>';
        container.innerHTML = thead + tbody;
    },
    renderRedFlagsTable() {
        const container = document.getElementById('redFlagsTable');
        if (!container) return;
        const data = this.data.tables?.parte6_rischi?.redFlags;
        if (!data) return;
        const thead = '<thead class="table-light"><tr>' + data.headers.map(h => '<th>' + h + '</th>').join('') + '</tr></thead>';
        const tbody = '<tbody>' + data.rows.map(row => {
            return '<tr><td>' + row.area + '</td><td>' + row.segnale + '</td><td>' + row.valore +
                   '</td><td>' + row.rischio + '</td></tr>';
        }).join('') + '</tbody>';
        container.innerHTML = thead + tbody;
    },
    renderManipulationAnalysisTable() {
        const tableHTML = `
            <div class="content-section">
                <h6>Tabella 6.4.1: Indicatori di potenziali manipolazioni contabili</h6>
                <table class="table table-sm">
                    <thead class="table-light"><tr><th>Test</th><th>Indicatori</th><th>Valutazione</th><th>Note</th></tr></thead>
                    <tbody>
                        <tr><td>Sales Profitability</td><td>- Fatturato: -14,27%<br>- EBITDA: -120,43%<br>- Variazione ricavi vs EBITDA: coerente</td>
                            <td class="text-left">✓ Coerente</td><td>Calo fatturato e marginalità allineati</td></tr>
                        <tr><td>Tax Effect</td><td>- Oneri finanziari: 67.447 €<br>- Posizione Tributaria Netta: -12.328 €<br>- Perdita d'esercizio: -149.177 €</td>
                            <td class="text-left">✓ Coerente</td><td>Situazione fiscale coerente con la perdita</td></tr>
                        <tr><td>Capitalism Test</td><td>- Investimenti: limitati<br>- Ammortamenti: 49.447 €<br>- Cash Flow Operativo: 211.345 €</td>
                            <td class="text-left">✓ Coerente</td><td>Investimenti coerenti con la situazione</td></tr>
                    </tbody>
                </table>
                <p><strong>Considerazioni:</strong> L'analisi non evidenzia particolari incongruenze o segnali di potenziali manipolazioni contabili.</p>
            </div>
        `;
        const container = document.querySelector('.content-wrapper');
        if (container) {
            // Insert after red flags section
            const redFlagsSection = document.getElementById('redFlagsTable');
            if (redFlagsSection && redFlagsSection.closest('.content-section')) {
                redFlagsSection.closest('.content-section').insertAdjacentHTML('afterend', tableHTML);
            }
        }
    },
    renderSensitivityAnalysisTable() {
        const tableHTML = `
            <div class="content-section">
                <h6>Tabella 6.5.1: Analisi di sensitività</h6>
                <div class="table-responsive">
                    <table class="table table-sm table-striped">
                        <thead class="table-light"><tr><th>Parametro</th><th>Valore critico</th><th>Interpretazione</th></tr></thead>
                        <tbody>
                            <tr><td>Variazione Ricavi che azzera l'EBIT</td><td>N/A</td><td class="text-danger">EBIT già negativo (-3,26%)</td></tr>
                            <tr><td>Variazione Costi Fissi che azzera l'EBIT</td><td>N/A</td><td class="text-danger">EBIT già negativo (-92.982 €)</td></tr>
                            <tr><td>Variazione Crediti Clienti che azzera la Liquidità</td><td>+38 gg</td><td class="text-danger">Bassa capacità di assorbire ritardi negli incassi</td></tr>
                            <tr><td>Variazione Rimanenze che annulla il Patrimonio Netto</td><td>-38,12%</td><td class="text-danger">Elevata sensibilità alla svalutazione magazzino</td></tr>
                            <tr><td>Variazione Debiti Fornitori che azzera la Liquidità</td><td>-29 gg</td><td class="text-danger">Elevata sensibilità all'accorciamento dei termini di pagamento</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        const container = document.querySelector('.content-wrapper');
        if (container) {
            const lastSection = container.querySelector('.content-section:last-of-type');
            if (lastSection) {
                lastSection.insertAdjacentHTML('beforebegin', tableHTML);
            }
        }
    },
    renderStressTestTable() {
        const tableHTML = `
            <div class="content-section">
                <h6>Tabella 6.6.1: Risultati Stress Test</h6>
                <div class="table-responsive small">
                    <table class="table table-sm table-hover">
                        <thead class="table-light"><tr><th>Stress Test</th><th>Superato</th><th>Valore critico</th><th>Valore attuale</th><th>Margine di sicurezza</th></tr></thead>
                        <tbody>
                            <tr><td>Variazione Ricavi</td><td class="text-danger">✗</td><td>N/A</td><td>-14,27%</td><td>Negativo</td></tr>
                            <tr><td>Variazione Costi Fissi</td><td class="text-danger">✗</td><td>N/A</td><td>N/A</td><td>Negativo</td></tr>
                            <tr><td>Variazione Crediti</td><td class="text-warning">⚠</td><td>+38 gg</td><td>89 gg</td><td>Solo 38 gg</td></tr>
                            <tr><td>Variazione Rimanenze</td><td class="text-warning">⚠</td><td>-38,12%</td><td>194 gg</td><td>Limitato</td></tr>
                            <tr><td>Variazione Debiti</td><td class="text-warning">⚠</td><td>-29 gg</td><td>116 gg</td><td>Solo 29 gg</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        const container = document.querySelector('.content-wrapper');
        if (container) {
            const lastSection = container.querySelector('.content-section:last-of-type');
            if (lastSection) {
                lastSection.insertAdjacentHTML('beforebegin', tableHTML);
            }
        }
    },
    renderActionPlanOperativo() {
        const container = document.getElementById('pianoAzioneTable');
        if (!container) return;
        const data = this.data.tables?.parte6_rischi?.pianoAzione;
        if (!data) return;
        const thead = '<thead class="table-light"><tr>' + data.headers.map(h => '<th>' + h + '</th>').join('') + '</tr></thead>';
        const tbody = '<tbody>' + data.rows.map(row => {
            const priorityBadge = row.priorita === 'Alta' ? 'bg-danger' : 'bg-warning text-dark';
            const iconHTML = '<i class="fas ' + (row.area.includes('debito') ? 'fa-coins' :
                             row.area.includes('Magazzino') ? 'fa-file-invoice' :
                             row.area.includes('Marginalità') ? 'fa-hand-holding-usd' :
                             row.area.includes('Crediti') ? 'fa-percentage' :
                             row.area.includes('Costi') ? 'fa-boxes' : 'fa-calculator') + ' me-1"></i>';
            return '<tr><td>' + iconHTML + row.area + '</td><td>' + row.situazione + '</td><td>' + row.azione +
                   '</td><td>' + row.effetti + '</td><td><span class="status-badge ' + priorityBadge + '">' + row.priorita + '</span></td></tr>';
        }).join('') + '</tbody>';
        container.innerHTML = thead + tbody;
    },
    renderTimelineActions() {
        const timelineHTML = `
            <div class="content-section">
                <h6>Tabella 7.3.1: Piano d'azione articolato per timeframe</h6>
                <ul class="timeline-irp" style="list-style: none; padding-left: 0; position: relative;">
                    <li class="timeline-irp-item" style="position: relative; margin-bottom: 1.5rem; padding-left: 45px;">
                        <div class="timeline-irp-badge priority-high" style="position: absolute; left: 0; top: 0; width: 38px; height: 38px; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; background-color: var(--danger); font-size: 0.75rem;">0/3m</div>
                        <div class="timeline-irp-content" style="background-color: var(--white); padding: 1rem; border-radius: 8px; border: 1px solid var(--card-border);">
                            <h6>Azioni Immediate <span class="badge bg-danger float-end">Urgenti</span></h6>
                            <ul class="small"><li>Avvio negoziazione con banche per ristrutturazione debito</li><li>Implementazione sistema monitoraggio flussi di cassa a 90 giorni</li><li>Analisi ABC magazzino e avvio liquidazione prodotti obsoleti</li><li>Revisione politiche commerciali e pricing</li></ul>
                        </div>
                    </li>
                    <li class="timeline-irp-item" style="position: relative; margin-bottom: 1.5rem; padding-left: 45px;">
                        <div class="timeline-irp-badge priority-high" style="position: absolute; left: 0; top: 0; width: 38px; height: 38px; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; background-color: var(--danger); font-size: 0.75rem;">3/6m</div>
                        <div class="timeline-irp-content" style="background-color: var(--white); padding: 1rem; border-radius: 8px; border: 1px solid var(--card-border);">
                            <h6>Azioni a Breve <span class="badge bg-danger float-end">Alta</span></h6>
                            <ul class="small"><li>Consolidamento debito a breve termine</li><li>Rafforzamento procedure di credit management</li><li>Implementazione piano di riduzione costi operativi</li><li>Rinegoziazione termini con fornitori strategici</li></ul>
                        </div>
                    </li>
                    <li class="timeline-irp-item" style="position: relative; margin-bottom: 1.5rem; padding-left: 45px;">
                        <div class="timeline-irp-badge priority-medium" style="position: absolute; left: 0; top: 0; width: 38px; height: 38px; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; background-color: var(--warning); font-size: 0.75rem;">6/12m</div>
                        <div class="timeline-irp-content" style="background-color: var(--white); padding: 1rem; border-radius: 8px; border: 1px solid var(--card-border);">
                            <h6>Azioni a Medio Termine <span class="badge bg-warning text-dark float-end">Media</span></h6>
                            <ul class="small"><li>Valutazione aumento di capitale o ingresso partner</li><li>Sviluppo servizi a valore aggiunto complementari</li><li>Rifocalizzazione su segmenti a maggiore marginalità</li><li>Implementazione sistema di controllo di gestione evoluto</li></ul>
                        </div>
                    </li>
                    <li class="timeline-irp-item" style="position: relative; margin-bottom: 1.5rem; padding-left: 45px;">
                        <div class="timeline-irp-badge priority-low" style="position: absolute; left: 0; top: 0; width: 38px; height: 38px; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; background-color: var(--success); font-size: 0.75rem;">12/24m</div>
                        <div class="timeline-irp-content" style="background-color: var(--white); padding: 1rem; border-radius: 8px; border: 1px solid var(--card-border);">
                            <h6>Azioni a Lungo Termine <span class="badge bg-success float-end">Strategiche</span></h6>
                            <ul class="small"><li>Valutazione opportunità di integrazione verticale</li><li>Diversificazione business e mercati</li><li>Sviluppo piano di reinvestimento degli utili futuri</li><li>Evoluzione modello di business</li></ul>
                        </div>
                    </li>
                </ul>
            </div>
        `;
        const container = document.querySelector('.content-wrapper');
        if (container) {
            const actionSection = document.getElementById('pianoAzioneTable');
            if (actionSection && actionSection.closest('.content-section')) {
                actionSection.closest('.content-section').insertAdjacentHTML('afterend', timelineHTML);
            }
        }
    },
    renderKPITargetTable() {
        const container = document.getElementById('dashboardKPITable');
        if (!container) return;
        const data = this.data.tables?.parte6_rischi?.dashboardKPI;
        if (!data) return;
        const thead = '<thead class="table-light"><tr>' + data.headers.map(h => '<th>' + h + '</th>').join('') + '</tr></thead>';
        const tbody = '<tbody>' + data.rows.map(row => {
            const valClass = row.valore.includes('-') || row.valore.includes('Negativ') ? 'value-crit' :
                           parseFloat(row.valore) < parseFloat(row.target.replace(/[<>]/g, '')) ? 'value-warn' : 'value-ok';
            const alertIcon = row.alert.includes('<') ? 'fa-arrow-down' : 'fa-arrow-up';
            return '<tr><td rowspan="' + (row.rowspan || 1) + '">' + row.categoria + '</td><td>' + row.kpi +
                   '</td><td>' + row.frequenza + '</td><td class="target-value">' + row.target +
                   '</td><td class="' + valClass + '">' + row.valore + '</td><td><i class="fas ' + alertIcon +
                   ' text-danger"></i> ' + row.alert + '</td></tr>';
        }).join('') + '</tbody>';
        container.innerHTML = thead + tbody;
    },
    renderAlertingSystemTable() {
        const tableHTML = `
            <div class="content-section">
                <h6>Tabella 7.5.1: Sistema di monitoraggio e alerting</h6>
                <div class="table-responsive">
                    <table class="table table-sm table-hover">
                        <thead class="table-light"><tr><th>Area</th><th>Frequenza monitoraggio</th><th>Soglie di alerting</th><th>Procedura escalation</th></tr></thead>
                        <tbody>
                            <tr><td>Liquidità</td><td>Settimanale</td><td>- Riduzione >5% vs settimana precedente<br>- Liquidità/Ricavi <10%<br>- Cash flow operativo settimanale negativo</td>
                                <td>1. Alert team finanziario<br>2. Revisione forecast di cassa<br>3. Escalation direzione amministrativa</td></tr>
                            <tr><td>Capitale circolante</td><td>Bisettimanale</td><td>- DSO >90 giorni<br>- DIO >200 giorni<br>- Ciclo monetario >180 giorni</td>
                                <td>1. Alert team amministrativo<br>2. Analisi scostamenti<br>3. Escalation controller</td></tr>
                            <tr><td>Redditività</td><td>Mensile</td><td>- EBITDA margin <0%<br>- Margine contribuzione <7%<br>- ROI <0%</td>
                                <td>1. Alert team controllo gestione<br>2. Analisi costi/ricavi<br>3. Escalation direzione generale</td></tr>
                            <tr><td>Solidità</td><td>Mensile</td><td>- PFN/PN >2,0x<br>- Patrimonio Netto/Totale Attivo <15%<br>- DSCR <0,8</td>
                                <td>1. Alert direzione finanziaria<br>2. Review proiezioni finanziarie<br>3. Escalation CdA</td></tr>
                            <tr><td>Crescita</td><td>Mensile</td><td>- Variazione ricavi <-5%<br>- Variazione ordini <-10%<br>- Pipeline <90% budget</td>
                                <td>1. Alert direzione commerciale<br>2. Revisione azioni commerciali<br>3. Escalation comitato esecutivo</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        const container = document.querySelector('.content-wrapper');
        if (container) {
            const lastSection = container.querySelector('.content-section:last-of-type');
            if (lastSection) {
                lastSection.insertAdjacentHTML('beforebegin', tableHTML);
            }
        }
    },
    renderSummaryCard() {
        const summaryHTML = `
            <div class="card summary-card mb-4 report-section" style="margin-top: 2rem;">
                <div class="card-header bg-success text-white"><h5 class="mb-0"><i class="fas fa-check-circle me-2"></i>Tabella Riepilogativa Interventi Prioritari</h5></div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-sm table-striped table-hover action-table">
                            <thead class="table-light"><tr><th>Area</th><th>Situazione Attuale</th><th>Azione Raccomandata</th><th>Effetti Previsti</th><th>Priorità</th></tr></thead>
                            <tbody>
                                <tr><td><span class="icon-circle bg-icon-danger"><i class="fas fa-sync-alt"></i></span> Ristrutturazione del debito</td>
                                    <td>PFN: €919.610, DSCR: 0,67</td><td>Rinegoziazione scadenze e consolidamento debito a breve</td>
                                    <td class="text-success">Miglioramento sostenibilità debito<br>DSCR target >1,0</td><td><span class="status-badge bg-danger">Alta</span></td></tr>
                                <tr><td><span class="icon-circle bg-icon-danger"><i class="fas fa-money-bill-wave"></i></span> Ottimizzazione magazzino</td>
                                    <td>DIO: 194 giorni</td><td>Revisione politiche di gestione scorte e liquidazione prodotti obsoleti</td>
                                    <td class="text-success">Riduzione magazzino 30%<br>+€250.000-300.000 liquidità</td><td><span class="status-badge bg-danger">Alta</span></td></tr>
                                <tr><td><span class="icon-circle bg-icon-danger"><i class="fas fa-chart-line"></i></span> Miglioramento marginalità</td>
                                    <td>EBITDA: -1,53%</td><td>Revisione pricing e mix prodotti</td>
                                    <td class="text-success">Incremento al 3-4%<br>+€130.000-170.000</td><td><span class="status-badge bg-danger">Alta</span></td></tr>
                                <tr><td><span class="icon-circle bg-icon-danger"><i class="fas fa-balance-scale"></i></span> Riduzione costi operativi</td>
                                    <td>Costi operativi elevati</td><td>Analisi ABC costi e piano di riduzione</td>
                                    <td class="text-success">Riduzione costi 8-10%<br>+€80.000-100.000</td><td><span class="status-badge bg-danger">Alta</span></td></tr>
                                <tr><td><span class="icon-circle bg-icon-warning"><i class="fas fa-piggy-bank"></i></span> Rafforzamento patrimoniale</td>
                                    <td>PN/Totale Attivo: 17%</td><td>Valutazione aumento capitale o ingresso partner</td>
                                    <td class="text-success">Miglioramento equilibrio patrimoniale<br>Riduzione PFN/PN a <1,0</td><td><span class="status-badge bg-warning text-dark">Media</span></td></tr>
                            </tbody>
                        </table>
                    </div>
                    <p class="mt-3 small">VAROLI GUIDO E FIGLIO S.R.L. presenta un profilo di rischio complessivamente elevato (IRP: 51,42/100), caratterizzato da significative criticità nell'equilibrio economico, tensioni sulla liquidità e una struttura finanziaria sbilanciata. L'implementazione delle raccomandazioni proposte è urgente e necessaria per interrompere la spirale negativa in atto e ripristinare condizioni di equilibrio sostenibili.</p>
                </div>
            </div>
        `;
        const container = document.querySelector('.content-wrapper');
        if (container) {
            container.insertAdjacentHTML('beforeend', summaryHTML);
        }
    },
    renderRiskMatrix() {
        const container = document.getElementById('riskMatrixIntro');
        if (!container) return;
        const title = this.data.content?.parte6_rischi_raccomandazioni?.riskMatrixTitle || 'Matrice Rischi';
        const intro = this.data.content?.parte6_rischi_raccomandazioni?.riskMatrixIntro || '';
        const finRisk = this.data.content?.parte6_rischi_raccomandazioni?.financialRisk || {};
        const opRisk = this.data.content?.parte6_rischi_raccomandazioni?.operationalRisk || {};
        const liqRisk = this.data.content?.parte6_rischi_raccomandazioni?.liquidityRisk || {};
        const mktRisk = this.data.content?.parte6_rischi_raccomandazioni?.marketRisk || {};
        container.innerHTML = `<h3>${title}</h3><p>${intro}</p>
            <div class="row">
                <div class="col-md-6"><div class="alert alert-danger"><strong>Rischio Finanziario (${finRisk.impact || ''} / ${finRisk.probability || ''}):</strong> ${finRisk.description || ''}</div></div>
                <div class="col-md-6"><div class="alert alert-danger"><strong>Rischio Operativo (${opRisk.impact || ''} / ${opRisk.probability || ''}):</strong> ${opRisk.description || ''}</div></div>
                <div class="col-md-6"><div class="alert alert-warning"><strong>Rischio Liquidità (${liqRisk.impact || ''} / ${liqRisk.probability || ''}):</strong> ${liqRisk.description || ''}</div></div>
                <div class="col-md-6"><div class="alert alert-warning"><strong>Rischio Mercato (${mktRisk.impact || ''} / ${mktRisk.probability || ''}):</strong> ${mktRisk.description || ''}</div></div>
            </div>`;
    },
    renderRedFlags() {
        const container = document.getElementById('redFlagsSection');
        if (!container) return;
        const title = this.data.content?.parte6_rischi_raccomandazioni?.redFlagsTitle || 'Segnali di Allarme';
        const intro = this.data.content?.parte6_rischi_raccomandazioni?.redFlagsIntro || '';
        container.innerHTML = `<div class="content-section"><h3>${title}</h3><p>${intro}</p></div>`;
    },
    renderActionPlan() {
        const container = document.getElementById('actionPlanSection');
        if (!container) return;
        const title = this.data.content?.parte6_rischi_raccomandazioni?.actionPlanTitle || 'Piano Azione';
        const intro = this.data.content?.parte6_rischi_raccomandazioni?.actionPlanIntro || '';
        const actionPlan = this.data.content?.parte6_rischi_raccomandazioni?.actionPlan || {};
        container.innerHTML = `<div class="content-section"><h3>${title}</h3><p>${intro}</p>
            <div class="alert alert-danger"><strong>Urgente (0-3 mesi):</strong> ${actionPlan.urgentActions || ''}</div>
            <div class="alert alert-warning"><strong>Breve Termine (3-6 mesi):</strong> ${actionPlan.shortTerm || ''}</div>
            <div class="alert alert-info"><strong>Medio Termine (6-12 mesi):</strong> ${actionPlan.mediumTerm || ''}</div>
        </div>`;
        const continuityNote = this.data.content?.parte6_rischi_raccomandazioni?.continuityNote || '';
        const contContainer = document.getElementById('continuityNote');
        if (contContainer) contContainer.innerHTML = `<div class="alert alert-danger mt-3">${continuityNote}</div>`;
    },
    renderGovernanceNote() {
        const container = document.getElementById('governanceNote');
        if (!container) return;
        const note = this.data.content?.parte6_rischi_raccomandazioni?.governanceNote || '';
        container.innerHTML = `<div class="alert alert-light"><strong>Governance e Adeguati Assetti:</strong> ${note}</div>`;
    },
    renderScenarioAnalysis() {
        const container = document.getElementById('scenarioAnalysis');
        if (!container) return;
        const analysis = this.data.content?.parte6_rischi_raccomandazioni?.scenarioAnalysis || '';
        container.innerHTML = `<div class="alert alert-warning mt-3"><strong>Analisi di Scenario:</strong> ${analysis}</div>`;
    }
};
document.addEventListener('DOMContentLoaded', () => { Parte6Rischi.init(); });
