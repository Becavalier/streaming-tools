import { readFileSync, writeFileSync } from 'node:fs'
import { argv } from 'node:process'
import { resolve, } from 'node:path'
import { get } from 'lodash'
import type { BCUTClip, SRTConfig, } from './types.d.ts'

const FIRST_FILE_IDX = 2
const inputFileName = argv[FIRST_FILE_IDX]
if (inputFileName) {
  try {
    const timeConverter = (ms: number) => {
      return [
        [
          Math.trunc(ms / 60 / 60 / 1000),
          Math.trunc(ms / 60 / 1000),
          Math.trunc(ms / 1000 % 60)
        ].map((num) => { return num.toString().padStart(2, '0'); }).join(':'),
        (ms / 1000 % 1).toFixed(3).toString().slice(2, 5)
      ].join(",")
    }
    const clips = get(JSON.parse(readFileSync(inputFileName, { encoding: 'utf8' })), ['tracks', 0, 'clips'], [])
    const srtConfigs = clips.reduce((prev: SRTConfig, item: BCUTClip, index: number) => {
      const { inPoint, outPoint, AssetInfo } = item
      const idx = `${index + 1}`
      prev[idx] = {
        from: timeConverter(inPoint),
        to: timeConverter(outPoint),
        content: AssetInfo.content
      }
      return prev
    }, {})

    const strs: string[] = []
    for (const key in srtConfigs) {
      const { from, to, content, } = srtConfigs[key]
      const time = `${from} --> ${to}`
      strs.push([key, time, content].join('\n'))
    }
    writeFileSync(resolve(inputFileName).replace(/\.[\s\S]+$/g, '.srt'), strs.join('\n\n'))
  } catch(e) {
    console.error(e)
  }
}
