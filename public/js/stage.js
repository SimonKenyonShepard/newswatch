define([], function() {

    var canvas,
        ctx;

    var headlineAnalysis = React.createClass({

        componentDidMount : function() {
            ctx = canvas.getDOMNode().getContext("2d");
        },

        componentDidUpdate : function() {
            this.updateGraph();
        },

        updateGraph : function() {
            var data = [];
            var topicsData = this.props.headLineData[0].headlineTopics;
            var colors = ["#F7464A", "#46BFBD", "#FDB45C", "F34660", "405A83", "718EA7", "455D71", "E7ECF7", "FFF84C", "39E877", "4C95FF", "C639E8", "FF713F"];
            for(var i = 0; i < topicsData.length; i++) {
                data.push({
                    value : topicsData[i].recurrance,
                    color : colors[i],
                    label : topicsData[i].topic
                });
            }
            var myDoughnutChart = new Chart(ctx).Doughnut(data);
        },

        render: function() {
            

            console.log("rerender canvas");
            console.log(this.props);
            var title = React.DOM.h3({className : "dataSection"}, "5 headline stories analysis");

            canvas = React.DOM.canvas({
                width : 400,
                height : 400,
                id : "headlineDoughnut"
            });

            return (
                React.DOM.div({
                    className : "headlineAnalysis row",
                    children : [title, canvas]
                })
            );
          }
    });

    return React.createClass({
        
        render: function() {
            
            console.log("rerender stage");
            var stageTitle = React.DOM.h2({},this.props.newsSource);
            var stage = React.DOM.div({
                  className : "row stage newSourceTitle"
                }, [stageTitle]);

            return (
                React.DOM.div({
                    children : [stage, headlineAnalysis(this.props)]
                })
            );
          }
    });
});