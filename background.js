let browser = window.chrome || window.browser;



browser.webRequest.onBeforeRequest.addListener(
    function(details) {        
        let createData = {
          url: details.url.replace('.incognito.', ''),
          incognito: true,
        };
        browser.windows.create(createData);
        browser.tabs.remove(details.tabId);
    },
    {
      urls: [
        "https://domclick.ru.incognito./*",
        "https://qa.domclick.ru.incognito./*",
        "http://domclick.ru.incognito./*",
        "http://qa.domclick.ru.incognito./*",
      ],
    types: ["main_frame"],
    },
    ["blocking"]
);

let gif;

const getUUID = () => {
  let dt = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}

// const createGif = () => {
//   if (gif) {
//     gif.remove();
//   }
//   gif = document.createElement('img');
//   gif.setAttribute("src", href);
//   document.body.appendChild(gif);
//   return gif;
// }

const getGifParams = (json, namePrefix = '') => {
  return Object.keys(json).reduce((accum, key, index) => {
      if (json[key]) {
        if (typeof json[key] === 'object') {
          return `${accum}&${getGifParams(json[key], `${key}__`)}`;
        }

        return `${accum}${index !== 0? '&': ''}${namePrefix}${key}=${json[key]}`;
      }

      return accum;
    },
    '');
}

const params = getGifParams({
  name: 'change_to',
  uuid: getUUID(),
  event_data: {
    session_uuid: getUUID(),
    created_at: new Date().toISOString(),
    // reply: event,
    // question: question,
    // ticket_status: status,
    // ticket_id: id,
    // text,
    origin: window.origin,
  }
});

const STATISTIC_GIF_URL = 'https://qa-cc.domclick.ru/api/v1/events.gif';


// catch open tabs
const handleUpdated = (tabId, changeInfo, tabInfo) => {
  if (changeInfo.url) {
    console.log("Tab: " + tabId +
                " URL changed to " + changeInfo.url + " " + tabInfo);
  }

  chrome.tabs.executeScript({
    code: `gif = document.createElement('img');
            gif.setAttribute("src", ${STATISTIC_GIF_URL}?${params});
            document.body.appendChild(gif);`
  });
}

browser.tabs.onUpdated.addListener(handleUpdated);

