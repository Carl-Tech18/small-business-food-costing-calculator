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
