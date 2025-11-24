import { getDocuments, getAnalytics, updateInvoiceStatus } from './storage.js';
import { formatCurrency, formatDate } from './utils.js';

// DOM Elements - Dashboard Tab
const dashTotalQuotes = document.getElementById('dash-total-quotes');
const dashTotalInvoices = document.getElementById('dash-total-invoices');
const dashPaidInvoices = document.getElementById('dash-paid-invoices');
const dashRevenue = document.getElementById('dash-revenue');
const dashTotalRevenue = document.getElementById('dash-total-revenue');
const dashBalance = document.getElementById('dash-balance');

// DOM Elements - Analytics Tab
const kpiTotalQuotes = document.getElementById('kpi-total-quotes');
const kpiTotalInvoices = document.getElementById('kpi-total-invoices');
const kpiPaidInvoices = document.getElementById('kpi-paid-invoices');
const kpiOutstanding = document.getElementById('kpi-outstanding');

// Tables
const quotesTableBody = document.getElementById('dash-quotes-table');
const invoicesTableBody = document.getElementById('dash-invoices-table');

export function initDashboard() {
    updateDashboard();
}

export function updateDashboard() {
    const analytics = getAnalytics();
    const quotes = getDocuments('quote');
    const invoices = getDocuments('invoice');

    // Update Stats Cards
    if (dashTotalQuotes) dashTotalQuotes.textContent = analytics.totalQuotes;
    if (dashTotalInvoices) dashTotalInvoices.textContent = analytics.totalInvoices;
    if (dashPaidInvoices) dashPaidInvoices.textContent = analytics.paidCount;
    if (dashRevenue) dashRevenue.textContent = formatCurrency(analytics.monthlyRevenue);
    if (dashTotalRevenue) dashTotalRevenue.textContent = formatCurrency(analytics.totalRevenue);
    if (dashBalance) dashBalance.textContent = formatCurrency(analytics.outstandingBalance);

    // Update Analytics Tab
    if (kpiTotalQuotes) kpiTotalQuotes.textContent = analytics.totalQuotes;
    if (kpiTotalInvoices) kpiTotalInvoices.textContent = analytics.totalInvoices;
    if (kpiPaidInvoices) kpiPaidInvoices.textContent = analytics.paidCount;
    if (kpiOutstanding) kpiOutstanding.textContent = formatCurrency(analytics.outstandingBalance);

    // Render Tables
    renderQuotesTable(quotes);
    renderInvoicesTable(invoices);
}

function renderQuotesTable(quotes) {
    if (!quotesTableBody) return;
    quotesTableBody.innerHTML = '';

    // Show top 5 recent
    const recentQuotes = quotes.slice(0, 5);

    if (recentQuotes.length === 0) {
        quotesTableBody.innerHTML = '<tr><td colspan="3" class="text-center">No quotes generated yet.</td></tr>';
        return;
    }

    recentQuotes.forEach(quote => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${quote.clientName}</td>
            <td>${formatDate(quote.createdAt)}</td>
            <td>${formatCurrency(quote.total)}</td>
        `;
        quotesTableBody.appendChild(row);
    });
}

function renderInvoicesTable(invoices) {
    if (!invoicesTableBody) return;
    invoicesTableBody.innerHTML = '';

    // Show top 5 recent
    const recentInvoices = invoices.slice(0, 5);

    if (recentInvoices.length === 0) {
        invoicesTableBody.innerHTML = '<tr><td colspan="3" class="text-center">No invoices generated yet.</td></tr>';
        return;
    }

    recentInvoices.forEach(invoice => {
        const row = document.createElement('tr');

        // Status Badge Logic
        let statusClass = 'badge-warning'; // Default Unpaid
        if (invoice.status === 'Paid') statusClass = 'badge-success';
        else if (invoice.status === 'Partially Paid') statusClass = 'badge-info';

        row.innerHTML = `
            <td>${invoice.clientName}</td>
            <td>
                <select class="status-select ${statusClass}" data-id="${invoice.id}">
                    <option value="Unpaid" ${invoice.status === 'Unpaid' ? 'selected' : ''}>Unpaid</option>
                    <option value="Partially Paid" ${invoice.status === 'Partially Paid' ? 'selected' : ''}>Partial</option>
                    <option value="Paid" ${invoice.status === 'Paid' ? 'selected' : ''}>Paid</option>
                </select>
            </td>
            <td>${formatCurrency(invoice.total)}</td>
        `;
        invoicesTableBody.appendChild(row);
    });

    // Attach Listeners to Status Selects
    document.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', (e) => {
            const id = e.target.dataset.id;
            const newStatus = e.target.value;
            updateInvoiceStatus(id, newStatus);
            updateDashboard(); // Refresh to update stats
        });
    });
}
