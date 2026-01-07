document.addEventListener('DOMContentLoaded', function() {
    const reservationContainer = document.querySelector('.myReservation');
    const deleteBtn = document.querySelector('.deleteBtn');
    
    // Rezervasiya məlumatlarını yüklə
    function loadReservation() {
        try {
            const reservation = JSON.parse(localStorage.getItem('myReservation'));
            
            if (reservation && reservationContainer) {
                // Məlumatları göstər
                document.querySelector('.reservMaster').textContent = reservation.master || 'Məlumat yoxdur';
                document.querySelector('.reservName').textContent = reservation.userName || 'Məlumat yoxdur';
                document.querySelector('.reservEmail').textContent = reservation.userEmail || 'Məlumat yoxdur';
                document.querySelector('.reservDate').textContent = `${reservation.date || ''} 🕐 ${reservation.time || ''}`;
                document.querySelector('.reservServices').textContent = 
                    Array.isArray(reservation.services) ? reservation.services.join(', ') : 'Məlumat yoxdur';
                
                // Əgər əlaqə nömrəsi varsa
                if (reservation.userContact) {
                    const contactElement = document.querySelector('.reservContact');
                    if (contactElement) {
                        contactElement.textContent = reservation.userContact;
                    }
                }
            } else {
                reservationContainer.innerHTML = `
                    <h2>Sizin Rezerviniz</h2>
                    <p>Hal-hazırda aktiv rezervasiya yoxdur.</p>
                    <button onclick="window.location.href='../index.html'">Ana səhifəyə qayıt</button>
                `;
            }
        } catch (error) {
            console.error('Rezervasiya yüklənərkən xəta:', error);
            reservationContainer.innerHTML = `
                <h2>Xəta</h2>
                <p>Rezervasiya məlumatları yüklənərkən xəta baş verdi.</p>
                <button onclick="window.location.href='../index.html'">Ana səhifəyə qayıt</button>
            `;
        }
    }
    
    // Rezervasiyanı sil
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function() {
            if (confirm('Rezervasiyanızı ləğv etmək istədiyinizə əminsiniz?')) {
                localStorage.removeItem('myReservation');
                reservationContainer.innerHTML = `
                    <h2>Rezervasiya</h2>
                    <p>✅ Rezervasiya uğurla ləğv edildi</p>
                    <button onclick="window.location.href='../index.html'">Ana səhifəyə qayıt</button>
                `;
            }
        });
    }
    
    // Səhifə yükləndikdə rezervasiyanı yüklə
    loadReservation();
});