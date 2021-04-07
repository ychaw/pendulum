function SettingsCard(props: any) {
    return (
        <div className={"Settings" + props.className + "Card"} id={props.className} onMouseEnter={props.omec} onMouseLeave={props.omlc} key={props.i}>
            <div className="SettingsHeader">{props.className}</div>
            <div className="SettingsContent"></div>
        </div>
    );
}


function SettingsCards(props: any) {
    return (
        <div className="SettingsCards">
            {props.classNames.map((className: string, i: number) => {
                return <SettingsCard className={className} omec={props.onMouseEnterChild} omlc={props.onMouseLeaveChild} key={i} />
            })}
        </div>
    );
}

export default SettingsCards;