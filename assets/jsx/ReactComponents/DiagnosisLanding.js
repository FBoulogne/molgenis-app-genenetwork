var _ = require('lodash')
var color = require('../../js/color')

var React = require('react')
var ReactRouter = require('react-router')
var Link = ReactRouter.Link
var Select = require('react-select')
var Logo = require('./Logo')

var DiagnosisLanding = React.createClass({

    mixins: [ReactRouter.History],

    getInitialState: function() {
        return {}
    },

    componentWillReceiveProps: function() {
        //this.loadData()
    },

    componentDidMount: function() {
      //this.loadData() 
    },

    // TODO socket listener
    getSuggestions: function(input, callback) {
        if (!input || input.length < 2) {
            return callback(null, {})
        }
        var ts = new Date()
        io.socket.get(GN.urls.suggest,
                      {
                          q: input
                      },
                      function(res, jwres) {
                          var options = _.map(res, function(o) {
                              return {value: o.text, label: o.text}
                          })
                          console.debug('%d ms suggest: %d options', new Date() - ts, res.length)
                          callback(null, {options: options, complete: true})
                      })
        io.socket.on('suggestions', function(msg) {
            console.debug('%d ms socket suggest: %d options', new Date() - ts, msg.length)
        })
    },

    onSelectChange: function(value, options) {
        console.log('select ' + value)
    },

    onLogoClick: function() {
        this.history.pushState(null, '/')
    },
    
    render: function() {

        return null
    }
})

module.exports = DiagnosisLanding
