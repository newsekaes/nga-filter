
const filtersExp = [
    {
        type: 'replies',
        keyword: ''
    },
    {
        type: 'topic',
        keyword: ''
    },
    {
        type: 'author',
        keyword: '',
    },
    {
        content: ''
    }
]
chrome.runtime.onInstalled.addListener(function(){
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function(){
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [
                    // 只有打开百度才显示pageAction
                    new chrome.declarativeContent.PageStateMatcher({pageUrl: {urlContains: 'http://nga.178.com'}})
                ],
                actions: [new chrome.declarativeContent.ShowPageAction()]
            }
        ]);
    });
});
