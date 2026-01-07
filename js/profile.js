// URL parametrlərini al
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const type = params.get("type");

// Xəta yoxlaması
if (!id || !type) {
    console.error("ID və ya Type parametri yoxdur!");
    alert("Xəta baş verdi. Əsas səhifəyə yönləndirilirsiniz.");
    window.location.href = "../index.html";
}

// API linklərini təyin et
const API_URLS = {
    barber: "https://sevgi-backend-barber.vercel.app/",
    beauty: "https://sevgi-backend-beauty.vercel.app/",
    master: "https://sevgi-backend-master.vercel.app/"
};

// Əsas funksiya
async function loadProfile() {
    try {
        const response = await fetch(API_URLS[type]);
        if (!response.ok) throw new Error(`API xətası: ${response.status}`);
        
        const data = await response.json();
        const person = data.find(item => item.id == id);
        
        if (!person) {
            throw new Error("Profil tapılmadı");
        }
        
        renderProfile(person);
    } catch (error) {
        console.error("Yükləmə xətası:", error);
        alert("Profil yüklənərkən xəta baş verdi. Əsas səhifəyə qayıdılır.");
        window.location.href = "../index.html";
    }
}

// Profil məlumatlarını render et
function renderProfile(person) {
    const profileContainer = document.getElementById("profil");
    const body = document.body;
    
    // Body-ə class əlavə et
    body.classList.add(type);
    
    if (type === "barber" || type === "beauty") {
        renderBarberBeautyProfile(person);
        setupSchedule(person);
        setupPriceCalculation();
        setupReservationEvents(person);
    } else if (type === "master") {
        renderMasterProfile(person);
    }
}

// Barber və Beauty profili
function renderBarberBeautyProfile(person) {
    const profileHTML = `
        <div class="profil-header ${type}">  
            <img src="${person.photo}" alt="profil sekli" onerror="this.src='../images/default-avatar.png'">
            <div class="profil-data">
                <h2 class="profileName">${person.name}</h2>
                <p class="barberRaiting">⭐ ${person.rating} (${person.reviews} rəy)</p>
                <p class="experience">⏳ ${person.experience} il təcrübə</p>
                <p class="location">📍 ${person.location}</p>
                <a href="tel:${person.phone}" class="contact ${type}">Əlaqə</a>
            </div>
        </div>

        <div class="services ${type}">
            ${person.services.map(service => `
                <div class="service-box ${type}" data-price="${service.price}">
                    <span>${service.name}</span>  
                    <span>${service.price} AZN</span>
                </div>
            `).join('')}
        </div>

        <div class="sum ${type}">Cəm: <span id="sum-price">0</span> AZN</div>

        <div class="schedule">
            <h3>Tarix seçin</h3>
            <div class="dates">
                ${Object.keys(person.schedule || {}).map(date => 
                    `<button class="date-btn" data-date="${date}">${date}</button>`
                ).join('')}
            </div>
            <div class="times"></div>
            <button class="rezerv-btn">Rezerv et</button>
        </div>
    `;
    
    document.getElementById("profil").innerHTML = profileHTML;
}

// Master profili
function renderMasterProfile(person) {
    const profileHTML = `
        <div class="profil-header ${type}"> 
            <img src="${person.photo}" alt="profil sekli" onerror="this.src='../images/default-avatar.png'">
            <div class="profil-data">
                <h2 class="barberName">${person.name}</h2>
                <p class="experience">⏳ ${person.experience} il təcrübə</p>
                <p class="special">${person.speciality}</p>
                <p class="contact-master">${person.contact}</p>
                <a href="tel:${person.phone}" class="contact ${type}">Əlaqə</a>
            </div>
        </div> 
    `;
    
    document.getElementById("profil").innerHTML = profileHTML;
}

// Qiymət hesablanması
function setupPriceCalculation() {
    const sumPriceElement = document.getElementById("sum-price");
    const serviceBoxes = document.querySelectorAll(".service-box");
    const selectedServices = [];
    
    serviceBoxes.forEach(box => {
        box.addEventListener("click", () => {
            box.classList.toggle("select");
            const price = parseFloat(box.dataset.price);
            
            if (box.classList.contains("select")) {
                selectedServices.push(price);
            } else {
                const index = selectedServices.indexOf(price);
                if (index > -1) {
                    selectedServices.splice(index, 1);
                }
            }
            
            const total = selectedServices.reduce((sum, price) => sum + price, 0);
            sumPriceElement.textContent = total;
        });
    });
}

// Tarix və saat seçimi
function setupSchedule(person) {
    const datesContainer = document.querySelector(".dates");
    const timesContainer = document.querySelector(".times");
    let selectedDate = null;
    let selectedTime = null;
    
    if (!datesContainer || !person.schedule) return;
    
    datesContainer.addEventListener("click", (e) => {
        if (!e.target.classList.contains("date-btn")) return;
        
        const dateBtn = e.target;
        const date = dateBtn.dataset.date;
        
        // Əvvəlki seçimi təmizlə
        document.querySelectorAll(".date-btn.select").forEach(btn => btn.classList.remove("select"));
        document.querySelectorAll(".times button.select").forEach(btn => btn.classList.remove("select"));
        
        // Yeni seçimi qeyd et
        dateBtn.classList.add("select");
        selectedDate = date;
        selectedTime = null;
        
        // Saatları göstər
        timesContainer.innerHTML = "";
        const times = person.schedule[date] || [];
        
        times.forEach(timeSlot => {
            const timeBtn = document.createElement("button");
            timeBtn.textContent = timeSlot.time;
            timeBtn.disabled = timeSlot.booked;
            timeBtn.classList.toggle("booked", timeSlot.booked);
            
            timeBtn.addEventListener("click", () => {
                document.querySelectorAll(".times button.select").forEach(btn => btn.classList.remove("select"));
                timeBtn.classList.add("select");
                selectedTime = timeSlot.time;
            });
            
            timesContainer.appendChild(timeBtn);
        });
    });
}

// Rezervasiya hadisələri
function setupReservationEvents(person) {
    const reserveBtn = document.querySelector(".rezerv-btn");
    const reserveCard = document.querySelector(".reserve-card");
    const deleteBtn = document.querySelector(".delete-btn");
    const payCardBtn = document.querySelector(".pay-card");
    const payCashBtn = document.querySelector(".pay-cash");
    const receiptCard = document.querySelector(".receipt-card");
    const goHomeBtn = document.querySelector(".go-home");
    
    if (!reserveBtn) return;
    
    // Rezerv et butonu
    reserveBtn.addEventListener("click", () => {
        const selectedServices = document.querySelectorAll(".service-box.select");
        const selectedDate = document.querySelector(".date-btn.select");
        const selectedTime = document.querySelector(".times button.select");
        
        if (!selectedServices.length || !selectedDate || !selectedTime) {
            alert("⚠️ Xahiş edirik xidmət, tarix və saat seçin!");
            return;
        }
        
        // Məlumatları doldur
        document.querySelector(".master-name").textContent = 
            document.querySelector(".profileName").textContent;
        document.querySelector(".date-time").textContent = 
            `📅 ${selectedDate.textContent} 🕐 ${selectedTime.textContent}`;
        
        const sumEnd = parseFloat(document.getElementById("sum-price").textContent);
        const totalWithCommission = sumEnd + (sumEnd * 0.05);
        document.querySelector(".total").textContent = `${totalWithCommission.toFixed(2)} AZN`;
        
        reserveCard.style.display = "flex";
    });
    
    // Ləğv et butonu
    deleteBtn.addEventListener("click", () => {
        reserveCard.style.display = "none";
    });
    
    // Nağd ödəniş
    payCashBtn.addEventListener("click", () => {
        alert("Nağd ödəniş üçün 20% depozit ödəməlisiniz.");
        reserveCard.style.display = "none";
        // Nağd ödəniş məntiqi burada əlavə edilə bilər
    });
    
    // Kartla ödəniş
    payCardBtn.addEventListener("click", () => {
        const userName = document.querySelector(".userName").value.trim();
        const userContact = document.querySelector(".userContact").value.trim();
        const userEmail = document.querySelector(".userEmail").value.trim();
        const selectedDate = document.querySelector(".date-btn.select");
        const selectedTime = document.querySelector(".times button.select");
        const selectedServices = document.querySelectorAll(".service-box.select");
        
        // Validasiya
        if (!userName || !userContact) {
            alert("⚠️ Zəhmət olmasa adınızı və əlaqə nömrənizi daxil edin!");
            return;
        }
        
        // Xidmət adlarını topla
        const serviceNames = Array.from(selectedServices).map(service => 
            service.querySelector("span").textContent.split(' AZN')[0]
        );
        
        // Rezervasiya məlumatlarını yadda saxla
        const reservation = {
            master: document.querySelector(".profileName").textContent,
            userName,
            userEmail,
            userContact,
            services: serviceNames,
            date: selectedDate.textContent,
            time: selectedTime.textContent,
            total: document.querySelector(".total").textContent,
            timestamp: new Date().toISOString()
        };
        
        try {
            localStorage.setItem("myReservation", JSON.stringify(reservation));
            console.log("Rezervasiya uğurla yadda saxlandı:", reservation);
        } catch (error) {
            console.error("LocalStorage xətası:", error);
            alert("Xəta baş verdi, zəhmət olmasa yenidən cəhd edin.");
            return;
        }
        
        // Çek məlumatlarını doldur
        document.querySelector(".receiptServices").textContent = serviceNames.join(", ");
        document.querySelector(".userReceipt").textContent = userName;
        document.querySelector(".userContactReceipt").textContent = userContact;
        document.querySelector(".userMail").textContent = userEmail || "Təyin edilməyib";
        document.querySelector(".receiptMaster").textContent = reservation.master;
        document.querySelector(".receiptDate").textContent = `📅 ${reservation.date} 🕐 ${reservation.time}`;
        document.querySelector(".receipTotal").textContent = reservation.total;
        
        // Kartları dəyişdir
        reserveCard.style.display = "none";
        receiptCard.style.display = "flex";
    });
    
    // Ana səhifəyə qayıt
    if (goHomeBtn) {
        goHomeBtn.addEventListener("click", () => {
            window.location.href = "../index.html";
        });
    }
}

// Səhifə yükləndikdə profili yüklə
document.addEventListener('DOMContentLoaded', loadProfile);