import React from 'react'

class Visualizations extends React.Component<{ highlighted: string }, {}> {
    render() {
        return (
            <div className="Visualizations">
                <div className="FocusCard" id={this.props.highlighted}></div>
                <div className="DetailTopCard" id={this.props.highlighted}></div>
                <div className="DetailCenterCard" id={this.props.highlighted}></div>
                <div className="DetailBottomCard" id={this.props.highlighted}></div>
            </div>
        );
    }
}

export default Visualizations;