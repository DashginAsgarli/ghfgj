document.addEventListener('DOMContentLoaded', function() {
    fetchBarber();
    
    // Sıralama funksiyaları
    setupSorting();
});

async function fetchBarber() {
    try {
        const response = await fetch('https://sevgi-backend-barber.vercel.app/');
        if (!response.ok) throw new Error('API cavab vermədi');
        
        const data = await response.json();
        barberData(data);
    } catch (error) {
        console.error('Barber məlumatları yüklənərkən xəta:', error);
        document.getElementById('barber-container').innerHTML = 
            '<p class="error">Məlumatlar yüklənərkən xəta baş verdi. Zəhmət olmasa yenidən yoxlayın.</p>';
    }
}

function barberData(barbers) {
    const container = document.getElementById('barber-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    barbers.forEach((barber, index) => {
        const card = document.createElement('div');
        card.className = 'barber-card';
        card.dataset.price = barber.price;
        card.dataset.rating = barber.rating;
        
        card.innerHTML = `
            <img src="${barber.photo}" alt="${barber.name}" onerror="this.src='../images/default-avatar.png'">
            <h3>${barber.name}</h3>
            <p>⭐ ${barber.rating} (${barber.reviews} rəy)</p>
            <p>📍 ${barber.location}</p>
            <p>💰 ${barber.price} AZN</p>
            <p>⚡ Növbəti: ${barber.nextAvailable}</p>
            <button class="profile-btn" data-id="${barber.id}" data-type="barber">
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

function setupSorting() {
    const priceBtn = document.querySelector('.price');
    const ratingBtn = document.querySelector('.rating');
    const container = document.getElementById('barber-container');
    
    if (!priceBtn || !ratingBtn || !container) return;
    
    let priceSortAsc = true;
    let ratingSortAsc = true;
    
    // Qiymətə görə sırala
    priceBtn.addEventListener('click', () => {
        const cards = Array.from(container.querySelectorAll('.barber-card'));
        
        cards.sort((a, b) => {
            const priceA = parseFloat(a.dataset.price) || 0;
            const priceB = parseFloat(b.dataset.price) || 0;
            
            return priceSortAsc ? priceA - priceB : priceB - priceA;
        });
        
        // Kartları yenidən düz
        cards.forEach(card => container.appendChild(card));
        
        // İkonu dəyiş
        priceBtn.innerHTML = priceSortAsc ? '💰 ↓' : '💰 ↑';
        priceSortAsc = !priceSortAsc;
    });
    
    // Reytingə görə sırala
    ratingBtn.addEventListener('click', () => {
        const cards = Array.from(container.querySelectorAll('.barber-card'));
        
        cards.sort((a, b) => {
            const ratingA = parseFloat(a.dataset.rating) || 0;
            const ratingB = parseFloat(b.dataset.rating) || 0;
            
            return ratingSortAsc ? ratingB - ratingA : ratingA - ratingB;
        });
        
        // Kartları yenidən düz
        cards.forEach(card => container.appendChild(card));
        
        // İkonu dəyiş
        ratingBtn.innerHTML = ratingSortAsc ? '⭐ ↓' : '⭐ ↑';
        ratingSortAsc = !ratingSortAsc;
    });
}