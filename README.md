# Small Business Food Costing Calculator v2.1

A web-based calculator designed for small food business owners to compute ingredient costs, sub-recipe costs, overhead, suggested pricing, profit margins, VAT, and discounts. Includes a cost distribution pie chart and CSV export functionality.

## Features

- Ingredient and Sub-Recipe Tables  
- Batch Scaling Support  
- Cost per Portion Calculation  
- Yield and Labor Overhead Fields  
- Estimated Sale Price Input  
- Net Profit and Cost Margin Calculation  
- VAT (12%) and PWD/Senior Discount (20%)  
- Final Profit After Discount  
- Cost Distribution Pie Chart  
- CSV Export of All Entries  
- Responsive Layout for Desktop and Mobile

## Project Structure

```
food-costing-calculator/
├── index.html      - Main structure
├── styles.css      - UI styling
├── script.js       - Calculator logic and chart
└── README.md       - Project documentation
```

## How to Use

1. Open `index.html` in any web browser.
2. Fill out:
   - Date and Dish Name
   - Ingredients and Sub-Recipes
   - Overhead and Labor Costs
   - Yield and Desired Profit
3. Set the Estimated Sale Price.
4. View:
   - Total Cost
   - Net Profit
   - Cost Margin Percentage
   - VAT and Discount Breakdown
   - Cost Breakdown Pie Chart
5. Use the Export CSV button to download your costing table.

## Dependencies

- Chart.js (for the pie chart)

Included via CDN in `index.html`:
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```

## Ideal For

- Small business owners
- Students
- Pop-up kitchens
- Cafes and home-based food businesses

## License

Free to use for personal and educational purposes. Attribution is appreciated.

Created by Carl using HTML, CSS, and JavaScript.
