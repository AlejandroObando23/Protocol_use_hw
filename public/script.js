document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const totalCustomersEl = document.getElementById('total-customers');
    const totalRevenueEl = document.getElementById('total-revenue');
    const customersBody = document.getElementById('customers-body');

    const searchType = document.getElementById('search-type');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const clearBtn = document.getElementById('clear-btn');
    const searchResults = document.getElementById('search-results');
    const refreshBtn = document.getElementById('refresh-btn');

    const API_BASE = '/customerStore';

    const formatMoney = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    const init = async () => {
        await loadStats();
        await loadAllCustomers();
    };

    const loadStats = async () => {
        try {
            const countRes = await fetch(`${API_BASE}/customer/count`);
            const countData = await countRes.json();
            totalCustomersEl.textContent = countData || 0;

            const summaryRes = await fetch(`${API_BASE}/customer/summary`);
            if (summaryRes.ok) {
                const summaryData = await summaryRes.json();
                const total = summaryData.reduce((acc, curr) => acc + (curr.totalSpent || 0), 0);
                totalRevenueEl.textContent = formatMoney(total);
            }
        } catch (error) {
            totalCustomersEl.textContent = 'Error';
            totalRevenueEl.textContent = 'Error';
        }
    };

    const loadAllCustomers = async () => {
        try {
            customersBody.innerHTML = '<tr><td colspan="3" class="text-center">Loading data...</td></tr>';

            const res = await fetch(`${API_BASE}/customer`);
            const data = await res.json();

            customersBody.innerHTML = '';

            if (data.length === 0) {
                customersBody.innerHTML = '<tr><td colspan="3" class="text-center">No customers found.</td></tr>';
                return;
            }

            data.forEach(customer => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${customer.name}</td>
                    <td>${customer.age}</td>
                    <td>${formatMoney(customer['moneySpent'])}</td>
                `;
                customersBody.appendChild(tr);
            });
        } catch (error) {
            customersBody.innerHTML = '<tr><td colspan="3" class="text-center" style="color:red;">Error connecting to API.</td></tr>';
        }
    };

    const performSearch = async () => {
        const type = searchType.value;
        const term = searchInput.value.trim();

        if (!term) return;

        searchResults.innerHTML = 'Searching...';
        searchResults.classList.remove('hidden');

        try {
            const res = await fetch(`${API_BASE}/customer/${type}/${term}`);

            if (res.status === 404) {
                searchResults.innerHTML = `<span style="color:red;">No customer found.</span>`;
                return;
            }

            const data = await res.json();

            searchResults.innerHTML = `
                <div>
                    <strong>Name:</strong> ${data.name} <br>
                    <strong>Age:</strong> ${data.age} <br>
                    <strong>Spent:</strong> ${formatMoney(data['moneySpent'])}
                </div>
            `;

        } catch (error) {
            searchResults.innerHTML = '<span style="color:red;">Error performing search.</span>';
        }
    };

    searchBtn.addEventListener('click', performSearch);

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchResults.classList.add('hidden');
        searchResults.innerHTML = '';
    });

    refreshBtn.addEventListener('click', () => {
        loadStats();
        loadAllCustomers();
    });

    init();
});