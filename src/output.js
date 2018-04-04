export default function output (inputText) {
  for (let key in outputMap) {
    if (inputText.match(key)) {
      return outputMap[key]
    }
  }

  return '并没有什么可以推荐的'
}

export const outputMap = {
  default: 'hello, world.',
  '你好': '你好，请输入图书关键词',
  'test': '菜鸟一枚，还望高抬贵手...',
  'hello': 'how are u?',
  'hi': 'how do u do?',
  '测试': '天気がいいから、散歩しましっよう。',
  '哈哈': '心情好像不错呦～～',
  '呵呵': '人生天地间，谁不是在苦苦煎熬。'
}

export function getKeyword (inputText, matchLength) {
  return inputText
}
