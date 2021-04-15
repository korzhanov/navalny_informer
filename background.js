let api = {
  "posts": "https://shtab.navalny.com/api/posts",
  "videos": "https://shtab.navalny.com/api/videos/",
  "shop": "https://shop.navalny.com/api/items/"
};

chrome.action.setBadgeBackgroundColor({
  color: "#ff3000"
});

try {
  chrome.runtime.onInstalled.addListener(() => {
    getData();
    console.log('Привет, это Навальный! Информер главного сайта в рунете');
  });
  chrome.alarms.create("informEvery10min", {
    periodInMinutes: 10
  });

  chrome.alarms.onAlarm.addListener(function (alarm) {
    if (alarm.name === "informEvery10min") {
      getData();
    }
  });

} catch (e) {
  console.log(e);
}
const getData = async function () {
  Object.keys(api).forEach((item) => {
    fetch(api[item]).then(r => r.json()).then(response => {
      let oldValue = {};
      chrome.storage.local.get(item, function (result) {
        oldValue = result[item] || null;
        chrome.storage.local.set({
          [item]: {
            "count": response.count || response.items.length || 0,
            "results": response.results || response.items || {}
          }
        });
        console.log(item + " count " + response.count);
        if (item != "shop" && response.count !== oldValue.count || JSON.stringify(response.results || response.items).length !== JSON.stringify(oldValue.results).length) {
          chrome.action.setBadgeText({
            text: "H"
          });
        }
      });
    });
  });
}