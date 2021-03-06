/**
 * Generates the data for a report that lists all receipts in a specific time period. 
 * The start and end dates of the report are fields of the report record itself.
 * The data generated by this report is rendered using the reportTemplate.html.
 * The report template draws a very simple bar chart using CSS. This script
 * also prepares the values needed for that chart. 
 */
const moment = require('moment');

const UNCATHEGORISED_TYPE_NAME = 'Uncategorised';
const UNCATHEGORISED_TYPE_COLOR = 'purple';  
const BAR_CHART_LENGTH = 10;  

/**
 * A class holding the info for the full report response
 */
class ReportResult {
    constructor(startDate, endDate, total, types, receipts, hasData) {
        this.startDate = startDate;        
        this.endDate = endDate;
        this.total = total;
        this.types = types;
        this.receipts = receipts;
        this.hasData = hasData;
    }
}

/**
 * A class holding the info for a single receipt going in to the report
 */
class ReceiptInfo {
    constructor(alias, amount, date, type, business, isInvoice, typeColor) {
        this.alias = alias;        
        this.amount = amount;
        this.date = date;
        this.type = type;        
        this.business = business;
        this.isInvoice = isInvoice;
        this.typeColor = typeColor;
    }
}

/**
 * A class holding a summary of info needed for the report for a type of receipts
 */
class TypeSummary {
    constructor(title, subtotal, bars, numReceipts, typeColor) {
        this.title = title;        
        this.subtotal = subtotal;
        this.bars = bars;
        this.numReceipts = numReceipts;
        this.typeColor = typeColor;
    }
}

generateReport();

async function generateReport() {
    const startDate = formatDate(stryke.data.record.startdate);
    const endDate = formatDate(stryke.data.record.enddate);
    console.log(`report from: ${startDate} until: ${endDate}`);

    const report = await buildReportData(startDate, endDate);    

    try {
        // update the total field on the report record
        await stryke.update(stryke.data.record.id, { total : parseFloat(report.total) });              
        // return the report data
        stryke.resolve(report);
    }
    catch (err) {
        console.error(err.message);
        stryke.error('An error occurred trying to update the total amount of this report record.');
    }
}

async function buildReportData(startDate, endDate) {

    let reportDoc = new ReportResult(startDate, endDate, 0, null, null, false);
    
    try {
        // 1. get the receipts for this report
        const recepitsForReport = await stryke.find(`{ 
            Receipt (filter : {
                receiptDate : { gt : "${startDate}", 
                              lt : "${endDate}"}        
            }) 
            { 
                alias, 
                amount, 
                receiptDate,
                type { name, color }
                business { name }
                isInvoice 
            }
        }`);
                        
        if (recepitsForReport && recepitsForReport.length > 0) {
            let total = 0;
            const receipts = new Array();
            const types = new Map();
            // 2. build the data for the report
            recepitsForReport.forEach((receipt) => {
                const typeName = receipt.type ? receipt.type.name : UNCATHEGORISED_TYPE_NAME;
                const typeColor = receipt.type ? receipt.type.color : UNCATHEGORISED_TYPE_COLOR;        
                const businessName = receipt.business ? receipt.business.name : '';                

                buildTypeSummary(types, typeName, typeColor, receipt);

                receipts.push(buildReceiptsData(typeName, businessName, typeColor, receipt));        
                
                total += receipt.amount;
            });
                    
            if (total) {
                total = formatAmount(total);
            }
        
            // 3. build the data for the bar chart
            buildTypesChartData(types, total);
        
            // 4. create the report object
            reportDoc = new ReportResult(startDate, endDate, total, Array.from(types.values()), receipts, true);            
        }

    } catch (err) {
        console.error(err.message);
        stryke.error('An error occurred trying to retrieve the data needed to build this report.');
    }
    
    return reportDoc;
}

function buildTypeSummary(types, typeName, typeColor, receipt) {
    let typeSummary = types.get(typeName);

    if (typeSummary) {
        typeSummary.subtotal = formatAmount(typeSummary.subtotal + receipt.amount);    
        types.set(typeName, typeSummary);
    } else {
        typeSummary = new TypeSummary(typeName, Number(receipt.amount), [ 1 ], 1, typeColor);
        types.set(typeName, typeSummary);
    }

    return types;
}

function buildTypesChartData(types, total) {
    // build arrays that represent each bar in the report's bar chart
    types.forEach((type) => {
        // one entry in the array represents one unti in the bar, 
        // it should be proportinal to the subtotal of that type against the grand total of the report
        const len = Math.round(((type.subtotal / total) * BAR_CHART_LENGTH));      
        type.bars = new Array(len).fill(1);          
    });
}

function buildReceiptsData(typeName, businessName, typeColor, receipt) {    

    const isInvoice = receipt.isInvoice ? 'yes' : null;    
    return new ReceiptInfo(receipt.alias, receipt.amount, formatDateWithTime(receipt.receiptDate), typeName, businessName, isInvoice, typeColor);
}

function formatDate(isoDate) {
    const mDate = moment(isoDate);
    return mDate.format('YYYY-MM-DD');
}

function formatDateWithTime(isoDate) {
    const mDate = moment(isoDate);
    return mDate.format('YYYY-MM-DD hh:mm');
}

function formatAmount(amount) {
    // round to 2 decimal places
    return Math.round((amount + Number.EPSILON) * 100) / 100
}