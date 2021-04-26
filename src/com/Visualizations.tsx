import React from "react";

export default class Visualizations extends React.Component<{ highlighted: string, dpv: any, envelopeVisualization: any }, {}> {

    shouldComponentUpdate(nextProps: any, nextState: any) {
        return this.props.highlighted !== nextProps.highlighted || this.props.envelopeVisualization !== nextProps.envelopeVisualization
    }

    render() {
        return (
            <div className="Visualizations">
                <div className="FocusCard" id={this.props.highlighted}>
                    {this.props.dpv}
                </div>
                <div className="DetailTopCard" id={this.props.highlighted}>
                    {this.props.envelopeVisualization}
                </div>
                <div className="DetailCenterCard" id={this.props.highlighted}></div>
                <div className="DetailBottomCard" id={this.props.highlighted}></div>
            </div>
        )
    }
}