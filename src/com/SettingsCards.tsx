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
                color='primary'
                defaultValue={props.preset.volume.default}
                min={props.preset.volume.min}
                max={props.preset.volume.max}
                onChange={props.handleSliderChange}
                aria-labelledby="slider"
                valueLabelDisplay="auto" />
        </div>
    );
}

function SettingsCard(props: any) {
    return (
        <div className={"Settings" + props.className + "Card"}
            id={props.className}
            key={props.i}
            onMouseEnter={() => props.onMouseEnterChild(props.className)}
            onMouseLeave={props.onMouseLeaveChild}
        >
            <div className="SettingsHeader">{props.className}</div>
            <div className="SettingsContent">{
                {
                    'Oscillator': <OscillatorContent handleSliderChange={props.handleSliderChange} />,
                    'Envelope': <EnvelopeContent />,
                    'Filter': <FilterContent />,
                    'Volume': <VolumeContent preset={props.preset} handleSliderChange={props.handleSliderChange} />,
                }[props.className as string]
            }</div>
        </div>
    );
}


export default function SettingsCards(props: any) {
    return (
        <div className="SettingsCards">
            {props.classNames.map((className: string, i: number) => {
                let preset = props.presets.getComponentByName(className)
                return (
                    <SettingsCard
                        className={className}
                        key={i}
                        preset={preset}
                        onMouseEnterChild={props.onMouseEnterChild}
                        onMouseLeaveChild={props.onMouseLeaveChild}
                        handleSliderChange={props.handleSliderChange}
                    />
                )
            })}
        </div>
    );
}