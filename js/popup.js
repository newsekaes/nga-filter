const repliesInput = document.querySelector('#replies-keyword')
const topicInput = document.querySelector('#topic-keyword')
const authorInput = document.querySelector('#author-keyword')
const confirmBtn = document.querySelector('#confirm')

init()
confirmBtn.addEventListener('click', function () {
    const filterList = []
    repliesInput.value.length > 0 && filterList.push({
        type: 'replies',
        value: parseInt(repliesInput.value)
    })
    topicInput.value.length > 0 && filterList.push(...topicInput.value.split(' ').filter(i => i.length > 0).map(i => ({
        type: 'topic',
        value: i,
    })))
    authorInput.value.length > 0 && filterList.push(...authorInput.value.split(' ').filter(i => i.length > 0).map(i => ({
        type: 'author',
        value: i,
    })))
    // 保存数据
    chrome.storage.sync.set({ name: 'filterList', value: filterList }, function() {
        sendMessageToContentScript({cmd: 'refresh', value: filterList});
    });
})

function init() {
    chrome.storage.sync.get({ name: 'filterList', value: [] }, function(item) {
        let replies = ''
        let topic = []
        let author = []
        item.value.forEach(function ({ type, value }) {
            if (type === 'replies') {
                replies = value;
            } else if (type === 'topic') {
                topic.push(value)
            } else if (type === 'author') {
                author.push(value)
            }
        })
        repliesInput.value = replies;
        topicInput.value = topic.join(' ');
        authorInput.value = author.join(' ');
    });
}
function sendMessageToContentScript(message, callback) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
            if (callback) callback(response);
        });
    });
}
