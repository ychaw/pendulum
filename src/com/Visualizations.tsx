import React from "react";

export default class Visualizations extends React.Component<{ highlighted: string, doublePendulumVisualization: any, envelopeVisualization: any, filterVisualization: any }, {}> {

    shouldComponentUpdate(nextProps: any, nextState: any) {
        return this.props.highlighted !== nextProps.highlighted
            || this.props.doublePendulumVisualization !== nextProps.doublePendulumVisualization
            || this.props.envelopeVisualization !== nextProps.envelopeVisualization
            || this.props.filterVisualization !== nextProps.filterVisualization
    }

    render() {
        return (
            <div className="Visualizations">
                <div className="FocusCard" id={this.props.highlighted}>
                    {this.props.doublePendulumVisualization}
                </div>
                <div className="DetailTopCard" id={this.props.highlighted}>
                    {this.props.envelopeVisualization}
                </div>
                <div className="DetailCenterCard" id={this.props.highlighted}>
                    {this.props.filterVisualization}
                </div>
                <div className="DetailBottomCard" id={this.props.highlighted}></div>
            </div>
        )
    }
}