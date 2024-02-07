import { readFileSync, writeFileSync } from 'node:fs'
import { argv } from 'node:process'
import { resolve, } from 'node:path'
import type { BCCConfig, SRTConfig } from './types.d.ts'

const bcc2srtCore = (bccConfig: BCCConfig): SRTConfig => {
  const timeConverter = (second: number): string => {
    return [
      [
        Math.trunc(second / 60 / 60),
        Math.trunc(second / 60),
        Math.trunc(second % 60)
      ].map((num) => { return num.toString().padStart(2, '0'); }).join(':'),
      (second % 1).toFixed(3).toString().slice(2, 5)
    ].join(",")
  }
  return bccConfig.body.reduce((prev, item, index) => {
    const idx = `${index + 1}`
    prev[idx] = {
      from: timeConverter(item.from),
      to: timeConverter(item.to),
      content: item.content
    }
    return prev
  }, {})
}

const FIRST_FILE_IDX = 2
const inputFileName = argv[FIRST_FILE_IDX]
if (inputFileName) {
  try {
    const srtConfigs = bcc2srtCore(
      JSON.parse(readFileSync(inputFileName, { encoding: 'utf8' })))
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
