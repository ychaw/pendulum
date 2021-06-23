import { Slider, Select, MenuItem } from '@material-ui/core';
import React from 'react';
import { IPreset, ITypes } from '../data/Presets';
import { LP, HP, BP, NOTCH } from '../data/Constants';

class PendulumContent extends React.Component<{ preset: any, handleSliderChange: any, theta1Value: number, theta2Value: number, disabledTheta: boolean }, { theta1Value: number, theta2Value: number }> {

    constructor(props: any) {
        super(props);
        this.state = {
            theta1Value: props.theta1Value,
            theta2Value: props.theta2Value
        }
    }

    shouldComponentUpdate(nextProps: any, nextState: any) {
        if (nextProps.theta1Value !== this.props.theta1Value && nextProps.theta2Value !== this.props.theta2Value) {
            this.setState({
                theta1Value: nextProps.theta1Value,
                theta2Value: nextProps.theta2Value,
            });
        }
        return true
    }

    changeValue(param: string, newValue: number) {
        if (param.startsWith('thetaFirst')) {
            this.setState({
                theta1Value: newValue
            });
        } else if (param.startsWith('thetaSecond')) {
            this.setState({
                theta2Value: newValue
            });
        }
        this.props.handleSliderChange(param, newValue);
    }

    render() {
        let params = Object.keys(this.props.preset);
        params.shift();
        let lastParam = params.pop() as string;
        let content = [];
        for (let i = 0; i < params.length; i += 2) {
            let param = params.slice(i, i + 2);
            let p: IPreset[] = [this.props.preset[param[0]], this.props.preset[param[1]]];
            content.push(
                <div className="SettingsContentParameter" key={i}>
                    <h3 className="Oscillator">{param[0].split(/(?=[A-Z])/)[0]}</h3>
                    <Slider
                        className="ParameterSlider"
                        id="first"
                        value={param[0].startsWith('theta') ? this.state.theta1Value : undefined}
                        disabled={param[0].startsWith('theta') ? this.props.disabledTheta : undefined}
                        defaultValue={p[0].default}
                        step={p[0].step}
                        min={p[0].min}
                        max={p[0].max}
                        onChange={(e, newValue) => this.changeValue(param[0], newValue as number)}
                        valueLabelDisplay="auto"
                    />
                    <Slider
                        className="ParameterSlider"
                        id="second"
                        value={param[1].startsWith('theta') ? this.state.theta2Value : undefined}
                        disabled={param[1].startsWith('theta') ? this.props.disabledTheta : undefined}
                        defaultValue={p[1].default}
                        step={p[1].step}
                        min={p[1].min}
                        max={p[1].max}
                        onChange={(e, newValue) => this.changeValue(param[1], newValue as number)}
                        valueLabelDisplay="auto"
                    />
                </div>
            )
        }
        let lastP: IPreset = this.props.preset[lastParam];
        content.push(
            <div className="SettingsContentParameter" key={params.length}>
                <h3>{lastParam}</h3>
                <Slider
                    className="ParameterSlider"
                    defaultValue={lastP.default}
                    step={lastP.step}
                    min={lastP.min}
                    max={lastP.max}
                    onChange={(e, newValue) => this.props.handleSliderChange(lastParam, newValue)}
                    valueLabelDisplay="auto"
                />
            </div>
        )

        return <div className="SettingsContent">{content}</div>
    }
}

class EnvelopeContent extends React.Component<{ preset: any, handleSliderChange: any, disabled: boolean }, {}> {

    shouldComponentUpdate(nextProps: any, nextState: any) {
        return nextProps.preset !== this.props.preset || nextProps.handleSliderChange !== this.props.handleSliderChange || nextProps.disabled !== this.props.disabled
    }

    render() {
        let params = Object.keys(this.props.preset);
        params.shift()
        return <div className="SettingsContent">{
            params.map((param: string, i: number) => {
                let p: IPreset = this.props.preset[param]
                return (
                    <div className="SettingsContentParameter" key={i}>
                        <h3 className="Envelope">{param.toUpperCase()}</h3>
                        <Slider
                            className="ParameterSlider"
                            defaultValue={p.default}
                            disabled={this.props.disabled}
                            step={p.step}
                            min={p.min}
                            max={p.max}
                            onChange={(e, newValue) => this.props.handleSliderChange(param, newValue)}
                            valueLabelDisplay="auto"
                        />
                    </div>
                )
            })
        } </div>
    }
}


class FilterContent extends React.Component<{ preset: any, handleSliderChange: any }, {}> {

    shouldComponentUpdate(nextProps: any, nextState: any) {
        return nextProps.preset !== this.props.preset || nextProps.handleSliderChange !== this.props.handleSliderChange
    }

    render() {
        let params = Object.keys(this.props.preset);
        params.shift();
        let type: ITypes = this.props.preset[params[0]];
        let typeName = params[0];
        params.shift();

        const filterDisplayNames = new Map([
            [LP, 'Low Pass'],
            [HP, 'High Pass'],
            [BP, 'Band Pass'],
            [NOTCH, 'Notch'],
        ]);

        return <div className="SettingsContent">
            <Select
                className="SettingsContentParameter"
                defaultValue={type.default}
                onChange={(e) => this.props.handleSliderChange(typeName, e.target.value)}
            >
                {
                    type.options.map((option: string, i: number) => {
                        return (
                            <MenuItem key={i} value={option}>{filterDisplayNames.get(option)}</MenuItem>
                        )
                    })
                }
            </Select>
            {
                params.map((param: any, i: number) => {
                    let p: IPreset = this.props.preset[param];
                    return (
                        <div className="SettingsContentParameter" key={i}>
                            <h3>{param}</h3>
                            <Slider
                                className="ParameterSlider"
                                defaultValue={p.default}
                                step={p.step}
                                min={p.min}
                                max={p.max}
                                onChange={(e, newValue) => this.props.handleSliderChange(param, newValue)}
                                valueLabelDisplay="auto"
                            />
                        </div>
                    )
                })
            }
        </div>
    }
}

class VolumeContent extends React.Component<{ preset: any, handleSliderChange: any }, {}> {

    shouldComponentUpdate(nextProps: any, nextState: any) {
        return nextProps.preset !== this.props.preset || nextProps.handleSliderChange !== this.props.handleSliderChange
    }

    render() {
        let p: IPreset = this.props.preset.volume;
        return <div className="SettingsContent">
            <div className="SettingsContentParameter">
                <Slider
                    className="ParameterSlider"
                    defaultValue={p.default}
                    step={p.step}
                    min={p.min}
                    max={p.max}
                    valueLabelFormat={p.valueLabelFormat}
                    onChange={(e, newValue) => this.props.handleSliderChange(this.props.preset.name, newValue)}
                    valueLabelDisplay="auto"
                />
            </div>
        </div>
    }
}



export default class SettingsCards extends React.Component<{ classNames: any, presets: any, setHighlight: any, clearHighlight: any, sliderChanges: any, theta1Value: number, theta2Value: number, disabledTheta: boolean, disabledEnvelope: boolean }, {}> {

    shouldComponentUpdate(nextProps: any, nextState: any) {
        return (nextProps.theta1Value !== this.props.theta1Value && nextProps.theta2Value !== this.props.theta2Value) || nextProps.diabledTheta !== this.props.disabledTheta || nextProps.disabledEnvelope !== this.props.disabledEnvelope
    }

    render() {
        let props = this.props
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
                                    'Oscillator': <PendulumContent preset={preset} handleSliderChange={props.sliderChanges[className]} theta1Value={props.theta1Value} theta2Value={props.theta2Value} disabledTheta={props.disabledTheta} />,
                                    'Envelope': <EnvelopeContent preset={preset} handleSliderChange={props.sliderChanges[className]} disabled={props.disabledEnvelope} />,
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
