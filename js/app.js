let categorys = document.querySelectorAll(".category")
categorys.forEach(btn => {
    btn.addEventListener("click", () => {
        let category = btn.id;
        window.location.href = `pages/${category}.html`;
    })
})

let aboutHome = document.querySelector(".about")
aboutHome.addEventListener("click", () => {
    window.location.href = "pages/about.html"
})


let input = document.querySelector(".search-home")
let categoryHome = document.querySelectorAll(".category")
let categories = document.querySelector(".categorys")

let notFound = document.createElement("p")
notFound.className = "notFound"
categories.appendChild(notFound)
notFound.innerHTML = "⚠️ Uyğun nəticə tapılmadı"


input.addEventListener("input", () => {
    let value = input.value.toLowerCase().trim()
    let found = false
    categoryHome.forEach(e => {
        let text = e.querySelector("span").innerHTML.toLowerCase()
        if (text.includes(value)) {
            e.style.display = ""
            found = true
        }
        else {
            e.style.display = "none"
        }
    })
    if (value == "") {
        categoryHome.forEach(e => {
            e.style.display = ""
        })
        notFound.style.display = "none"
        return
    }
    notFound.style.display = found ? "none" : "block";

})