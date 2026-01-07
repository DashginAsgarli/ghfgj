document.addEventListener('DOMContentLoaded', function() {
    fetchMaster();
    setupMasterSorting();
});

async function fetchMaster() {
    try {
        const response = await fetch('https://sevgi-backend-master.vercel.app/');
        if (!response.ok) throw new Error('API cavab vermədi');
        
        const data = await response.json();
        masterData(data);
    } catch (error) {
        console.error('Master məlumatları yüklənərkən xəta:', error);
        document.getElementById('master-container').innerHTML = 
            '<p class="error">Məlumatlar yüklənərkən xəta baş verdi. Zəhmət olmasa yenidən yoxlayın.</p>';
    }
}

function masterData(masters) {
    const container = document.getElementById('master-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    masters.forEach((master, index) => {
        const card = document.createElement('div');
        card.className = 'master-card';
        card.dataset.rating = master.rating;
        
        card.innerHTML = `
            <img src="${master.photo}" alt="${master.name}" onerror="this.src='../images/default-avatar.png'">
            <h3>${master.name}</h3>
            <p>⭐ ${master.rating} (${master.reviews} rəy)</p>
            <p>🔧 ${master.speciality}</p>
            <p>📞 ${master.contact}</p>
            <p>⚡ Növbəti: ${master.nextAvailable}</p>
            <button class="profile-btn" data-id="${master.id}" data-type="master">
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

function setupMasterSorting() {
    const ratingBtn = document.querySelector('.rating');
    const container = document.getElementById('master-container');
    
    if (!ratingBtn || !container) return;
    
    let ratingSortAsc = true;
    
    // Reytingə görə sırala
    ratingBtn.addEventListener('click', () => {
        const cards = Array.from(container.querySelectorAll('.master-card'));
        
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