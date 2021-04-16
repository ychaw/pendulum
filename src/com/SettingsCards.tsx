import { Slider } from '@material-ui/core';

function SettingsContent(props: any) {
    let params = Object.keys(props.preset);
    params.shift()
    return <div className="SettingsContent"> {
        params.map((param: any, i: number) => {
            let p = props.preset[param]
            return (
                <div className="SettingsContentParameter" key={i}>
                    {/*<h3>{p.name}</h3>*/}
                    <Slider
                        className="ParameterSlider"
                        defaultValue={p.default}
                        step={p.step}
                        min={p.min}
                        max={p.max}
                        onChange={(e, newValue) => props.handleSliderChange(param, newValue)}
                        valueLabelDisplay="auto"
                    />
                </div>
            )
        })
    } </div>
}

export default function SettingsCards(props: any) {
    return (
        <div className="SettingsCards">
            {props.classNames.map((className: string, i: number) => {
                let preset = props.presets.getComponentByName(className)
                return (

                    <div
                        className={"Settings" + className + "Card"}
                        key={i}
                        onMouseEnter={() => props.setHighlight(className)}
                        onMouseLeave={props.clearHighlight}
                    >
                        <h2 className="SettingsHeader">{className}</h2>
                        <SettingsContent preset={preset} handleSliderChange={props.sliderChanges[className]} />
                    </div>

                )
            })}
        </div>
    );
}