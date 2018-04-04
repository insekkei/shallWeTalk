import React, { Component } from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import RecommendBooks from './components/RecommendBooks'
import output, {outputMap, getKeyword} from './output'
import './App.css'

class App extends Component {
  constructor () {
    super()
    this.state = {
      inputText: '',
      bookList: [],
      talkList: []
    }
  }

  componentDidMount () {
    this.fetchData()
    const localTalk = JSON.parse(localStorage.getItem('insekkei.com/talk'))
    if (!localTalk) {
      this.updateLocalStorage([{
        type: 'output',
        content: 'hello'
      }])
    }
    this.setState({
      talkList: JSON.parse(localStorage.getItem('insekkei.com/talk'))
    })
  }

  componentDidUpdate () {
    this.mainPanel.scrollIntoView({behavior: 'smooth', block: 'end'})
  }

  fetchData = () => {
    fetch('http://insekkei.com/bookcat/books/books.json').then((res) => {
      Promise.resolve(res.json()).then(result => {
        this.setState({
          bookList: result
        })
      })
    })
  }

  updateLocalStorage = (talkList) => {
    localStorage.setItem('insekkei.com/talk', JSON.stringify(talkList))
  }

  getRelativeBooks = (inputText) => {
    const {bookList} = this.state
    const keyword = getKeyword(inputText)
    return bookList.filter(item => JSON.stringify(item).match(keyword))
  }

  updateOutputContent = (inputText) => {
    const relativeBooks = this.getRelativeBooks(inputText)

    const talkList = [
      ...this.state.talkList,
      {
        type: 'output',
        content: relativeBooks.length > 0
          ? renderToStaticMarkup(
            <RecommendBooks books={relativeBooks} />
          ) : output(inputText)
      }
    ]
    this.setState({talkList})
    this.updateLocalStorage(talkList)
  }

  clearTalk = () => {
    this.setState({talkList: [{
      type: 'output',
      content: outputMap.default
    }]})
    this.updateLocalStorage([{
      type: 'output',
      content: outputMap.default
    }])
  }

  onChange = e => {
    this.setState({
      inputText: e.target.value
    })
  }

  onKeyPress = e => {
    const {key, target: {value}} = e
    switch (key) {
      case 'Enter': {
        clearTimeout(this.timer)
        if (value.trim().length) {
          const talkList = [
            ...this.state.talkList,
            {
              type: 'input',
              content: value
            }
          ]
          this.setState({
            talkList,
            inputText: ''
          }, () => {
            this.timer = setTimeout(() => {
              this.updateOutputContent(value)
            }, 1000)
          })
          this.updateLocalStorage(talkList)
        }
        break;
      }
      default:
        break;
    }
  }
  render () {
    const {talkList, inputText} = this.state
    return (
      <div className='App'>
        <div className='MainPanel' ref={el => { this.mainPanel = el }}>
          {talkList.map((item, index) => {
            const {type, content} = item
            if (type === 'input') {
              return (
                <div key={index} className='InputItem'>
                  <div className='TalkItemContent'>{content}</div>
                </div>
              )
            }
            return (
              <div key={index} className='OutputItem'>
                <div className='TalkItemContent' dangerouslySetInnerHTML={{__html: content}}></div>
              </div>
            )
          })}
        </div>
        <span className='ClearTalk' onClick={this.clearTalk}>清除</span>
        <div className='BottomBar'>
          <input value={inputText}
            className='SearchInput'
            onKeyPress={this.onKeyPress}
            onChange={this.onChange}
          />
        </div>
      </div>
    )
  }
}

export default App
