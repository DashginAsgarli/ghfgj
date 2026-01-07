function fetchMaster() {
    fetch("https://sevgi-backend-master.vercel.app/")
        .then(response => response.json())
        .then(data => {
            masterData(data)
        })
}

let masterCard = document.querySelectorAll(".master-card")
function masterData(masters) {
    masterCard.forEach((e, i) => {
        let data = masters[i]
        e.dataset.rating = data.rating
        e.innerHTML = `
    <img src="${data.photo}" alt="masterPhoto">
    <h3>${data.name}</h3>
    <p>Reytinq: ⭐${data.rating}</p>
    <p>Rəy sayı: 📝${data.reviews}</p>
    <p>Xidmət: ${data.speciality}</p>
    <p>Əlaqə: 📞${data.contact}</p>
    <p>Növbəti mövcud vaxt:⚡${data.nextAvailable}</p>
    <button class="profileMaster-btn profile-btn" data-id=${data.id} data-type="master">Profilə keç</button>

    `
        let profileBtn = document.querySelectorAll(".profile-btn")
        profileBtn.forEach(btn => {
            btn.addEventListener("click", (e) => {
                let id = e.currentTarget.dataset.id
                let type = e.currentTarget.dataset.type
                location.href = `profile.html?id=${id}&type=${type}`
            })
        })

    })
}

let masterContainer = document.querySelector("#master-container")
let rating = document.querySelector(".rating")
let decreasRating = true
rating.addEventListener("click", () => {
    let masterCard = document.querySelectorAll(".master-card")

    let arrRating = Array.from(masterCard)
    arrRating.sort((a, b) => {
        let priceR1 = parseFloat(a.dataset.rating)
        let priceR2 = parseFloat(b.dataset.rating)
        if (decreasRating) {
            return priceR2 - priceR1
        }
        else {
            return priceR1 - priceR2
        }

    })
    arrRating.forEach(e => {
        masterContainer.appendChild(e)
    })
    decreasRating = !decreasRating
})

fetchMaster()