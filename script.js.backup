// === MASTER COOKERY - STANDALONE SCRIPT (NO IMPORTS) ===
// All functionality is self-contained in this file

console.log("✅ Script loading...");

// === LOCALSTORAGE FUNCTIONS (INLINED) ===
const STORAGE_KEY = 'master_cookery_data';

function initStorage() {
    if (!localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ quotes: [], invoices: [] }));
    }
}

function getData() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { quotes: [], invoices: [] };
    } catch (e) {
        return { quotes: [], invoices: [] };
    }
}

function saveDocument(docData) {
    const data = getData();
    const collection = docData.type === 'quote' ? 'quotes' : 'invoices';
    const prefix = docData.type === 'quote' ? 'MC-QT' : 'MC-INV';
    const randomId = Math.floor(1000 + Math.random() * 9000);

    const newDoc = {
        ...docData,
        id: `${prefix}-${randomId}`,
        createdAt: new Date().toISOString(),
        status: docData.type === 'quote' ? 'Pending' : 'Unpaid'
    };

    data[collection].unshift(newDoc);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return newDoc;
}

function getDocuments(type) {
    const data = getData();
    return data[type === 'quote' ? 'quotes' : 'invoices'] || [];
}

function updateInvoiceStatus(id, newStatus) {
    const data = getData();
    const invoiceIndex = data.invoices.findIndex(inv => inv.id === id);
    if (invoiceIndex !== -1) {
        data.invoices[invoiceIndex].status = newStatus;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return true;
    }
    return false;
}

function getAnalytics() {
    const data = getData();
    const quotes = data.quotes;
    const invoices = data.invoices;

    const paidInvoices = invoices.filter(inv => inv.status === 'Paid');
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyRevenue = invoices
        .filter(inv => {
            const d = new Date(inv.createdAt);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        })
        .reduce((sum, inv) => sum + (parseFloat(inv.total) || 0), 0);

    return {
        totalQuotes: quotes.length,
        totalInvoices: invoices.length,
        paidCount: paidInvoices.length,
        totalRevenue: invoices.reduce((sum, inv) => sum + (parseFloat(inv.total) || 0), 0),
        outstandingBalance: invoices.filter(inv => inv.status !== 'Paid').reduce((sum, inv) => sum + (parseFloat(inv.total) || 0), 0),
        monthlyRevenue: monthlyRevenue
    };
}

// === UTILITY FUNCTIONS (INLINED) ===
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(amount);
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' });
}

// === DASHBOARD FUNCTIONS (INLINED) ===
function updateDashboard() {
    console.log("📊 Updating dashboard...");
    const analytics = getAnalytics();
    const quotes = getDocuments('quote');
    const invoices = getDocuments('invoice');

    // Update stats
    const dashTotalQuotes = document.getElementById('dash-total-quotes');
    const dashTotalInvoices = document.getElementById('dash-total-invoices');
    const dashPaidInvoices = document.getElementById('dash-paid-invoices');
    const dashRevenue = document.getElementById('dash-revenue');
    const dashTotalRevenue = document.getElementById('dash-total-revenue');
    const dashBalance = document.getElementById('dash-balance');

    if (dashTotalQuotes) dashTotalQuotes.textContent = analytics.totalQuotes;
    if (dashTotalInvoices) dashTotalInvoices.textContent = analytics.totalInvoices;
    if (dashPaidInvoices) dashPaidInvoices.textContent = analytics.paidCount;
    if (dashRevenue) dashRevenue.textContent = formatCurrency(analytics.monthlyRevenue);
    if (dashTotalRevenue) dashTotalRevenue.textContent = formatCurrency(analytics.totalRevenue);
    if (dashBalance) dashBalance.textContent = formatCurrency(analytics.outstandingBalance);

    // Update analytics tab
    const kpiTotalQuotes = document.getElementById('kpi-total-quotes');
    const kpiTotalInvoices = document.getElementById('kpi-total-invoices');
    const kpiPaidInvoices = document.getElementById('kpi-paid-invoices');
    const kpiOutstanding = document.getElementById('kpi-outstanding');

    if (kpiTotalQuotes) kpiTotalQuotes.textContent = analytics.totalQuotes;
    if (kpiTotalInvoices) kpiTotalInvoices.textContent = analytics.totalInvoices;
    if (kpiPaidInvoices) kpiPaidInvoices.textContent = analytics.paidCount;
    if (kpiOutstanding) kpiOutstanding.textContent = formatCurrency(analytics.outstandingBalance);

    // Render tables
    renderQuotesTable(quotes);
    renderInvoicesTable(invoices);
}

function renderQuotesTable(quotes) {
    const tbody = document.getElementById('dash-quotes-table');
    if (!tbody) return;

    tbody.innerHTML = '';
    const recent = quotes.slice(0, 5);

    if (recent.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align:center">No quotes yet</td></tr>';
        return;
    }

    recent.forEach(quote => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${quote.clientName}</td>
            <td>${formatDate(quote.createdAt)}</td>
            <td>${formatCurrency(quote.total)}</td>
        `;
        tbody.appendChild(row);
    });
}

function renderInvoicesTable(invoices) {
    const tbody = document.getElementById('dash-invoices-table');
    if (!tbody) return;

    tbody.innerHTML = '';
    const recent = invoices.slice(0, 5);

    if (recent.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align:center">No invoices yet</td></tr>';
        return;
    }

    recent.forEach(invoice => {
        const row = document.createElement('tr');
        let statusClass = 'badge-warning';
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
        tbody.appendChild(row);
    });

    // Attach status change listeners
    document.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', function (e) {
            const id = e.target.dataset.id;
            const newStatus = e.target.value;
            updateInvoiceStatus(id, newStatus);
            updateDashboard();
        });
    });
}

// === MAIN APP INITIALIZATION ===
document.addEventListener('DOMContentLoaded', function () {
    console.log("✅ DOM Ready!");

    initStorage();

    // === NAVIGATION ===
    const navPills = document.querySelectorAll('.nav-pill');
    const viewSections = document.querySelectorAll('.view-section');

    console.log(`Found ${navPills.length} nav buttons, ${viewSections.length} sections`);

    function switchTab(tabId) {
        console.log(`🔄 Switching to: ${tabId}`);
        navPills.forEach(p => p.classList.toggle('active', p.dataset.tab === tabId));
        viewSections.forEach(s => s.classList.toggle('active', s.id === tabId));
    }

    navPills.forEach(pill => {
        pill.addEventListener('click', () => switchTab(pill.dataset.tab));
        pill.style.cursor = 'pointer';
    });

    // === ACTION BUTTONS ===
    const btnGoQuote = document.getElementById('btn-go-quote');
    const btnGoInvoice = document.getElementById('btn-go-invoice');

    if (btnGoQuote) {
        console.log("✅ Quote button found");
        btnGoQuote.addEventListener('click', () => {
            console.log("🖱️ Quote button clicked!");
            switchTab('tab-gen-quote');
        });
        btnGoQuote.style.cursor = 'pointer';
    }

    if (btnGoInvoice) {
        console.log("✅ Invoice button found");
        btnGoInvoice.addEventListener('click', () => {
            console.log("🖱️ Invoice button clicked!");
            switchTab('tab-gen-invoice');
        });
        btnGoInvoice.style.cursor = 'pointer';
    }

    // === FORM SETUP ===
    setupForm('q_', 'quote');
    setupForm('i_', 'invoice');

    // === LOAD DASHBOARD ===
    updateDashboard();

    console.log("✅ App initialized!");
});

function setupForm(prefix, docType) {
    const form = document.getElementById(prefix + 'docForm');
    if (!form) return;

    const inputs = form.querySelectorAll('input, select, textarea');
    const generateBtn = document.getElementById(prefix + 'generateBtn');

    inputs.forEach(input => input.addEventListener('input', () => calculateTotals(prefix)));

    const transportMode = document.getElementById(prefix + 'transportMode');
    if (transportMode) {
        transportMode.addEventListener('change', () => {
            updateTransportHelp(prefix);
            calculateTotals(prefix);
        });
    }

    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            await generatePDF(prefix, docType);
        });
        generateBtn.style.cursor = 'pointer';
    }

    calculateTotals(prefix);
}

function calculateTotals(prefix) {
    const guests = parseFloat(document.getElementById(prefix + 'guestCount')?.value) || 0;
    const price = parseFloat(document.getElementById(prefix + 'unitPrice')?.value) || 0;
    const distance = parseFloat(document.getElementById(prefix + 'distance')?.value) || 0;
    const transportInput = parseFloat(document.getElementById(prefix + 'transportCost')?.value) || 0;
    const deposit = parseFloat(document.getElementById(prefix + 'deposit')?.value) || 0;
    const mode = document.getElementById(prefix + 'transportMode')?.value || 'manual';

    const foodTotal = guests * price;
    const transportTotal = mode === 'manual' ? distance * transportInput : transportInput;
    const grandTotal = foodTotal + transportTotal;
    const balance = grandTotal - deposit;

    updateDisplay(prefix + 'displayFoodTotal', foodTotal);
    updateDisplay(prefix + 'displayTransportTotal', transportTotal);
    updateDisplay(prefix + 'displayGrandTotal', grandTotal);
    updateDisplay(prefix + 'displayBalance', balance);
}

function updateDisplay(id, amount) {
    const el = document.getElementById(id);
    if (el) el.textContent = formatCurrency(amount);
}

function updateTransportHelp(prefix) {
    const mode = document.getElementById(prefix + 'transportMode')?.value;
    const help = document.getElementById(prefix + 'transportHelp');
    const cost = document.getElementById(prefix + 'transportCost');

    if (mode === 'manual') {
        if (help) help.textContent = 'Enter rate per km (e.g. 5.50)';
        if (cost) cost.placeholder = 'Rate per km';
    } else {
        if (help) help.textContent = 'Enter total fixed transport cost';
        if (cost) cost.placeholder = 'Fixed Cost';
    }
}

// Render tables
renderQuotesTable(quotes);
renderInvoicesTable(invoices);
}

function renderQuotesTable(quotes) {
    const tbody = document.getElementById('dash-quotes-table');
    if (!tbody) return;

    tbody.innerHTML = '';
    const recent = quotes.slice(0, 5);

    if (recent.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align:center">No quotes yet</td></tr>';
        return;
    }

    recent.forEach(quote => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${quote.clientName}</td>
            <td>${formatDate(quote.createdAt)}</td>
            <td>${formatCurrency(quote.total)}</td>
        `;
        tbody.appendChild(row);
    });
}

function renderInvoicesTable(invoices) {
    const tbody = document.getElementById('dash-invoices-table');
    if (!tbody) return;

    tbody.innerHTML = '';
    const recent = invoices.slice(0, 5);

    if (recent.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align:center">No invoices yet</td></tr>';
        return;
    }

    recent.forEach(invoice => {
        const row = document.createElement('tr');
        let statusClass = 'badge-warning';
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
        tbody.appendChild(row);
    });

    // Attach status change listeners
    document.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', function (e) {
            const id = e.target.dataset.id;
            const newStatus = e.target.value;
            updateInvoiceStatus(id, newStatus);
            updateDashboard();
        });
    });
}

// === MAIN APP INITIALIZATION ===
document.addEventListener('DOMContentLoaded', function () {
    console.log("✅ DOM Ready!");

    initStorage();

    // === NAVIGATION ===
    const navPills = document.querySelectorAll('.nav-pill');
    const viewSections = document.querySelectorAll('.view-section');

    console.log(`Found ${navPills.length} nav buttons, ${viewSections.length} sections`);

    function switchTab(tabId) {
        console.log(`🔄 Switching to: ${tabId}`);
        navPills.forEach(p => p.classList.toggle('active', p.dataset.tab === tabId));
        viewSections.forEach(s => s.classList.toggle('active', s.id === tabId));
    }

    navPills.forEach(pill => {
        pill.addEventListener('click', () => switchTab(pill.dataset.tab));
        pill.style.cursor = 'pointer';
    });

    // === ACTION BUTTONS ===
    const btnGoQuote = document.getElementById('btn-go-quote');
    const btnGoInvoice = document.getElementById('btn-go-invoice');

    if (btnGoQuote) {
        console.log("✅ Quote button found");
        btnGoQuote.addEventListener('click', () => {
            console.log("🖱️ Quote button clicked!");
            switchTab('tab-gen-quote');
        });
        btnGoQuote.style.cursor = 'pointer';
    }

    if (btnGoInvoice) {
        console.log("✅ Invoice button found");
        btnGoInvoice.addEventListener('click', () => {
            console.log("🖱️ Invoice button clicked!");
            switchTab('tab-gen-invoice');
        });
        btnGoInvoice.style.cursor = 'pointer';
    }

    // === FORM SETUP ===
    setupForm('q_', 'quote');
    setupForm('i_', 'invoice');

    // === LOAD DASHBOARD ===
    updateDashboard();

    console.log("✅ App initialized!");
});

function setupForm(prefix, docType) {
    const form = document.getElementById(prefix + 'docForm');
    if (!form) return;

    const inputs = form.querySelectorAll('input, select, textarea');
    const generateBtn = document.getElementById(prefix + 'generateBtn');

    inputs.forEach(input => input.addEventListener('input', () => calculateTotals(prefix)));

    const transportMode = document.getElementById(prefix + 'transportMode');
    if (transportMode) {
        transportMode.addEventListener('change', () => {
            updateTransportHelp(prefix);
            calculateTotals(prefix);
        });
    }

    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            await generatePDF(prefix, docType);
        });
        generateBtn.style.cursor = 'pointer';
    }

    calculateTotals(prefix);
}

function calculateTotals(prefix) {
    const guests = parseFloat(document.getElementById(prefix + 'guestCount')?.value) || 0;
    const price = parseFloat(document.getElementById(prefix + 'unitPrice')?.value) || 0;
    const distance = parseFloat(document.getElementById(prefix + 'distance')?.value) || 0;
    const transportInput = parseFloat(document.getElementById(prefix + 'transportCost')?.value) || 0;
    const deposit = parseFloat(document.getElementById(prefix + 'deposit')?.value) || 0;
    const mode = document.getElementById(prefix + 'transportMode')?.value || 'manual';

    const foodTotal = guests * price;
    const transportTotal = mode === 'manual' ? distance * transportInput : transportInput;
    const grandTotal = foodTotal + transportTotal;
    const balance = grandTotal - deposit;

    updateDisplay(prefix + 'displayFoodTotal', foodTotal);
    updateDisplay(prefix + 'displayTransportTotal', transportTotal);
    updateDisplay(prefix + 'displayGrandTotal', grandTotal);
    updateDisplay(prefix + 'displayBalance', balance);
}

function updateDisplay(id, amount) {
    const el = document.getElementById(id);
    if (el) el.textContent = formatCurrency(amount);
}

function updateTransportHelp(prefix) {
    const mode = document.getElementById(prefix + 'transportMode')?.value;
    const help = document.getElementById(prefix + 'transportHelp');
    const cost = document.getElementById(prefix + 'transportCost');

    if (mode === 'manual') {
        if (help) help.textContent = 'Enter rate per km (e.g. 5.50)';
        if (cost) cost.placeholder = 'Rate per km';
    } else {
        if (help) help.textContent = 'Enter total fixed transport cost';
        if (cost) cost.placeholder = 'Fixed Cost';
    }
}

async function generatePDF(prefix, docType) {
    const btn = document.getElementById(prefix + 'generateBtn');
    const originalText = btn.innerHTML;
    btn.textContent = 'Generating...';
    btn.disabled = true;

    try {
        const { PDFDocument, rgb, StandardFonts } = await import('https://esm.sh/pdf-lib@1.17.1');

        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([595.28, 841.89]); // A4
        const { width, height } = page.getSize();

        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        // Colors matching template
        const orange = rgb(0.93, 0.49, 0.15); // #ED7D26
        const white = rgb(1, 1, 1);
        const black = rgb(0, 0, 0);
        const lightGray = rgb(0.95, 0.95, 0.95);
        const darkGray = rgb(0.3, 0.3, 0.3);

        // === ORANGE HEADER WITH LOGO ===
        const headerHeight = 90;
        page.drawRectangle({
            x: 0,
            y: height - headerHeight,
            width,
            height: headerHeight,
            color: orange
        });

        // Embed logo
        try {
            const logoResponse = await fetch('logo.png');
            const logoBytes = await logoResponse.arrayBuffer();
            const logoImage = await pdfDoc.embedPng(logoBytes);
            const logoDims = logoImage.scale(0.15); // Adjust scale as needed

            page.drawImage(logoImage, {
                x: 40,
                y: height - headerHeight + 15,
                width: logoDims.width,
                height: logoDims.height,
            });
        } catch (error) {
            console.warn('Logo not found, using text fallback');
            page.drawText('M', { x: 50, y: height - 50, size: 40, font: fontBold, color: white });
        }

        // Company name in header
        page.drawText('The Master Cookery', {
            x: 150,
            y: height - 45,
            size: 20,
            font: fontBold,
            color: white
        });
        page.drawText('Mastering Taste, Every Time.', {
            x: 150,
            y: height - 65,
            size: 9,
            font: font,
            color: white
        });

        // Document type (INVOICE/QUOTE) in header
        const docTitle = docType === 'quote' ? 'QUOTE' : 'INVOICE';
        const titleWidth = fontBold.widthOfTextAtSize(docTitle, 32);
        page.drawText(docTitle, {
            x: width - titleWidth - 40,
            y: height - 55,
            size: 32,
            font: fontBold,
            color: white
        });

        // === DOCUMENT INFO (Invoice Number, Date, etc.) ===
        let y = height - headerHeight - 30;
        const leftCol = 50;
        const rightCol = width - 200;

        // Generate invoice number
        const invoiceNum = `MC-${docType === 'quote' ? 'QT' : 'INV'}-${Math.floor(1000 + Math.random() * 9000)}`;
        const today = new Date().toISOString().split('T')[0];

        page.drawText(`${docType === 'quote' ? 'Quote' : 'Invoice'} Number:`, {
            x: leftCol, y, size: 9, font: fontBold
        });
        page.drawText(invoiceNum, {
            x: leftCol + 100, y, size: 9, font: font
        });

        // Company address (right side)
        page.drawText('Kwachief, Howick, South Africa', {
            x: rightCol, y, size: 9, font: font
        });
        y -= 12;

        page.drawText(`${docType === 'quote' ? 'Quote' : 'Invoice'} Date:`, {
            x: leftCol, y, size: 9, font: fontBold
        });
        page.drawText(today, {
            x: leftCol + 100, y, size: 9, font: font
        });

        page.drawText('themastercookery@gmail.com', {
            x: rightCol, y, size: 9, font: font
        });
        y -= 12;

        page.drawText('Due Date:', {
            x: leftCol, y, size: 9, font: fontBold
        });
        page.drawText('Payment required immediately', {
            x: leftCol + 100, y, size: 9, font: font
        });

        page.drawText('+27 78 227 2612', {
            x: rightCol, y, size: 9, font: font
        });

        y -= 30;

        // === BILL TO & EVENT DETAILS ===
        const clientName = document.getElementById(prefix + 'clientName').value;
        const company = document.getElementById(prefix + 'company').value;
        const address = document.getElementById(prefix + 'address').value;
        const email = document.getElementById(prefix + 'email').value;
        const phone = document.getElementById(prefix + 'phone').value;

        // Bill To (left)
        page.drawText('BILL TO:', { x: leftCol, y, size: 11, font: fontBold, color: orange });
        y -= 18;
        page.drawText(clientName, { x: leftCol, y, size: 10, font: fontBold });
        if (company) {
            y -= 12;
            page.drawText(company, { x: leftCol, y, size: 9, font: font });
        }
        y -= 12;

        // Split address into lines if too long
        const addressLines = address.split('\n');
        addressLines.forEach(line => {
            page.drawText(line, { x: leftCol, y, size: 9, font: font });
            y -= 12;
        });

        page.drawText(email, { x: leftCol, y, size: 9, font: font });
        y -= 12;
        page.drawText(phone, { x: leftCol, y, size: 9, font: font });

        // Event Details (right)
        let yRight = height - headerHeight - 90;
        page.drawText('EVENT DETAILS', { x: rightCol, y: yRight, size: 11, font: fontBold, color: orange });
        yRight -= 18;

        page.drawText('Event Name:', { x: rightCol, y: yRight, size: 9, font: fontBold });
        page.drawText(document.getElementById(prefix + 'eventName').value, {
            x: rightCol + 70, y: yRight, size: 9, font: font
        });
        yRight -= 12;

        page.drawText('Event Date:', { x: rightCol, y: yRight, size: 9, font: fontBold });
        page.drawText(document.getElementById(prefix + 'eventDate').value, {
            x: rightCol + 70, y: yRight, size: 9, font: font
        });
        yRight -= 12;

        page.drawText('Location:', { x: rightCol, y: yRight, size: 9, font: fontBold });
        yRight -= 12;
        page.drawText(document.getElementById(prefix + 'location')?.value || 'N/A', {
            x: rightCol, y: yRight, size: 9, font: font
        });
        yRight -= 12;

        page.drawText('Type:', { x: rightCol, y: yRight, size: 9, font: fontBold });
        page.drawText(document.getElementById(prefix + 'eventType').value, {
            x: rightCol + 70, y: yRight, size: 9, font: font
        });
        yRight -= 12;

        page.drawText('Guests:', { x: rightCol, y: yRight, size: 9, font: fontBold });
        page.drawText(document.getElementById(prefix + 'guestCount').value, {
            x: rightCol + 70, y: yRight, size: 9, font: font
        });

        // === TABLE ===
        y = Math.min(y, yRight) - 30;

        // Table header
        const tableTop = y;
        page.drawRectangle({
            x: 40,
            y: tableTop - 20,
            width: width - 80,
            height: 20,
            color: lightGray
        });

        page.drawText('DESCRIPTION', { x: 50, y: tableTop - 13, size: 9, font: fontBold });
        page.drawText('QUANTITY', { x: 280, y: tableTop - 13, size: 9, font: fontBold });
        page.drawText('UNIT PRICE (ZAR)', { x: 360, y: tableTop - 13, size: 9, font: fontBold });
        page.drawText('TOTAL (ZAR)', { x: 480, y: tableTop - 13, size: 9, font: fontBold });

        y = tableTop - 35;

        // Line items
        const guests = parseFloat(document.getElementById(prefix + 'guestCount').value);
        const pricePerGuest = parseFloat(document.getElementById(prefix + 'unitPrice').value);
        const foodTotal = guests * pricePerGuest;

        page.drawText('3 Course Catering Services', { x: 50, y, size: 9, font: font });
        page.drawText(guests.toString(), { x: 300, y, size: 9, font: font });
        page.drawText(`R ${pricePerGuest.toFixed(2)}`, { x: 380, y, size: 9, font: font });
        page.drawText(`R ${foodTotal.toFixed(2)}`, { x: 485, y, size: 9, font: font });

        y -= 15;

        // Transport
        const mode = document.getElementById(prefix + 'transportMode').value;
        const transportInput = parseFloat(document.getElementById(prefix + 'transportCost').value) || 0;
        const distance = parseFloat(document.getElementById(prefix + 'distance').value) || 0;
        const transportTotal = mode === 'manual' ? distance * transportInput : transportInput;

        if (transportTotal > 0) {
            page.drawText('Transport', { x: 50, y, size: 9, font: font });
            page.drawText('1', { x: 300, y, size: 9, font: font });
            page.drawText(`R ${transportTotal.toFixed(2)}`, { x: 380, y, size: 9, font: font });
            page.drawText(`R ${transportTotal.toFixed(2)}`, { x: 485, y, size: 9, font: font });
            y -= 20;
        }

        // Totals section
        y -= 10;
        const grandTotal = foodTotal + transportTotal;
        const deposit = parseFloat(document.getElementById(prefix + 'deposit').value) || 0;
        const balance = grandTotal - deposit;

        // Subtotal
        page.drawText('Subtotal:', { x: 400, y, size: 10, font: fontBold });
        page.drawText(`R ${grandTotal.toFixed(2)}`, { x: 485, y, size: 10, font: font });
        y -= 15;

        // Deposit (green background)
        if (deposit > 0) {
            page.drawRectangle({
                x: 395,
                y: y - 5,
                width: 160,
                height: 15,
                color: rgb(0.85, 0.95, 0.85)
            });
            page.drawText('Deposit Received:', { x: 400, y, size: 9, font: font });
            page.drawText(`-R ${deposit.toFixed(2)}`, { x: 485, y, size: 9, font: font });
            y -= 20;
        }

        // Balance Due (red background)
        page.drawRectangle({
            x: 395,
            y: y - 5,
            width: 160,
            height: 18,
            color: rgb(0.95, 0.85, 0.85)
        });
        page.drawText('BALANCE DUE:', { x: 400, y, size: 11, font: fontBold, color: rgb(0.7, 0, 0) });
        page.drawText(`R ${balance.toFixed(2)}`, { x: 485, y, size: 11, font: fontBold, color: rgb(0.7, 0, 0) });

        // === BANKING DETAILS ===
        y -= 40;
        page.drawText('BANKING DETAILS', { x: 50, y, size: 11, font: fontBold, color: orange });
        y -= 15;
        page.drawText('EFT Payment:', { x: 50, y, size: 9, font: fontBold });
        y -= 12;
        page.drawText('The Master Cookery pty ltd', { x: 50, y, size: 9, font: font });
        y -= 12;
        page.drawText('First National Bank', { x: 50, y, size: 9, font: font });
        y -= 12;
        page.drawText('Account: 63051804649', { x: 50, y, size: 9, font: font });
        y -= 12;
        page.drawText('Branch Code: 210835', { x: 50, y, size: 9, font: font });
        y -= 12;
        page.drawText('Reference: Name & Date Of Event', { x: 50, y, size: 9, font: font });

        // === ORANGE FOOTER ===
        const footerHeight = 80;
        page.drawRectangle({
            x: 0,
            y: 0,
            width,
            height: footerHeight,
            color: orange
        });

        page.drawText('Thank you for choosing The Master Cookery', {
            x: width / 2 - 140,
            y: 50,
            size: 12,
            font: fontBold,
            color: white
        });
        page.drawText('We guarantee a premium, professional catering experience tailored to your event.', {
            x: width / 2 - 180,
            y: 35,
            size: 9,
            font: font,
            color: white
        });
        page.drawText('Chef Sizwe Syachamba Ndlela | WhatsApp: 0782272612 | www.themastercookery.co.za', {
            x: width / 2 - 200,
            y: 20,
            size: 8,
            font: font,
            color: white
        });

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `MasterCookery_${docType}_${invoiceNum}_${Date.now()}.pdf`;
        link.click();

        // Save to storage
        saveDocument({
            type: docType,
            clientName,
            company,
            eventName: document.getElementById(prefix + 'eventName').value,
            eventType: document.getElementById(prefix + 'eventType').value,
            date: document.getElementById(prefix + 'eventDate').value,
            guestCount: guests,
            total: grandTotal
        });

        updateDashboard();
        alert('PDF generated and saved!');

    } catch (error) {
        console.error('PDF Error:', error);
        alert('Failed to generate PDF: ' + error.message);
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

console.log("✅ Script ready!");
