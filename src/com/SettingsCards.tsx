import { Slider } from '@material-ui/core';

function OscillatorContent(props: any) {
    return <div></div>
}

function EnvelopeContent(props: any) {
    return <div></div>
}

function FilterContent(props: any) {
    return <div></div>
}

function VolumeContent(props: any) {
    return (
        <div>
            <Slider
                defaultValue={props.preset.volume.default}
                min={props.preset.volume.min}
                max={props.preset.volume.max}
                onChange={props.handleSliderChange}
                valueLabelDisplay="auto"
            />
        </div>
    );
}

export default function SettingsCards(props: any) {
    console.log('SettingsCards');
    return (
        <div className="SettingsCards">
            {props.classNames.map((className: string, i: number) => {
                let preset = props.presets.getComponentByName(className)
                return (

                    <div className={"Settings" + className + "Card"}
                        key={i}
                        onMouseEnter={() => props.onMouseEnterChild(className)}
                        onMouseLeave={props.onMouseLeaveChild}
                    >
                        <h2 className="SettingsHeader">{className}</h2>
                        <div className="SettingsContent">{
                            {
                                'Oscillator': <OscillatorContent handleSliderChange={props.handleSliderChange} />,
                                'Envelope': <EnvelopeContent />,
                                'Filter': <FilterContent />,
                                'Volume': <VolumeContent preset={preset} handleSliderChange={props.handleSliderChange} />,
                            }[className as string]
                        }</div>
                    </div>

                )
            })}
        </div>
    );
}