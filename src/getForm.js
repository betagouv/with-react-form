import { createSelector } from 'reselect'

const CREATION = "creation"
const MODIFICATION = "modification"

const getId = ({ match, location, name }) => {
  const { params } = match
  if (name) {
    return params[`${name}Id`]
  }

  const { pathname } = location
  const chunks = pathname.split('/')
  if (params.modification === MODIFICATION) {
    return chunks.slice(-2)[0]
  }
  return chunks.slice(-1)[0]
}

const getForm = createSelector(
  getId,
  ({ location }) => location.pathname,
  ({ location }) => location.search,
  ({ match }) => match.params.modification,
  (id, pathname, search, modification) => {
    const isCreatedEntity = id === CREATION
    const isModifiedEntity = modification === MODIFICATION

    const readOnly = !isCreatedEntity && !isModifiedEntity
    let creationUrl
    let modificationUrl
    let getReadOnlyUrl

    let method
    if (isCreatedEntity) {
      creationUrl = `${pathname}${search}`
      method = "POST"
      getReadOnlyUrl = createdId => `${pathname.replace(`/${CREATION}`, `/${createdId}`)}${search}`
    } else if (isModifiedEntity) {
      creationUrl = `${pathname.replace(`/${id}/${MODIFICATION}`, '')}/${CREATION}${search}`
      method = "PATCH"
      modificationUrl = `${pathname}${search}`
      getReadOnlyUrl = () => `${pathname.replace(`/${MODIFICATION}`, "")}${search}`
    } else if (id) {
      creationUrl = `${pathname.replace(`/${id}`, '')}/${CREATION}${search}`
      modificationUrl = `${pathname}/${MODIFICATION}${search}`
      getReadOnlyUrl = () => `${pathname}${search}`
    } else {
      creationUrl = `${pathname}/${CREATION}${search}`
      modificationUrl = `${pathname}/${MODIFICATION}${search}`
      getReadOnlyUrl = () => `${pathname}${search}`
    }

    return {
      creationUrl,
      getReadOnlyUrl,
      id,
      isCreatedEntity,
      isModifiedEntity,
      method,
      modificationUrl,
      readOnly
    }
  }
)

export default getForm
