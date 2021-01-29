
let modelData = [{
    "index": 1,
    "shelve": [
        {
            "name": "pstWay",
            "num": 1,
            "space": 7.759999999999998,
            "x": 1,
            "index": 2
        },
        {
            "name": "station",
            "num": 1,
            "space": 60,
            "x": 2,
            "index": 0
        },
        {
            "name": "pickWay",
            "num": 4,
            "space": 8,
            "x": 3,
            "index": 3
        },
        {
            "name": "station",
            "num": 1,
            "space": 60,
            "x": 7,
            "index": 4
        },
        {
            "name": "station",
            "num": 1,
            "space": 60,
            "x": 8,
            "index": 5
        },
        {
            "name": "pickWay",
            "num": 4,
            "space": 8,
            "x": 9,
            "index": 6
        },
        {
            "name": "station",
            "num": 1,
            "space": 60,
            "x": 13,
            "index": 7
        },
        {
            "name": "shelve",
            "num": 20,
            "space": 8,
            "x": 14,
            "index": 8
        }
    ],
    "psb": [],
    "peoples": [],
    "psts": [
        {
            "name": "pstWay",
            "num": 1,
            "space": 7.759999999999998,
            "x": 1,
            "index": 2
        }
    ]
}, ]
let modelOptions = [
    {
        "id": "ba1d06a1-8c74-4f65-823a-1eb7993f1f7e",
        "name": "工作站",
        "num": 1,
        "space": 62,
        "isDeleted": false,
        "border": ""
    },
    {
        "id": "961d7de4-1a01-49ef-a31a-efea2387ad73",
        "trackWidth": "1802px",
        "trackNum": 34,
        "num": 34,
        "index": 1,
        "space": 54,
        "name": "轨道",
        "isDeleted": false
    },
    {
        "id": "61426421-a293-4f27-81ee-a61dda8480d1",
        "name": "PST通道",
        "shelvesNum": 1,
        "shevlesSpace": 90,
        "num": 1,
        "space": 90,
        "isDeleted": false,
        "border": ""
    },
    {
        "id": "3284287b-827d-4f09-8716-9a330363dbef",
        "shelvesNum": 4,
        "shevlesSpace": 54,
        "name": "货架",
        "num": 4,
        "space": 54,
        "index": 3,
        "isDeleted": false
    },
    {
        "id": "742684d9-288e-46a6-92b2-bc74b726f282",
        "name": "工作站",
        "num": 1,
        "space": 62,
        "isDeleted": false,
        "border": ""
    },
    {
        "id": "579cf2a7-f151-43d2-8145-2c33265cdbde",
        "name": "工作站",
        "num": 1,
        "space": 62,
        "isDeleted": false,
        "border": ""
    },
    {
        "id": "5a16d354-3839-410b-8c20-49f8022811a2",
        "shelvesNum": 4,
        "shevlesSpace": 54,
        "name": "货架",
        "num": 4,
        "space": 54,
        "index": 6,
        "isDeleted": false
    },
    {
        "id": "83992448-79a9-4da7-8584-700581bb6ba4",
        "name": "工作站",
        "num": 1,
        "space": 62,
        "isDeleted": false,
        "border": ""
    },
    {
        "id": "3ac924f1-60d6-41d0-8b55-3b6719a8d3d1",
        "shelvesNum": 20,
        "shevlesSpace": 54,
        "name": "货架",
        "num": 20,
        "space": 54,
        "index": 8,
        "isDeleted": false
    }
];
let floorList = [
    {
        "floorName": "一层",
        "unitList": [
            {
                "unit": "单元1",
                "unitId": "1",
                "infoList": [
                    {
                        "id": "ba1d06a1-8c74-4f65-823a-1eb7993f1f7e",
                        "name": "工作站",
                        "isDeleted": false,
                        "border": ""
                    },
                    {
                        "id": "961d7de4-1a01-49ef-a31a-efea2387ad73",
                        "name": "轨道",
                        "isDeleted": false,
                        "border": ""
                    },
                    {
                        "id": "61426421-a293-4f27-81ee-a61dda8480d1",
                        "name": "PST通道",
                        "isDeleted": false,
                        "border": ""
                    },
                    {
                        "id": "3284287b-827d-4f09-8716-9a330363dbef",
                        "name": "拣货通道",
                        "isDeleted": false,
                        "border": ""
                    },
                    {
                        "id": "742684d9-288e-46a6-92b2-bc74b726f282",
                        "name": "工作站",
                        "isDeleted": false,
                        "border": ""
                    },
                    {
                        "id": "579cf2a7-f151-43d2-8145-2c33265cdbde",
                        "name": "工作站",
                        "isDeleted": false,
                        "border": ""
                    },
                    {
                        "id": "5a16d354-3839-410b-8c20-49f8022811a2",
                        "name": "拣货通道",
                        "isDeleted": false,
                        "border": ""
                    },
                    {
                        "id": "83992448-79a9-4da7-8584-700581bb6ba4",
                        "name": "工作站",
                        "isDeleted": false,
                        "border": ""
                    },
                    {
                        "id": "3ac924f1-60d6-41d0-8b55-3b6719a8d3d1",
                        "name": "货架",
                        "isDeleted": false,
                        "border": ""
                    }
                ]
            }
        ],
        "componentList": [
            {
                "unitId": "1",
                "itemList": [
                    {
                        "id": "ba1d06a1-8c74-4f65-823a-1eb7993f1f7e",
                        "name": "bzq",
                        "modelName": "工作站",
                        "left": 387.76,
                        "top": 18,
                        "border": "",
                        "bgImg": "/img/station@2.f2021ad7.png",
                        "offsetParentLeft": 0.14791666666666667,
                        "offsetParentTop": 0.06937033084311633,
                        "offset": {
                            "x": 17,
                            "y": 13
                        },
                        "generateModelName": "工作站",
                        "isDeleted": false,
                        "isSelected": false,
                        "isDrag": true,
                        "widthStyle": "50px",
                        "heightStyle": "480px",
                        "leftStyle": 387.76,
                        "topStyle": 18
                    },
                    {
                        "id": "961d7de4-1a01-49ef-a31a-efea2387ad73",
                        "name": "gd",
                        "modelName": "轨道",
                        "left": 332.16,
                        "top": 18,
                        "border": "",
                        "bgImg": "data:image/png;base64,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",
                        "offsetParentLeft": 0.14791666666666667,
                        "offsetParentTop": 0.06937033084311633,
                        "offset": {
                            "x": 26,
                            "y": 17
                        },
                        "generateModelName": "轨道",
                        "isDeleted": false,
                        "isSelected": false,
                        "isDrag": true,
                        "widthStyle": "57px",
                        "heightStyle": "480px",
                        "leftStyle": 332.16,
                        "topStyle": 18,
                        "trackWidth": "1802px",
                        "trackNum": 34
                    },
                    {
                        "id": "61426421-a293-4f27-81ee-a61dda8480d1",
                        "name": "hj",
                        "modelName": "PST通道",
                        "left": 332.16,
                        "top": 18,
                        "border": "",
                        "bgImg": "/img/PSBPassageway.8428f4be.png",
                        "offsetParentLeft": 0.14791666666666667,
                        "offsetParentTop": 0.06937033084311633,
                        "offset": {
                            "x": 22,
                            "y": 19
                        },
                        "generateModelName": "PST通道",
                        "isDeleted": false,
                        "isSelected": false,
                        "isDrag": true,
                        "widthStyle": "50px",
                        "heightStyle": "480px",
                        "leftStyle": 332.16,
                        "topStyle": 18
                    },
                    {
                        "id": "3284287b-827d-4f09-8716-9a330363dbef",
                        "name": "hj",
                        "modelName": "拣货通道",
                        "left": 441.36,
                        "top": 18,
                        "border": "",
                        "bgImg": "/img/pickingChannel.263a0c1b.png",
                        "offsetParentLeft": 0.14791666666666667,
                        "offsetParentTop": 0.06937033084311633,
                        "offset": {
                            "x": 28,
                            "y": 39
                        },
                        "generateModelName": "拣货通道",
                        "isDeleted": false,
                        "isSelected": false,
                        "isDrag": true,
                        "widthStyle": "50px",
                        "heightStyle": "480px",
                        "leftStyle": 441.36,
                        "topStyle": 18,
                        "shelvesNum": 4,
                        "shevlesSpace": 54
                    },
                    {
                        "id": "742684d9-288e-46a6-92b2-bc74b726f282",
                        "name": "bzq",
                        "modelName": "工作站",
                        "left": 658.96,
                        "top": 18,
                        "border": "",
                        "bgImg": "/img/station@2.f2021ad7.png",
                        "offsetParentLeft": 0.14791666666666667,
                        "offsetParentTop": 0.06937033084311633,
                        "offset": {
                            "x": 27,
                            "y": 30
                        },
                        "generateModelName": "工作站",
                        "isDeleted": false,
                        "isSelected": false,
                        "isDrag": true,
                        "widthStyle": "50px",
                        "heightStyle": "480px",
                        "leftStyle": 658.96,
                        "topStyle": 18
                    },
                    {
                        "id": "579cf2a7-f151-43d2-8145-2c33265cdbde",
                        "name": "bzq",
                        "modelName": "工作站",
                        "left": 712.56,
                        "top": 18,
                        "border": "",
                        "bgImg": "/img/station@2.f2021ad7.png",
                        "offsetParentLeft": 0.14791666666666667,
                        "offsetParentTop": 0.06937033084311633,
                        "offset": {
                            "x": 32,
                            "y": 21
                        },
                        "generateModelName": "工作站",
                        "isDeleted": false,
                        "isSelected": false,
                        "isDrag": true,
                        "widthStyle": "50px",
                        "heightStyle": "480px",
                        "leftStyle": 712.56,
                        "topStyle": 18
                    },
                    {
                        "id": "5a16d354-3839-410b-8c20-49f8022811a2",
                        "name": "hj",
                        "modelName": "拣货通道",
                        "left": 766.16,
                        "top": 18,
                        "border": "",
                        "bgImg": "/img/pickingChannel.263a0c1b.png",
                        "offsetParentLeft": 0.14791666666666667,
                        "offsetParentTop": 0.06937033084311633,
                        "offset": {
                            "x": 28,
                            "y": 23
                        },
                        "generateModelName": "拣货通道",
                        "isDeleted": false,
                        "isSelected": false,
                        "isDrag": true,
                        "widthStyle": "50px",
                        "heightStyle": "480px",
                        "leftStyle": 766.16,
                        "topStyle": 18,
                        "shelvesNum": 4,
                        "shevlesSpace": 54
                    },
                    {
                        "id": "83992448-79a9-4da7-8584-700581bb6ba4",
                        "name": "bzq",
                        "modelName": "工作站",
                        "left": 983.76,
                        "top": 18,
                        "border": "",
                        "bgImg": "/img/station@2.f2021ad7.png",
                        "offsetParentLeft": 0.14791666666666667,
                        "offsetParentTop": 0.06937033084311633,
                        "offset": {
                            "x": 23,
                            "y": 18
                        },
                        "generateModelName": "工作站",
                        "isDeleted": false,
                        "isSelected": false,
                        "isDrag": true,
                        "widthStyle": "50px",
                        "heightStyle": "480px",
                        "leftStyle": 983.76,
                        "topStyle": 18
                    },
                    {
                        "id": "3ac924f1-60d6-41d0-8b55-3b6719a8d3d1",
                        "name": "hj",
                        "modelName": "货架",
                        "left": 1037.36,
                        "top": 18,
                        "border": "",
                        "bgImg": "/img/huojia@2.378249ec.png",
                        "offsetParentLeft": 0.14791666666666667,
                        "offsetParentTop": 0.06937033084311633,
                        "offset": {
                            "x": 39,
                            "y": 26
                        },
                        "generateModelName": "货架",
                        "isDeleted": false,
                        "isSelected": false,
                        "isDrag": true,
                        "widthStyle": "50px",
                        "heightStyle": "480px",
                        "leftStyle": 1037.36,
                        "topStyle": 18,
                        "shelvesNum": 20,
                        "shevlesSpace": 54
                    }
                ]
            }
        ],
        "width": 6000,
        "height": 4000,
        "num": 200
    }
]

const dict = {
    modelData,
    modelOptions,
    floorList,
}

export default dict

