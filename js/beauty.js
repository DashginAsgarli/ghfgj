function fetchBeauty() {
    fetch("https://sevgi-backend-beauty.vercel.app/")
        .then(response => response.json())
        .then(data => {
            beautyData(data)
        })
}
function beautyData(beautys) {
    let beautyCard = document.querySelectorAll(".beauty-card")
    beautyCard.forEach((e, i) => {
        let data = beautys[i]
        e.dataset.price = data.price
        e.dataset.rating = data.rating

        e.innerHTML = `
    <img src="${data.photo}" alt="barberPhoto">
    <h3>${data.name}</h3>
    <p>Reytinq: ✨${data.rating}</p>
    <p>Rəy sayı: 💌${data.reviews}</p>
    <p>Ünvan: ${data.location}</p>
    <p>Qiymət: 💖 ${data.price}</p>
    <p>Növbəti mövcud vaxt:🌸${data.nextAvailable}</p>
    <button class="profileBeauty-btn  profile-btn" data-id=${data.id} data-type="beauty">Profilə keç</button>

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

let increase = true
let priceIcon = document.querySelector(".price")
let beautyContainer = document.querySelector("#beauty-container")
let rating = document.querySelector(".rating")


priceIcon.addEventListener("click", () => {
    let beautyCard = document.querySelectorAll(".beauty-card")
    let arrBeauty = Array.from(beautyCard)
    arrBeauty.sort((a, b) => {
        let price1 = parseFloat(a.dataset.price)
        let price2 = parseFloat(b.dataset.price)
        if (increase) {
            return price1 - price2
        }
        else {
            return price2 - price1
        }

    })
    arrBeauty.forEach(e => {
        beautyContainer.appendChild(e)
    })
    increase = !increase;
})

let decreasRating = true
rating.addEventListener("click", () => {
    let beautyCard = document.querySelectorAll(".beauty-card")

    let arrRating = Array.from(beautyCard)
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
        beautyContainer.appendChild(e)
    })
    decreasRating = !decreasRating
})


fetchBeauty()