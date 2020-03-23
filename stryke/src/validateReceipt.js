/**
 * Receipts before create trigger.
 * - validates that invoices have a related business. If not it will not allow creating the record.
 */
if (stryke.data.recordAfter.isInvoice && !stryke.data.recordAfter.business) {
    stryke.error('If the receipt is an invoice, it must have the business set.');    
}

stryke.resolve(stryke.data.recordAfter);