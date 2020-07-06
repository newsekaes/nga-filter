const rowsContainerId = '#topicrows'
const rowsClass = '.topicrow'
const filterSelectorMap = {
    replies: '.replies',
    topic: '.topic',
    author: '.author',
}

let filterList = [];

chrome.storage.sync.get({ name: 'filterList', value: [] }, function(item) {
    filterList = item.value;
    const topicContainer = document.querySelector(rowsContainerId)
    if (topicContainer) {
        const observer = new MutationObserver(function (mutation) {
            refresh(filterList)
        })
        observer.observe(topicContainer, { childList: true })
        refresh(filterList)
    }
});

function refresh(list) {
    filterList = list;
    const topicRows = document.querySelectorAll(`${rowsContainerId} ${rowsClass}`)
    Array.from(topicRows).forEach(el => el.style.display = '')
    filter()
}
function filter() {
    const topicRows = document.querySelectorAll(`${rowsContainerId} ${rowsClass}`)
    filterList.forEach(({ type, value }) => {
        if (type === 'replies') filterItems(topicRows, filterSelectorMap[type], value, true)
        else filterItems(topicRows, filterSelectorMap[type], value)
    })
}
function filterItems(elArray, selector, value, isNumber = false) {
    Array.from(elArray).forEach((elem) => {
        if (isNumber) {
            if (parseInt(elem.querySelector(selector).innerText) < value) {
                elem.style.display = 'none'
            }
        } else {
            if (elem.querySelector(selector).innerText.indexOf(value) > -1) {
                elem.style.display = 'none'
            }
        }
    })
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // console.log(sender.tab ?"from a content script:" + sender.tab.url :"from the extension");
    if (request.cmd === 'refresh') {
        refresh(request.value);
    }
    sendResponse('done');
});
