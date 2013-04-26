var app = {
}
app.Router = Backbone.Router.extend({
  routes: {
    "(sort/:sort)": "dashboard",
    "be-cool": "page2"
  },
  dashboard: function(sort){
    console.log(sort)
    view = new app.views.Dashboard()
  },
  page2: function(querystring){
    view = new app.views.Page2()
  }
})

app.views = {}
app.views.Dashboard = Backbone.View.extend({
  el: '#page',
  events: {
    'click a.page-2': 'onClickPage2'
  },
  initialize: function(){
    this.render()
  },
  onClickPage2: function(e){
    e && e.preventDefault()
    app.router.navigate('be-cool', {trigger:true})
  },
  render: function(){
    this.$el.html('hello there. <a href="#" class="page-2">go to page 2</a>. <a href="#sort/alpha">redo this page with sort</a>. <a href="#">and without sort</a>')
  }
})

app.views.Page2 = Backbone.View.extend({
  el: '#page',
  events: {
    'click a.dashboard': 'onClickDashboard'
  },
  initialize: function(){
    this.render()
  },
  onClickDashboard: function(e){
    e && e.preventDefault()
    app.router.navigate('', {trigger:true})
  },
  render: function(){
    this.$el.html('hello there from page 2. <a href="#" class="dashboard">dashboard</a>')
  }
})

$(function(){
  app.router = new app.Router()
  Backbone.history.start({pushState:false, root: '/backbone-test/'})
})