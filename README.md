# with-react-form

A small wrapper of react-router parsing the form params from the location.search

[![CircleCI](https://circleci.com/gh/betagouv/with-react-form/tree/master.svg?style=svg)](https://circleci.com/gh/betagouv/with-react-form/tree/master)
[![npm version](https://img.shields.io/npm/v/with-react-form.svg?style=flat-square)](https://npmjs.org/package/with-react-form)

## Basic usage with `getParams`
```javascript

// Let's say you are at location '/foo?counter=1'
import React, { PureComponent } from 'react'
import { withRouter } from 'react-router-dom'
import withForm from 'with-react-form'

class FooPage extends PureComponent {

  onIncrementCounter = () => {
    const { history, form } = this.props
    const { counter } = form.parse()
    // navigate to /foo?counter=2
    history.push(form.getSearchFromUpdate({ counter: counter + 1 }))
  }

  render () {
    const { form } = this.props
    const { counter } = form.getParams()
    return (
      <div>
        My counter is equal to {counter}
        <button onClick={this.onIncrementCounter}>
          Increment
        </button>
      </div>
    )
  }
}

export default withRouter(withForm()(FooPage))
```
