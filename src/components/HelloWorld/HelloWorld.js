import React from 'react';
import './Helloworld.less';

const Helloworld = React.createClass({


    /**
     * [render react默认的对象方法]
     * this.props = {}
     * @return {[...]} [...]
     */
    render() {
        return (
            <div>Hello, This is from React world!</div>
        );
    }
});

export default Helloworld;