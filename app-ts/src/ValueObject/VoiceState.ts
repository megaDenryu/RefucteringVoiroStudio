import { BaseValueObject } from "../BaseClasses/base_value_object";

export interface IVoiceState {
    scale: Number;
}

export class VoiceState extends BaseValueObject {
    public readonly scale:Number;

    constructor(scale:Number) {
        super();
        this.scale = scale;
    }

    toDict(): IVoiceState {
        return {
            scale: this.scale
        };
    }

    static fromDict(voiceState: IVoiceState): VoiceState {
        return new VoiceState(voiceState.scale);
    }
}