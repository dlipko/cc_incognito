
const events = {
    browser_tab_update: 'browser_tab_update',
    browser_tab_remove: 'browser_tab_remove',
    browser_active_tab_change: 'browser_active_tab_change',
    browser_window_active: 'browser_window_active',
    browser_window_hidden: 'browser_window_hidden',
    browser_window_remove: 'browser_window_remove', 
}

const getUUID = () => {
let dt = new Date().getTime();
const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
});
return uuid;
}

const SESSION_UUID = getUUID();
const STATISTIC_GIF_URL = 'https://qa-cc.domclick.ru/api/v1/events.gif';


const getGifParams = (json, namePrefix = '') => {
return Object.keys(json).reduce((accum, key, index) => {
    if (typeof(json[key]) !== "undefined" && json[key] !== null) {
        if (typeof json[key] === 'object') {

            return `${accum}&${getGifParams(json[key], `${namePrefix}${key}__`)}`;
        }

        return `${accum}${index !== 0? '&': ''}${namePrefix}${key}=${json[key]}`;
    }

    return accum;
    },
    '');
}

const getParams = ({ name, tab, browserWindow }) => {
return getGifParams({ 
    name,
    uuid: getUUID(),
    event_data: {
        session_uuid: SESSION_UUID,
        created_at: new Date().toISOString(),
        ...(tab && {
            ...(tab.url && { b64_url: btoa(tab.url)}),
        }),
        ...(browserWindow && {window: {
            id: browserWindow.id,
            incognito: browserWindow.incognito,
        }}),
        origin: window.origin,
    }
});
}

const postOpenTab = ({ url, windowId, incognito }) => {
    const params = {
        name: events.browser_tab_update,
        tab: {
            url,
        },
        browserWindow: {
            id: windowId,
            incognito,
        }
    }
    fetch(`${STATISTIC_GIF_URL}?${getParams(params)}`);
}

const postActiveTabChange = ({ url, windowId, incognito }) => {
    const params = {
        name: events.browser_active_tab_change,
        tab: {
            url,
        },
        browserWindow: {
            id: windowId,
            incognito,
        }
    }
    fetch(`${STATISTIC_GIF_URL}?${getParams(params)}`);
}

const postRemoveTab = (browserWindow) => {
    const params = {
        name: events.browser_tab_remove,
        browserWindow,
    }
    fetch(`${STATISTIC_GIF_URL}?${getParams(params)}`);
}

const postWindowActive = (browserWindow) => {
    const params = {
        name: events.browser_window_active,
        browserWindow,
    }
    fetch(`${STATISTIC_GIF_URL}?${getParams(params)}`);
}

const postHideWindow = () => {
    const params = {
        name: events.browser_window_hidden,
    }
    fetch(`${STATISTIC_GIF_URL}?${getParams(params)}`);
}

const postRemoveWindow = (browserWindow) => {
    const params = {
        name: events.browser_window_remove,
        browserWindow,
    }
    fetch(`${STATISTIC_GIF_URL}?${getParams(params)}`);
}

const postCreateWindow = (browserWindow) => {
    const params = {
        name: events.browser_window_remove,
        browserWindow,
    }
    fetch(`${STATISTIC_GIF_URL}?${getParams(params)}`);
}

export {
    postOpenTab,
    postActiveTabChange,
    postWindowActive,
    postHideWindow,
    postRemoveTab,
    postRemoveWindow,
    postCreateWindow,
}