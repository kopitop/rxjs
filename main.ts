import * as Rx from './node_modules/rxjs/Rx';

declare var $;

var refreshClickStream = Rx.Observable.fromEvent($('#btn'), 'click');

var requestStream = refreshClickStream.startWith('startup click')
  .map(function() {
    var randomOffset = Math.floor(Math.random()*500);
    return 'https://api.github.com/users?since=' + randomOffset;
  });

var responseStream = requestStream
    .flatMap(function (requestUrl) {
        return Rx.Observable.fromPromise($.getJSON(requestUrl));
    });

var close1ClickStream = Rx.Observable.fromEvent($('#first-close'), 'click');

var suggestion1Stream = close1ClickStream.startWith('startup click')
  .combineLatest(responseStream,             
    function(click, listUsers) {
        let total = $(listUsers).toArray().length;
      return listUsers[Math.floor(Math.random()*total)];
    }
  )
  .merge(
    refreshClickStream.map(function(){ return null; })
  )
  .startWith(null);

  suggestion1Stream.subscribe((suggestion) => {
    let html;
    if (suggestion == null) {
        html = '';
    } else {
        html += `
                <td>${suggestion.id}</td>
                <td><a href="${suggestion.url}">${suggestion.login}</a></td>
                <td><img width="50px" height="50px" src="${suggestion.avatar_url}" alt="" /></td>
                `;
    }
        
    $('.first').html(html);
});