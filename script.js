// Global variables
function getValidNumber(input, defaultValue = 0) {
  let value = parseFloat(input.value);
  if (isNaN(value) || value < 0) {
    value = defaultValue;
    input.value = value; // Optional: force input to valid value
  }
  return value;
}

let dishImageBase64 = "";

function createRow(cells) {
  const row = document.createElement('tr');
  cells.forEach(cell => row.appendChild(cell));

  const deleteCell = document.createElement('td');
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '🗑';
  deleteBtn.onclick = () => {
    row.remove();
    updateTotals();
  };

  deleteCell.appendChild(deleteBtn);
  row.appendChild(deleteCell);

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
    createInputCell('text', '', () => {}),
    createInputCell('text', '', () => {})
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
  const scale = getValidNumber(document.getElementById('batchScale').value) || 1;
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
    const cost = getValidNumber(row.cells[2].querySelector('input'));
    const qty = getValidNumber(row.cells[3].querySelector('input'));
    const total = cost * qty * scale;
    row.cells[5].textContent = total.toFixed(2);
    ingredientTotal += total;
  });

  const subRecipeRows = document.getElementById('subRecipesBody').rows;
  [...subRecipeRows].forEach(row => {
    const cost = getValidNumber(row.cells[2].querySelector('input'));
    const qty = getValidNumber(row.cells[3].querySelector('input'));
    const total = cost * qty;
    row.cells[4].textContent = total.toFixed(2);
    subRecipeTotal += total;
  });

  const labor = getValidNumber(document.getElementById('laborCost').value) || 0;
  const utilities = getValidNumber(document.getElementById('utilitiesCost').value) || 0;
  const packaging = getValidNumber(document.getElementById('packagingCost').value) || 0;
  const yieldCount = getValidNumber(document.getElementById('yieldCount').value) || 1;
  const profit = getValidNumber(document.getElementById('profitPerPortion').value) || 0;

  const totalCost = ingredientTotal + subRecipeTotal + labor + utilities + packaging;
  const costPerPortion = yieldCount && yieldCount > 0 ? totalCost / yieldCount : 0;
  const suggestedPrice = costPerPortion + profit;

  document.getElementById('totalCost').textContent = totalCost.toFixed(2);
  updateDishSummary();
}

function updateDishSummary() {
  const salePrice = getValidNumber(document.getElementById("estSalePrice").value) || 0;
  const totalCost = getValidNumber(document.getElementById("totalCost").textContent) || 0;
  const targetMargin = getValidNumber(document.getElementById("targetMargin").value) || 0;

  const profit = salePrice - totalCost;
  const margin = salePrice > 0 ? ((profit / salePrice) * 100).toFixed(2) : 0;
  const autoSuggest = targetMargin > 0 ? (totalCost / (1 - targetMargin / 100)) : 0;

  document.getElementById("netProfit").textContent = profit.toFixed(2);
  document.getElementById("costMargin").textContent = `${margin}%`;
  document.getElementById("autoSuggest").textContent = `₱${autoSuggest.toFixed(2)}`;

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

document.addEventListener('DOMContentLoaded', () => {
  addIngredientRow();
  addSubRecipeRow();

  const dishPhotoInput = document.getElementById("dishPhoto");
  
  ["estSalePrice", "targetMargin"].forEach(id => {function drawPieChart(totalCost) {
  const estPrice = getValidNumber(document.getElementById("estSalePrice"));
  const profit = estPrice - totalCost;
  const ctx = document.getElementById("pieChart").getContext("2d");
  if (!window.Chart) return; // Chart.js not loaded
  if (window.pieChart) window.pieChart.destroy();
  window.pieChart = new Chart(ctx, {
    document.getElementById(id).addEventListener("input", updateDishSummary);
  });
});

function resetAll() {
  document.querySelectorAll("input").forEach(i => (i.value = ""));
  [
    "totalCost", "costMargin", "netProfit", "vatAmount", "vatExcluded",
    "discountValue", "discountedPrice", "profitAfterDiscount", "profitDifference"
  ].forEach(id => document.getElemendishPhotoInput.addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;

  // Extra safety: check file type
  if (!file.type.startsWith("image/")) {
    alert("Please upload a valid image file.");
    this.value = ""; // reset the input field
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    dishImageBase64 = e.target.result;
    document.getElementById("photoPreview").innerHTML = `<img src="${dishImageBase64}" alt="Dish Photo" />`;
  };
  reader.readAsDataURL(file);
});tById(id).textContent = "0.00");
  document.getElementById("autoSuggest").textContent = "₱0.00";
  document.getElementById("photoPreview").innerHTML = "";
  dishImageBase64 = "";
  if (window.pieChart) window.pieChart.destroy();

  // Clear and reset tables
  document.getElementById('ingredientsBody').innerHTML = "";
  document.getElementById('subRecipesBody').innerHTML = "";
  addIngredientRow();
  addSubRecipeRow();
}

function saveToLocal() {
  const data = {
    date: document.getElementById("dishDate").value,
    name: document.getElementById("dishName").value,
    price: document.getElementById("estSalePrice").value,
    margin: document.getElementById("targetMargin").value,
    image: dishImageBase64,
    ingredients: [...document.querySelectorAll('#ingredientsBody tr')].map(row => ({
      name: row.cells[0].querySelector('input')?.value || '',
      unit: row.cells[1].querySelector('input')?.value || '',
      cost: row.cells[2].querySelector('input')?.value || '0',
      qty: row.cells[3].querySelector('input')?.value || '0'
    })),
    subRecipes: [...document.querySelectorAll('#subRecipesBody tr')].map(row => ({
      name: row.cells[0].querySelector('input')?.value || '',
      unit: row.cells[1].querySelector('input')?.value || '',
      cost: row.cells[2].querySelector('input')?.value || '0',
      qty: row.cells[3].querySelector('input')?.value || '0'
    }))
  };
  localStorage.setItem("foodCostingData", JSON.stringify(data));
  alert("Data saved!");
}

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

  // Load ingredients
  const ingredientsBody = document.getElementById('ingredientsBody');
  ingredientsBody.innerHTML = "";
  (saved.ingredients || []).forEach(obj => {
    const row = createRow([
      createInputCell('text', obj.name),
      createInputCell('text', obj.unit),
      createInputCell('number', obj.cost),
      createInputCell('number', obj.qty),
      createInputCell('text', '', () => {}),
      createInputCell('text', '', () => {})
    ]);
    ingredientsBody.appendChild(row);
  });

  // Load sub-recipes
  const subRecipesBody = document.getElementById('subRecipesBody');
  subRecipesBody.innerHTML = "";
  (saved.subRecipes || []).forEach(obj => {
    const row = createRow([
      createInputCell('text', obj.name),
      createInputCell('text', obj.unit),
      createInputCell('number', obj.cost),
      createInputCell('number', obj.qty),
      createInputCell('text', '', () => {})
    ]);
    subRecipesBody.appendChild(row);
  });

  updateTotals(); // Recalculate everything after loading
  updateDishSummary();
}

function exportPDF() {
  try {
    const container = document.querySelector(".container").cloneNode(true);
    if (dishImageBase64) {
      const img = container.querySelector("#photoPreview img");
      if (img) img.src = dishImageBase64;
    }
    html2pdf().from(container).save("food-costing-report.pdf");
  } catch (e) {
    alert("Failed to export PDF: " + e.message);
  }
}
