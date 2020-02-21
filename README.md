# with-react-form

## DEPRECATED
New version is here now https://github.com/betagouv/with-react-formidable


A small wrapper of react-router parsing the form params from the location.pathname and match.params

[![CircleCI](https://circleci.com/gh/betagouv/with-react-form/tree/master.svg?style=svg)](https://circleci.com/gh/betagouv/with-react-form/tree/master)
[![npm version](https://img.shields.io/npm/v/with-react-form.svg?style=flat-square)](https://npmjs.org/package/with-react-form)


## Convention

Your app needs to work with a special react-router syntax. Given the url, withForm will find by itself if you are in readOnly, creation or modification state. In summary, your React Route needs to be with path = "/foos/:fooId([A-Z0-9]+|creation)/:modification(modification)?", then :

  - "/foos/AE" is a readOnly url, for the specific fetch of the entity foo with id=AE,
  - "/foos/creation" is the creation url for posting a new foo object,
  - "/foos/AE/modification" is the modification url for patching an already existing foo entity with id AE.

## Basic usage with react-final-form and redux-thunk-data

Starting at pathname /foos/AE :

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

  handleFormSubmit = formValues => {
    const { form, handleSubmitFoo } = this.props
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

  renderField = ({ input }) => {
    const { form } = this.props
    const { readOnly } = form
    return (
      <input
        {...input}
        readOnly={readOnly}
        type="text"
      />
    )
  }

  renderForm = ({ handleSubmit }) => {
    const { form } = this.props
    const { readOnly } = form
    return (
      <form onSubmit={handleSubmit}>
        <Field
          name="title"
          render={this.renderField}
        />
        {
          readOnly
          ? (
            <button
              onClick={this.handleActivateForm}
              type="button"
            >
              {'Modify'}
            </button>
          )
          : (
            <button type="submit">
              {'Save'}
            </button>
          )
        }
      </form>
    )
  }

  render () {
    const { form } = this.props
    const { readOnly } = form
    return (
      <Form
        initialValues={initialValues}
        onSubmit={this.onFormSubmit}
        render={this.renderForm}
      />
    )
  }
}

Foo.propTypes = {
  form: PropTypes.shape({
    apiPath: PropTypes.string,
    getReadOnlyUrl: PropTypes.func,
    isCreatedEntity: PropTypes.bool,
    method: PropTypes.string,
    modificationUrl: PropTypes.string,
    readOnly: PropTypes.bool
  }).isRequired,
}

const mapDispatchProps = (dispatch, ownProps) => ({
  handleRequestFoo: config => dispatch(requestData(config)),
  handleSubmitFoo: config => dispatch(requestData(config))
})

export default compose(
  withRouter,
  withForm,
  connect(null, mapDispatchProps)
)(Foo)
```
