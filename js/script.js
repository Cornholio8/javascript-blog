/* eslint-disable no-inner-declarations */
{
  'use strict';
  /*document.getElementById('test-button').addEventListener('click', function(){*/

  /*console.log('links:', links);*/
  /*});*/
  const templates = {
    articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
    tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
    authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  };

  const titleClickHandler = function(event){
    event.preventDefault();
    const clickedElement = this;
    console.log('Link was clicked!');
    console.log('event', event);

    /* [Done] remove class 'active' from all article links  */

    const activeLinks = document.querySelectorAll('.titles a.active');

    for(let activeLink of activeLinks){
      activeLink.classList.remove('active');
    }

    /* [DONE] add class 'active' to the clicked link */

    clickedElement.classList.add('active');
    console.log('clickedElement:', clickedElement);

    /* [DONE] remove class 'active' from all articles */

    const activeArticles = document.querySelectorAll('.posts .post');

    for(let activeArticle of activeArticles){
      activeArticle.classList.remove('active');
    }

    /* [DONE] get 'href' attribute from the clicked link */

    const articleSelector = clickedElement.getAttribute('href');
    console.log('selector:', articleSelector);

    /* [DONE] find the correct article using the selector (value of 'href' attribute) */

    const targetArticle = document.querySelector(articleSelector);
    console.log('article', targetArticle);

    /* add class 'active' to the correct article */

    targetArticle.classList.add('active');
    console.log('cArticle:', targetArticle);
  };

  const optArticleSelector = '.post',
    optTitleSelector = '.post-title',
    optTitleListSelector = '.titles',
    optArticleTagsSelector = '.post-tags .list',
    optArticleAuthorSelector = '.post-author',
    optTagsListSelector = '.tags.list',
    optCloudClassCount = 5,
    optCloudClassPrefix = 'tag-size-',
    optAuthorsListSelector = '.authors.list';

  function generateTitleLinks(customSelector = ''){

    /* [DONE] Remove contents of titleList */

    const titleList = document.querySelector(optTitleListSelector);
    titleList.innerHTML = '';
    console.log(titleList);

    /* [DONE] for each article */

    const articles = document.querySelectorAll(optArticleSelector + customSelector);

    let html = '';

    for (let article of articles){

      /* [DONE] get the article id */

      const articleId = article.getAttribute('id');
      console.log(articleId);

      /* [DONE] find the title element */

      const articleTitleElement = article.querySelector(optTitleSelector);

      /* [DONE] get the title from the title element */

      const articleTitle = articleTitleElement.innerHTML;

      /* [DONE] create HTML of the link */

      const linkHTMLData = {id: articleId, title: articleTitle};
      const linkHTML = templates.articleLink(linkHTMLData);
      console.log(linkHTML);


      /* [DONE] insert link into titleList */
      html = html + linkHTML;
    }

    titleList.innerHTML = html;

    const links = document.querySelectorAll('.titles a');
    for (let link of links) {
      link.addEventListener('click', titleClickHandler);
    }}

  generateTitleLinks();

  function calculateTagsParams(tags) {
    const params = { max: 0, min: 99999 };
    for (let tag in tags) {
      params.max = Math.max(tags[tag], params.max);
      params.min = Math.min(tags[tag], params.min);
    }
    return params;
  }

  function calculateTagClass(count, params) {
    const normalizedCount = count - params.min;
    const normalizedMax = params.max - params.min;
    const percentage = normalizedCount / normalizedMax;
    const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);
    return optCloudClassPrefix + classNumber;
  }

  function generateTags(){

    /* [NEW] create a new variable allTags with an empty object */
    let allTags = {};

    /* [DONE] find all articles */

    const articles = document.querySelectorAll(optArticleSelector);
    console.log('articles', articles);

    /* [DONE] START LOOP: for every article: */

    for(let article of articles){

      /* [DONE] find tags wrapper */

      const articleTag = article.querySelector(optArticleTagsSelector);
      console.log('tags wrapper', articleTag);

      /* [DONE] make html variable with empty string */

      let html = '';

      /* [DONE] get tags from data-tags attribute */

      const articleTags = article.getAttribute('data-tags');
      console.log('tags', articleTags);

      /* [DONE] split tags into array */

      const articleTagsArray = articleTags.split(' ');
      console.log(articleTagsArray);

      /* [DONE] START LOOP: for each tag */

      for(let tag of articleTagsArray){
        console.log('each tag', tag);

        /* [DONE] generate HTML of the link */

        /*const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + ' ' + '</a></li>';*/
        const tagHTMLData = { tagsId: tag, tagName: tag };
        const linkHTML = templates.tagLink(tagHTMLData);


        /* [DONE] add generated code to html variable */

        html = html + linkHTML;

        /* [NEW] check if this link is NOT already in allTags */

        if(!allTags[tag]) {

          /* [NEW] add tag to allTags object */

          allTags[tag] = 1;
        } else {
          allTags[tag]++;
        }
      /* [DONE] END LOOP: for each tag */
      }
      /* [DONE] insert HTML of all the links into the tags wrapper */

      articleTag.innerHTML = html;

    /* [DONE] END LOOP: for every article: */
    }

    /* [NEW] find list of tags in right column */
    const tagList = document.querySelector(optTagsListSelector);

    const tagsParams = calculateTagsParams(allTags);
    console.log('tagsParams:', tagsParams);
    /* [NEW] create variable for all links HTML code */
    let allTagsHTML = '';

    /* [NEW] START LOOP: for each tag in allTags: */
    for(let tag in allTags){
      /* [NEW] generate code of a link and add it to allTagsHTML */
      allTagsHTML += '<li><a href="#tag-' + tag + '" class="' + calculateTagClass(allTags[tag], tagsParams) + '"> ' + tag + '</a></li>';
    }
    /* [NEW] END LOOP: for each tag in allTags: */

    /* [NEW] add HTML from allTagsHTML to tagList */
    tagList.innerHTML = allTagsHTML;
    console.log(allTags);
  }

  generateTags();

  function tagClickHandler(event){
    /* [DONE] prevent default action for this event */

    event.preventDefault();

    /* [DONE] make new constant named "clickedElement" and give it the value of "this" */

    const clickedElement = this;

    /* [DONE] make a new constant "href" and read the attribute "href" of the clicked element */

    const href = clickedElement.getAttribute('href');

    /* [DONE] make a new constant "tag" and extract tag from the "href" constant */

    const tag = href.replace('#tag-', '');

    /* [DONE] find all tag links with class active */

    const tagLinks = document.querySelectorAll('a.active[href^="#tag-"]');

    /* [DONE] START LOOP: for each active tag link */

    for(let link of tagLinks){

      /* [DONE] remove class active */

      link.classList.remove('active');

      /* [DONE] END LOOP: for each active tag link */

    }

    /* [DONE] find all tag links with "href" attribute equal to the "href" constant */

    const tagsHref = document.querySelectorAll('a[href="' + href + '"]');

    /* [DONE] START LOOP: for each found tag link */

    for (let tagHref of tagsHref){

      /* [DONE] add class active */

      tagHref.classList.add('active');

      /* [DONE] END LOOP: for each found tag link */

    }

    /* [DONE] execute function "generateTitleLinks" with article selector as argument */

    generateTitleLinks('[data-tags~="' + tag + '"]');
  }

  function addClickListenersToTags(){
    /* [DONE] find all links to tags */

    const allLinks = document.querySelectorAll('a[href^="#tag-"]');

    /* [DONE] START LOOP: for each link */

    for (let allLink of allLinks){

      /* [DONE] add tagClickHandler as event listener for that link */

      allLink.addEventListener('click', tagClickHandler);

    /* [DONE] END LOOP: for each link */
    }
  }

  addClickListenersToTags();

  function generateAuthors(){
    /* [NEW] create a new variable allAuthors with an empty object */
    let allAuthors = {};

    /* find all articles */

    const articles = document.querySelectorAll(optArticleSelector);

    /* START LOOP: for every article: */

    for(let article of articles){

      /* find authors wrapper */

      const authorWrapper = article.querySelector(optArticleAuthorSelector);
      console.log('wrapper', authorWrapper);

      /* make html variable with empty string */

      let html = '';

      /* get author from data-author attribute */

      const articleAuthor = article.getAttribute('data-author');
      console.log('author', articleAuthor);

      /* generate HTML of the link */

      /*const linkHTML = '<a href="#author-' + articleAuthor + '">' + articleAuthor + ' ' + '</a>';*/
      const authorHTMLData = { author: articleAuthor };
      const linkHTML = templates.authorLink(authorHTMLData);

      /* add generated code to html variable */

      html = html + linkHTML;

      /* [NEW] check if this link is NOT already in allAuthors */

      if (!allAuthors[articleAuthor]){

        /* [NEW] add tasag to allAuthors object */

        allAuthors[articleAuthor] = 1;
      } else {
        allAuthors[articleAuthor]++;
      }

      /* insert HTML of all the links into the author wrapper */

      authorWrapper.innerHTML = html;

    /* END LOOP: for every article: */
    }

    /* [NEW] find list of authors in right column */

    const authorsList = document.querySelector(optAuthorsListSelector);
    /* [NEW] creat variable for all links HTML code */

    let allAuthorsHTML = '';

    /* [NEW] START LOOP: for each tag in allAuthors */

    for (let author in allAuthors){

      /* [NEW] generate code of a link and add it to allAuthorsData  */
      allAuthorsHTML += '<li><a href="#author-' + author + '"><span>' + author + ' (' + allAuthors[author] + ')</span></a></li> ';

      /* [NEW] END LOOP: for each tag in allAuthors: */
    }

    /* [NEW] add HTML from allAuthorsHTML to AuthorsList */
    authorsList.innerHTML = allAuthorsHTML;
  }

  generateAuthors();

  function authorClickHandler(event){
    /* prevent default action for this event */

    event.preventDefault();

    /* make new constant named "clickedElement" and give it the value of "this" */

    const clickedElement = this;

    /* make a new constant "href" and read the attribute "href" of the clicked element */

    const href = clickedElement.getAttribute('href');
    console.log(href);

    /* make a new constant and extract author from the "href" constant */

    const author = href.replace('#author-', '');
    console.log(author);

    /* find all author links with class active */

    const authorLinks = document.querySelectorAll('a.active[href^="#author-"]');

    /* START LOOP: for each active author link */

    for(let authorLink of authorLinks){

      /* remove class active */

      authorLink.classList.remove('active');

      /* END LOOP: for each active author link */

    }

    /* find all author links with "href" attribute equal to the "href" constant */

    const authorsHref = document.querySelectorAll('a[href="#author' + href + '"]');
    console.log(authorsHref);

    /* START LOOP: for each found author link */

    for (let authorHref of authorsHref){

      /* add class active */

      authorHref.classList.add('active');

      /* END LOOP: for each found tag link */

    }

    /* execute function "generateTitleLinks" with article selector as argument */

    generateTitleLinks('[data-author="' + author + '"]');
  }

  // eslint-disable-next-line no-inner-declarations
  function addClickListenersToAuthors(){
    /* find all links to authors */

    const allLinks = document.querySelectorAll('a[href^="#author-"]');

    /* START LOOP: for each link */

    for (let allLink of allLinks){

      /* add authorClickHandler as event listener for that link */

      allLink.addEventListener('click', authorClickHandler);

    /* END LOOP: for each link */
    }
  }

  addClickListenersToAuthors();

}
