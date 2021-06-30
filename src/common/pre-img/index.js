import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class PreImg extends Component {
    static propTypes={
        src:PropTypes.string
    }
    constructor(props){

    }
    render() {
        return (
            <div className="yy-pre-img-box" >
                <img src={this.props.src}></img>
            </div>
        )
    }
}
