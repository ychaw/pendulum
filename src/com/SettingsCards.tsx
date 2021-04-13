import { Slider } from '@material-ui/core';

function SettingsCard(props: any) {
    return (
        <div className={"Settings" + props.className + "Card"}
            id={props.className}
            key={props.i}
            onMouseEnter={() => props.onMouseEnterChild(props.className)}
            onMouseLeave={props.onMouseLeaveChild}
        >
            <div className="SettingsHeader">{props.className}</div>
            <div className="SettingsContent">
                <Slider onChange={props.handleSliderChange} aria-labelledby="slider" valueLabelDisplay="auto" />
            </div>
        </div>
    );
}


export default function SettingsCards(props: any) {
    return (
        <div className="SettingsCards">
            {props.classNames.map((className: string, i: number) => {
                return (
                    <SettingsCard
                        className={className}
                        key={i}
                        onMouseEnterChild={props.onMouseEnterChild}
                        onMouseLeaveChild={props.onMouseLeaveChild}
                        handleSliderChange={props.handleSliderChange}
                    />
                )
            })}
        </div>
    );
}