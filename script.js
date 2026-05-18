document.getElementById('date').innerText = new Date().toLocaleDateString('en-GB');
let materials = [];

function formatMoney(amount){
    return Number(amount).toLocaleString('en-US') + ' RWF';
}

function addMaterial(){
    let name = document.getElementById('materialName').value;
    let basePrice = parseFloat(document.getElementById('materialPrice').value) || 0;
    let qty = parseInt(document.getElementById('materialQty').value) || 1;

    if(name.trim() === ''){
        alert('Please enter a material product name.');
        return;
    }

    // Always append the standard +2,000 RWF markup on materials automatically
    let clientUnitPrice = basePrice + 2000;
    let calculatedTotal = clientUnitPrice * qty;
    let pocketProfit = 2000 * qty;

    materials.push({
        name: name,
        price: clientUnitPrice, // Customer sees marked up cost
        qty: qty,
        total: calculatedTotal,
        profit: pocketProfit
    });

    renderMaterials();

    document.getElementById('materialName').value = '';
    document.getElementById('materialPrice').value = 0;
    document.getElementById('materialQty').value = 1;
}

function renderMaterials(){
    let html = '';
    materials.forEach(item => {
        html += `
            <div class="saved-material">
                <b>${item.name}</b><br>
                Customer Unit Price: ${formatMoney(item.price)} <span class="profit-badge">Markup Applied</span><br>
                Qty: ${item.qty} | Total: ${formatMoney(item.total)}
            </div>
        `;
    });
    document.getElementById('savedMaterials').innerHTML = html;
}

function calculatePrice(){
    let product = document.getElementById('product').value;
    let width = parseFloat(document.getElementById('width').value) || 0;
    let height = parseFloat(document.getElementById('height').value) || 0;
    let unit = document.getElementById('unit').value;
    let qty = parseInt(document.getElementById('qty').value) || 1;
    let customer = document.getElementById('customer').value || 'Valued Customer';

    if(unit === 'cm'){
        width = width / 100;
        height = height / 100;
    }

    let size = width * height;

    let printRate = 0;
    let branding = 0;
    let design = 10000; // Flat 10k design fee across the board
    let brandingUpsizeProfit = 0;

    if(product === 'sticker'){
        printRate = 5500;
        branding = 5000;
        if(size > 1) {
            branding += 2000;
            brandingUpsizeProfit = 2000;
        }
        branding = branding * qty;
        brandingUpsizeProfit = brandingUpsizeProfit * qty;
    }
    
    if(product === 'oneway'){
        printRate = 6500;
        branding = 5000;
        if(size > 1) {
            branding += 2000;
            brandingUpsizeProfit = 2000;
        }
        branding = branding * qty;
        brandingUpsizeProfit = brandingUpsizeProfit * qty;
    }
    
    if(product === 'banner'){
        printRate = 5000;
        branding = 0;
    }
    
    if(product === 'backlight'){
        printRate = 7000;
        branding = 0;
    }

    let printing = size * printRate * qty;

    let materialsTotal = 0;
    let materialsProfitTotal = 0;
    materials.forEach(item => {
        materialsTotal += item.total;
        materialsProfitTotal += item.profit;
    });

    let total = printing + design + branding + materialsTotal;

    // Output structural metric interface values
    document.getElementById('sizeResult').innerText = size.toFixed(2) + ' m²';
    document.getElementById('printingResult').innerText = formatMoney(printing);
    document.getElementById('brandingResult').innerText = formatMoney(branding);
    document.getElementById('designResult').innerText = formatMoney(design);
    document.getElementById('materialsResult').innerText = formatMoney(materialsTotal);
    document.getElementById('totalResult').innerText = 'TOTAL : ' + formatMoney(total);

    // Update Private Profit Tracking Card
    document.getElementById('internalProfitCard').style.display = 'block';
    document.getElementById('trackMatProfit').innerText = formatMoney(materialsProfitTotal);
    document.getElementById('trackBrandProfit').innerText = formatMoney(brandingUpsizeProfit);
    document.getElementById('trackTotalProfit').innerText = formatMoney(design + materialsProfitTotal + brandingUpsizeProfit);

    // Map output to preview template
    document.getElementById('qCustomer').innerText = customer;
    document.getElementById('qProduct').innerText = product.toUpperCase();
    document.getElementById('qSize').innerText = width.toFixed(2) + 'm x ' + height.toFixed(2) + 'm';
    document.getElementById('qQty').innerText = qty;
    document.getElementById('qTotal').innerText = formatMoney(printing + design + branding);
    document.getElementById('grandTotal').innerText = 'TOTAL : ' + formatMoney(total);

    let materialHTML = '';
    if(materials.length > 0){
        materialHTML = `
            <table style="margin-top: 15px;">
                <thead>
                    <tr>
                        <th>Additional Material Item</th>
                        <th>Unit Cost</th>
                        <th>Qty</th>
                        <th>Total Cost</th>
                    </tr>
                </thead>
                <tbody>
        `;
        materials.forEach(item => {
            materialHTML += `
                <tr>
                    <td>${item.name}</td>
                    <td>${formatMoney(item.price)}</td>
                    <td>${item.qty}</td>
                    <td>${formatMoney(item.total)}</td>
                </tr>
            `;
        });
        materialHTML += `</tbody></table>`;
    }
    document.getElementById('materialsTable').innerHTML = materialHTML;
}

async function downloadPDF(){
    const { jsPDF } = window.jspdf;
    const quotation = document.getElementById("quotation");

    const canvas = await html2canvas(quotation, {
        scale: 2,
        useCORS: true
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("KINGKA-Quotation.pdf");
}