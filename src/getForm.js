import { createSelector } from 'reselect'

const CREATION = "creation"
const MODIFICATION = "modification"

const getId = ({ match, location, name }) => {
  const { params } = match
  console.log(name)
  if (name) {
    return params[`${name}Id`]
  }

  const { pathname } = location
  const chunks = pathname.split('/')
  console.log(chunks, params)
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

    console.log({id})

    const isCreatedEntity = id === CREATION
    const isModifiedEntity = modification === MODIFICATION

    const readOnly = !isCreatedEntity && !isModifiedEntity
    let creationUrl
    let modificationUrl
    let getReadOnlyUrl

    let method
    if (isCreatedEntity) {
      method = "POST"
      getReadOnlyUrl = createdId => `${pathname.replace(`/${CREATION}`, `/${createdId}`)}${search}`
    } else if (isModifiedEntity) {
      method = "PATCH"
      getReadOnlyUrl = () => `${pathname.replace(`/${MODIFICATION}`, "")}${search}`
    } else {
      creationUrl = `${pathname}/${CREATION}${search}`
      modificationUrl = `${pathname}/${MODIFICATION}${search}`
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
