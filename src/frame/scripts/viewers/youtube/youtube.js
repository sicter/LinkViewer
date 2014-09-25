'use strict';

var ViewerBase = require('../viewerBase');
var Helpers = require('../../helpers');
var template = require('./template.hbs');

function convertNumber(number){
  if(number > 1000000000){
    return (((number/1000000000) | 0).toString() + 'B');
  }
  else if(number > 1000000){
    return (((number/1000000) | 0).toString() + 'M');
  }
  else if(number > 1000){
    return (((number/1000) | 0).toString() + 'K');
  }
  else{
    return number;
  }

}

var YoutubeViewer = ViewerBase.extend({
  show: function(url) {
    var self = this;
    var id, api;

    if (url.href.indexOf('/watch') != -1) {

      id = Helpers.getQueryVariable(url, 'v');

      api = 'http://gdata.youtube.com/feeds/api/videos/' + id + '?v=2&alt=jsonc';//-in-script&amp;callback=";

      Helpers.getJSON(api).then(function(json) {
            /*jshint camelcase: false */

            var vidParams = {
              thumb: json.data.thumbnail.hqDefault,
              //uploader: json.data.uploader,
              //category: json.data.category,

              title: json.data.title,
              description: json.data.description.substring(0,250) + '...',
              likeCount: convertNumber(json.data.likeCount),
              viewCount: convertNumber(json.data.viewCount),
              commentCount: convertNumber(json.data.commentCount),

              createdAt: Helpers.stringifyTimestamp(json.created_at_i)
            };

            self.applyTemplate(template(vidParams));
          });
    }
    else if(url.href.indexOf('/playlist') != -1){

      id = Helpers.getQueryVariable(url, 'list');

      api = 'https://gdata.youtube.com/feeds/api/playlists/'  + id + '?alt=jsonc&v=2';//-in-script&amp;callback=";

      Helpers.getJSON(api).then(function(json) {
            /*jshint camelcase: false */
        alert(json.data);
            var listParams = {
              thumb: json.data.thumbnail.hqDefault,
              //uploader: json.data.uploader,
              //category: json.data.category,

              title: json.data.title,
              description: json.data.description.substring(0,250) + '...',
              //likeCount: convertNumber(json.data.item.likeCount),
              //viewCount: convertNumber(json.data.item.viewCount),
              //commentCount: convertNumber(json.data.item.commentCount),

              createdAt: Helpers.stringifyTimestamp(json.created_at_i)
            };

            self.applyTemplate(template(listParams));
          });
    }

  }
});

module.exports = new YoutubeViewer();