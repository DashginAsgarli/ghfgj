document.addEventListener('DOMContentLoaded', function() {
    // Kategoriyalara klik hadisəsi
    let categorys = document.querySelectorAll(".category");
    categorys.forEach(btn => {
        btn.addEventListener("click", () => {
            let category = btn.id;
            if (category) {
                window.location.href = `./pages/${category}.html`;
            }
        });
    });

    // Haqqında səhifəsinə keçid
    let aboutHome = document.querySelector(".about");
    if (aboutHome) {
        aboutHome.addEventListener("click", () => {
            window.location.href = "./pages/about.html";
        });
    }

    // Rezerv səhifəsinə keçid
    let myReserv = document.querySelector(".myReserv");
    if (myReserv) {
        myReserv.addEventListener("click", () => {
            window.location.href = "./pages/myreservation.html";
        });
    }

    // Axtarış funksiyası
    let input = document.querySelector(".search-home");
    let categoryHome = document.querySelectorAll(".category");
    let notFound = document.querySelector(".notFound");
    
    if (input && categoryHome.length > 0) {
        input.addEventListener("input", () => {
            let value = input.value.toLowerCase().trim();
            let found = false;
            
            categoryHome.forEach(e => {
                let text = e.querySelector("span").innerHTML.toLowerCase();
                if (text.includes(value)) {
                    e.style.display = "flex";
                    found = true;
                } else {
                    e.style.display = "none";
                }
            });
            
            if (value === "") {
                categoryHome.forEach(e => {
                    e.style.display = "flex";
                });
                if (notFound) notFound.style.display = "none";
                return;
            }
            
            if (notFound) {
                notFound.style.display = found ? "none" : "block";
            }
        });
    }
});