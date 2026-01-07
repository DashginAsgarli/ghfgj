document.addEventListener('DOMContentLoaded', function() {
    fetchBeauty();
    setupBeautySorting();
});

async function fetchBeauty() {
    try {
        const response = await fetch('https://sevgi-backend-beauty.vercel.app/');
        if (!response.ok) throw new Error('API cavab vermədi');
        
        const data = await response.json();
        beautyData(data);
    } catch (error) {
        console.error('Beauty məlumatları yüklənərkən xəta:', error);
        document.getElementById('beauty-container').innerHTML = 
            '<p class="error">Məlumatlar yüklənərkən xəta baş verdi. Zəhmət olmasa yenidən yoxlayın.</p>';
    }
}

function beautyData(beautys) {
    const container = document.getElementById('beauty-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    beautys.forEach((beauty, index) => {
        const card = document.createElement('div');
        card.className = 'beauty-card';
        card.dataset.price = beauty.price;
        card.dataset.rating = beauty.rating;
        
        card.innerHTML = `
            <img src="${beauty.photo}" alt="${beauty.name}" onerror="this.src='../images/default-avatar.png'">
            <h3>${beauty.name}</h3>
            <p>✨ ${beauty.rating} (${beauty.reviews} rəy)</p>
            <p>📍 ${beauty.location}</p>
            <p>💖 ${beauty.price} AZN</p>
            <p>🌸 Növbəti: ${beauty.nextAvailable}</p>
            <button class="profile-btn" data-id="${beauty.id}" data-type="beauty">
                Profilə keç
            </button>
        `;
        
        container.appendChild(card);
    });
    
    // Profil butonlarına klik hadisəsi
    document.querySelectorAll('.profile-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id;
            const type = e.currentTarget.dataset.type;
            window.location.href = `profile.html?id=${id}&type=${type}`;
        });
    });
}

function setupBeautySorting() {
    const priceBtn = document.querySelector('.price');
    const ratingBtn = document.querySelector('.rating');
    const container = document.getElementById('beauty-container');
    
    if (!priceBtn || !ratingBtn || !container) return;
    
    let priceSortAsc = true;
    let ratingSortAsc = true;
    
    // Qiymətə görə sırala
    priceBtn.addEventListener('click', () => {
        const cards = Array.from(container.querySelectorAll('.beauty-card'));
        
        cards.sort((a, b) => {
            const priceA = parseFloat(a.dataset.price) || 0;
            const priceB = parseFloat(b.dataset.price) || 0;
            
            return priceSortAsc ? priceA - priceB : priceB - priceA;
        });
        
        cards.forEach(card => container.appendChild(card));
        priceBtn.innerHTML = priceSortAsc ? '💰 ↓' : '💰 ↑';
        priceSortAsc = !priceSortAsc;
    });
    
    // Reytingə görə sırala
    ratingBtn.addEventListener('click', () => {
        const cards = Array.from(container.querySelectorAll('.beauty-card'));
        
        cards.sort((a, b) => {
            const ratingA = parseFloat(a.dataset.rating) || 0;
            const ratingB = parseFloat(b.dataset.rating) || 0;
            
            return ratingSortAsc ? ratingB - ratingA : ratingA - ratingB;
        });
        
        cards.forEach(card => container.appendChild(card));
        ratingBtn.innerHTML = ratingSortAsc ? '⭐ ↓' : '⭐ ↑';
        ratingSortAsc = !ratingSortAsc;
    });
}