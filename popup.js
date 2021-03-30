let main_campain_big_digit = document.querySelector("#main_campain_big_digit");
let xhr = new XMLHttpRequest();
let markup = {
    "posts": document.getElementById("newsList"),
    "videos": document.getElementById("videoList"),
    "shop": document.getElementById("shopList")
}
localStorage.bigDigit = localStorage.bigDigit ? localStorage.bigDigit : 1;
localStorage.bigDigitTemp = localStorage.bigDigitTemp > 20 ? localStorage.bigDigit - 21 : 1;

function getCampainCount() {

    xhr.open('GET', 'https://free.navalny.com/api/v1/maps/counters/', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            localStorage.bigDigit = JSON.parse(xhr.responseText).persons;
        }
    };
    xhr.onerror = function (e) {
        console.log(e);
    };
    xhr.send();
}

async function showDigit(digit = 0) {
    main_campain_big_digit.classList.replace("tracking-in-expand", "tracking-out-contract");
    await sleep(300);
    main_campain_big_digit.textContent = (digit * 1).toLocaleString("ru-Ru");
    console.log(digit.toLocaleString("ru-Ru"));
    main_campain_big_digit.classList.replace("tracking-out-contract", "tracking-in-expand");
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function showcontent() {
    Object.keys(markup).forEach((item) => {
        chrome.storage.local.get(item, function (oo) {
            let resultList = oo[item].results;
            let block = "";
            for (let result of resultList) {
                switch (item) {
                    case "posts":
                        block += `<a class="posts flip-in-ver-right" target="_blank" href="https://shtab.navalny.com/hq/${result.hq_slug}/${result.id}?utm_source=chrome_extention&utm_medium=navalny_informer&utm_campaign=freenavalny" title="${result.annotation}">
                                    <div class="media">
                                    <img src="${result.image}">
                                    </div>
                                    <div class="content">
                                    <span class="city">${result.city}</span>                                        
                                        <h5>${result.title}</h5>                                       
                                    </div>
                              </a>`;

                        break;
                    case "videos":
                        block += `<a class="videos" target="_blank" href="https://www.youtube.com/watch?v=${result.url.split(/v\/|v=|youtu\.be\//)[1].split(/[?&]/)[0]}?utm_source=chrome_extention&utm_medium=navalny_informer&utm_campaign=freenavalny" title="${result.annotation}">
                                    <div class="media">
                                        <img src="https://i3.ytimg.com/vi/${result.url.split(/v\/|v=|youtu\.be\//)[1].split(/[?&]/)[0]}/mqdefault.jpg">
                                    </div>
                                    <div class="content">
                                    <span class="city">${result.city}</span>
                                        <h6>${result.title}</h6>                                        
                                    </div>
                              </a>`;

                        break;
                    case "shop":
                        block += `<a class="items" title="${result.title}" target="_blank" href="https://shop.navalny.com/${result.link}?utm_source=chrome_extention&utm_medium=navalny_informer&utm_campaign=freenavalny">
                    <img src="${result.image}">
                    </a>`;

                        break;
                }
            }
            markup[item].innerHTML = block;
        });
    });
}

getCampainCount();
showDigit(localStorage.bigDigitTemp);
showcontent();

let refreshCount = setInterval(function () {
    getCampainCount();
}, 45000);

let digitAnimate = setInterval(function () {
    if (localStorage.bigDigit > localStorage.bigDigitTemp) {

        // console.log("------------------");
        // console.log(localStorage.bigDigit);
        // console.log(localStorage.bigDigitTemp);
        let bigDigitTempOld = localStorage.bigDigitTemp;

        if ((parseInt(localStorage.bigDigitTemp) - localStorage.bigDigit) > 1) {
            localStorage.bigDigitTemp = Math.floor((localStorage.bigDigit - localStorage.bigDigitTemp) * 0.45) + parseInt(localStorage.bigDigitTemp);
        } else {
            localStorage.bigDigitTemp = localStorage.bigDigit;
        }
        if (bigDigitTempOld != localStorage.bigDigitTemp) return showDigit(localStorage.bigDigitTemp);
    }
}, 1000);

chrome.action.setBadgeText({
    text: ""
});

window.addEventListener('unload', function (event) {
    clearInterval(digitAnimate);
    clearInterval(refreshCount);
});