var filterLoop = [
  {
    landmark: 'state',
    toFetch: 'state',
    landmarkValue: '',
    callback: null,
    fetchedDatas: []
  },
  {
    landmark: 'state',
    toFetch: 'district',
    landmarkValue: '',
    callback: null,
    fetchedDatas: []
  },
  {
    landmark: 'district',
    toFetch: 'block',
    landmarkValue: '',
    callback: null,
    fetchedDatas: []
  },
  {
    landmark: 'block',
    toFetch: 'panchayat',
    landmarkValue: '',
    callback: null,
    fetchedDatas: []
  }
]

export { filterLoop }
