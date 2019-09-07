# with-react-form

A small wrapper of react-router parsing the form params from the location.search

[![CircleCI](https://circleci.com/gh/betagouv/with-react-form/tree/master.svg?style=svg)](https://circleci.com/gh/betagouv/with-react-form/tree/master)
[![npm version](https://img.shields.io/npm/v/with-react-form.svg?style=flat-square)](https://npmjs.org/package/with-react-form)

## Basic usage with requestData

// We need to be at pathname /foos/AE

```javascript
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Field, Form } from 'react-final-form'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { requestData } from 'redux-thunk-data'
import withForm from 'with-form'

class Foo extends PureComponent {

  componentDidMount() {
    const { form, handleRequestFoo } = this.props
    const { apiPath, isCreatedEntity } = form
    if (!isCreatedEntity) {
      handleRequestFoo({ apiPath })
    }
  }

  handleActivateForm = () => {
    const { form, history } = this.props
    const { modificationUrl } = form
    history.push(modificationUrl)
  }

  handleDeactivateForm = formResolver => (state, action) => {
    const { payload } = action
    const { datum } = payload
    const { id: createdId } = datum
    const { form, history } = this.props
    const { getReadOnlyUrl } = form
    formResolver()
    history.push(getReadOnlyUrl(createdId))
  }

  onFormSubmit = formValues => {
    const { form, handleSubmitFoo, history } = this.props
    const { apiPath, method } = form
    const formSubmitPromise = new Promise(resolve => {
      handleSubmitFoo({
        apiPath,
        body: { ...formValues },
        handleSuccess: this.handleDeactivateForm(resolve),
        method
      })
    })
    return formSubmitPromise
  }

  render () {
    const { form } = this.props
    const { readOnly } = form
    return (
      <Form
        initialValues={initialValues}
        onSubmit={this.onFormSubmit}
        render={() => (
          <form onSubmit={handleSubmit}>
            <Field
              name={name}
              render={({ input, meta }) => (
                <input
                  {...input}
                  readOnly={readOnly}
                  type="text"
                />
              )}
            />
            {
              readOnly
              ? (
                <button onClick={this.handleActivateForm} type="button">
                  Modify
                </button>
              )
              : (
                <button type="submit">
                  Save
                </button>
              )
            }
          </form>
        )}
      />
    )
  }
}

Foo.defaultProps = {
  foo: null
}

Foo.propTypes = {
  foo: PropTypes.shape(),
  handleRequestFoo: PropTypes.func.isRequired,
  handleSubmitFoo: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      fooId: PropTypes.string
    }).isRequired
  }).isRequired,
}

const mapStateToProps = (state, ownProps) => ({
  foo: selectFooById(state, ownProps.match.params.fooId)
})

const mapDispatchProps = (dispatch, ownProps) => ({
  handleRequestFoo: config => dispatch(requestData(config)),
  handleSubmitFoo: config => dispatch(requestData(config))
})

export default compose(
  withRouter,
  withForm,
  connect(mapStateToProps, mapDispatchProps)
)(Foo)
```
