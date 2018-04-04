import React, {PureComponent} from 'react'
import './RecommendBooks.css'

export default class RecommendBooks extends PureComponent {
  render () {
    const bookItems = this.props.books.map(item => (
      <a
        key={item.id}
        className='RecommendBookItem'
        href={`http://insekkei.com/bookcat/#/books/${item.id}#bookdetails`}
        target='_blank'
      >
        《{item.title}》-{item.author}
      </a>
    ))

    return (
      <div className='RecommendBookList'>
        {bookItems}
      </div>
    )
  }
}
