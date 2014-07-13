define([], function() {
    return React.createClass({
        render: function() {
            return (
                React.DOM.div({
                    className: 'row header',
                    children : [
                        React.DOM.div({className : "col-md-5",
                                        children : [React.DOM.h1({className : "mainLogo"}, 'NEWSWATCH'), React.DOM.p({className : "subline"}, 'Analysising bais in the media') ]
                                    }),
                        React.DOM.div({className : "col-md-7 links",
                                        children : [React.DOM.a({href : "/about"}, "about"), React.DOM.a({}, "contact")]
                                    })
                    ]
                })
            );
          }
    });
});