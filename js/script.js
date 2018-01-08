const API_KEY = '00914858-e291-4910-9b4e-47512b633dde';
let requestUrl = 'https://content.guardianapis.com/search?&show-blocks=body&api-key=' + API_KEY + '&page=1';

const request = new XMLHttpRequest();
request.open("GET", requestUrl);
request.responseType = 'json';
request.send();

const totalPages = document.querySelector('.total-pages');

const errHandler = function() {
	if (request.statusText === '') {
		document.querySelector('main').style.display = 'none';
		const err = document.createElement('div');
		err.className = 'error';
		err.textContent = 'Sorry, we couldn\'t find the news for you. Please try again later.';
		document.body.appendChild(err);
	}	
};

setTimeout(errHandler, 3000);

const acc = document.querySelectorAll('.accordion');
const panel = document.querySelectorAll('.panel');
let i;

const truncate = function( n, useWordBoundary ) {
  if (this.length <= n) { return this; }
  let subString = this.substr(0, n-1);
  return (useWordBoundary 
       ? subString.substr(0, subString.lastIndexOf(' ')) 
       : subString) + "...";
};

const refresh = function() {
	const title = request.response.response['results'];

	for(i = 0; i < acc.length; i++) {
		acc[i].textContent = title[i].webTitle;
		panel[i].innerHTML = `<p>${truncate.apply(title[i].blocks.body[0].bodyTextSummary, [256, true])}</p><br><a href="${title[i].webUrl}" class="link">Read full News</a>`;
	}
	totalPages.textContent = request.response.response.pages;
};

request.onload = refresh;

for (i = 0; i < acc.length; i++) {
	acc[i].addEventListener('click', function() {
		this.classList.toggle('active');

		let panel = this.nextElementSibling;
		if (panel.style.maxHeight) {
			panel.style.maxHeight = null;
		} else {
			panel.style.maxHeight = panel.scrollHeight + 'px';
		}
	})
}

const refreshBtn = document.querySelector('.refresh');

refreshBtn.addEventListener('click', (e) => {
	
});

const btnPrev = document.querySelector('.prev');
const btnNext = document.querySelector('.next');
const pageNum = document.querySelector('.page-num');

function currentPageValue() {
	pageNum.value = request.response.response.currentPage;
}

setTimeout(currentPageValue, 1000);

const getNewPage = function(e) {
	if (e === "plus") { pageNum.value++ };
	if (e === "minus") { pageNum.value-- };
	let newPage = requestUrl.slice(0, -1);
	newPage += pageNum.value;
	request.open("GET", newPage);
	request.send();
}

btnPrev.onclick = () => {
	if (pageNum.value <= 1) return;
	getNewPage("minus");
}

btnNext.onclick = () => {
	if (pageNum.value > request.response.response.pages) return;
	getNewPage("plus");
}