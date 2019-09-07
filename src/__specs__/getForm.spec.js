import getForm from '../getForm'

describe('getForm', () => {
  describe('when location, match are in a readonly state', () => {
    it('should return a readonly form', () => {
      // given
      const location = {
        pathname: "/foos/AE",
        search: ''
      }
      const match = {
        params: {
          fooId: "AE"
        }
      }

      // when
      const form = getForm({ location, match })

      // then
      expect(form).toStrictEqual({
        creationUrl: "/foos/creation",
        getReadOnlyUrl: expect.any(Function),
        id: "AE",
        isCreatedEntity: false,
        isModifiedEntity: false,
        method: undefined,
        modificationUrl: "/foos/AE/modification",
        readOnly: true
      })
      expect(form.getReadOnlyUrl("AE")).toBe("/foos/AE")
    })
  })

  describe('when location, match are in a creation state', () => {
    it('should return a creation form', () => {
      // given
      const location = {
        pathname: "/foos/creation",
        search: ''
      }
      const match = {
        params: {
          fooId: "creation"
        }
      }

      // when
      const form = getForm({ location, match })

      // then
      expect(form).toStrictEqual({
        creationUrl: "/foos/creation",
        getReadOnlyUrl: expect.any(Function),
        id: "creation",
        isCreatedEntity: true,
        isModifiedEntity: false,
        method: "POST",
        modificationUrl: undefined,
        readOnly: false
      })
      expect(form.getReadOnlyUrl("AE")).toBe("/foos/AE")
    })
  })

  describe('when location, match are in a modification state', () => {
    it('should return a modification form', () => {
      // given
      const location = {
        pathname: "/foos/AE/modification",
        search: ''
      }
      const match = {
        params: {
          fooId: "AE",
          modification: "modification"
        }
      }

      // when
      const form = getForm({ location, match })

      // then
      expect(form).toStrictEqual({
        creationUrl: "/foos/creation",
        getReadOnlyUrl: expect.any(Function),
        id: "AE",
        isCreatedEntity: false,
        isModifiedEntity: true,
        method: "PATCH",
        modificationUrl: "/foos/AE/modification",
        readOnly: false
      })
      expect(form.getReadOnlyUrl("AE")).toBe("/foos/AE")
    })
  })


})
