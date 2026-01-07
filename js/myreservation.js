document.addEventListener('DOMContentLoaded', function() {
    const reservationContainer = document.querySelector('.myReservation');
    const deleteBtn = document.querySelector('.deleteBtn');
    
    // Rezervasiya məlumatlarını yüklə
    function loadReservation() {
        try {
            console.log("Rezervasiya məlumatları yüklənir...");
            
            // Əvvəlcə ən son rezervasiyanı yoxla
            let reservation = JSON.parse(localStorage.getItem("latestReservation"));
            
            // Əgər yoxdursa, bütün rezervasiyalardan ən sonuncunu götür
            if (!reservation) {
                const allReservations = JSON.parse(localStorage.getItem("masterhubReservations")) || [];
                if (allReservations.length > 0) {
                    reservation = allReservations[allReservations.length - 1];
                }
            }
            
            console.log("Tapılan rezervasiya:", reservation);
            
            if (reservation && reservationContainer) {
                // HTML strukturunu yarat
                reservationContainer.innerHTML = `
                    <h2>Sizin Rezervasiyanız</h2>
                    <div class="reservation-details">
                        <p><strong>Xidmət verən:</strong> <span class="reservMaster">${reservation.master || 'Məlumat yoxdur'}</span></p>
                        <p><strong>Müştəri adı:</strong> <span class="reservName">${reservation.userName || 'Məlumat yoxdur'}</span></p>
                        <p><strong>Email:</strong> <span class="reservEmail">${reservation.userEmail || 'Məlumat yoxdur'}</span></p>
                        <p><strong>Əlaqə nömrəsi:</strong> <span class="reservContact">${reservation.userContact || 'Məlumat yoxdur'}</span></p>
                        <p><strong>Tarix & Saat:</strong> <span class="reservDate">📅 ${reservation.date || ''} 🕐 ${reservation.time || ''}</span></p>
                        <p><strong>Xidmətlər:</strong> <span class="reservServices">${Array.isArray(reservation.services) ? reservation.services.join(', ') : 'Məlumat yoxdur'}</span></p>
                        <p><strong>Ümumi məbləğ:</strong> <span class="reservTotal">${reservation.total || '0 AZN'}</span></p>
                        <p><strong>Status:</strong> <span class="reservStatus">${reservation.status || 'Təsdiqləndi'}</span></p>
                    </div>
                    <div class="reservation-actions">
                        <button class="deleteBtn">Rezervasiyanı ləğv et</button>
                        <button class="goHomeBtn" onclick="window.location.href='../index.html'">Ana səhifəyə qayıt</button>
                    </div>
                `;
                
                // Yeni delete butonu əlavə et
                const newDeleteBtn = reservationContainer.querySelector('.deleteBtn');
                if (newDeleteBtn) {
                    newDeleteBtn.addEventListener('click', deleteReservation);
                }
                
            } else {
                reservationContainer.innerHTML = `
                    <div class="no-reservation">
                        <h2>📋 Sizin Rezervasiyanız</h2>
                        <p class="empty-message">Hal-hazırda aktiv rezervasiya yoxdur.</p>
                        <div class="actions">
                            <button onclick="window.location.href='../index.html'">Ana səhifəyə qayıt</button>
                            <button onclick="window.location.href='barber.html'">Xidmət axtar</button>
                        </div>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Rezervasiya yüklənərkən xəta:', error);
            reservationContainer.innerHTML = `
                <div class="error-message">
                    <h2>⚠️ Xəta</h2>
                    <p>Rezervasiya məlumatları yüklənərkən xəta baş verdi.</p>
                    <p><small>${error.message}</small></p>
                    <button onclick="window.location.href='../index.html'">Ana səhifəyə qayıt</button>
                </div>
            `;
        }
    }
    
    // Rezervasiyanı sil
    function deleteReservation() {
        if (confirm('Rezervasiyanızı ləğv etmək istədiyinizə əminsiniz?')) {
            try {
                // Latest rezervasiyanı sil
                localStorage.removeItem("latestReservation");
                
                // Bütün rezervasiyalardan ən sonuncunu sil
                const allReservations = JSON.parse(localStorage.getItem("masterhubReservations")) || [];
                if (allReservations.length > 0) {
                    allReservations.pop(); // Ən son rezervasiyanı sil
                    localStorage.setItem("masterhubReservations", JSON.stringify(allReservations));
                }
                
                // UI yenilə
                reservationContainer.innerHTML = `
                    <div class="success-message">
                        <h2>✅ Rezervasiya ləğv edildi</h2>
                        <p>Rezervasiyanız uğurla ləğv edildi.</p>
                        <div class="actions">
                            <button onclick="window.location.href='../index.html'">Ana səhifəyə qayıt</button>
                            <button onclick="window.location.href='barber.html'">Yeni rezervasiya</button>
                        </div>
                    </div>
                `;
                
                console.log("Rezervasiya uğurla silindi");
                
            } catch (error) {
                console.error('Rezervasiya silinərkən xəta:', error);
                alert('Rezervasiya silinərkən xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.');
            }
        }
    }
    
    // Səhifə yükləndikdə rezervasiyanı yüklə
    loadReservation();
    
    // Həmçinin localStorage dəyişikliklərini dinlə
    window.addEventListener('storage', function(e) {
        console.log('LocalStorage dəyişdi:', e.key);
        if (e.key === 'latestReservation' || e.key === 'masterhubReservations') {
            loadReservation();
        }
    });
});