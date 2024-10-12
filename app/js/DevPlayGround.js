///@ts-check
// import { TTSSoftwareSelecter, CharacterNameSelecter, TTSSoftwareEnum, CharacterName, HumanImage, CharaSelectFunction } from "./CharaInfoSelect.js";


const c1 = new CharacterName('test1');
const c2 = new CharacterName('test2');
if (c1 === c2) {
    console.log('c1 === c2');
} else {
    console.log('c1 !== c2');
}

console.log('DevPlayGround.js loaded');
const test1 = document.getElementsByClassName("Test1")[0];
const selecterElem = new TTSSoftwareSelecter()
test1.appendChild(selecterElem.selectElement);

const charaNamesSelecter = new CharacterNameSelecter(
    TTSSoftwareEnum.CevioAI, 
    [
        new CharacterName('test1'), 
        new CharacterName('test2'), 
        new CharacterName('test3'),
        new CharacterName('test4'),
        new CharacterName('test5'),
        new CharacterName('test6'),
        new CharacterName('test7'),
        new CharacterName('test8'),
        new CharacterName('test9'),
        new CharacterName('test10'),
        new CharacterName('test11'),
        new CharacterName('test12'),
        new CharacterName('test13'),
        new CharacterName('test14'),
        new CharacterName('test15'),
        new CharacterName('test16'),
    ]
    );
test1.appendChild(charaNamesSelecter.component.element);

//CharaSelectFunctionのテスト

const charaNamesDict = {
    "CevioAI": [
        new CharacterName('test1'), 
        new CharacterName('test2'), 
        new CharacterName('test3'),
        new CharacterName('test4'),
        new CharacterName('test5'),
        new CharacterName('test6'),
    ],
    "AIVoice": [
        new CharacterName('test1'), 
        new CharacterName('test2'), 
        new CharacterName('test3'),
    ],
    "VoiceVox": [
        new CharacterName('test1'), 
        new CharacterName('test2'), 
        new CharacterName('test3'),
        new CharacterName('test4'),
        new CharacterName('test5'),
        new CharacterName('test6'),
        new CharacterName('test7'),
        new CharacterName('test8'),
        new CharacterName('test9'),
        new CharacterName('test10'),
        new CharacterName('test11'),
        new CharacterName('test12'),
    ],
    "Coeiroink": [
        new CharacterName('test1'), 
        new CharacterName('test2'), 
    ],
}

const humanImagesDict = {
    "test1": [
        new HumanImage('test1.png'),
        new HumanImage('test2.png'),
        new HumanImage('test3.png'),
    ]
}
const charaSelectFunction = new CharaSelectFunction(charaNamesDict, humanImagesDict);
test1.appendChild(charaSelectFunction.Component.element);