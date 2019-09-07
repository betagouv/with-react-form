import getForm from '../getForm'

describe('getForm', () => {
  describe('when location, match are in a readonly state', () => {
    it('should return a readonly form for a simple path', () => {
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
        apiPath: "/foos/AE",
        creationUrl: "/foos/creation",
        getReadOnlyUrl: expect.any(Function),
        id: "AE",
        isCreatedEntity: false,
        isModifiedEntity: false,
        method: undefined,
        modificationUrl: "/foos/AE/modification",
        name: "foo",
        readOnly: true
      })
      expect(form.getReadOnlyUrl("AE")).toBe("/foos/AE")
    })

    it('should return a readonly form with a complex path with several params', () => {
      // given
      const location = {
        pathname: "/foos/AE/bars/BF",
        search: ''
      }
      const match = {
        params: {
          barId: "BF",
          fooId: "AE"
        }
      }

      // when
      const form = getForm({ location, match })

      // then
      expect(form).toStrictEqual({
        apiPath: "/bars/BF",
        creationUrl: "/foos/AE/bars/creation",
        getReadOnlyUrl: expect.any(Function),
        id: "BF",
        isCreatedEntity: false,
        isModifiedEntity: false,
        method: undefined,
        modificationUrl: "/foos/AE/bars/BF/modification",
        name: "bar",
        readOnly: true
      })
      expect(form.getReadOnlyUrl("BF")).toBe("/foos/AE/bars/BF")
    })
  })

  describe('when location, match are in a creation state', () => {
    it('should return a creation form for a simple path', () => {
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
        apiPath: "/foos",
        creationUrl: "/foos/creation",
        getReadOnlyUrl: expect.any(Function),
        id: "creation",
        isCreatedEntity: true,
        isModifiedEntity: false,
        method: "POST",
        modificationUrl: undefined,
        name: "foo",
        readOnly: false
      })
      expect(form.getReadOnlyUrl("AE")).toBe("/foos/AE")
    })

    it('should return a creation form for a complex path with several params', () => {
      // given
      const location = {
        pathname: "/foos/AE/bars/creation",
        search: ''
      }
      const match = {
        params: {
          barId: "creation",
          fooId: "AE"
        }
      }

      // when
      const form = getForm({ location, match })

      // then
      expect(form).toStrictEqual({
        apiPath: "/bars",
        creationUrl: "/foos/AE/bars/creation",
        getReadOnlyUrl: expect.any(Function),
        id: "creation",
        isCreatedEntity: true,
        isModifiedEntity: false,
        method: "POST",
        modificationUrl: undefined,
        name: "bar",
        readOnly: false
      })
      expect(form.getReadOnlyUrl("BF")).toBe("/foos/AE/bars/BF")
    })
  })

  describe('when location, match are in a modification state', () => {
    it('should return a modification form for a simple path', () => {
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
        apiPath: "/foos/AE",
        creationUrl: "/foos/creation",
        getReadOnlyUrl: expect.any(Function),
        id: "AE",
        isCreatedEntity: false,
        isModifiedEntity: true,
        method: "PATCH",
        modificationUrl: "/foos/AE/modification",
        name: "foo",
        readOnly: false
      })
      expect(form.getReadOnlyUrl("AE")).toBe("/foos/AE")
    })

    it('should return a modification form for a complex path with several params', () => {
      // given
      const location = {
        pathname: "/foos/AE/bars/BF/modification",
        search: ''
      }
      const match = {
        params: {
          barId: "BF",
          fooId: "AE",
          modification: "modification"
        }
      }

      // when
      const form = getForm({ location, match })

      // then
      expect(form).toStrictEqual({
        apiPath: "/bars/BF",
        creationUrl: "/foos/AE/bars/creation",
        getReadOnlyUrl: expect.any(Function),
        id: "BF",
        isCreatedEntity: false,
        isModifiedEntity: true,
        method: "PATCH",
        modificationUrl: "/foos/AE/bars/BF/modification",
        name: "bar",
        readOnly: false
      })
      expect(form.getReadOnlyUrl("BF")).toBe("/foos/AE/bars/BF")
    })
  })
})
