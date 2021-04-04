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
 // @todo дописать и русифицировать функцию по подобию показа времени в соцсетях
// function humanDateTime(tdate) {
//     var system_date = new Date(Date.parse(tdate));
//     var user_date = new Date();
//     var diff = Math.floor((user_date - system_date) / 1000);
//     if (diff <= 90) {return "только что";}
//     if (diff <= 3540) {return Math.round(diff / 60) + " мин. назад";}
//     if (diff <= 5400) {return "час назад";}
//     if (diff <= 86400) {return Math.round(diff / 3600) + " часов назад";}
//     if (diff <= 129600) {return "вчера";}
//     if (diff < 604800) {return Math.round(diff / 86400) + " дней назад";}
//     if (diff <= 777600) {return "неделю назад";}
//     return system_date;
// }
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
                let image = result.image;
                let hq_slug = result.hq_slug;
                let id = result.id;
                let city = result.city;
                let avatar = result.avatar;
                let annotation = result.annotation?result.annotation.replace(/((?:.*?\s){5}.*?)/umg,`$1\n`):"";
                let title = result.title;
                let pubdate = new Date(result.pubdate).toLocaleString("ru",{month: 'long',day: 'numeric'});
                switch (item) {
                    case "posts":
                        block += `<a class="posts flip-in-ver-right" target="_blank" href="https://shtab.navalny.com/hq/${hq_slug}/${id}?utm_source=chrome_extention&utm_medium=navalny_informer&utm_campaign=freenavalny" title="${annotation}">
                                    <div class="media">
                                    <img src="${image}">
                                    </div>
                                    <div class="content">
                                    <div class="hq-block">
                                        <div class="avatar" style="background-image: url('${avatar}')">
                                        </div>
                                        <div><span class="city">${city}</span>
                                        <div class="pubdate">${pubdate}</div></div>
                                    </div>
                                        <h5 class="black">${title}</h5>
                                    </div>
                              </a>`;

                        break;
                    case "videos":
                        block += `<a class="videos" target="_blank" href="https://www.youtube.com/watch?v=${result.url.split(/v\/|v=|youtu\.be\//)[1].split(/[?&]/)[0]}?utm_source=chrome_extention&utm_medium=navalny_informer&utm_campaign=freenavalny" title="${annotation}">
                                    <div class="media">
                                        <img src="https://i3.ytimg.com/vi/${result.url.split(/v\/|v=|youtu\.be\//)[1].split(/[?&]/)[0]}/mqdefault.jpg">
                                    </div>
                                    <div class="content">
                                    <div class="hq-block">
                                    <div><span class="city">${city}</span>
                                    <div class="pubdate">${pubdate}</div></div>
                                </div>
                                        <h6 class="black">${title}</h6>                                        
                                    </div>
                              </a>`;

                        break;
                    case "shop":
                        block += `<a class="items" title="${title}" target="_blank" href="https://shop.navalny.com/${result.link}?utm_source=chrome_extention&utm_medium=navalny_informer&utm_campaign=freenavalny">
                    <img src="${image}">
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