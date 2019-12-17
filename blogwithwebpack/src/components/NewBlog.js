import React from 'react'
import { useField } from '../hooks'
import { Button, Form } from 'semantic-ui-react'

const NewBlog = (props) => {
  const [title, titleReset] = useField('text', 'title')
  const [author, authorReset] = useField('text', 'author')
  const [url, urlReset] = useField('text', 'url')

  const handleSubmit = (event) => {
    event.preventDefault()
    props.createBlog({
      title: title.value,
      author: author.value,
      url: url.value
    })
    titleReset()
    authorReset()
    urlReset()
  }

  return (
    <div>
      <h2>create new</h2>

      <Form onSubmit={handleSubmit}>
        <Form.Field>
          title:
          <input {...title} data-cy='title' />
        </Form.Field>
        <Form.Field>
          author:
          <input {...author} data-cy='author' />
        </Form.Field>
        <Form.Field>
          url:
          <input {...url} data-cy='url' />
        </Form.Field>
        <Button positive type='submit'>create</Button>
      </Form>
    </div>
  )
}

export default NewBlog