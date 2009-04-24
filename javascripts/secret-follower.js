var SecretFollower = {
  initialize: function(){
    this.form = $('follow-form');
    this.form.observe('submit', this.formSubmit.bindAsEventListener(this));
    this.input = this.form.down('input[type=text]');
    this.following = $('following');
    this.meta = $('meta');
    this.tweets = $('tweets');
    this.preloadFollowees();
    if (this.followees.size() > 0) this.fetchTweets();
  },
  fetchTweets: function(){
    var url = 'http://search.twitter.com/search.json?show_user=true&rpp=50&q=', query = $A();
    this.followees.each(function(followee){
      query.push('from:' + followee);
    });
    url += escape(query.join(' OR '));
    url += '&callback=?';
    getJSON(url, this.tweetCallback.bind(this));

    this.meta.update('');
    if (this.followees.size() == 0) return;
    this.meta.insert('<li><a href="http://search.twitter.com/search.atom?q=' + escape(query.join(' OR ')) + '">subscribe rss</a></li>');
    this.meta.insert('<li><a href="http://search.twitter.com/search?q=' + escape(query.join(' OR ')) + '">view on twitter</a></li>');
  },
  tweetCallback: function(data){
    this.tweets.update('');
    data.results.each(function(tweet){
      this.tweets.insert(this._buildTweetItem(tweet));
    }.bind(this));
  },
  preloadFollowees: function(){
    this.followees = getCookie('following') || $A();
    if (typeof this.followees == 'string') this.followees = unescape(this.followees).evalJSON();
    this.followees.each(function(followee){
      this.addFollowee(followee);
    }.bind(this));
  },
  formSubmit: function(event){
    event.stop();
    var followee = this.input.value.strip();
    this.input.value = '';
    
    if (followee == '' || this.followees.indexOf(followee) > -1) return;
    if (this.followees.size() >= 8) return alert("Max followees (8) reached. Remove a few first.") ;
    
    this.addFollowee(followee);
    this.followees.push(followee);
    this.saveFolloweeState();
    this.fetchTweets();
  },
  saveFolloweeState: function(){
    var date = new Date();
    date.setTime(date.getTime()+(365*24*60*60*1000));
    setCookie('following', this.followees.toJSON(), date);
  },
  addFollowee: function(followee){
    this.following.insert(this._buildFolloweeItem(followee));
  },
  removeFollowee: function(item, followee){
    if (!confirm('are you sure?')) return;
    item = $(item).up('li');
    item.remove();
    this.followees = this.followees.without(followee);
    this.saveFolloweeState();
    this.fetchTweets();
  },
  _buildFolloweeItem: function(followee){
    return '<li><a href="http://www.twitter.com/' + followee + '">' + followee + '</a>&nbsp;<a href="#" title="remove followee" class="remove" onclick="return SecretFollower.removeFollowee(this, \'' + followee + '\');">&times;</a></li>';
  },
  _buildTweetItem: function(tweet){
    return '<li><img src="' + tweet.profile_image_url + '" alt=""/>' + tweet.text + '&nbsp;<a href="http://twitter.com/' + tweet.from_user + '/statuses/' + tweet.id + '" title="view tweet">&rarr</a></li>';
  }
};

document.observe('dom:loaded', SecretFollower.initialize.bind(SecretFollower));

var Followee = Class.create({
  initialize: function(name){
    this.name = name;
  }
});

