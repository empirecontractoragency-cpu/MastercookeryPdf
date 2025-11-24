// LocalStorage Management for Master Cookery

const STORAGE_KEY = 'master_cookery_data';

// Initialize storage if empty
if (!localStorage.getItem(STORAGE_KEY)) {
    const initialData = {
        quotes: [],
        invoices: []
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
}

function getData() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch (e) {
        console.error("Error reading from localStorage", e);
        return { quotes: [], invoices: [] };
    }
}

function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function saveDocument(docData) {
    const data = getData();
    const collection = docData.type === 'quote' ? 'quotes' : 'invoices';

    // Generate ID
    const prefix = docData.type === 'quote' ? 'MC-QT' : 'MC-INV';
    const randomId = Math.floor(1000 + Math.random() * 9000);
    const docId = `${prefix}-${randomId}`;

    const newDoc = {
        ...docData,
        id: docId,
        createdAt: new Date().toISOString(),
        status: docData.type === 'quote' ? 'Pending' : 'Unpaid'
    };

    data[collection].unshift(newDoc); // Add to top
    saveData(data);
    return newDoc;
}

export function getDocuments(type) {
    const data = getData();
    return data[type === 'quote' ? 'quotes' : 'invoices'] || [];
}

export function updateInvoiceStatus(id, newStatus) {
    const data = getData();
    const invoiceIndex = data.invoices.findIndex(inv => inv.id === id);

    if (invoiceIndex !== -1) {
        data.invoices[invoiceIndex].status = newStatus;
        saveData(data);
        return true;
    }
    return false;
}

export function getAnalytics() {
    const data = getData();
    const quotes = data.quotes;
    const invoices = data.invoices;

    const totalQuotes = quotes.length;
    const totalInvoices = invoices.length;

    const paidInvoices = invoices.filter(inv => inv.status === 'Paid');
    const paidCount = paidInvoices.length;

    const totalRevenue = invoices.reduce((sum, inv) => sum + (parseFloat(inv.total) || 0), 0);
    const paidRevenue = paidInvoices.reduce((sum, inv) => sum + (parseFloat(inv.total) || 0), 0);

    // Calculate outstanding balance (Unpaid + Partially Paid)
    // Simplified: Assuming "total" is the full amount. 
    // Ideally we'd track payments against total, but for now:
    // Unpaid = full amount, Paid = 0 outstanding.
    const outstandingBalance = invoices
        .filter(inv => inv.status !== 'Paid')
        .reduce((sum, inv) => sum + (parseFloat(inv.total) || 0), 0);

    // Monthly Revenue (Simple check for current month)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyRevenue = invoices
        .filter(inv => {
            const d = new Date(inv.createdAt);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        })
        .reduce((sum, inv) => sum + (parseFloat(inv.total) || 0), 0);

    return {
        totalQuotes,
        totalInvoices,
        paidCount,
        totalRevenue,
        paidRevenue,
        outstandingBalance,
        monthlyRevenue
    };
}
