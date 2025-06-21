function updateCosts() {
    let rows = document.querySelectorAll('#ingredientsTable tbody tr');
    let total = 0;
    rows.forEach(row => {
        let unitCost = parseFloat(row.cells[2].querySelector('input').value) || 0;
        let qtyUsed = parseFloat(row.cells[3].querySelector('input').value) || 0;
        let cost = unitCost * qtyUsed;
        row.cells[4].querySelector('span').innerText = cost.toFixed(2);
        total += cost;
    });
    document.getElementById('ingredientTotal').value = total.toFixed(2);
    updateFinal();
}

function updateFinal() {
    let ingredientCost = parseFloat(document.getElementById('ingredientTotal').value) || 0;
    let packaging = parseFloat(document.getElementById('packaging').value) || 0;
    let others = parseFloat(document.getElementById('others').value) || 0;
    let profit = parseFloat(document.getElementById('profit').value) || 0;

    let totalCost = ingredientCost + packaging + others;
    let sellingPrice = totalCost + profit;

    document.getElementById('totalCost').value = totalCost.toFixed(2);
    document.getElementById('sellingPrice').innerText = sellingPrice.toFixed(2);
}

window.onload = updateCosts;
