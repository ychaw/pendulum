import { Slider, Select, MenuItem } from '@material-ui/core';
import React from 'react';
import { IPreset, ITypes } from '../data/Presets';

function OscillatorContent(props: any) {
    let params = Object.keys(props.preset);
    params.shift();
    let lastParam = params.pop() as string;
    let content = [];
    for (let i = 0; i < params.length; i += 2) {
        let param = params.slice(i, i + 2);
        let p: IPreset[] = [props.preset[param[0]], props.preset[param[1]]];
        content.push(
            <div className="SettingsContentParameter" key={i}>
                <h3 className="Oscillator">{param[0].split(/(?=[A-Z])/)[0]}</h3>
                <Slider
                    className="ParameterSlider"
                    id="first"
                    defaultValue={p[0].default}
                    step={p[0].step}
                    min={p[0].min}
                    max={p[0].max}
                    onChange={(e, newValue) => props.handleSliderChange(param[0], newValue)}
                    valueLabelDisplay="auto"
                />
                <Slider
                    className="ParameterSlider"
                    id="second"
                    defaultValue={p[1].default}
                    step={p[1].step}
                    min={p[1].min}
                    max={p[1].max}
                    onChange={(e, newValue) => props.handleSliderChange(param[1], newValue)}
                    valueLabelDisplay="auto"
                />
            </div>
        )
    }
    let lastP: IPreset = props.preset[lastParam];
    content.push(
        <div className="SettingsContentParameter" key={params.length}>
            <h3>{lastParam}</h3>
            <Slider
                className="ParameterSlider"
                defaultValue={lastP.default}
                step={lastP.step}
                min={lastP.min}
                max={lastP.max}
                onChange={(e, newValue) => props.handleSliderChange(lastParam, newValue)}
                valueLabelDisplay="auto"
            />
        </div>
    )

    return <div className="SettingsContent">{content}</div>
}

function EnvelopeContent(props: any) {
    let params = Object.keys(props.preset);
    params.shift()
    return <div className="SettingsContent">{
        params.map((param: string, i: number) => {
            let p: IPreset = props.preset[param]
            return (
                <div className="SettingsContentParameter" key={i}>
                    <h3 className="Envelope">{param.toUpperCase()}</h3>
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


function FilterContent(props: any) {
    let params = Object.keys(props.preset);
    params.shift();
    let type: ITypes = props.preset[params[0]];
    let typeName = params[0];
    params.shift();
    return <div className="SettingsContent">
        <Select
            className="SettingsContentParameter"
            defaultValue={type.default}
            onChange={(e) => props.handleSliderChange(typeName, e.target.value)}
        >
            {
                type.options.map((option: string, i: number) => {
                    return (
                        <MenuItem key={i} value={option}>{option}</MenuItem>
                    )
                })
            }
        </Select>
        {
            params.map((param: any, i: number) => {
                let p: IPreset = props.preset[param];
                return (
                    <div className="SettingsContentParameter" key={i}>
                        <h3>{param}</h3>
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
        }
    </div>
}

function VolumeContent(props: any) {
    let p: IPreset = props.preset.volume;
    return <div className="SettingsContent">
        <div className="SettingsContentParameter">
            <Slider
                className="ParameterSlider"
                defaultValue={p.default}
                step={p.step}
                min={p.min}
                max={p.max}
                onChange={(e, newValue) => props.handleSliderChange(props.preset.name, newValue)}
                valueLabelDisplay="auto"
            />
        </div>
    </div>
}



export default class SettingsCards extends React.Component<{ classNames: any, presets: any, setHighlight: any, clearHighlight: any, sliderChanges: any }, {}> {

    prop: any

    constructor(props: any) {
        super(props);
        this.prop = props
    }

    shouldComponentUpdate(nextProps: any, nextState: any) {
        return false
    }

    render() {
        let props = this.prop
        return (
            <div className="SettingsCards"> {
                props.classNames.map((className: string, i: number) => {
                    let preset = props.presets.getComponentByName(className)
                    return (

                        <div
                            className={"Settings" + className + "Card"}
                            key={i}
                            onMouseEnter={() => props.setHighlight(className)}
                            onMouseLeave={props.clearHighlight}
                        >
                            <h2 className="SettingsHeader">{className}</h2>
                            {
                                {
                                    'Oscillator': <OscillatorContent preset={preset} handleSliderChange={props.sliderChanges[className]} />,
                                    'Envelope': <EnvelopeContent preset={preset} handleSliderChange={props.sliderChanges[className]} />,
                                    'Filter': <FilterContent preset={preset} handleSliderChange={props.sliderChanges[className]} />,
                                    'Volume': <VolumeContent preset={preset} handleSliderChange={props.sliderChanges[className]} />,
                                }[className as string]
                            }
                        </div>

                    )
                })
            } </div>
        );
    }
}