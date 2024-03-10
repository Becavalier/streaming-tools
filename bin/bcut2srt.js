"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_fs_1 = require("node:fs");
var node_process_1 = require("node:process");
var node_path_1 = require("node:path");
var lodash_1 = require("lodash");
var FIRST_FILE_IDX = 2;
var inputFileName = node_process_1.argv[FIRST_FILE_IDX];
if (inputFileName) {
    try {
        var timeConverter_1 = function (ms) {
            return [
                [
                    Math.trunc(ms / 60 / 60 / 1000),
                    Math.trunc(ms / 60 / 1000),
                    Math.trunc(ms / 1000 % 60)
                ].map(function (num) { return num.toString().padStart(2, '0'); }).join(':'),
                (ms / 1000 % 1).toFixed(3).toString().slice(2, 5)
            ].join(",");
        };
        var clips = (0, lodash_1.get)(JSON.parse((0, node_fs_1.readFileSync)(inputFileName, { encoding: 'utf8' })), ['tracks', 0, 'clips'], []);
        var srtConfigs = clips.reduce(function (prev, item, index) {
            var inPoint = item.inPoint, outPoint = item.outPoint, AssetInfo = item.AssetInfo;
            var idx = "".concat(index + 1);
            prev[idx] = {
                from: timeConverter_1(inPoint),
                to: timeConverter_1(outPoint),
                content: AssetInfo.content
            };
            return prev;
        }, {});
        var strs = [];
        for (var key in srtConfigs) {
            var _a = srtConfigs[key], from = _a.from, to = _a.to, content = _a.content;
            var time = "".concat(from, " --> ").concat(to);
            strs.push([key, time, content].join('\n'));
        }
        (0, node_fs_1.writeFileSync)((0, node_path_1.resolve)(inputFileName).replace(/\.[\s\S]+$/g, '.srt'), strs.join('\n\n'));
    }
    catch (e) {
        console.error(e);
    }
}
