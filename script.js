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
  updateDishSummary();
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

function updateDishSummary() {
  const salePrice = parseFloat(document.getElementById("estSalePrice").value) || 0;
  const totalCost = parseFloat(document.getElementById("totalCost").textContent) || 0;

  const profit = salePrice - totalCost;
  const margin = salePrice > 0 ? ((profit / salePrice) * 100).toFixed(2) : 0;

  document.getElementById("summaryTotalCost").textContent = totalCost.toFixed(2);
  document.getElementById("netProfit").textContent = profit.toFixed(2);
  document.getElementById("costMargin").textContent = `${margin}%`;

  // VAT Breakdown
  const vat = salePrice * 0.12;
  const vatExcluded = salePrice - vat;

  document.getElementById("vatExcluded").textContent = vatExcluded.toFixed(2);
  document.getElementById("vatAmount").textContent = vat.toFixed(2);

  // Discount Calculations (PWD/Senior)
  const discount = salePrice * 0.20;
  const discountedPrice = salePrice - discount;
  const profitAfterDiscount = discountedPrice - totalCost;
  const profitDiff = profit - profitAfterDiscount;

  document.getElementById("discountValue").textContent = discount.toFixed(2);
  document.getElementById("discountedPrice").textContent = discountedPrice.toFixed(2);
  document.getElementById("profitAfterDiscount").textContent = profitAfterDiscount.toFixed(2);
  document.getElementById("profitDifference").textContent = profitDiff.toFixed(2);

  drawPieChart();
}

function drawPieChart() {
  const ingredientRows = document.getElementById('ingredientsBody').rows;
  const subRecipeRows = document.getElementById('subRecipesBody').rows;

  let ingredientTotal = 0;
  let subRecipeTotal = 0;
  let overhead = 0;

  [...ingredientRows].forEach(row => {
    const cost = parseFloat(row.cells[5]?.textContent) || 0;
    ingredientTotal += cost;
  });

  [...subRecipeRows].forEach(row => {
    const cost = parseFloat(row.cells[4]?.textContent) || 0;
    subRecipeTotal += cost;
  });

  overhead +=
    (parseFloat(document.getElementById('laborCost').value) || 0) +
    (parseFloat(document.getElementById('utilitiesCost').value) || 0) +
    (parseFloat(document.getElementById('packagingCost').value) || 0);

  const data = [ingredientTotal, subRecipeTotal, overhead];
  const ctx = document.getElementById('pieChart').getContext('2d');

  if (window.pieChart) window.pieChart.destroy();
  window.pieChart = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: ['Ingredients', 'Sub-Recipes', 'Overhead'],
    datasets: [{
      data: data,
      backgroundColor: ['#4CAF50', '#FF9800', '#2196F3']
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' }
    }
  }
});
  // Global vars
let dishImageBase64 = "";

// Handle Photo Upload
const dishPhotoInput = document.getElementById("dishPhoto");
dishPhotoInput.addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    dishImageBase64 = e.target.result;
    document.getElementById("photoPreview").innerHTML = `<img src="${dishImageBase64}" alt="Dish Photo" />`;
  };
  reader.readAsDataURL(file);
});

// Update summary calculations
function updateDishSummary() {
  const salePrice = parseFloat(document.getElementById("estSalePrice").value) || 0;
  const totalCost = parseFloat(document.getElementById("totalCost").textContent) || 0;
  const targetMargin = parseFloat(document.getElementById("targetMargin").value) || 0;

  const profit = salePrice - totalCost;
  const margin = salePrice > 0 ? ((profit / salePrice) * 100).toFixed(2) : 0;
  const autoSuggest = targetMargin > 0 ? (totalCost / (1 - targetMargin / 100)) : 0;

  document.getElementById("netProfit").textContent = profit.toFixed(2);
  document.getElementById("costMargin").textContent = `${margin}%`;
  document.getElementById("autoSuggest").textContent = `₱${autoSuggest.toFixed(2)}`;

  // VAT and discount logic
  const vat = salePrice * 0.12;
  const vatExcluded = salePrice - vat;
  const discount = salePrice * 0.2;
  const discountedPrice = salePrice - discount;
  const profitAfterDiscount = discountedPrice - totalCost;
  const profitDiff = profit - profitAfterDiscount;

  document.getElementById("vatAmount").textContent = vat.toFixed(2);
  document.getElementById("vatExcluded").textContent = vatExcluded.toFixed(2);
  document.getElementById("discountValue").textContent = discount.toFixed(2);
  document.getElementById("discountedPrice").textContent = discountedPrice.toFixed(2);
  document.getElementById("profitAfterDiscount").textContent = profitAfterDiscount.toFixed(2);
  document.getElementById("profitDifference").textContent = profitDiff.toFixed(2);

  drawPieChart(totalCost);
}

function drawPieChart(totalCost) {
  const estPrice = parseFloat(document.getElementById("estSalePrice").value) || 0;
  const profit = estPrice - totalCost;

  const ctx = document.getElementById("pieChart").getContext("2d");
  if (window.pieChart) window.pieChart.destroy();
  window.pieChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Cost", "Profit"],
      datasets: [
        {
          data: [totalCost, profit > 0 ? profit : 0],
          backgroundColor: ["#f44336", "#4caf50"]
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" }
      }
    }
  });
}

// Reset all fields
function resetAll() {
  document.querySelectorAll("input").forEach(i => (i.value = ""));
  document.querySelectorAll("span").forEach(s => (s.textContent = "0.00"));
  document.getElementById("autoSuggest").textContent = "₱0.00";
  document.getElementById("photoPreview").innerHTML = "";
  dishImageBase64 = "";
  if (window.pieChart) window.pieChart.destroy();
}

// Save data to localStorage
function saveToLocal() {
  const data = {
    date: document.getElementById("dishDate").value,
    name: document.getElementById("dishName").value,
    price: document.getElementById("estSalePrice").value,
    margin: document.getElementById("targetMargin").value,
    image: dishImageBase64
  };
  localStorage.setItem("foodCostingData", JSON.stringify(data));
  alert("Data saved!");
}

// Load data from localStorage
function loadFromLocal() {
  const saved = JSON.parse(localStorage.getItem("foodCostingData"));
  if (!saved) return alert("No saved data found.");
  document.getElementById("dishDate").value = saved.date;
  document.getElementById("dishName").value = saved.name;
  document.getElementById("estSalePrice").value = saved.price;
  document.getElementById("targetMargin").value = saved.margin;
  if (saved.image) {
    dishImageBase64 = saved.image;
    document.getElementById("photoPreview").innerHTML = `<img src="${saved.image}" alt="Saved Dish" />`;
  }
  updateDishSummary();
}

// Export to PDF
function exportPDF() {
  const container = document.querySelector(".container").cloneNode(true);
  if (dishImageBase64) {
    const img = container.querySelector("#photoPreview img");
    if (img) img.src = dishImageBase64;
  }
  html2pdf().from(container).save("food-costing-report.pdf");
}

// Trigger update on price change
["estSalePrice", "targetMargin"].forEach(id => {
  document.getElementById(id).addEventListener("input", updateDishSummary);
});
