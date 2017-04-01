System.register(["./node_modules/rxjs/Rx"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Rx, refreshClickStream, requestStream, responseStream, close1ClickStream, suggestion1Stream;
    return {
        setters: [
            function (Rx_1) {
                Rx = Rx_1;
            }
        ],
        execute: function () {
            refreshClickStream = Rx.Observable.fromEvent($('#btn'), 'click');
            requestStream = refreshClickStream.startWith('startup click')
                .map(function () {
                var randomOffset = Math.floor(Math.random() * 500);
                return 'https://api.github.com/users?since=' + randomOffset;
            });
            responseStream = requestStream
                .flatMap(function (requestUrl) {
                return Rx.Observable.fromPromise($.getJSON(requestUrl));
            });
            // responseStream.subscribe(data => {
            //     // 
            // })
            // refreshClickStream.subscribe(function() {
            //     $('.users').html('');
            // });
            // var suggestion1Stream = responseStream
            //   .map(function(listUsers) {
            //       let total = $(listUsers).toArray().length;
            //     // get one random user from the list
            //     return listUsers[Math.floor(Math.random()*total)];
            //   })
            //   .merge(
            //       refreshClickStream.map(() => null)
            //       )
            //   .startWith(null);
            close1ClickStream = Rx.Observable.fromEvent($('#first-close'), 'click');
            suggestion1Stream = close1ClickStream.startWith('startup click')
                .combineLatest(responseStream, function (click, listUsers) {
                var total = $(listUsers).toArray().length;
                return listUsers[Math.floor(Math.random() * total)];
            })
                .merge(refreshClickStream.map(function () { return null; }))
                .startWith(null);
            suggestion1Stream.subscribe(function (suggestion) {
                var html;
                if (suggestion == null) {
                    html = '';
                }
                else {
                    html += "\n                <td>" + suggestion.id + "</td>\n                <td><a href=\"" + suggestion.url + "\">" + suggestion.login + "</a></td>\n                <td><img width=\"50px\" height=\"50px\" src=\"" + suggestion.avatar_url + "\" alt=\"\" /></td>\n                ";
                }
                $('.first').html(html);
            });
        }
    };
});
