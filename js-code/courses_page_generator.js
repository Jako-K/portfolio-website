async function create_courses_page(){
    const container = document.createElement('div'); // Main container

    const response = await fetch('./public/courses_info.csv');
    const text = await response.text();
    const rows = text.split('\n');

    let currentTable = null; // To track the current table body
    let currentCategory = null; // To track the current category
    let isFirstTitleRow = null;
    rows.forEach(row => {
        const trimmed = row.trim();
        if (!trimmed) return; // Skip empty lines

        // Check for subcategory lines (starting with '#')
        if (trimmed.startsWith('#')) {
            currentCategory = trimmed.substring(1); // Remove the '#' and use as category name

            // Create a new table for the category
            const categoryDiv = document.createElement('div');
            categoryDiv.classList.add('category-container');
            categoryDiv.style.marginBottom = '20px'; // Add spacing between tables

            const table = document.createElement('table');
            table.classList.add('course-table');
            if(isFirstTitleRow === null){
                table.innerHTML = `
                    <thead>
                        <tr>
                            <th class="category-header-left">${currentCategory}</th>
                            <th class="category-header-right">ETCS Points</th>
                        </tr>
                    </thead>`;
            }else{
                table.innerHTML = `
                    <thead>
                        <tr>
                            <th class="category-header-left">${currentCategory}</th>
                            <th> </th>
                        </tr>
                    </thead>`;
            }
            if (isFirstTitleRow === null) {
                isFirstTitleRow = true;
            }

            currentTable = document.createElement('tbody');
            table.appendChild(currentTable);
            categoryDiv.appendChild(table);

            container.appendChild(categoryDiv);
        } else if (currentTable) {
            // Add rows to the current table
            const cells = trimmed.split(',');
            const newRow = currentTable.insertRow();
            cells.forEach(cell => {
                const newCell = newRow.insertCell();
                newCell.textContent = cell;
            });
        }
    });

    const tableHTML = `
        <div class="courses-page-container">
            <div class="courses-page-introduction">
                <h2>University Courses</h2>
                <div class="title-line"></div>
                Below is a comprehensive list of courses I completed during my Bachelor’s and Master’s degrees at the Technical University of Denmark (DTU).
            </div>
            ${container.outerHTML}
        </div>
    `;
    return tableHTML;
}
