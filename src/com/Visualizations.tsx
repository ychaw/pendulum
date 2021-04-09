function Visualizations(props: any) {
    return (
        <div className="Visualizations">
            <div className="FocusCard" id={props.highlighted}>
                {props.dpv}
            </div>
            <div className="DetailTopCard" id={props.highlighted}></div>
            <div className="DetailCenterCard" id={props.highlighted}></div>
            <div className="DetailBottomCard" id={props.highlighted}></div>
        </div>
    );
}

export default Visualizations;