exports.readNumberingXml = readNumberingXml;
exports.Numbering = Numbering;
exports.defaultNumbering = new Numbering({});

function Numbering(nums) {
    return {
        findLevel: function(numId, level) {
            var num = nums[numId];
            if (num) {
                return num[level];
            } else {
                return null;
            }
        },

        findLevelByStyleId: function(styleId) {
            if(!!styleId) {
                for(var num in nums) {
                    for(var level in nums[num]) {
                        if(nums[num][level].styleId === styleId) {
                            return nums[num][level];
                        }
                    }
                }
            }

            return null;
        },

        getNums: function() {
            return nums;
        }
    };
}

function readNumberingXml(root) {
    var abstractNums = readAbstractNums(root);
    var nums = readNums(root, abstractNums);
    return new Numbering(nums);
}

function readAbstractNums(root) {
    var abstractNums = {};
    root.getElementsByTagName("w:abstractNum").forEach(function(element) {
        var id = element.attributes["w:abstractNumId"];
        abstractNums[id] = readAbstractNum(element);
    });
    return abstractNums;
}

function readAbstractNum(element) {
    var levels = {};
    var abstractNumId = element.attributes["w:abstractNumId"];

    element.getElementsByTagName("w:lvl").forEach(function(levelElement) {
        var levelIndex = levelElement.attributes["w:ilvl"];
        var numFmt = levelElement.first("w:numFmt").attributes["w:val"];
        var styleId = levelElement.firstOrEmpty("w:pStyle").attributes["w:val"];
        levels[levelIndex] = {
            isOrdered: numFmt !== "bullet",
            level: levelIndex,
            format: numFmt,
            numberId: abstractNumId,
            styleId: styleId
        };
    });
    return levels;
}

function readNums(root, abstractNums) {
    var nums = {};
    root.getElementsByTagName("w:num").forEach(function(element) {
        var id = element.attributes["w:numId"];
        var abstractNumId = element.first("w:abstractNumId").attributes["w:val"];
        nums[id] = abstractNums[abstractNumId];
    });
    return nums;
}
