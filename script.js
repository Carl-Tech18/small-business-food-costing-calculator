// Ingredient and sub-recipe arrays
let ingredients = [];
let subRecipes = [];

function createRow(cells) {
  const row = document.createElement('tr');
  cells.forEach(cell => row.appendChild(cell));
  return row;
}

function createInputCell(type = 'text', value = '', onInput = updateTotals) {
  const td = document.createElement('td');
  const input = document.createElement('input');
  input.type = type;
  input.value = value;
  input.onchange = onInput;
  td.appendChild(input);
  return td;
}

function addIngredientRow() {
  const tbody = document.getElementById('ingredientsBody');
  const row = createRow([
    createInputCell('text'),
    createInputCell('text'),
    createInputCell('number', 0),
    createInputCell('number', 0),
    createInputCell('text', '', () => {}), // Converted qty (auto)
    createInputCell('text', '', () => {})  // Total cost (auto)
  ]);
  tbody.appendChild(row);
  updateTotals();
}

function addSubRecipeRow() {
  const tbody = document.getElementById('subRecipesBody');
  const row = createRow([
    createInputCell('text'),
    createInputCell('text'),
    createInputCell('number', 0),
    createInputCell('number', 0),
    createInputCell('text', '', () => {})
  ]);
  tbody.appendChild(row);
  updateTotals();
}

function applyBatchScaling() {
  const scale = parseFloat(document.getElementById('batchScale').value) || 1;
  const tbody = document.getElementById('ingredientsBody');
  [...tbody.rows].forEach(row => {
    const qtyInput = row.cells[3].querySelector('input');
    const converted = row.cells[4];
    converted.textContent = (parseFloat(qtyInput.value) * scale).toFixed(2);
  });
  updateTotals();
}

function updateTotals() {
  let ingredientTotal = 0;
  let subRecipeTotal = 0;
  const scale = parseFloat(document.getElementById('batchScale').value) || 1;

  const ingredientRows = document.getElementById('ingredientsBody').rows;
  [...ingredientRows].forEach(row => {
    const cost = parseFloat(row.cells[2].querySelector('input').value) || 0;
    const qty = parseFloat(row.cells[3].querySelector('input').value) || 0;
    const total = cost * qty * scale;
    row.cells[5].textContent = total.toFixed(2);
    ingredientTotal += total;
  });

  const subRecipeRows = document.getElementById('subRecipesBody').rows;
  [...subRecipeRows].forEach(row => {
    const cost = parseFloat(row.cells[2].querySelector('input').value) || 0;
    const qty = parseFloat(row.cells[3].querySelector('input').value) || 0;
    const total = cost * qty;
    row.cells[4].textContent = total.toFixed(2);
    subRecipeTotal += total;
  });

  const labor = parseFloat(document.getElementById('laborCost').value) || 0;
  const utilities = parseFloat(document.getElementById('utilitiesCost').value) || 0;
  const packaging = parseFloat(document.getElementById('packagingCost').value) || 0;
  const yieldCount = parseFloat(document.getElementById('yieldCount').value) || 1;
  const profit = parseFloat(document.getElementById('profitPerPortion').value) || 0;

  const totalCost = ingredientTotal + subRecipeTotal + labor + utilities + packaging;
  const costPerPortion = totalCost / yieldCount;
  const suggestedPrice = costPerPortion + profit;

  document.getElementById('totalCost').textContent = totalCost.toFixed(2);
  document.getElementById('costPerPortion').textContent = costPerPortion.toFixed(2);
  document.getElementById('suggestedPrice').textContent = suggestedPrice.toFixed(2);
}

function exportToCSV() {
  let csv = 'Section,Ingredient/Item,Unit,Unit Cost,Quantity,Total\n';
  const ingredients = document.querySelectorAll('#ingredientsBody tr');
  ingredients.forEach(row => {
    const vals = [...row.cells].map(td => td.innerText || td.querySelector('input')?.value || '');
    csv += ['Ingredient', ...vals].join(',') + '\n';
  });
  const subs = document.querySelectorAll('#subRecipesBody tr');
  subs.forEach(row => {
    const vals = [...row.cells].map(td => td.innerText || td.querySelector('input')?.value || '');
    csv += ['Sub-Recipe', ...vals].join(',') + '\n';
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'food_costing.csv';
  link.click();
}

document.addEventListener('DOMContentLoaded', () => {
  addIngredientRow();
  addSubRecipeRow();
});
