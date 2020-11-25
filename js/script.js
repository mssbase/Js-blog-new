'use strict';

const titleClickHandler = function(event) {
  event.preventDefault();
  const clickedElement = this;

  /* remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');

  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }

  /* add class 'active' to the clicked link */
  clickedElement.classList.add('active');


  /* remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts article.active');

  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }
  /* get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');

  /* find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);

  /* add class 'active' to the correct article */
  targetArticle.classList.add('active');
};

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optTagsListSelector = '.tags.list',
  optArticleAuthorSelector = '.post-author';


function generateTitleLinks(customSelector = ''){
  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';

  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  // console.log(customSelector);
  let html = '';
  for(let article of articles){
  /* get the article id */
    const articleId = article.getAttribute('id');
    /* find the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    /* get the title from the title element */
    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    /* create HTML of the link */
    html = html + linkHTML;

  }
  /* insert link into titleList */
  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');

  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

function generateTags() {
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  /* START LOOP: for every article: */
  for (let article of articles) {
    /* find tags wrapper */
    const tagWrapper = article.querySelector(optArticleTagsSelector);
    // console.log(tagWrapper)
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');
    // console.log(articleTagsArray);

    /* START LOOP: for each tag */
    for(let tag of articleTagsArray){
      /* generate HTML of the link */
      const tagHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
      /* add generated code to html variable */
      html = html + tagHTML + ' ';
    }
    /* insert HTML of all the links into the tags wrapper */
    tagWrapper.innerHTML = html;
  }
}
generateTags();

const tagClickHandler = function(event){

  event.preventDefault();
  const clickedElement = this;
  const href = clickedElement.getAttribute('href');
  const tag = href.replace('#tag-', '');

  /* find all tag links with class active */
  const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');

  for(let activeTag of activeTags){
    activeTag.classList.remove('active');
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const tagLink = document.querySelectorAll('a[href="' + href + '"]');
  /* START LOOP: for each found tag link */
  for(let tagLinks of tagLink){
    tagLinks.classList.add('active');
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
};

const addClickListenersToTags = function(){
  /* find all links to tags */
  const linkTags = document.querySelectorAll('a[href^="#tag-"]');
  /* START LOOP: for each link */
  for(let linkTag of linkTags){
    /* add tagClickHandler as event listener for that link */
    linkTag.addEventListener('click', tagClickHandler);
  }
};
addClickListenersToTags();

const generateAuthors = function () {

  const articles = document.querySelectorAll(optArticleSelector);

  for (let article of articles){
    const authorWrapper = article.querySelector(optArticleAuthorSelector);
    let html = '';
    const tagAuthor = article.getAttribute('data-author');
    const authorHTML = '<li><a href="#author-' + tagAuthor + '">' + tagAuthor + '</a></li>';
    html = html + authorHTML;
    authorWrapper.innerHTML = html;
  }
};
generateAuthors();

const authorClickHandler = function (event) {

  event.preventDefault();
  const clickedElement = this;
  const href = clickedElement.getAttribute('href');
  const author = href.replace('#author-', '');
  const activeAuthor = document.querySelectorAll('a.active[href^="#author-"]');

  for(let activeAuthors of activeAuthor){
    activeAuthors.classList.remove('active');
  }

  const authorLinks = document.querySelectorAll('a[href="' + href + '"]');

  for(let authorLink of authorLinks){
    authorLink.classList.add('active');
  }

  generateTitleLinks('[data-author="' + author + '"]');

};

const addClickListenerToAuthors = function(){

  const LinksToAuthors = document.querySelectorAll('a[href^="#author-"]');

  for(let LinkToAuthor of LinksToAuthors){
    LinkToAuthor.addEventListener('click', authorClickHandler);
  }
};
addClickListenerToAuthors();
