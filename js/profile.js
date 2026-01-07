//Bu hise chatdandi anlamadim
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const type = params.get("type");
//Bu hise chatdandi tam anlamadim(problemimi hell etmek ucun elave elemisem)


let link = ""
if (type === "barber") {
  link = "https://sevgi-backend-barber.vercel.app/"
}
else if (type === "beauty") {
  link = "https://sevgi-backend-beauty.vercel.app/"
}
else if (type === "master") {
  link = "https://sevgi-backend-master.vercel.app/"
}


fetch(link)
  .then(response => response.json())
  .then(data => {
    let person = data.find(i => i.id == id)
    profileData(person)
  })




let profileContainer = document.querySelector(".profile");
let profil = document.querySelector("#profil")

function profileData(person) {
  profileContainer.classList.add(type)

  if (type === "barber" || type === "beauty") {
    personBarberorBeauty(person)
    Schedule(person)
    priceCalculate()

  }
  else if (type == "master") {
    masterPerson(person)
  }
}

let reserveCard = document.querySelector(".reserve-card")

function personBarberorBeauty(person) {
  profil.innerHTML = `
<div class="profil-header  ${type}">  
  <img src=${person.photo} alt="profil sekli">
  <div class="profil-data ">
    <h2 class="profileName">${person.name}</h2>
    <p class="barberRaiting">⭐${person.rating} (${person.reviews} rəy)</p>
    <p class="experience ">⏳${person.experience} il təcrübə</p>
    <p class="location ">📍${person.location}</p>
    <a href="tel:${person.phone}" class="contact ${type}">Əlaqə</a>
  </div>
</div>


<div class="services ${type}">
${person.services.map(e =>
    `<div class="service-box ${type}" data-price="${e.price}" >
   <span>${e.name}</span>  
   <span>${e.price} AZN</span>
   </div>`).join('')}
  </div>

<div class="sum ${type}">Cəm: <span id="sum-price">0</span> AZN</div>


<div class="schedule">
  <h3>Tarix seçin</h3>
  <div class="dates">
  ${Object.keys(person.schedule).map((date, i) => `<button class="date-btn" data-date="${date}">${date}</button>`).join('')}
  </div>
  <div class="times"></div>
  <button class="rezerv-btn">Rezerv et</button>
</div>
`

  let reserveBtn = document.querySelector(".rezerv-btn")


  reserveBtn.addEventListener("click", () => {
    let selectService = document.querySelectorAll(".service-box.select")
    let dateSelect = document.querySelector(".dates button.select")
    let timeSelect = document.querySelector(".times button.select")

    if (!selectService.length || !dateSelect || !timeSelect) {
      alert("⚠️Məlumatlar tam doldurulmayıb!!!⚠️")
      return
    }



    document.querySelector(".master-name").innerHTML = document.querySelector(".profileName").innerHTML
    document.querySelector(".date-time").innerHTML = `📅${dateSelect.innerHTML}    🕐${timeSelect.innerHTML}`
    let sumEnd = Number(document.getElementById("sum-price").innerHTML)
    document.querySelector(".total").innerHTML = (((sumEnd * 5) / 100) + sumEnd) + " AZN";
    reserveCard.style.display = "flex"

  })
}


function masterPerson(person) {
  profil.innerHTML = `
<div class="profil-header  ${type}"> 
<img src=${person.photo} alt="profil sekli">
<div class="profil-data ">
<h2 class="barberName">${person.name}</h2>
<p class="experience ">⏳${person.experience} il təcrübə</p>
<p class="special ">${person.speciality}</p>
<p class="contact-master ">${person.contact}</p>
<a href="tel:${person.phone}" class="contact ${type}">Əlaqə</a>
</div>
</div> 
`}

function priceCalculate() {
  let sumPrice = document.querySelector("#sum-price")
  let serviceBox = document.querySelectorAll(".service-box")
  let selected = []

  serviceBox.forEach(e => {
    e.addEventListener("click", () => {
      e.classList.toggle("select")

      let price = Number(e.dataset.price)
      if (e.classList.contains("select")) {
        selected.push(price)
      }
      else {
        let index = selected.indexOf(price)
        if (index > -1) {
          selected.splice(index, 1)    //YouTube izzah
        }
      }
      let sum = 0
      for (let i = 0; i < selected.length; i++) {
        sum += selected[i]
      }
      sumPrice.innerHTML = sum
    })
  })
}



function Schedule(person) {
  let dateBtn = document.querySelectorAll(".date-btn")
  let timesDiv = document.querySelector(".times")
  let selectDate = ""
  let selectTime = ""

  dateBtn.forEach(e => {
    e.addEventListener("click", () => {
      if (selectDate) {
        selectDate.classList.remove("select")
        selectTime = ""
      }
      if (e.classList.contains("select")) {
        e.classList.remove("select")
        selectDate = ""
        selectTime = ""
      }
      else {
        e.classList.add("select")
        selectDate = e
      }


      timesDiv.innerHTML = ""
      if (selectDate) {
        let date = e.innerHTML
        let time = person.schedule[date]

        time.forEach(e => {
          let timeBtn = document.createElement("button")
          timeBtn.innerHTML = e.time
          if (e.booked) {
            timeBtn.disabled = true
          }
          timeBtn.addEventListener("click", () => {
            // evvelki secilmis saat varsa rengi cixart
            let allTimeBtn = document.querySelectorAll(".times button")
            allTimeBtn.forEach(e => {
              e.classList.remove("select")
            })
            // yeni secilmis saat
            selectTime = e.time
            timeBtn.classList.add("select")
          })

          timesDiv.appendChild(timeBtn)
        })
      }
    })
  })
}




let deleteBtn = document.querySelector(".delete-btn")
let payCard = document.querySelector(".pay-card")
let receiptCard = document.querySelector(".receipt-card")

deleteBtn.addEventListener("click", () => {
  reserveCard.style.display = "none"
})

let payCash = document.querySelector(".pay-cash")
payCash.addEventListener("click", () => {
  alert("20% depozit ödəməlisiniz")
  reserveCard.style.display = "none"
})



payCard.addEventListener("click", () => {
  let userName = document.querySelector(".userName").value
  let userContact = document.querySelector(".userContact").value
  let userEmail = document.querySelector(".userEmail").value


  if (!userName || !userContact) {
    alert("⚠️ Zəhmət olmasa bütün istifadəçi məlumatlarını doldurun!")
    return
  }
  let dateSelect = document.querySelector(".dates button.select")
  let timeSelect = document.querySelector(".times button.select")
  let selectService = document.querySelectorAll(".service-box.select")

  let serviceNames = []
  selectService.forEach(e => {
    serviceNames.push(e.querySelector("span").innerHTML)
  })

  let myReservation = {
    master: document.querySelector(".profileName").innerHTML,
    userName,
    userEmail: document.querySelector(".userEmail").value,
    // userContact,
    services: serviceNames,
    date: dateSelect.textContent,
    time: timeSelect.textContent,
  }
  localStorage.setItem("myReservation", JSON.stringify(myReservation))


  document.querySelector(".receiptServices").innerHTML = serviceNames.join(", ")
  document.querySelector(".userReceipt").innerHTML = userName
  document.querySelector(".userContactReceipt").innerHTML = userContact
  document.querySelector(".userMail").innerHTML = userEmail
  document.querySelector(".receiptMaster").innerHTML = document.querySelector(".profileName").innerHTML
  document.querySelector(".receiptDate").innerHTML = `📅 ${dateSelect.textContent} 🕐 ${timeSelect.textContent}`
  let sumEnd = Number(document.querySelector("#sum-price").innerHTML)
  document.querySelector(".receipTotal").innerHTML = (((sumEnd * 5) / 100) + sumEnd) + " AZN"



  reserveCard.style.display = "none"
  receiptCard.style.display = "flex"

  document.querySelector(".go-home").addEventListener("click", () => {
    window.location.href = "/index.html";
  })
})