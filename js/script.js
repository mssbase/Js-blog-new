'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  articleTagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorTagLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorRightLink: Handlebars.compile(document.querySelector('#template-author-right-link').innerHTML)
};

const titleClickHandler = function(event) {
  event.preventDefault();
  const clickedElement = this;

  const activeLinks = document.querySelectorAll('.titles a.active');

  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }

  clickedElement.classList.add('active');

  const activeArticles = document.querySelectorAll('.posts article.active');

  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }

  const articleSelector = clickedElement.getAttribute('href');

  const targetArticle = document.querySelector(articleSelector);

  targetArticle.classList.add('active');
};

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optTagsListSelector = '.tags.list',
  optArticleAuthorSelector = '.post-author',
  optCloudClassCount = '5',
  optCloudClassPrefix = 'tag-size-',
  optAuthorListSelector = '.list.authors';



function generateTitleLinks(customSelector = ''){

  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';

  const articles = document.querySelectorAll(optArticleSelector + customSelector);

  let html = '';

  for(let article of articles){
    const articleId = article.getAttribute('id');
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);
    html = html + linkHTML;
  }

  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');

  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

const calculateTagsParams = function(tags){

  const params = {
    max: 0,
    min: 999999,
  };

  for(let tag in tags){
    if(tags[tag] > params.max){
      params.max = tags[tag];
    }
  }

  for(let tag in tags){
    if(tags[tag] < params.min){
      params.min = tags[tag];
    }
  }
  return params;
};

const calculateTagClass = function(count, params){

  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );
  return optCloudClassPrefix + classNumber;
};


function generateTags() {
  let allTags = {};

  const articles = document.querySelectorAll(optArticleSelector);

  for (let article of articles) {
    const tagWrapper = article.querySelector(optArticleTagsSelector);
    let html = '';
    const articleTags = article.getAttribute('data-tags');
    const articleTagsArray = articleTags.split(' ');

    for(let tag of articleTagsArray){
      const tagHTMLData = {tag: tag};
      const tagHTML = templates.articleTagLink(tagHTMLData);
      // const tagHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
      html = html + tagHTML + ' ';
      if(!allTags[tag]){
        allTags[tag] = 1;
      } else{
        allTags[tag]++;
      }
    }

    tagWrapper.innerHTML = html;
  }

  const tagList = document.querySelector(optTagsListSelector);
  const tagsParams = calculateTagsParams(allTags);
  console.log('tagsParams:', tagsParams);

  const allTagsData = {tags:[]};
  // let allTagsHTML = '';

  for(let tag in allTags){
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });
    // const tagLinkHTML = '<li class="' + calculateTagClass(allTags[tag], tagsParams) + '"><a href="#tag-' + tag + '">' + tag + ' (' + allTags[tag] + ') ' + '</a></li>';
    // allTagsHTML += tagLinkHTML;
  }
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
  // tagList.innerHTML = allTagsHTML;
}

generateTags();

const tagClickHandler = function(event){

  event.preventDefault();
  const clickedElement = this;
  const href = clickedElement.getAttribute('href');
  const tag = href.replace('#tag-', '');
  const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');

  for(let activeTag of activeTags){
    activeTag.classList.remove('active');
  }

  const tagLink = document.querySelectorAll('a[href="' + href + '"]');

  for(let tagLinks of tagLink){
    tagLinks.classList.add('active');
  }

  generateTitleLinks('[data-tags~="' + tag + '"]');
};

const addClickListenersToTags = function(){

  const linkTags = document.querySelectorAll('a[href^="#tag-"]');

  for(let linkTag of linkTags){
    linkTag.addEventListener('click', tagClickHandler);
  }
};
addClickListenersToTags();


const generateAuthors = function () {
  let allAuthors = {};
  const articles = document.querySelectorAll(optArticleSelector);

  for (let article of articles){
    const authorWrapper = article.querySelector(optArticleAuthorSelector);
    let html = '';
    const tagAuthor = article.getAttribute('data-author');
    const authorHTMLData = {author: tagAuthor};
    const authorHTML = templates.authorTagLink(authorHTMLData);
    // const authorHTML = '<li><a href="#author-' + tagAuthor + '">' + tagAuthor + '</a></li>';
    html = html + authorHTML;

    if(!allAuthors[tagAuthor]){
      allAuthors[tagAuthor] = 1;
    } else {
      allAuthors[tagAuthor]++;
    }
    authorWrapper.innerHTML = html;
  }

  const authorsList = document.querySelector(optAuthorListSelector);
  const allAuthorsData = {authors: []};

  // let allAuthorsHTML = '';

  for (let tagAuthor in allAuthors){
    allAuthorsData.authors.push({
      author: tagAuthor,
      authorCount: allAuthors[tagAuthor]
    });
    // const authorLinkHTML = '<li><a href="#author-' + tagAuthor + '">' + tagAuthor + ' (' + allAuthors[tagAuthor] + ') ' + '</a></li>';
    // allAuthorsHTML += authorLinkHTML;
  }
  // authorList.innerHTML = allAuthorsHTML;
  authorsList.innerHTML = templates.authorRightLink(allAuthorsData);
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
