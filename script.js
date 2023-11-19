/* ping.js - v0.3.0 http://github.com/alfg/ping.js */
var Ping = function (a) {
    this.opt = a || {}, this.favicon = this.opt.favicon || "/favicon.ico", this.timeout = this.opt.timeout || 0, this.logError = this.opt.logError || !1
};
Ping.prototype.ping = function (a, b) {
    function c(a) {
        i.wasSuccess = !0, e.call(i, a)
    }

    function d(a) {
        i.wasSuccess = !1, e.call(i, a)
    }

    function e() {
        j && clearTimeout(j);
        var a = new Date - k;
        if (b) {
            if ("function" == typeof b) return this.wasSuccess ? (f && g(a), b(null, a)) : (i.logError && console.error("error loading resource"), f && h(a), b("error", a));
            throw new Error("Callback is not a function.")
        }
        if (f) return this.wasSuccess ? g(a) : h(a);
        throw new Error("Promise is not supported by your browser. Use callback instead.")
    }
    var f, g, h;
    "undefined" != typeof Promise && (f = new Promise(function (a, b) {
        g = a, h = b
    }));
    var i = this;
    i.wasSuccess = !1, i.img = new Image, i.img.onload = c, i.img.onerror = d;
    var j, k = new Date;
    return i.timeout && (j = setTimeout(function () {
        e.call(i, void 0)
    }, i.timeout)), i.img.src = a + i.favicon + "?" + +new Date, f
}, "undefined" != typeof exports ? "undefined" != typeof module && module.exports && (module.exports = Ping) : window.Ping = Ping;

// Function to perform latency testing
async function testLatency(link, pTag) {
    clearResults(pTag);
    const ping = new Ping();
    const span = document.createElement('span');
    span.classList.add('latency-result');
    span.style.color = 'grey';
    span.textContent = ' ● 检测ing...';

    pTag.appendChild(span);

    try {
        const responseTime = await ping.ping(link);
        clearResults(pTag); // Clear previous results
        displayResult(pTag, responseTime);
    } catch (error) {
        // console.error(`Error testing latency for ${link}: ${error}`);
        const responseTime = `Error testing latency for ${link}: ${error}`;
        clearResults(pTag); // Clear previous results
        displayResult(pTag, responseTime);
    }
}

// Function to clear previous results
function clearResults(pTag) {
    const resultSpans = pTag.querySelectorAll('span.latency-result');
    resultSpans.forEach(span => span.remove());
}

// Function to display the result
function displayResult(pTag, responseTime) {
    const resultSpan = document.createElement('span');
    resultSpan.classList.add('latency-result');
    resultSpan.style.color = getLatencyColor(responseTime);
    if(typeof responseTime == 'number'){
        resultSpan.textContent = ` ● ${(responseTime/1000).toFixed(1)} s`;
    }else{
        resultSpan.textContent = ` ● 连接错误`;
    }

    pTag.appendChild(resultSpan);

    // Add click event listener to retest the link
    resultSpan.addEventListener('click', () => retestLink(pTag));
}

// Function to retest a link when clicked
function retestLink(pTag) {
    const link = pTag.querySelector('a');
    testLatency(link.href, pTag);
}

// Determine color based on response time
function getLatencyColor(responseTime) {
    if (responseTime <= 500) {
        return '#008000'; // Dark green
    } else if (responseTime <= 1000) {
        return '#00FF00'; // Light green
    } else if (responseTime <= 3000) {
        return '#ADFF2F'; // Yellow green
    } else if (responseTime <= 5000) {
        return '#FFA500'; // Orange
    } else if (responseTime <= 10000) {
        return '#FF4500'; // Red orange
    } else {
        return '#FF0000'; // Red
    }
}

// Execute when DOM is fully loaded
// document.addEventListener('DOMContentLoaded', function () {
//     const links = document.querySelectorAll('p a');

//     links.forEach(link => {
//         const pTag = link.parentNode; // Get the parent <p> element
//         const url = link.href;

//         // Initial latency test
//         testLatency(url, pTag);
//     });
// });

document.addEventListener('DOMContentLoaded', function () {
    const h2Headings = document.querySelectorAll('h2');

    const tocContainer = document.createElement('div');
    tocContainer.className = 'toc-container';

    const tocTitle = document.createElement('div');
    tocTitle.className = 'toc-title';
    // tocTitle.textContent = '目录';
    tocContainer.appendChild(tocTitle);

    const tocList = document.createElement('ul');
    tocList.className = 'toc-list';

    h2Headings.forEach((h2Heading, index) => {
        const h2Anchor = document.createElement('a');
        h2Anchor.id = `toc-h2-${index}`;

        const h2Item = document.createElement('li');
        const h2Link = document.createElement('a');
        h2Link.href = `#toc-h2-${index}`;
        h2Link.textContent = h2Heading.textContent;
        h2Item.appendChild(h2Link);

        h2Link.addEventListener('click', function (event) {
            event.preventDefault();
            h2Heading.scrollIntoView({ behavior: 'smooth' });
        });

        tocList.appendChild(h2Item);

        const h3Headings = getAssociatedH3Headings(h2Heading);
        if (h3Headings.length > 0) {
            const h3List = document.createElement('ul');
            h3Headings.forEach((h3Heading, h3Index) => {
                const h3Anchor = document.createElement('a');
                h3Anchor.id = `toc-h3-${index}-${h3Index}`;

                const h3Item = document.createElement('li');
                const h3Link = document.createElement('a');
                h3Link.href = `#toc-h3-${index}-${h3Index}`;
                h3Link.textContent = h3Heading.textContent;
                h3Item.appendChild(h3Link);

                h3Link.addEventListener('click', function (event) {
                    event.preventDefault();
                    h3Heading.scrollIntoView({ behavior: 'smooth' });
                });

                h3List.appendChild(h3Item);
            });

            // 注释该行可以删除二级目录
            h2Item.appendChild(h3List);
        }
    });

    tocContainer.appendChild(tocList);
    document.getElementById("directory").appendChild(tocContainer);
});

function getAssociatedH3Headings(h2Heading) {
    const h3Headings = [];
    let currentElement = h2Heading.nextElementSibling;
    while (currentElement && currentElement.tagName !== 'H2') {
        if (currentElement.tagName === 'H3') {
            h3Headings.push(currentElement);
        }
        currentElement = currentElement.nextElementSibling;
    }
    return h3Headings;
}
