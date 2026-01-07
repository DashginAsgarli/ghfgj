let myReserv = document.querySelector(".myReserv")
if (myReserv) {
    myReserv.addEventListener("click", () => {
        window.location.href = "../pages/myreservation.html"
    })
}
window.addEventListener("DOMContentLoaded", () => {
    let reservation = JSON.parse(localStorage.getItem("myReservation"));
 if (reservation) {
    document.querySelector(".reservMaster").textContent = reservation.master;
    document.querySelector(".reservName").textContent = reservation.userName;
    document.querySelector(".reservEmail").textContent = reservation.userEmail;
    // document.querySelector(".reservContact").textContent = reservation.userContact;
    document.querySelector(".reservDate").textContent = `${reservation.date} && 🕐 ${reservation.time}`
    document.querySelector(".reservServices").textContent = reservation.services.join(", ")

  } 

    let deleteBtn = document.querySelector(".deleteBtn")
    deleteBtn.addEventListener("click", () => {
        localStorage.removeItem("myReservation")
        let myReservation = document.querySelector(".myReservation")
        myReservation.innerHTML = "<p>Rezervasiya ləğv edildi</p>"
    })

})