/**
 * SCAN360 Dashboard - Export PDF via Typst API
 * Handles PDF generation using the asynchronous Typst API
 */

const ExportAPI = {
    baseURL: 'https://typstpro.scan360.it',
    pollingInterval: 5000, // 5 seconds
    maxAttempts: 60, // 5 minutes max

    /**
     * Generate PDF from current dashboard data
     */
    async generatePDF() {
        console.log('📄 Starting PDF generation...');

        // Show loading state
        this.showExportLoading();

        try {
            // Prepare conversation data
            const conversation = this.prepareConversation();

            // Prepare company data
            const companyData = this.prepareCompanyData();

            // Get cliente_id from company data
            const clienteId = this.getClienteId();

            // Start generation
            const documentId = await this.startGeneration(conversation, companyData, clienteId);

            // Poll for status
            await this.pollStatus(documentId);

            // Download PDF
            await this.downloadPDF(documentId);

            Utils.showToast('PDF generato con successo!', 'success');

        } catch (error) {
            console.error('❌ PDF generation failed:', error);
            Utils.showToast(`Errore generazione PDF: ${error.message}`, 'error', 5000);
        } finally {
            this.hideExportLoading();
        }
    },

    /**
     * Prepare conversation data for API
     */
    prepareConversation() {
        const data = App.getData();
        const now = new Date().toISOString();

        return [
            {
                role: 'user',
                content: `Genera un report completo di analisi economico-finanziaria per ${data.company.name} - Anno fiscale ${data.company.fiscalYear}`,
                timestamp: now
            },
            {
                role: 'assistant',
                content: this.generateReportSummary(),
                timestamp: now
            }
        ];
    },

    /**
     * Generate report summary from current data
     */
    generateReportSummary() {
        const data = App.getData();
        const kpis = data.kpis;

        let summary = `# Report Analisi Economico-Finanziaria - ${data.company.name}\n\n`;
        summary += `**Anno Fiscale:** ${data.company.fiscalYear}\n`;
        summary += `**Data Report:** ${Utils.formatDate(data.company.reportDate)}\n\n`;

        summary += `## Sintesi Esecutiva\n\n`;
        summary += `**Indice di Rischio (IRP):** ${kpis.irp.displayValue} - ${kpis.irp.categoryLabel}\n`;
        summary += `${data.content.parte1_sintesi.irpDescription}\n\n`;

        summary += `## Indicatori Principali\n\n`;
        summary += `- **Ricavi:** ${kpis.revenue.displayValue} (${kpis.revenue.trend.displayValue})\n`;
        summary += `- **EBITDA:** ${kpis.ebitda.displayValue} (Margin: ${kpis.ebitdaMargin.displayValue})\n`;
        summary += `- **Patrimonio Netto:** ${kpis.equity.displayValue}\n`;
        summary += `- **PFN:** ${kpis.pfnEbitda.displayValue}\n`;
        summary += `- **Liquidità:** ${kpis.liquidity.displayValue}\n\n`;

        summary += `## Analisi SWOT\n\n`;
        const swot = data.tables.parte1_sintesi.swot;
        summary += `### Punti di Forza\n${swot.strengths.map(s => `- ${s}`).join('\n')}\n\n`;
        summary += `### Debolezze\n${swot.weaknesses.map(s => `- ${s}`).join('\n')}\n\n`;
        summary += `### Opportunità\n${swot.opportunities.map(s => `- ${s}`).join('\n')}\n\n`;
        summary += `### Minacce\n${swot.threats.map(s => `- ${s}`).join('\n')}\n\n`;

        summary += `## Azioni Prioritarie\n\n`;
        const actions = data.tables.parte1_sintesi.priorityActions.rows;
        actions.forEach(action => {
            summary += `### ${action.area}\n`;
            summary += `**Azione:** ${action.action}\n`;
            summary += `**Impatto Atteso:** ${action.impact}\n`;
            summary += `**Priorità:** ${action.priority}\n\n`;
        });

        return summary;
    },

    /**
     * Prepare company data for API
     */
    prepareCompanyData() {
        const data = App.getData();

        return {
            // Company info
            company: data.company,

            // KPIs
            kpis: data.kpis,

            // Content sections
            content: data.content,

            // Tables
            tables: data.tables,

            // Charts data
            charts: data.charts,

            // Configuration
            config: data.config
        };
    },

    /**
     * Get cliente ID from company data
     */
    getClienteId() {
        const company = App.getData().company;
        // Use first 8 chars of company name as ID
        return company.shortName.substring(0, 8).toUpperCase().replace(/\s/g, '');
    },

    /**
     * Start PDF generation (API call)
     */
    async startGeneration(conversation, companyData, clienteId) {
        const response = await fetch(`${this.baseURL}/api/v1/documents/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                conversation,
                company_data: companyData,
                cliente_id: clienteId,
                llm_model: 'gemini-flash'
            })
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.detail || `HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`📄 Document ID: ${data.document_id}`);
        console.log(`⏱️  Estimated time: ${data.estimated_time_seconds}s`);

        this.updateExportStatus(`Generazione in corso... (${data.estimated_time_seconds}s stimati)`);

        return data.document_id;
    },

    /**
     * Poll for generation status
     */
    async pollStatus(documentId) {
        let attempt = 0;

        while (attempt < this.maxAttempts) {
            // Wait before polling
            await new Promise(resolve => setTimeout(resolve, this.pollingInterval));
            attempt++;

            const response = await fetch(`${this.baseURL}/api/v1/documents/${documentId}/status`);

            if (!response.ok) {
                throw new Error(`Status check failed: HTTP ${response.status}`);
            }

            const statusData = await response.json();
            const { status, progress_percent, current_step } = statusData;

            console.log(`⏳ [${progress_percent}%] ${current_step || 'Processing...'}`);
            this.updateExportStatus(`${current_step || 'Elaborazione in corso...'} (${progress_percent}%)`);

            if (status === 'completed') {
                console.log('✅ Generation completed!');
                return;
            }

            if (status === 'failed') {
                const error = statusData.error || 'Unknown error';
                throw new Error(`Generation failed: ${error}`);
            }
        }

        throw new Error('Generation timeout: exceeded 5 minutes');
    },

    /**
     * Download generated PDF
     */
    async downloadPDF(documentId) {
        console.log('📥 Downloading PDF...');
        this.updateExportStatus('Download in corso...');

        const response = await fetch(`${this.baseURL}/api/v1/documents/${documentId}/download`);

        if (!response.ok) {
            throw new Error(`Download failed: HTTP ${response.status}`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        // Create download link
        const a = document.createElement('a');
        a.href = url;
        a.download = `SCAN360_Report_${App.getData().company.shortName}_${App.getData().company.fiscalYear}.pdf`;
        document.body.appendChild(a);
        a.click();

        // Cleanup
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        console.log('✅ PDF downloaded successfully');
    },

    /**
     * Show export loading state
     */
    showExportLoading() {
        const btn = document.getElementById('exportPdfBtn');
        if (btn) {
            btn.classList.add('loading');
            btn.disabled = true;
            btn.innerHTML = `
                <span class="loading"></span>
                Generazione in corso...
            `;
        }
    },

    /**
     * Hide export loading state
     */
    hideExportLoading() {
        const btn = document.getElementById('exportPdfBtn');
        if (btn) {
            btn.classList.remove('loading');
            btn.disabled = false;
            btn.innerHTML = `
                <svg data-lucide="download" width="16" height="16"></svg>
                Esporta PDF
            `;

            // Re-initialize Lucide icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    },

    /**
     * Update export status message
     */
    updateExportStatus(message) {
        const btn = document.getElementById('exportPdfBtn');
        if (btn && btn.classList.contains('loading')) {
            // Find text node
            const textNode = Array.from(btn.childNodes).find(node => node.nodeType === 3);
            if (textNode) {
                textNode.textContent = message;
            }
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ExportAPI;
}
