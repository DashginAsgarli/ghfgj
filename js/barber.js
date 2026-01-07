function fetchBarber() {
    fetch("https://sevgi-backend-barber.vercel.app/")
        .then(response => response.json())
        .then(data => {
            barberData(data)
        })
}
function barberData(barbers) {
    let barberCard = document.querySelectorAll(".barber-card")
    barberCard.forEach((e, i) => {
        let data = barbers[i]
        e.dataset.price = data.price
        e.dataset.rating = data.rating

        e.innerHTML = `
            <img src="${data.photo}" alt="barberPhoto">
            <h3>${data.name}</h3>
            <p>Reytinq: ⭐${data.rating}</p>
            <p>Rəy sayı: 📝${data.reviews}</p>
            <p>Ünvan: ${data.location}</p>
            <p>Qiymət: 💰${data.price}</p>
            <p>Növbəti mövcud vaxt:⚡${data.nextAvailable}</p>
            <button class="profileBarber-btn  profile-btn" data-type="barber" data-id=${data.id}>Profilə keç</button>
        `

        let profileBtn = document.querySelectorAll(".profile-btn")
        profileBtn.forEach(btn => {
            btn.addEventListener("click", (e) => {
                let id = e.currentTarget.dataset.id  //kliklenmis btn elementi
                let type = e.currentTarget.dataset.type
                location.href = `profile.html?id=${id}&type=${type}`
            })
        })
    })
}




let price = document.querySelector(".price")
let barberContainer = document.querySelector("#barber-container")
let rating = document.querySelector(".rating")
let barberCard = document.querySelectorAll(".barber-card")


let increase = true
price.addEventListener("click", () => {
    let arr = Array.from(barberCard)
    arr.sort((a, b) => {
        let price1 = parseFloat(a.dataset.price)
        let price2 = parseFloat(b.dataset.price)
        if (increase) {
            return price1 - price2
        }
        else {
            return price2 - price1
        }

    })
    arr.forEach(e => {
        barberContainer.appendChild(e)
    })
    increase = !increase;
})


let decreasRating = true
rating.addEventListener("click", () => {
    let arrRating = Array.from(barberCard)
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
        barberContainer.appendChild(e)
    })
    decreasRating = !decreasRating
})
fetchBarber()