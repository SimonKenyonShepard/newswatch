require(["header", "stage"], function(header, stage) {

    var app = React.createClass({

        _initialState : {
            newsSource : "BBC UK",
            dataURL : "/getHeadlineData",
            headLineData : {}
        },

        getInitialState : function() {
            return this._initialState;
        },

        tick: function() {
        },

        componentWillMount: function() {
            $.ajax({
              url: this.state.dataURL,
              dataType: 'json',
              success: function(data) {
                this.setState({headLineData: data});
              }.bind(this)
            });
        },

        componentDidMount: function() {
            this.interval = setInterval(this.tick, 1000);
        },
        
        componentWillUnmount: function() {
            clearInterval(this.interval);
        },

        render: function() {

            return (
                React.DOM.div({
                    children : [
                        header(this.state),
                        stage(this.state) 

                    ]
                })
            );
          }
    });

    React.renderComponent(
        app({}),
        $(".app")[0]
    );


});