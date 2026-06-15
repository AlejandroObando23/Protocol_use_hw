document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const totalInsectsEl = document.getElementById('total-insects');
    const smallCountEl = document.getElementById('small-count');
    const mediumCountEl = document.getElementById('medium-count');
    const largeCountEl = document.getElementById('large-count');
    const insectsBody = document.getElementById('insects-body');

    const searchInput = document.getElementById('search-input');
    const categorySelect = document.getElementById('category-select');
    const deleteCategoryBtn = document.getElementById('delete-category-btn');
    const refreshBtn = document.getElementById('refresh-btn');

    // Custom Confirm Modal Elements
    const confirmModal = document.getElementById('confirm-modal');
    const confirmTitle = document.getElementById('confirm-title');
    const confirmMessage = document.getElementById('confirm-message');
    const confirmCancelBtn = document.getElementById('confirm-cancel-btn');
    const confirmOkBtn = document.getElementById('confirm-ok-btn');
    
    let onConfirmCallback = null;

    const API_BASE = '/insectStore';
    let insectsData = [];

    // Initialize application
    const init = async () => {
        await fetchAndRender();
    };

    // Helper: custom confirm
    const showConfirm = (title, message, callback) => {
        confirmTitle.textContent = title;
        confirmMessage.textContent = message;
        onConfirmCallback = callback;
        confirmModal.classList.remove('hidden');
    };

    const hideConfirm = () => {
        confirmModal.classList.add('hidden');
        onConfirmCallback = null;
    };

    confirmCancelBtn.addEventListener('click', hideConfirm);
    confirmOkBtn.addEventListener('click', async () => {
        if (onConfirmCallback) {
            await onConfirmCallback();
        }
        hideConfirm();
    });

    // Fetch all insect data and render stats + table
    const fetchAndRender = async () => {
        try {
            insectsBody.innerHTML = '<tr><td colspan="7" class="text-center">Loading specimens...</td></tr>';
            
            const res = await fetch(`${API_BASE}/insect`);
            if (!res.ok) throw new Error('Failed to fetch insects');
            
            insectsData = await res.json();
            
            updateStats();
            renderTable(insectsData);
        } catch (error) {
            console.error(error);
            insectsBody.innerHTML = '<tr><td colspan="7" class="text-center" style="color: var(--danger);">Error loading data. Make sure the database is connected.</td></tr>';
        }
    };

    // Calculate and update stats boxes
    const updateStats = () => {
        totalInsectsEl.textContent = insectsData.length;
        
        let small = 0;
        let medium = 0;
        let large = 0;

        insectsData.forEach(insect => {
            const len = insect.body_length_mm;
            if (len < 15) small++;
            else if (len <= 50) medium++;
            else large++;
        });

        smallCountEl.textContent = small;
        mediumCountEl.textContent = medium;
        largeCountEl.textContent = large;
    };

    // Render table with the given list of insects
    const renderTable = (list) => {
        insectsBody.innerHTML = '';

        if (list.length === 0) {
            insectsBody.innerHTML = '<tr><td colspan="7" class="text-center">No specimens match your search.</td></tr>';
            return;
        }

        list.forEach(insect => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <div class="name-container">
                        <span class="common-name">${insect.common_name}</span>
                    </div>
                </td>
                <td class="scientific-name">${insect.scientific_name}</td>
                <td>
                    <span class="taxonomy-badge order-badge">${insect.order}</span>
                    <span class="taxonomy-badge family-badge">${insect.family}</span>
                </td>
                <td class="text-right font-mono">${insect.wingspan_mm} mm</td>
                <td class="text-right font-mono">${insect.body_length_mm} mm</td>
                <td class="text-right font-mono">${insect.wingspan_to_body_ratio || (insect.wingspan_mm / insect.body_length_mm).toFixed(2)}</td>
                <td class="text-center">
                    <button class="action-btn btn-delete" data-id="${insect.id}" title="Delete specimen">Delete</button>
                </td>
            `;
            insectsBody.appendChild(tr);
        });
    };

    // Real-time client-side search filtering
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim();
        if (!query) {
            renderTable(insectsData);
            return;
        }

        const filtered = insectsData.filter(insect => {
            return (
                (insect.common_name && insect.common_name.toLowerCase().includes(query)) ||
                (insect.scientific_name && insect.scientific_name.toLowerCase().includes(query)) ||
                (insect.order && insect.order.toLowerCase().includes(query)) ||
                (insect.family && insect.family.toLowerCase().includes(query))
            );
        });
        renderTable(filtered);
    });

    // Delete single insect by ID (with custom confirm)
    insectsBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-delete')) {
            const id = e.target.getAttribute('data-id');
            const commonName = e.target.closest('tr').querySelector('.common-name').textContent;
            
            showConfirm(
                'Delete Specimen',
                `Are you sure you want to delete the "${commonName}" (ID: ${id}) from the database?`,
                async () => {
                    try {
                        const res = await fetch(`${API_BASE}/insect/${id}`, {
                            method: 'DELETE'
                        });
                        if (res.ok) {
                            await fetchAndRender();
                        } else {
                            const errData = await res.json();
                            alert(`Error: ${errData.message || 'Could not delete specimen'}`);
                        }
                    } catch (error) {
                        console.error(error);
                        alert('Network error trying to delete specimen.');
                    }
                }
            );
        }
    });

    // Delete insects by size category (with custom confirm)
    deleteCategoryBtn.addEventListener('click', () => {
        const category = categorySelect.value;
        if (!category) {
            alert('Please select a size category to delete.');
            return;
        }

        showConfirm(
            'Delete Size Category',
            `WARNING: Are you sure you want to delete ALL insects in the "${category.toUpperCase()}" category?`,
            async () => {
                try {
                    const res = await fetch(`${API_BASE}/insect/size/${category}`, {
                        method: 'DELETE'
                    });
                    
                    const result = await res.json();
                    if (res.ok) {
                        alert(result.message || `Deleted ${result.count} insects successfully.`);
                        categorySelect.selectedIndex = 0; // reset select
                        await fetchAndRender();
                    } else {
                        alert(`Error: ${result.message || 'Could not delete category'}`);
                    }
                } catch (error) {
                    console.error(error);
                    alert('Network error trying to delete category.');
                }
            }
        );
    });

    // Refresh list manually
    refreshBtn.addEventListener('click', fetchAndRender);

    // Run app
    init();
});